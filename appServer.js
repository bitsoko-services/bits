var exports = module.exports = {};

exports.Wallet = function(socket) {
    
 bitsoko.manageSocket(socket);
	
    
    socket.on('getRecList', function (data) {
    consol.info('attempting recovery ' + data.data);
      
bsConn.mysql.query('SELECT * FROM wallets',
        function(err, results) {
       
        if(results){
          
            socket.emit(data.action, { action : data.action, "status" : "ok", data : results }); 
            
    }

});
        
  });
