const express = require('express');
const router = express.Router();

const Course = require('../../models/course');
const { requireApiRole, requireApiLogin } = require('../../middleware/apiAuth');
const { writeAudit } = require('../../services/audit');
const { getCurrentStudent, getCurrentTeacher } = require('../../services/currentProfile');
const { pick, toInt } = require('../../utils/common');

async function enforceTeacherScope(req, course) {
  if (req.user.role !== 'teacher') return true;
  const t = await getCurrentTeacher(req);
  if (!t) return false;
  return String(course.teacher) === String(t._id);
}

router.get('/', requireApiRole('admin','teacher','student'), async (req, res, next) => {
  try {
    const includeInactive = String(req.query.includeInactive || 'false') === 'true';
    const base = includeInactive ? {} : { isActive: true };

    if (req.user.role === 'teacher' && String(req.query.all || 'false') !== 'true') {
      const t = await getCurrentTeacher(req);
      if (!t) return res.json({ items: [] });
      const items = await Course.find({ ...base, teacher: t._id })
        .populate('subject')
        .populate('teacher')
        .sort({ dateTime: -1 });
      return res.json({ items });
    }

    const items = await Course.find(base).populate('subject').populate('teacher').sort({ dateTime: -1 });
    res.json({ items });
  } catch (err) { next(err); }
});

router.get('/:id', requireApiRole('admin','teacher','student'), async (req, res, next) => {
  try {
    const c = await Course.findById(req.params.id).populate('subject').populate('teacher').populate('students');
    if (!c) return res.status(404).json({ error: 'NOT_FOUND' });
    if (req.user.role === 'teacher' && !(await enforceTeacherScope(req, c))) return res.status(403).json({ error: 'FORBIDDEN' });
    res.json({ item: c });
  } catch (err) { next(err); }
});

router.post('/', requireApiRole('admin','teacher'), async (req, res, next) => {
  try {
    const body = req.body || {};
    const allowed = pick(body, ['subject','teacher','room','dateTime','capacity']);
    allowed.capacity = toInt(allowed.capacity, 30);

    if (req.user.role === 'teacher') {
      const t = await getCurrentTeacher(req);
      if (!t) return res.status(400).json({ error: 'VALIDATION', message: 'teacher profile missing' });
      allowed.teacher = t._id;
    }

    if (!allowed.subject || !allowed.teacher || !allowed.room || !allowed.dateTime) {
      return res.status(400).json({ error: 'VALIDATION' });
    }

    const c = await Course.create({ ...allowed, students: [], isActive: true });
    await writeAudit({ req, action: 'CREATE', entity: 'Course', entityId: c._id });
    res.status(201).json({ item: c });
  } catch (err) { next(err); }
});

router.patch('/:id', requireApiRole('admin','teacher'), async (req, res, next) => {
  try {
    const c = await Course.findById(req.params.id);
    if (!c) return res.status(404).json({ error: 'NOT_FOUND' });

    if (req.user.role === 'teacher' && !(await enforceTeacherScope(req, c))) return res.status(403).json({ error: 'FORBIDDEN' });

    const allowed = pick(req.body || {}, ['subject','room','dateTime','capacity','isActive']);
    if (req.user.role === 'admin') {
      // admins can reassign teacher
      if (req.body && req.body.teacher) allowed.teacher = req.body.teacher;
    }
    if (allowed.capacity !== undefined) allowed.capacity = toInt(allowed.capacity, c.capacity);

    Object.assign(c, allowed);
    await c.save();

    await writeAudit({ req, action: 'UPDATE', entity: 'Course', entityId: c._id, meta: { fields: Object.keys(allowed) } });
    res.json({ item: c });
  } catch (err) { next(err); }
});

router.delete('/:id', requireApiRole('admin','teacher'), async (req, res, next) => {
  try {
    const c = await Course.findById(req.params.id);
    if (!c) return res.status(404).json({ error: 'NOT_FOUND' });

    if (req.user.role === 'teacher' && !(await enforceTeacherScope(req, c))) return res.status(403).json({ error: 'FORBIDDEN' });

    c.isActive = false;
    await c.save();
    await writeAudit({ req, action: 'DELETE', entity: 'Course', entityId: c._id });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// Student enroll/unenroll
router.post('/:id/enroll', requireApiRole('student'), async (req, res, next) => {
  try {
    const c = await Course.findById(req.params.id);
    if (!c || !c.isActive) return res.status(404).json({ error: 'NOT_FOUND' });

    const s = await getCurrentStudent(req);
    if (!s) return res.status(400).json({ error: 'VALIDATION', message: 'student profile missing' });

    const already = c.students.some(x => String(x) === String(s._id));
    if (already) return res.json({ ok: true });

    if (c.capacity && c.students.length >= c.capacity) return res.status(409).json({ error: 'CAPACITY_FULL' });

    c.students.push(s._id);
    await c.save();

    await writeAudit({ req, action: 'ENROLL', entity: 'Course', entityId: c._id, meta: { studentId: s._id } });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

router.delete('/:id/enroll', requireApiRole('student'), async (req, res, next) => {
  try {
    const c = await Course.findById(req.params.id);
    if (!c || !c.isActive) return res.status(404).json({ error: 'NOT_FOUND' });

    const s = await getCurrentStudent(req);
    if (!s) return res.status(400).json({ error: 'VALIDATION', message: 'student profile missing' });

    c.students = c.students.filter(x => String(x) !== String(s._id));
    await c.save();

    await writeAudit({ req, action: 'UNENROLL', entity: 'Course', entityId: c._id, meta: { studentId: s._id } });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

module.exports = router;
