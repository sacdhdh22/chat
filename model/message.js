/**
 * Created by DELL on 10/30/2016.
 */
var mongoose =require('mongoose');
var Schema = mongoose.Schema;
var messageSchema = new Schema({
    senderName : String,
    content : String,
    date: { type: Date, default: Date.now() },
    room : { type: Schema.Types.ObjectId }
});

messageSchema.statics.getMessageForRooms = function (id, callback) {
    this.find({room : id},function (err, doc) {
        if (err) callback(err);
        else if (doc) callback(null, doc);
        else callback(null, false);
    });
};

module.exports = mongoose.model('Message', messageSchema);