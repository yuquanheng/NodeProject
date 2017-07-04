var mysql = require('mysql');
var config = require('./mysqlconfig');
var db = {};
db.Query = function(sql,callback){
	var connection = mysql.createConnection(config);
	connection.connect(function(err){
		console.log("MySql 链接失败 "+JSON.stringify(err));
		return; 
	});
    connection.query(sql,function(err, rows, fields){
     if (err){
		 console.log("读取数据库失败 "+JSON.stringify(err));
		 return;
	 }
     else
	 {
		callback(rows);		
	 }
    });	
	connection.end(function(err){
	if(err)
	{
		console.log("关闭失败");
	}
	else{
		console.log("关闭成功");
	}
    });
}
module.exports = db;