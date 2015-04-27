var mongoose = require('mongoose');

var dbURI = process.env.DBURI || 'mongodb://localhost/dict';
mongoose.connect(dbURI);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var wordSchema = mongoose.Schema({
  word: String,
  syllables: Array
});

wordSchema.methods.splitSyllables = function() {

};

wordSchema.pre('save', function(next) {
  word.split('')
};

var Word = mongoose.model('Word', wordSchema);