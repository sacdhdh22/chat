
angular.module('myApp').factory('socket', function(){
    return io.connect('http://localhost:3000');
});