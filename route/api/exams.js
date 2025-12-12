const express = require('express');
const router = express.Router();

const Exam = require('../../models/exam');
const Course = require('../../models/course');
const { requireApiRole } = require('../../middleware/apiAuth');
const { writeAudit } = require('../../services/audit');
const { getCurrentTeacher } = require('../../services/currentProfile');
const { pick, toInt } = require('../../utils/common');

async function teacherOwnsCourse(req, courseId) {
  const t = await getCurrentTeacher(req);
  if (!t) return false;
  const c = await Course.findById(courseId);
  if (!c || !c.isActive) return false;
  return String(c.teacher) === String(t._id);
}

router.get('/', requireApiRole('admin','teacher','student'), async (req, res, next) => {
  try {
    const includeInactive = String(req.query.includeInactive || 'false') === 'true';
    const base = includeInactive ? {} : { isActive: true };

    if (req.user.role === 'teacher' && String(req.query.all || 'false') !== 'true') {
      const t = await getCurrentTeacher(req);
      if (!t) return res.json({ items: [] });
      const courses = await Course.find({ teacher: t._id, isActive: true }).select('_id');
      const ids = courses.map(c => c._id);
      const items = await Exam.find({ ...base, course: { $in: ids } }).populate({ path: 'course', populate: ['subject','teacher'] }).sort({ dateTime: -1 });
      return res.json({ items });
    }

    const items = await Exam.find(base).populate({ path: 'course', populate: ['subject','teacher'] }).sort({ dateTime: -1 });
    res.json({ items });
  } catch (err) { next(err); }
});

router.get('/:id', requireApiRole('admin','teacher','student'), async (req, res, next) => {
  try {
    const e = await Exam.findById(req.params.id).populate({ path: 'course', populate: ['subject','teacher'] });
    if (!e) return res.status(404).json({ error: 'NOT_FOUND' });
    if (req.user.role === 'teacher' && !(await teacherOwnsCourse(req, e.course._id))) return res.status(403).json({ error: 'FORBIDDEN' });
    res.json({ item: e });
  } catch (err) { next(err); }
});

router.post('/', requireApiRole('admin','teacher'), async (req, res, next) => {
  try {
    const body = req.body || {};
    const allowed = pick(body, ['course','dateTime','location','capacity','status']);
    allowed.capacity = toInt(allowed.capacity, 50);

    if (!allowed.course || !allowed.dateTime) return res.status(400).json({ error: 'VALIDATION' });

    if (req.user.role === 'teacher') {
      const ok = await teacherOwnsCourse(req, allowed.course);
      if (!ok) return res.status(403).json({ error: 'FORBIDDEN' });
    }

    const e = await Exam.create({ ...allowed, isActive: true });
    await writeAudit({ req, action: 'CREATE', entity: 'Exam', entityId: e._id });
    res.status(201).json({ item: e });
  } catch (err) { next(err); }
});

router.patch('/:id', requireApiRole('admin','teacher'), async (req, res, next) => {
  try {
    const e = await Exam.findById(req.params.id);
    if (!e) return res.status(404).json({ error: 'NOT_FOUND' });

    if (req.user.role === 'teacher') {
      const ok = await teacherOwnsCourse(req, e.course);
      if (!ok) return res.status(403).json({ error: 'FORBIDDEN' });
    }

    const allowed = pick(req.body || {}, ['dateTime','location','capacity','status','isActive']);
    if (allowed.capacity !== undefined) allowed.capacity = toInt(allowed.capacity, e.capacity);

    Object.assign(e, allowed);
    await e.save();

    await writeAudit({ req, action: 'UPDATE', entity: 'Exam', entityId: e._id, meta: { fields: Object.keys(allowed) } });
    res.json({ item: e });
  } catch (err) { next(err); }
});

router.delete('/:id', requireApiRole('admin','teacher'), async (req, res, next) => {
  try {
    const e = await Exam.findById(req.params.id);
    if (!e) return res.status(404).json({ error: 'NOT_FOUND' });

    if (req.user.role === 'teacher') {
      const ok = await teacherOwnsCourse(req, e.course);
      if (!ok) return res.status(403).json({ error: 'FORBIDDEN' });
    }

    e.isActive = false;
    e.status = 'deleted';
    await e.save();

    await writeAudit({ req, action: 'DELETE', entity: 'Exam', entityId: e._id });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

module.exports = router;
