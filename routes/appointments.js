const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// @route   GET api/appointments
// @desc    Get all appointments
// @access  Private
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient', ['firstName', 'lastName'])
      .sort({ date: 1 });
    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/appointments/:id
// @desc    Get appointment by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', ['firstName', 'lastName']);
    if (!appointment) {
      return res.status(404).json({ msg: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Appointment not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/appointments
// @desc    Create an appointment
// @access  Private
router.post('/', async (req, res) => {
  try {
    const newAppointment = new Appointment(req.body);
    const appointment = await newAppointment.save();
    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/appointments/:id
// @desc    Update an appointment
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ msg: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Appointment not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/appointments/:id
// @desc    Delete an appointment
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ msg: 'Appointment not found' });
    }
    res.json({ msg: 'Appointment removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Appointment not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router; 