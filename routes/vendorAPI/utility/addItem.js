var items = require('../../items/items');


var addItem = async (obj) => {

  var ret = await items.findOne({ username: obj.username, itemName: obj.itemName });
  if (ret)
    throw new Error('Item already exists.Please delete and try again');

  var newItem = new items({
    username: obj.username,
    itemName: obj.itemName,
    price: parseFloat(obj.price)
  });
  var ret3 = await newItem.save();
  return true;
};

module.exports = addItem;
