const express = require('express');
const router = express.Router();

const feeService = require('../../business_logic/services/fee_service');
const requireAuth = require('../middlewares/require_auth');

router.get('/fees', requireAuth('admin'), async (req, res) => {
  const fees = await feeService.listAll();
  res.json(fees);
});

router.post('/fees', requireAuth('admin'), async (req, res) => {
  const { studentEmail, amount } = req.body;

  try {
    const fee = await feeService.create(
      req.session.user,
      { studentEmail, amount }
    );

    res.status(201).json(fee);
  }
  catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
