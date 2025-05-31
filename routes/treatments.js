const express = require('express');
const router = express.Router();
const Treatment = require('../models/Treatment');

// @route   GET api/treatments
// @desc    Get all treatments
// @access  Private
router.get('/', async (req, res) => {
  try {
    const treatments = await Treatment.find()
      .populate('patient', ['firstName', 'lastName'])
      .sort({ date: -1 });
    res.json(treatments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/treatments/:id
// @desc    Get treatment by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const treatment = await Treatment.findById(req.params.id)
      .populate('patient', ['firstName', 'lastName']);
    if (!treatment) {
      return res.status(404).json({ msg: 'Treatment not found' });
    }
    res.json(treatment);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Treatment not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/treatments
// @desc    Create a treatment
// @access  Private
router.post('/', async (req, res) => {
  try {
    const newTreatment = new Treatment(req.body);
    const treatment = await newTreatment.save();
    res.json(treatment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/treatments/:id
// @desc    Update a treatment
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const treatment = await Treatment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!treatment) {
      return res.status(404).json({ msg: 'Treatment not found' });
    }
    res.json(treatment);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Treatment not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/treatments/:id
// @desc    Delete a treatment
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const treatment = await Treatment.findByIdAndDelete(req.params.id);
    if (!treatment) {
      return res.status(404).json({ msg: 'Treatment not found' });
    }
    res.json({ msg: 'Treatment removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Treatment not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router; 