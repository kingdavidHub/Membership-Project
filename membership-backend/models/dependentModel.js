// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');

const dependentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Dependent must have a first name']
  },
  lastName: {
    type: String,
    required: [true, 'Dependent must have a last name']
  },
  member: {
    type: mongoose.Schema.ObjectId,
    ref: 'Member',
    required: [true, 'Dependent must be attached to a member']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Dependent = mongoose.model('Dependent', dependentSchema);

module.exports = Dependent;
