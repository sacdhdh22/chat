/**
 * Created by DELL on 10/30/2016.
 */
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var path  = require('path');
var Room = require('./model/rooms.js');
var Msg = require('./model/message.js');
var Message = require('./model/message.js');
var _ = require('underscore');
var _ = require('lodash');
//connection
mongoose.connect('mongodb://localhost/chatapp');
//var route = require('./serverApi');

//setting up the path to public directory
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

//setting up the body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.set('view engine', 'jade');

//page to be loaded when server runs
app.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname,'views', 'index.html'));
});

io.sockets.on('connection',function(socket){
    var roomsNow =[];
    var messages = [];
    var users = [];
    socket.on('get Rooms', function(data){
        Room.findAllRooms(function(err, doc){
            if(err)
            res.sendStatus(500);
            else if(doc){
                _.each(doc, function(data){
                    roomsNow.push(data)
                });
                socket.emit('got rooms', {rooms: roomsNow});
            }
        });
    });

    socket.on('get AllRooms', function(data){
        Room.findAllRooms(function(err, doc){
            if(err)
            res.sendStatus(500);
            else if(doc){
                socket.emit('all rooms', doc);
            }
        });
    });

    socket.on('add Rooms', function(data){
         var room = new Room();
         room.name = data.roomName;
         Room.create(room, function(err, data){
         if(err)
             res.sendStatus(200);
         else if(data)
         {
             roomsNow.push(data);
             io.sockets.emit('got rooms', {rooms : roomsNow});
         }
      });
    });


     // Adding users name user joined and is directed to default room

    socket.on('user joined', function(data){
      Room.findOne({'name' : 'default'},function (err, doc) {  //Creates for the first time only
      if(!doc)
      {
          var room = new Room();
          room.name = "default";
          Room.create(room, function(err, data) {
              socket.emit('default group', data);
              socket.broadcast.emit('newuser joined',data);
              });
          }
          else if(doc){
          socket.join(doc._id);
          socket.broadcast.emit('newuser joined',doc);
          socket.emit('default group', doc);
               }
          });
    });

    socket.on('sent MsgChangeRoom', function(data){
        Msg.getMessageForRooms(data, function(err, doc){

           messages = [];
            _.each(doc, function(ele){
               messages.push(ele);
            });
            socket.emit('get AllMsg', messages);
        });
    });

    socket.on('get DefaultMsg', function(data){
        Msg.getMessageForRooms(data, function(err, doc){
           messages = [];
            _.each(doc, function(ele){
               messages.push(ele);
            });
            socket.emit('send DefaultMsg', messages);
        });

    });

    //socket.on('sent Msg', function(data){
    //    Msg.getMessageForRooms(data, function(err, doc){
    //       messages = [];
    //        _.each(doc, function(ele){
    //           messages.push(ele);
    //        });
    //        socket.emit('get Msh', messages);
    //    });
    //
    //});

    var arr = ["Sorry ComeAgain..!"];
    socket.on('send msg', function(data, data1, data2){
     Message.compareStrings1(data, function(err, doc){
     if(err)
        io.sockets.emit('get Msg', arr);
     else if(doc.length == 0)
        io.sockets.emit('get Msg', arr);
     else
     {
       var a  = _.map(doc, 'reply');
       console.log(a);
       io.sockets.emit('get Msg',a);
     }
     })

//     var message = new Msg();
//        message.content = data;
//        message.senderName = data1;
//        message.room = data2;
//        Msg.create(message, function(err, data){
//            messages.push(data);
//            io.sockets.in(data2).emit('get Msg', messages);
//        })
    });

// In case user changes the room\

    socket.on('change Room', function(random , oldRoom, newRoom){
        console.log(random);
        console.log(oldRoom);
        console.log(newRoom);
        socket.leave(oldRoom);
        socket.join(newRoom);
        socket.broadcast.to(oldRoom).emit('user left');
        socket.broadcast.to(newRoom).emit('user joined1');
        //io.sockets.emit('room changed', newRoom);
    });
})
server.listen(3000);
module.exports = app;