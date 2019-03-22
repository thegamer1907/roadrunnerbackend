var User = require('../../user/User');
var IsVendor = require('../../isVendor/IsVendor');
var IsAdmin = require('../../isAdmin/isAdmin');
var IsSuperuser = require('../../isSuperuser/IsSuperuser');
var IsFinanceAdmin = require('../../isFinanceAdmin/IsFinanceAdmin');
var linkCard = require('./linkUserCard');
var mongoose = require('mongoose');
var IsFoodAdmin = require('../../isFoodAdmin/IsFoodAdmin');

var addVendor = async (obj) => {

  const session = await mongoose.startSession();
  await session.startTransaction();

  try {

    var hashedPassword = obj.password;
    var newUser = new User({
      name: obj.name,
      username: obj.username,
      password: hashedPassword,
      phoneNumber: obj.phoneNumber
    });

    var ret3 = await newUser.save();
    var newisAdmin = new IsAdmin({
      username: obj.username,
      isAdmin: false
    });
    ret3 = await newisAdmin.save();

    var newisSuperuser = new IsSuperuser({
      username: obj.username,
      isSuperuser: false
    });
    ret3 = await newisSuperuser.save();


    var newisVendor = new IsVendor({
      username: obj.username,
      isVendor: true
    });
    ret3 = await newisVendor.save();


    var newisFinanceAdmin = new IsFinanceAdmin({
      username: obj.username,
      isFinanceadmin: false
    });
    ret3 = await newisFinanceAdmin.save();

    var newisFoodAdmin = new IsFoodAdmin({
      username: obj.username,
      isFoodAdmin: false
    });
    ret3 = await newisFoodAdmin.save();

    await session.commitTransaction();
    await session.endSession();

    return true;

  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};




module.exports = addVendor;
