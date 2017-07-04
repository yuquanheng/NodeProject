var express = require('express');
var router = express.Router();
var Connection = require('tedious').Connection;
var Q = require("q");
var formidable = require("formidable"); //载入 formidable
var fs = require('fs');
var success="";
var successfile="";
//用户名，密码和数据库服务器,数据库   
/* GET home page. */
//表查询信息 
router.get('/images/*', function (req, res, next) {
   success="";
   successfile="";
   var getREQ = req;
   var QueryObject = getREQ.query;
   var imagepath = "."+req.originalUrl;
   fs.exists(imagepath, function(exists) {  
    
	if(exists)
	{
		console.log("文件存在 返回本服务器图片");
		fs.readFile(imagepath,'binary',function(err, file) {
		if(err)
		{
			console.log(err);
		}
		else
		{
		 res.write(file,"binary"); 
		 res.end(); 
		}
        });
	}
	else
	{
		
		console.log("文件不存在  返回用户默认的头像");
		fs.readFile('./public/images/initphoto.png','binary',function(err, file) {
	    
		if(err)
		{
			console.log(err);
		}
		else
		{
		 res.write(file,"binary"); 
		 res.end(); 
		}
        });
	}
    	
   });
});
//
function unique(arr){
var tmp = new Array();
for(var m in arr){
tmp[arr[m]]=1;
}
//再把键和值的位置再次调换
var tmparr = new Array();
 
for(var n in tmp){
tmparr.push(n);
}
return tmparr;
}
//
module.exports = router;