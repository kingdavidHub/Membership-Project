const User = require('./../models/userModel');
const Member = require('./../models/memberModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const Email = require('../utils/email');
const { generateTempPassword } = require('../utils/generateTempPassword');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.addMemberDetailsAdmin = catchAsync(async (req, res, next) => {
  const oldUser = await User.findById(req.params.id);

  if (oldUser.member) {
    return next(new AppError('User already has a member', 400));
  }

  const body = filterObj(
    req.body,
    'firstName',
    'lastName',
    'dob',
    'membershipId',
    'entryYear'
  );

  const member = await Member.create({
    user: req.params.id,
    ...body
  });

  const password = generateTempPassword();

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      member: member.id,
      enforcePasswordReset: true
    },
    {
      new: true,
      runValidators: true
    }
  );

  const user = await User.findById(req.params.id);
  user.password = password;
  await user.save();

  // await new Email().onCreateUser(user.email, password, user.firstName);

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.changeUserRole = catchAsync(async (req, res, next) => {
  const role = req.body.role;
  if (role === 'super-admin') {
    return next(new AppError(`You can't create new super admins`, 400));
  }
  const allowedRoles = ['admin', 'member'];
  if (!allowedRoles.includes(role)) {
    return next(new AppError(`You can only choose admin or member`, 400));
  }
  const user = await User.findByIdAndUpdate(req.body.id, {
    role: req.body.role
  });

  console.log('passed');

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead'
  });
};

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);

// Do NOT update passwords with this!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
