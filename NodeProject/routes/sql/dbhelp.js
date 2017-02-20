var mongoose = require('mongoose');  
var Request = require('tedious').Request;
var moment = require('moment'); 
    //用户名，密码和数据库服务器,数据库  
var db = {};
db.querydata=function(sqlselect,connectionkey,callback)
{    
     var connection = connectionkey;
     connection.on('connect', function(err) {
		            if(err)
					{
						console.log('connect err');
						return;
					}
					else
					{
						console.log('connect success');
					}
                   executeStatement(connection,sqlselect,callback);
                  });
}
function executeStatement(connection,sqlselect,callback) 
{        
          var rows=[]; 
          request = new Request(sqlselect,function(err, rowCount) {
          if (err)
		  {
            console.log(err);
			return;
          } 
		  else 
		  {
            console.log("the datacounts "+rowCount);
          }
      
           connection.close();
		   callback(err,rows);
         });

        request.on('row', function(columns) {
		  var row = {};
          columns.forEach(function(column) {
		   row[column.metadata.colName] = column.value;
           });
		  rows.push(row);
         });

        request.on('done', function(rowCount, more) {
         console.log(rowCount + ' rows returned');
        });

       connection.execSql(request);
 };
module.exports = db;