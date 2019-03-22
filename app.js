var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var db = require('./db');
var favicon = require('serve-favicon');

var config = require('./config')
var mongoose = require('mongoose');
var expressSanitizer = require('express-sanitizer');
var helmet = require('helmet');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var fs = require('fs');
global.__root = __dirname + '/routes/';

var app = express();

// Don't redirect if the hostname is `localhost:port` or the route is `/insecure`
if (config.secure)
  app.use(redirectToHTTPS([/localhost:(\d{4})/], [/\/insecure/], 301));


// app.use(favicon(__dirname + '/public/assests/wallet.svg'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.use(expressSanitizer());
app.use('/', indexRouter);

app.get('/api', function (req, res) {
  res.status(200).send('API works.');
});


var UserController = require(__root + 'user/UserController');
app.use('/api/users', UserController);

var AuthController = require(__root + 'auth/AuthController');
app.use('/api/auth', AuthController);

// var CardBalanceController = require(__root + 'cardBalance/CardBalanceController');
// app.use('/api/cardbalance', CardBalanceController);

// var CardDetailsController = require('./routes/cardDetails/CardDetailsController');
// app.use('/api/carddetails', CardDetailsController);

// var CardPinController = require('./routes/cardPin/CardPinController');
// app.use('/api/cardpin', CardPinController);

// var IDToCardController = require('./routes/idToCard/IDToCardController');
// app.use('/api/idtocard', IDToCardController);

// var IsAdminController = require('./routes/isAdmin/isAdminController');
// app.use('/api/isadmin', IsAdminController);

// var IsSuperuserController = require('./routes/isSuperuser/IsSuperuserController');
// app.use('/api/issuperuser', IsSuperuserController);

// var IsVendorController = require('./routes/isVendor/IsVendorController');
// app.use('/api/isvendor', IsVendorController);

// var ItemsController = require('./routes/items/itemsController');
// app.use('/api/items', ItemsController);

// var TransactionController = require('./routes/transaction/TransactionController');
// app.use('/api/transaction', TransactionController);

// var TransactionDetailsController = require('./routes/transactionDetails/TransactionDetailsController');
// app.use('/api/transactiondetails', TransactionDetailsController);

// var UsernameToCardController = require('./routes/usernameToCard/UsernameToCardController');
// app.use('/api/usernametocard', UsernameToCardController);

// var CardAPIController = require('./routes/cardAPI/CardAPIController');
// app.use('/api/v2/card', CardAPIController);

// var VendorAPIController = require('./routes/vendorAPI/VendorAPIController');
// app.use('/api/v2/vendor', VendorAPIController);

// var UserHardCashController = require('./routes/userHardCash/UsernameHardCashController');
// app.use('/api/userhardcash', UserHardCashController);

// var TransactionSummaryController = require('./routes/TransactionSummary/TransactionSummaryController');
// app.use('/api/transactionsummary', TransactionSummaryController)

// var IsFinanceAdminController = require('./routes/isFinanceAdmin/IsFinanceAdminController');
// app.use('/api/isfinanceadmin', IsFinanceAdminController);

// var AllCardDetailsController = require('./routes/allCardDetails/AllCardDetailsController');
// app.use('/api/allcarddetails', AllCardDetailsController);

// var UtilityAPIController = require('./routes/utilityAPI/utilityAPIController');
// app.use('/api/v2/utility', UtilityAPIController);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = err;
  err.stack = '';
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
