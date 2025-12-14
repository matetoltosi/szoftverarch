const express = require('express');
const router = express.Router();

const feeService = require('../../business_logic/services/fee.service');
const requireAuth = require('../middleware/requireAuth');

router.get('/fees', requireAuth('admin'), async (req, res) => {
  const fees = await feeService.listAll();
  res.json(fees);
});

router.post('/fees', requireAuth('admin'), async (req, res) => {
  const { studentId, amount } = req.body;

  const fee = await feeService.create(
    req.session.user,
    { studentId, amount }
  );

  res.status(201).json(fee);
});

module.exports = router;
