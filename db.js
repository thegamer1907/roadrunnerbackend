var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/roadrunner', { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);