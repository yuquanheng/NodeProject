var express = require('express');
var router = express.Router();
var Connection = require('tedious').Connection;
var Request = require('tedious').Request; 
var myconnect = require('../sql/dbhelp');
var sqlconfig = require('../sql/sqlconfig');
var Paras = require('../request/ParseRequestBody');
var moment = require('moment');
var Q = require("q");
//用户名，密码和数据库服务器,数据库   
var mongoose = require('mongoose'); 
var config = sqlconfig;
/* GET home page. */
//查询信息
String.prototype.trim = function() {
       return this.replace(/^\s+|\s+$/g, "");
    };
router.get('/', function (req, res, next) {
	
	console.log("里程管理 数据库查询操作");
	var QueryObject = new Paras(req).GetParas();
	
	var date = QueryObject.date.trim();
    console.log("收到date "+date);
	var phone  = QueryObject.phone.trim();
    console.log("收到phone "+phone);
	var ename  = QueryObject.ename.trim();
    console.log("收到ename "+ename);
	//var rpid = QueryObject.id.trim();
	var sEcho = QueryObject.sEcho.trim();
	var iDisplaystart =QueryObject.iDisplayStart.trim();
	var iDisplayLength =QueryObject.iDisplayLength.trim();
	var displayargs = {
		'iDisplaystart':iDisplaystart,
		'iDisplayLength':iDisplayLength,
		'sEcho':sEcho,
		//'id':rpid,
		'date':date,
		'phone':phone,
		'ename':ename
	};
	
	getdatafromdatabase(res,displayargs);
});
function getdatafromdatabase(res,displayargs){
	
	 console.log("进去查询"); 
	 var testeray = moment().subtract(1,'days').format('YYYY-MM-DD');
	 var sql = "select * from dbo.GIS_MileageDetailReport where ReportDate = '"+displayargs.date+"' and Phone = "+displayargs.phone;
     console.log("详细查询中的 sql语句 "+sql);
	QueryRawdata(sql).done(
	function(data){
		 if(data.length > 0)
		 {
			  console.log("存在数据");
			  var enddata = operteRawdata(data,displayargs);
			  var senddata = {"sEcho":displayargs.sEcho,"iTotalRecords":data.length,"iTotalDisplayRecords":data.length,"aaData":enddata};
			  res.send(JSON.stringify(senddata));
		 }
		 else
		 {  
	          console.log("不存在数据");
	          var senddata = {"sEcho":displayargs.sEcho,"iTotalRecords":data.length,"iTotalDisplayRecords":data.length,"aaData":[]};
			  res.send(JSON.stringify(senddata));
		 }
	},
	function(err){
		console.log(err);
	}
	);
}
function QueryRawdata(sql)
{
	var deferred = Q.defer();
	var connectionkey = new Connection(config);
	myconnect.querydata(sql,connectionkey,function(err,data){
		
		if(err)
		{
			console.log(err);
			deferred.reject(err);
		}
		else
		{
			deferred.resolve(data);
		}
	});
	return deferred.promise;
}
function operteRawdata(data,displayargs)
{   
	var datalength = data.length;
	var aaData = [];
	var iDisplaystart = displayargs.iDisplaystart;
	var displaylength = displayargs.iDisplayLength;
	var numberstart = parseInt(iDisplaystart,"10");
	var numberdisplay = parseInt(displaylength,"10");
	
	if((datalength-numberstart)<numberdisplay)
	{
		console.log("不够显示一页了");
		numberdisplay = datalength-numberstart;
	}
	//console.log("翻页起始位置"+numberstart);
	for(var i=numberstart;i<numberstart+numberdisplay;i++)
	{   
      
		var row = data[i];
        var miaoshu="";
		var truemiao="";
		var date="";
		var timeBg = "";
		var timeEd = "";
		if(row.Ex_BgTime != null)
		{
			miaoshu = row.Ex_BgTime.getTime()/1000;
			truemiao = miaoshu-8*3600;
		    date = new Date( truemiao * 1000 );//.转换成毫秒
		    timeBg = moment(new Date(date)).format('YYYY/MM/DD HH:mm:ss'); 
		}		
		if(row.Ex_EndTime != null)
		{
			miaoshu = row.Ex_EndTime.getTime()/1000;
			truemiao = miaoshu-8*3600;
		    date = new Date( truemiao * 1000 );//.转换成毫秒
		    timeEd = moment(new Date(date)).format('YYYY/MM/DD HH:mm:ss'); 
		}
		//row.ReportDate,row.Rp_ID,row.Phone,row.Name,row.Ex_BgTime,row.Ex_EndTime,row.Ex_Mileage,row.E_ID,row.E_Name,row.OrgID,row.OrgName
     	var getrow = [row.ReportDate,row.Phone,row.Name,timeBg,timeEd,(row.Ex_Mileage/1000).toFixed(2),displayargs.ename,row.OrgName,row.E_ID,row.OrgID];
		
	    aaData.push(getrow);
	}
	
	return aaData;
	
}
module.exports = router;