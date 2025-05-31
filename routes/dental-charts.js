const express = require('express');
const router = express.Router();
const DentalChart = require('../models/DentalChart');

// @route   GET api/dental-charts
// @desc    Get all dental charts
// @access  Private
router.get('/', async (req, res) => {
  try {
    const charts = await DentalChart.find()
      .populate('patient', ['firstName', 'lastName'])
      .sort({ date: -1 });
    res.json(charts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/dental-charts/:id
// @desc    Get dental chart by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const chart = await DentalChart.findById(req.params.id)
      .populate('patient', ['firstName', 'lastName']);
    if (!chart) {
      return res.status(404).json({ msg: 'Dental chart not found' });
    }
    res.json(chart);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Dental chart not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/dental-charts
// @desc    Create a dental chart
// @access  Private
router.post('/', async (req, res) => {
  try {
    const newChart = new DentalChart(req.body);
    const chart = await newChart.save();
    res.json(chart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/dental-charts/:id
// @desc    Update a dental chart
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const chart = await DentalChart.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!chart) {
      return res.status(404).json({ msg: 'Dental chart not found' });
    }
    res.json(chart);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Dental chart not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/dental-charts/:id
// @desc    Delete a dental chart
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const chart = await DentalChart.findByIdAndDelete(req.params.id);
    if (!chart) {
      return res.status(404).json({ msg: 'Dental chart not found' });
    }
    res.json({ msg: 'Dental chart removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Dental chart not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router; 