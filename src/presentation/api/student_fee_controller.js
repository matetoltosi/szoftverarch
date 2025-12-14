const express = require('express');
const router = express.Router();

const requireAuth = require('../middlewares/require_auth');
const feeService = require('../../services/fee_service');

router.get('/fees', requireAuth('student'), async (req, res) => {
  try {
    const fees = await feeService.listForStudent(req.session.user);
    res.json(fees);
  } catch (err) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/fees/:feeId', requireAuth('student'), async (req, res) => {
  try {
    await feeService.pay(req.session.user, req.params.feeId);
    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
