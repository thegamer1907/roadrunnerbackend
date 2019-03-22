var User = require('../../user/User');
var IsVendor = require('../../isVendor/IsVendor');


var getAllVendors = async () => {

  var obj = await IsVendor.find({ isVendor: true });
  var data = [];
  for (let i = 0; i < obj.length; i++) {
    data.push(obj[i].username);
  }

  var ret = await User.find({ username: { $in: data } }, { _id: 0, password: 0 });
  return ret;
};




module.exports = getAllVendors;
