var myApp = angular.module('myApp', []);

myApp.controller('controller', function($scope, $http, $timeout, socket){
  //Declaring global variable
    $scope.rooms = [];
    $scope.messages = [];
    $scope.name;
    $scope.roomId;
    $scope.left = '';
    $scope.joined='';
    var random =Math.random();

    //Modal to input your name
    $('#entername').modal({
        backdrop: 'static',
        keyboard: false
    })
  //Fetch all the rooms that are available for chat iniatially
    socket.emit('get Rooms', {});
     socket.on('got rooms', function(data) {
        $scope.rooms = data.rooms;
        $scope.$digest();
    });

  //Adding new room
    $scope.addRoom = function() {
       socket.emit('add Rooms', {roomName : $scope.roomName});
    };

  //When user changes the room gets all the message for the new room
    $scope.changeRoom = function(id) {
       var random = Math.random();
       socket.emit('change Room',random,  $scope.roomId,  id);
        socket.on('user left', function(data){
            console.log("edwef");
            $scope.left = $scope.name + " " + "left the room";
            console.log($scope.left);
         });
       socket.on('user joined1', function(data) {
           $scope.joined = "New user joined the room";
           console.log($scope.joined);
           $scope.roomId = data;
           socket.emit('sent MsgChangeRoom', $scope.roomId);
           socket.on('get AllMsg', function(data) {
               $scope.messages = [];
               $scope.messages = data;
               $scope.$digest();
           });
         });
    };

    // Adding Users name for first time and getting all the  Messages for default room
      $scope.addName = function(name) {
        $scope.name = name;
        socket.emit('user joined', name);

        socket.on('newuser joined', function(name){
            $scope.room = data.name;
            $scope.joined = $scope.name + " " + "joined the room";
            alert($scope.joined);
        })
        socket.on('default group', function(data) {
        $scope.roomId = data._id;
        socket.emit('get AllRooms', {});
        socket.on('all rooms', function(data) {
            $scope.rooms = [];
            $scope.rooms.push(data[0]);
            $scope.$digest();
        });
        socket.emit('get DefaultMsg', $scope.roomId);
        socket.on('send DefaultMsg', function(data) {
            $scope.messages = [];
            $scope.messages = data;
            $scope.$digest();
            });
        });
      };

   //Sending message from user
    $scope.sendMessage = function(msg) {
       socket.emit('send msg', msg, $scope.name,  $scope.roomId);
        socket.on('get Msg', function(data) {
            $scope.messages = data;
            $scope.$digest();
        });
        };
});
