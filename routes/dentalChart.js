const express = require('express');
const router = express.Router();
const DentalChart = require('../models/DentalChart');
const auth = require('../middleware/auth');

// Get dental chart for a patient
router.get('/:patientId', auth, async (req, res) => {
  try {
    const chart = await DentalChart.findOne({ patient: req.params.patientId })
      .sort({ date: -1 })
      .populate('createdBy', 'name');

    if (!chart) {
      return res.status(404).json({ message: 'Diş haritası bulunamadı' });
    }

    res.json(chart);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Create new dental chart
router.post('/:patientId', auth, async (req, res) => {
  try {
    const { teeth, observations, treatmentPlan } = req.body;

    const chart = new DentalChart({
      patient: req.params.patientId,
      teeth,
      observations,
      treatmentPlan,
      createdBy: req.user.id
    });

    await chart.save();
    res.status(201).json(chart);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Update specific tooth
router.put('/:patientId/tooth/:toothNumber', auth, async (req, res) => {
  try {
    const chart = await DentalChart.findOne({ patient: req.params.patientId })
      .sort({ date: -1 });

    if (!chart) {
      return res.status(404).json({ message: 'Diş haritası bulunamadı' });
    }

    const toothIndex = chart.teeth.findIndex(
      tooth => tooth.number === parseInt(req.params.toothNumber)
    );

    if (toothIndex === -1) {
      return res.status(404).json({ message: 'Diş bulunamadı' });
    }

    chart.teeth[toothIndex] = {
      ...chart.teeth[toothIndex],
      ...req.body,
      lastModified: Date.now()
    };

    chart.updatedBy = req.user.id;
    await chart.save();

    res.json(chart.teeth[toothIndex]);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Update treatment plan
router.put('/:patientId/treatment-plan', auth, async (req, res) => {
  try {
    const chart = await DentalChart.findOne({ patient: req.params.patientId })
      .sort({ date: -1 });

    if (!chart) {
      return res.status(404).json({ message: 'Diş haritası bulunamadı' });
    }

    chart.treatmentPlan = req.body.treatmentPlan;
    chart.updatedBy = req.user.id;
    await chart.save();

    res.json(chart);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Get dental chart history
router.get('/:patientId/history', auth, async (req, res) => {
  try {
    const charts = await DentalChart.find({ patient: req.params.patientId })
      .sort({ date: -1 })
      .populate('createdBy', 'name')
      .select('date observations treatmentPlan createdBy');

    res.json(charts);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router; 