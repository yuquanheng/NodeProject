var io = require('socket.io')();
var onlineUsers = {};
var onlineCount = 0;
function mysocket(server){

    (function(server){
      
      io.listen(server);
      io.on( "connection", function( socket ){
         console.log( "一个新连接" ); 
      });
			
    })(server);
}
exports.listen = mysocket;