/**
 * Created by DELL on 10/30/2016.
 */
var mongoose =require('mongoose');
var Schema = mongoose.Schema;
var roomSchema = new Schema({
    name : String,
    date: { type: Date, default: Date.now() }
});

roomSchema.statics.findAllRooms = function (callback) {
    this.find(function (err, doc) {
        if (err) callback(err);
        else if (doc) callback(null, doc);
        else callback(null, false);
    });
};

roomSchema.statics.checkDefaultRoom = function (callback) {
    console.log("sadqwd");
    this.findOne({name : 'default'},function (err, doc) {
        if (err) callback(err);
        else if (doc) callback(null, true);
        else callback(null, false);
    });
};

module.exports = mongoose.model('Room', roomSchema);