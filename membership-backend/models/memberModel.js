const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Member must be a User!']
  },
  firstName: {
    type: String,
    required: [true, 'User must have a first name']
  },
  lastName: {
    type: String,
    required: [true, 'User must have a last name']
  },
  dob: {
    type: Date,
    required: [true, 'User must have a date of birth']
  },
  membershipId: {
    type: String,
    required: [true, 'User must have a membership ID']
  },
  entryYear: {
    type: Number,
    required: [true, 'User must have an entry year']
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'unpaid', 'pending'],
    default: 'pending'
  },
  memberStatus: {
    type: String,
    enum: ['active', 'inactive', 'deceased'],
    default: 'active'
  },
  dependents: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Dependent'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

memberSchema.pre(/^find/, function(next) {
  this.populate('user');
  next();
});

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;
