var ConnectionPool = require('tedious-connection-pool');
var Request = require('tedious').Request;
var logger = require('../../util/log').logger; 
var ExecStateMent = {}; 
ExecStateMent.exec = function(sql,callback)
{
	console.log("sql³Ø´´½¨");
	var rows = [];
	var poolConfig = {
    min: 4,
    max: 10
    //log: true
    }; 
    
	
    var connectionConfig = {
      userName: 'sa',  
	  password: 'xinyun!2#4',  
	  server: '220.248.36.100',  
	  options : {  
				  database  : 'TrafficDispatch',
				  'requestTimeout': 30000			  
				}  
    };

	var pool = new ConnectionPool(poolConfig, connectionConfig);

	pool.on('error', function(err) {
		logger.error("sqlserver connection err:"+err);
		console.error(err);
	});

	pool.acquire(function (err, connection) {
		if (err) {
			console.error(err);
			logger.error("sqlserver connection err:"+err);
			return;
		}

		var request = new Request(sql, function(err, rowCount) {
			if (err) {
				console.error(err);
				logger.error("sqlserver connection err:"+err);
				callback([]);
				return;
			}
            
			
			console.log('rowCount: ' + rowCount);
            callback(rows);
			rows = [];
			connection.release();
			
		});

		request.on('row', function(columns) {
			 var row = {};
			 var columnslength = columns.length;
			 for(var i=0 ;i< columnslength ; i++)
			 {
				var column = columns[i];
				row[column.metadata.colName] = column.value;
				 
			 }
		     rows.push(row);
		});

		connection.execSql(request);
  });
}
module.exports = ExecStateMent;