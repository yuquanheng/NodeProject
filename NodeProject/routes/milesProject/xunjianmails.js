var express = require('express');
var router = express.Router();
var Connection = require('tedious').Connection;
var Request = require('tedious').Request; 
var myconnect = require('../sql/dbhelp');
var sqlconfig = require('../sql/sqlconfig');
var Paras = require('../request/ParseRequestBody');
var Excel = require('../file/Excel');
var Unique = require('../data/UniqueData');
var moment = require('moment');
var Q = require("q");
var globale = "";
//用户名，密码和数据库服务器,数据库   
var mongoose = require('mongoose'); 
var config = sqlconfig; 
// define the global variable in case of reapeating the sql
var storysql = "";
String.prototype.trim = function() 
{
   return this.replace(/^\s+|\s+$/g, "");
};
router.get('/', function (req, res, next) {
	
	console.log("database begin");

	var QueryObject = new Paras(req).GetParas();
	
	var phone = QueryObject.phone.trim();
	var name = QueryObject.name.trim();
	var ename = QueryObject.ename.trim();
	var oname = QueryObject.oname.trim();
	var timestart = QueryObject.timestart.trim();
	var timeend = QueryObject.timeend.trim();
	var sEcho = QueryObject.sEcho.trim();
	var iDisplaystart =QueryObject.iDisplayStart.trim();
	var iDisplayLength =QueryObject.iDisplayLength.trim();
	//var globale = "";
	var args = {
		
		'phone':phone,
		'name':name,
		'ename':ename,
		'oname':oname,
		'timestart':timestart,
		'timeend':timeend
	};
	var displayargs = {
		'iDisplaystart':iDisplaystart,
		'iDisplayLength':iDisplayLength,
		'sEcho':sEcho
	};
	
	getdatafromdatabase(args,res,displayargs);
});
function getunio(arr)
{
	var datalength = arr.length;
	var uniarrstring = [];
	var uniqueg = [];
	
	if(datalength > 0)
	{
		for(var i=0;i<datalength;i++)
		{
			var row = arr[i];
			uniarrstring.push(""+row['E_ID']+":"+row['OrgName']);
		}
		Unique.arr = uniarrstring;
		var midos = Unique.StringGroup();
		
		for(var i=0;i<midos.length;i++)
		{
			var stringos = midos[i];
			var groups = stringos.split(":");
			var temp = {'E_ID':groups[0],'OrgName':groups[1]};
			uniqueg.push(temp);
			
		}
	}
	return uniqueg;
}
router.get('/osgroup', function (req, res, next) {
	
	 
	//加载部门数据 由于部门存在重复 要有函数对其进行过滤 后进行返回
    var sql = "select E_ID,OrgName from dbo.GIS_MileageReport";
	var connectionkey = new Connection(config);
	myconnect.querydata(sql,connectionkey,function(err,data){
	if(err)
	{
		console.log(err);
		res.send(JSON.stringify([]));
	}
	else
	{
		if(data.length > 0)
		{
			console.log("存在数据");
			var datalength = data.length;
			var arr =[];
			
			for(var i=0;i<datalength;i++)
			{
				arr.push(data[i]);
			}
			
			var norepeat = getunio(arr);
			res.send(JSON.stringify(norepeat));
		}
		else
		{   
			console.log("没有数据");
			res.send(JSON.stringify([]));
		}
	}
   });
	
});
router.get('/esgroup', function (req, res, next) {
	
	//加载单位数据 由于单位数据不存在重复 所以不需要进行过滤 直接从数据库读取并返回
	var sql = "select E_ID,E_Name from dbo.SYS_EnterpriseInfo";
	console.log("单位查询");
	var connectionkey = new Connection(config);
	myconnect.querydata(sql,connectionkey,function(err,data){
		
		if(err)
		{
			console.log(err);
		}
		else
		{
			if(data.length > 0)
			{  
		        console.log("存在数据");
				var datalength = data.length;
				var arr =[];
				globale = data;
				console.log("单位内存存储");
				for(var i=0;i<datalength;i++)
				{
					arr.push(data[i]);
				}
			  
				res.send(JSON.stringify(arr));
			}
			else
			{   console.log("不存在数据");
				res.send(JSON.stringify([]));
			}
		}
	});
	
});
router.get('/pie', function (req, res, next) {
	
	console.log("制作饼图");

    var QueryObject = new Paras(req).GetParas();
	
	
	var type = QueryObject.type.trim();
	console.log("type 类型 "+type);
	Pie(res,type);
	
});
router.get('/rect', function (req, res, next) {
	
	console.log("制作矩形图");

	var QueryObject = new Paras(req).GetParas();
	
	var type = QueryObject.type.trim();
	console.log("type 类型 "+type);
	Rect(res,type);
});
router.get('/excel', function (req, res, next) {
	Gotodatabaseforexcel(req,res);
});
function getdatafromdatabase(args,res,displayargs){
	
	var sql = joinsql(args);
	storysql = sql;
	console.log("sql 语句拼接最终结果 "+sql);
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
		if(row.R_BgTime != null)
		{
			miaoshu = row.R_BgTime.getTime()/1000;
			truemiao = miaoshu-8*3600;
		    date = new Date( truemiao * 1000 );//.转换成毫秒
		    timeBg = moment(new Date(date)).format('YYYY/MM/DD HH:mm:ss'); 
		}		
		if(row.R_EndTime != null)
		{
			miaoshu = row.R_EndTime.getTime()/1000;
			truemiao = miaoshu-8*3600;
		    date = new Date( truemiao * 1000 );//.转换成毫秒
		    timeEd = moment(new Date(date)).format('YYYY/MM/DD HH:mm:ss'); 
		}
		//row.ReportDate,row.Phone,row.Name,row.R_BgTime,row.R_EndTime,row.R_MileageSum,row.E_ID,row.E_Name,row.OrgID,row.OrgName,row.OperTime
		var myename = getename(row.E_ID);
     	var getrow = [row.ReportDate,row.Phone,row.Name,timeBg,timeEd,(row.R_MileageSum/1000).toFixed(2),(row.R_OnlineTimeSum/60).toFixed(2),myename,row.OrgName,row.E_ID,row.OrgID,row.ID];
		
	    aaData.push(getrow);
	}
	
	return aaData;
	
}
function joinsql(args){
	
	 var sql = "";
	 var phone = args.phone;
	
	 var name  = args.name;
	 
	 var ename = args.ename;
	
	 var oname = args.oname;
	
	 var timestart = args.timestart;
	 
	 var timeend = args.timeend;
	
	 console.log("phone para "+phone);
	 console.log("name para "+name);
	 console.log("ename para "+ename);
	 console.log("oname para "+oname);
	 console.log("timestart para "+timestart);
	 console.log("timeend para "+timeend);
	 if(phone)
	 {  
		 sql = "select * from dbo.GIS_MileageReport where Phone like '%"+phone+"%'";
		 if(name)
		 {
			 sql = sql + " and Name like '%"+name+"%'";
			 if(ename)
			 {
				 sql = sql +" and E_ID  = "+ename;
				 if(oname)
				 {
					 sql = sql +" and OrgName = '"+oname+"'";
				 }
			 }
			 else
			 {
				  if(oname)
				 {
					 sql = sql +" and OrgName = '"+oname+"'";
				 }
			 }
		 }
		 else
		 {
			if(ename)
			 {
				 sql = sql +" and E_ID = "+ename;
				 if(oname)
				 {
					 sql = sql +" and OrgName = '"+oname+"'";
				 }
			 }
			 else
			 {
				  if(oname)
				 {
					 sql = sql +" and OrgName = '"+oname+"'";
				 }
			 }
		 }
	 }
	 else
	 {  
		 if(name)
		 {
			 sql = "select * from dbo.GIS_MileageReport where Name like '%"+name+"%'";
			 if(ename)
			 {
				 sql = sql +" and E_ID = "+ename;
				 if(oname)
				 {
					 sql = sql +" and OrgName = '"+oname+"'";
				 }
			 }
			 else
			 {
				  if(oname)
				 {
					 sql = sql +" and OrgName = '"+oname+"'";
				 }
			 }
			 
		 }
		 else
		 {
			 if(ename)
			 {
				 sql = "select * from dbo.GIS_MileageReport where E_ID = "+ename;
				 if(oname)
				 {
					 sql = sql +" and OrgName = '"+oname+"'";
				 }
			 }
			 else
			 {
				  if(oname)
				 {
					 sql ="select * from dbo.GIS_MileageReport where OrgName = '"+oname+"'";
				 }
			 }
		 }
	 }
	 
  if(sql)
  {
	  if(timestart)
	  {
		  if(timeend)
		  {
			sql=sql+" and ReportDate between '"+timestart+"' and '"+timeend+"'";  
		  }
		  else
		  {
			sql = sql+" and ReportDate = '"+timestart+"'";
		  } 
	  }
	  else
	  {
		  if(timeend)
		  {
			sql = sql+" and ReportDate = '"+timeend+"'";  
		  }
	  }
  }
  else
  {
	  if(timestart)
	  {
		  if(timeend)
		  {
			sql="select * from dbo.GIS_MileageReport where ReportDate between '"+timestart+"' and '"+timeend+"'";  
		  }
		  else
		  {
			sql ="select * from dbo.GIS_MileageReport where ReportDate = '"+timestart+"'";
		  } 
	  }
	  else
	  {
		  if(timeend)
		  {
			sql ="select * from dbo.GIS_MileageReport where ReportDate = '"+timeend+"'";
		  }
	  }
	  
  }
  if(!sql)
  {
	 var testeray = moment().format('YYYY-MM-DD');
	sql = "select * from dbo.GIS_MileageReport where ReportDate ='"+testeray+"'";
  }
  return sql;
}
//文件下载excel
function  Gotodatabaseforexcel(req,res)
{
	var sql = storysql;
	var connectionkey = new Connection(config);
	myconnect.querydata(sql,connectionkey,function(err,data){
		
		     if(err)
		     {
			    console.log(err);
				deferred.reject(err);
		     }
		     else
		     {     
	            console.log("执行sql语句成功 ");
			    var getdata = getexceldata(data);
                var excelName = "里程报表";
				var myExcel = new Excel(getdata);
				myExcel.product(res,req,excelName);
		     }
	      });
	
}

//加工处理数据
function  getexceldata(data)
{
	var datalength = data.length;
	var alldata=[];
	alldata[0]=["日期","电话","名称","开始时间","结束时间","总里程(KM)","在线时长(H)","单位","部门"];
	for(var i=0;i<datalength;i++)
	{
		var row = data[i];
        var miaoshu="";
		var truemiao="";
		var date="";
		var timestart = "";
		var timeend = "";
		if(row.R_BgTime!=null)
		{
			miaoshu = row.R_BgTime.getTime()/1000;
			truemiao = miaoshu-8*3600;
		    date = new Date( truemiao * 1000 );//.转换成毫秒
		    timestart = moment(new Date(date)).format('YYYY/MM/DD HH:mm:ss'); 
		}		
		if(row.R_EndTime != null)
		{
			miaoshu = row.R_EndTime.getTime()/1000;
			truemiao = miaoshu-8*3600;
		    date = new Date( truemiao * 1000 );//.转换成毫秒
		    timeend = moment(new Date(date)).format('YYYY/MM/DD HH:mm:ss');
		}
		var myename = getename(row.E_ID);
     	var getrow = [row.ReportDate,row.Phone,row.Name,timestart,timeend,(row.R_MileageSum/1000).toFixed(2),(row.R_OnlineTimeSum/60).toFixed(2),myename,row.OrgName];
	    alldata.push(getrow);
	}
	return alldata;
}
function Rect(res,type)
{
	var sql = storysql;
	console.log("视图sql 语句 "+sql);
	var connectionkey = new Connection(config);
	myconnect.querydata(sql,connectionkey,function(err,data){
		
		     if(err)
		     {
			    console.log(err);
				
		     }
		     else
		     {  //
		        var data = insertEname(data);
		        //
		        var datalength = data.length;
	            if(datalength>0)
				{
					
					if(type == "re")
					{
						//gsdata = RectdataByEgr(data);
						res.send(JSON.stringify(RectdataByEgr(data)));
					}
					else if(type == "ro")
					{
						//gsdata = RectdataByOrg(data);
						res.send(JSON.stringify(RectdataByOrg(data)));
					}
					else if(type == "rp")
					{
						res.send(JSON.stringify(RectdataByPeople(data)));
					}
				}
				else
				{
					console.log("数据库不存在 RECT 数据");
					var data = [];
					res.send(JSON.stringify(data));
				}
		     }
	      });
	
}
function RectdataByOrg(data) 
{
	console.log("进入视图RECT ORG 操作");
	var datalength = data.length;
	var ogroup = [];
	var uniqueogroup = "";
	var datagroup = [];
	for(var i=0;i<datalength;i++)
	{
		var row = data[i];
		ogroup.push(row['E_Name']+""+row['OrgName']);
	}
	Unique.arr = ogroup;
	uniqueogroup = Unique.StringGroup();
     
	 console.log("RECT ORG 有不同的部门数量 "+uniqueogroup.length);
	 
	for(var h=0;h<uniqueogroup.length;h++)
	{
        var deal = {'name':"",'value':""};	
    	var thisname = uniqueogroup[h];
		var onum = 0;
		console.log("Rect ORG 外层循环");
		for(var j=0;j<datalength;j++)
		{
			var row1 = data[j];
			console.log("Rect ORG 内层循环");
		    if(thisname == (row1['E_Name']+""+row1['OrgName']))
			{
				console.log("Rect ORG 确定");
				onum = onum +row1['R_MileageSum'];
			}
		}
		deal.name = insertSpace(thisname,2);
		deal['value'] = onum;
		datagroup.push(deal);
	}
	console.log("Rect ORG 最终加工数据 "+JSON.stringify(datagroup));
	return datagroup;
}

function RectdataByEgr(data)
{
	console.log("进入视图RECT EG 操作");
	var datalength = data.length;
	var egroup = [];
	var uniquergroup = "";
	var datagroup = [];
	for(var i=0;i<datalength;i++)
	{
		var row = data[i];
		egroup.push(row['E_Name']);
	}
	Unique.arr = egroup;
	uniquergroup = Unique.StringGroup();
	
	for(var h=0;h<uniquergroup.length;h++)
	{
        var deal = {'name':"",'value':""};	
    	var thisname = uniquergroup[h];
		var onum = 0;
		for(var j=0;j<datalength;j++)
		{
			var row1 = data[j];
		    if(thisname == row1['E_Name'])
			{
        		onum = onum +row1['R_MileageSum'];
			}
		}
		
		deal.name = insertSpace(thisname,2);
		deal.value = onum;
		datagroup.push(deal);
	}
	console.log("Rect EG 最终加工数据 "+JSON.stringify(datagroup));
	return datagroup;
}
function RectdataByPeople(data)
{
	
	console.log("进入视图RECT PEOPLE 操作");
	var datalength = data.length;
	var ogroup = [];
	var uniqueogroup = "";
	var datagroup = [];
	for(var i=0;i<datalength;i++)
	{
		var row = data[i];
		ogroup.push(row['E_Name']+""+row['OrgName']+""+row['Name']);
	}
	Unique.arr = ogroup;
	uniqueogroup = Unique.StringGroup();
     
	 console.log("RECT ORG 有不同的人员 "+uniqueogroup.length);
	 
	for(var h=0;h<uniqueogroup.length;h++)
	{
        var deal = {'name':"",'value':""};	
    	var thisname = uniqueogroup[h];
		var onum = 0;
		console.log("Rect ORG 外层循环");
		for(var j=0;j<datalength;j++)
		{
			var row1 = data[j];
			console.log("Rect ORG 内层循环");
		    if(thisname == (row1['E_Name']+""+row1['OrgName']+""+row1['Name']))
			{
				console.log("Rect ORG 确定");
				onum = onum +row1['R_MileageSum'];
			}
		}
		deal.name = insertSpace(thisname,2);
		deal['value'] = onum;
		datagroup.push(deal);
	}
	console.log("Rect ORG 最终加工数据 "+JSON.stringify(datagroup));
	return datagroup;
	
}
function Pie(res,type)
{
	var sql = storysql;
	console.log("视图sql 语句 "+sql);
	var connectionkey = new Connection(config);
	myconnect.querydata(sql,connectionkey,function(err,data){
		
		     if(err)
		     {
			    console.log(err);
				
		     }
		     else
		     {   
		        //
		        var data = insertEname(data);
		        //
		        var datalength = data.length;
	            if(datalength>0)
				{
					
					if(type == "oe")
					{
						res.send(JSON.stringify(PiedataByEgr(data)));
					}
					else if(type =="oo")
					{
						res.send(JSON.stringify(PiedataByOrg(data)));
					}
					
				}
				else
				{   
			            console.log("数据库不存在 PIE 数据");
			        	var flights = [];
					res.send(JSON.stringify(flights));
				}
		     }
	      });
	
}

function PiedataByOrg(data)
{
	console.log("进入视图PIE ORG 操作");
	var datalength = data.length;
	
	var datagroup = [];
    for(var j=0;j<datalength;j++)
	{
		var row1 = data[j];
		var deal = {'origin':"",'carrier':"",'count':""};	
		
		deal.origin = row1['E_Name']+""+row1['OrgName'];
		deal.carrier = row1['Name'];
		deal.count = row1['R_MileageSum'];
		datagroup.push(deal);
	}
	console.log("PIE ORG 最终加工数据 "+JSON.stringify(datagroup));
	return datagroup;
	
}

function PiedataByEgr(data)
{
	console.log("进入视图PIE EGR 操作");
	var datalength = data.length;
	//var tempor = "";
	//var temper = "";
	var datagroup = [];
	//
	var uniqueeg = [];
	//
	for(var i=0;i<datalength;i++)
	{
		var row1 = data[i];
		if(find(uniqueeg,row1['E_Name']+""+row1['OrgName']))
		{
			console.log("饼状图的单位视图有重复数据");
			continue;
		}
		else
		{
			console.log("饼状图的单位视图无重复数据");
		}
		uniqueeg.push(row1['E_Name']+""+row1['OrgName']);
		var deal = {'origin':"",'carrier':"",'count':""};	
		
		deal.origin = row1['E_Name'];
		deal.carrier = row1['OrgName'];
		
		
		deal.count =  milesgrouporg(row1['E_Name']+""+row1['OrgName'],data);
		datagroup.push(deal);
	}
	console.log("Pie EG 最终加工数据 "+JSON.stringify(datagroup));
	return datagroup;
}
function milesgrouporg(eidandoid,data)
{
	var sum =0;
	for(var i=0;i<data.length;i++)
	{
		if(eidandoid == data[i]['E_Name']+""+data[i]['OrgName'])
		{
			sum =sum + data[i]['R_MileageSum'];
		}
		
	}
	return sum;
}
function insertSpace(insertText,type)
{
	var textlength = insertText.length;
	var count = textlength/type;
	var countyu = textlength%type;
	var doneText = "";
	var step = type;
	if(count > 0)
	{
		for(var i=0;i<count;i++)
	    {
		  doneText = doneText+insertText.substr(i*step,step)+" ";
	    }
	  
	}
	else
	{
		doneText = insertText;
	}
	return doneText;
	 
}

function getename(eid){
	
	if(globale == "")
	{
		console.log("单位内存存储为空");
	}
	else
	{
	  var datalength = globale.length;
	  for(var i=0;i<datalength;i++)
	  {
		var datarow = globale[i];
		if(datarow['E_ID'] == eid)
		{
			return datarow['E_Name'];
		}
	  }
	  var emp = ""
	  return emp;
	}
}


function insertEname(data)
{
   var datalength = data.length;
   for(var i=0;i<datalength;i++)
   {
	   var rowdata = data[i];
	   var eid = rowdata['E_ID'];
	   var ename = getename(eid);
	   rowdata['E_Name'] = ename;
   }
 return data;    
}

function find(arr,ex)
{
	var datalength = arr.length;
	for(var i=0;i<datalength;i++)
	{
		if(arr[i] == ex)
		{
			return true;
		}
	}
	return false;
}
module.exports = router;