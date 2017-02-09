/**
 * Created by DELL on 10/30/2016.
 */
var mongoose =require('mongoose');
var Schema = mongoose.Schema;
var messageSchema = new Schema({
    senderName : String,
    content : String,
    reply : String,
    date: { type: Date, default: Date.now() },
    room : { type: Schema.Types.ObjectId }
});

messageSchema.index({"content" : "text"}, function(err, data){
 console.log(err);
 console.log(data);
})

messageSchema.statics.getMessageForRooms = function (id, callback) {
    this.find({room : id},function (err, doc) {
        if (err) callback(err);
        else if (doc) callback(null, doc);
        else callback(null, false);
    });
};


messageSchema.statics.compareStrings1 = function (sentMsg, callback) {
console.log(sentMsg);
this.find({$text: {$search : sentMsg}},
  //,  { score : { $meta: "textScore" } }
  function (err, doc) {
     console.log(err);
     console.log(doc);
    if (err) callback(err);
    else if (doc) callback(null, doc);
    else callback(null, false);
 });
};


messageSchema.statics.compareStrings = function (sentMsg, callback) {
console.log(sentMsg);
    this.find({ content : {$text:{$search:"\"hi\""}}},function(err,doc ){
    if(err)
    console.log(err);
    else
        console.log(doc);
    });
//    this.find({content : sentMsg},function (err, doc) {
//        if (err) callback(err);
//        else if (doc) callback(null, doc);
//        else callback(null, false);
//    });
};

module.exports = mongoose.model('Message', messageSchema);