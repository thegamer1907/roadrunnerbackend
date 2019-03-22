var UsernameToCard = require('../../usernameToCard/UsernameToCard');
var CardDetails = require('../../cardDetails/CardDetails');


var linkCard = async (username, cardNo) => {


  var obj = await CardDetails.findOne({ cardNo: cardNo });
  if (!obj)
    throw new Error('Card Does Not Exists. Register the card First');
  obj = await UsernameToCard.findOne({ cardNo: cardNo });
  if (obj)
    throw new Error(`Card already linked to a vendor ${obj.username}`);
  obj = await UsernameToCard.findOne({ username: username });
  if (obj)
    throw new Error('Username already linked to a card. Please contact WMD to change');
  var newUsernameToCard = new UsernameToCard({
    username: username,
    cardNo: cardNo
  });
  var ret3 = await newUsernameToCard.save();

  return true;
};


module.exports = linkCard;