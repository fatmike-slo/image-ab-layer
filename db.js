var mongoose = require('mongoose');

mongoose.connect('mongodb://fatmike:A10Warthog@ds161471.mlab.com:61471/fatmongodb', { useMongoClient: true, promiseLibrary: global.Promise });


let Schema = mongoose.Schema;

let searchSchema = new Schema({
    term: String,
    when: String
});

let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", ()=> {
    console.log('connected');
});

let Database = mongoose.model("images", searchSchema);

module.exports = Database;