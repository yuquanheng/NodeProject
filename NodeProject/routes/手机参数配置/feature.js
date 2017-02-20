var express = require('express');
var router = express.Router();
var Connection = require('tedious').Connection;
var Request = require('tedious').Request; 
var myconnect = require('../数据库/dbhelp');
var Paras = require('../请求参数/ParseRequestBody');
//用户名，密码和数据库服务器,数据库   
/* GET home page. */
//表查询信息
var config = {  
  userName: 'sa',  
  password: 'xinyun!2#4',  
  server: '220.248.36.100',  
  options : {  
              database  : 'TrafficDispatch'		 
            }  
  };
String.prototype.trim = function() {
       return this.replace(/^\s+|\s+$/g, "");
};
router.get('/',function(req, res, next){
	
	console.log("获取企业数据");
	var sql = "select E_ID,E_Name from SYS_EnterpriseInfo";
	
	var connectionkey = new Connection(config);
	myconnect.querydata(sql,connectionkey,function(err,data){
		
		if(err)
		{
			console.log(err);
		}
		else
		{
			if(data.length>0)
			{
				res.send(JSON.stringify(data));
			}
			else
			{
				res.send(JSON.stringify([]));
			}
		}
	});
});
router.get('/init',function(req, res, next){
	
	console.log("初始化数据请求");
	var geteid = req.query.posteid;
	
	var sql = "select CP_Content from SYS_ConfigParamInfo where CP_Key = '"+geteid+"' and CP_CategoryValue = '240'";
	var connectionkey = new Connection(config);
	myconnect.querydata(sql,connectionkey,function(err,data){
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.send(JSON.stringify(data)); 
		}
	});
	
});
router.post('/post', function (req, res, next) {
	
	var QueryObject = new Paras(req).PostParas().then(function(data){
		
		   var getdata = data.postdata;
		   var eid = data.posteid;
		   
		   var jsonparse = JSON.parse(getdata);
		   var pushdataString = JSON.stringify(jsonparse[0]);
		   console.log("得到传送数据 "+getdata);
		   console.log("得到数据的单位 "+eid);
		   console.log("插入数据库的内容 "+pushdataString);
		   var sql = "if exists(select 1 from SYS_ConfigParamInfo where CP_CategoryValue = '240' and CP_Key = '"+eid+"') update SYS_ConfigParamInfo set CP_Content ='"+pushdataString+"' where CP_Key = '"+eid+"' and CP_CategoryValue = '240' else insert into SYS_ConfigParamInfo(CP_Key,CP_CategoryValue,CP_CategoryName,CP_Content,CP_CreateTime) values('"+eid+"',240,'EFS_TYPE_SMARTFEATURE','"+pushdataString+"',GETDATE())";
		   sql = "";
		   var connectionkey = new Connection(config);
			myconnect.querydata(sql,connectionkey,function(err,data){
				if(err)
				{
					console.log(err);
				}
				else
				{
					res.send(['上传成功']); 
				}
			});
	},function(err){
		console.log(err);
	});
   /*var getdata = req.query.postdata;
   var eid = req.query.posteid;
   
   var jsonparse = JSON.parse(getdata);
   var pushdataString = JSON.stringify(jsonparse[0]);
   console.log("得到传送数据 "+getdata);
   console.log("得到数据的单位 "+eid);
   console.log("插入数据库的内容 "+pushdataString);
   var sql = "if exists(select 1 from SYS_ConfigParamInfo where CP_CategoryValue = '240' and CP_Key = '"+eid+"') update SYS_ConfigParamInfo set CP_Content ='"+pushdataString+"' where CP_Key = '"+eid+"' and CP_CategoryValue = '240' else insert into SYS_ConfigParamInfo(CP_Key,CP_CategoryValue,CP_CategoryName,CP_Content,CP_CreateTime) values('"+eid+"',240,'EFS_TYPE_SMARTFEATURE','"+pushdataString+"',GETDATE())";
   sql = "";
   var connectionkey = new Connection(config);
	myconnect.querydata(sql,connectionkey,function(err,data){
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.end("上传成功"); 
		}
	});*/
    
});
//
function unique(arr){
	var tmp = new Array();
	for(var m in arr){
	tmp[arr[m]]=1;
	}
	var tmparr = new Array();
	for(var n in tmp){
	tmparr.push(n);
	}
	return tmparr;
}
//
module.exports = router;