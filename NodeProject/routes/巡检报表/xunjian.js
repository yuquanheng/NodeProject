var express = require('express');
var router = express.Router();
var xlsx = require('node-xlsx');
var Connection = require('tedious').Connection;
var Request = require('tedious').Request; 
var myconnect = require('../数据库/dbhelp.js');
var moment = require('moment');
var redis = require('../缓存/redis');
var tempeid ="";
var Q = require("q");
var childProcess = require('child_process');
var Paras = require('../请求参数/ParseRequestBody');
var Excel = require('../文件下载/Excel');
var Unique = require('../数据/UniqueData');
var n = childProcess.fork('./routes/巡检报表/redisprocessforxunjian.js'); 
//用户名，密码和数据库服务器,数据库   
var mongoose = require('mongoose'); 
var config = {  
  userName: 'sa',  
  password: 'xinyun!2#4',  
  server: '220.248.36.100',  
  options : {  
              database  : 'TrafficDispatch'		 
            }  
  };
 var uploadpara ={"sql":"","diansql":""};
//
/* GET home page. */
//表查询信息
router.get('/table', function (req, res, next) {
  
   uploadpara.sql="";
   uploadpara.diansql="";
   Gotodatabase(req, res);
   
});
//
router.get('/table/osgroup', function (req, res, next) {
    
	var req = new Paras(req).GetParas(); 
    
	var geteid = req.eid.trim();
	
	if(typeof( geteid) == "undefined")
	{
	   geteid="";
	}
	tempeid=geteid;
	checkRedis('bumen'+""+geteid,geteid,"dbo.SYS_Organization").then(getRedis).then(Gotodatabaseforosgroup).done(
	function(data)
	{
		if(data[0] == 'bumen');
		{
			console.log("数据库返回数据");
			data.shift();
		}
		console.log("最后得到数据 "+data);
		res.send(data);
	},
	function(err)
	{
		console.log(err);
	}
	);
});
router.get('/table/xianlu', function (req, res, next) {
    console.log("部门请求 数据到来");
    var req = new Paras(req).GetParas(); 
	var geteid = req.eid.trim();
	console.log("传输的公司名字  "+geteid );
	if(typeof( geteid) == "undefined")
	{
	   geteid="";
	}
	tempeid=geteid;
	checkRedis('xianlu'+""+geteid,geteid,"dbo.Elec_InspLineReport").then(getRedis).then(Gotodatabaseforosgroup).done(
	function(data)
	{
		if(data[0] == 'xianlu');
		{
			console.log("数据库返回数据");
			data.shift();
		}
		console.log("最后得到数据 "+data);
		res.send(data);
	},
	function(err)
	{
		console.log(err);
	}
	);
});
router.get('/table/xunjianqi', function (req, res, next) {
    console.log("部门请求 数据到来");
    var req = new Paras(req).GetParas(); 
	var geteid = req.eid.trim();
	console.log("传输的公司名字  "+geteid );
	if(typeof( geteid) == "undefined")
	{
	   geteid="";
	}
	tempeid=geteid;
	checkRedis('xunjianqi'+""+geteid,geteid,"dbo.Elec_InspLineReport").then(getRedis).then(Gotodatabaseforosgroup).done(
	function(data)
	{
		if(data[0] == 'xunjianqi');
		{
			console.log("数据库返回数据");
			data.shift();
		}
		console.log("最后得到数据 "+data);
		res.send(data);
	},
	function(err)
	{
		console.log(err);
	}
	);
});
//状态视图查询(柱状图入口)
router.get('/table/view/', function (req, res, next) {
   console.log("视图有数据请求到来");
   Gotodatabaseforview(req, res);
});
//每一条线路的点数据
router.get('/table/point', function (req, res, next) {
   console.log("点有数据请求到来");
   Gotodatabaseforpoint(req, res);
});
//柱状图点数据统计
router.get('/table/point/view', function (req, res, next) {
	console.log("点集合请求开始");
	Gotodatabaseforxianluview(req,res);
});
//excel下载
router.get('/table/excel', function (req, res, next) {
	console.log("下载请求开始");
	Gotodatabaseforexcel(req,res);
});
 String.prototype.trim = function() {
       return this.replace(/^\s+|\s+$/g, "");
    };
//keyname=[keyname]
function checkRedis(keyname,idnum,sqltype){
	console.log("检测"+keyname+"缓存是否存在");
	var deferred = Q.defer();
	
	redis.exits(keyname,function(err,success){
		
		if(err)
		{
			console.log(err);
			deferred.reject(err);
		}
		else
		{
			 
			if(success == "1")
			{
				console.log(""+keyname+"存在在缓存");
			}
			else
			{
				console.log(""+keyname+"不存在在缓存");
			}
			var sendpara = [success,keyname,idnum,sqltype];
			deferred.resolve(sendpara);
		}
	});
	
	return deferred.promise;
}
function getRedis(data){
	
	var paras=[];
	var deferred = Q.defer();
	var isexit = data[0];
	if(isexit == "1")
	{
		console.log("从缓存读取数据");
		redis.QueryList.lrange([data[1],0,-1],function(err,resoult){
			if(err)
			{
				consle.log(err);
				deferred.reject(err);
			}
			else
			{
				console.log("缓存获取成功 "+resoult);
			    paras = ['1',resoult];
				deferred.resolve(paras);
			}
		});
		
	}
	else
	{   console.log("不存在缓存 跳过缓存获取数据的步骤");
		paras = ['0',data[2],data[3],data[1]];
		deferred.resolve(paras);
	}
	return deferred.promise;
}
//在进入页面根据本单位ID首先加载本单位的部门/巡检器/线路
function Gotodatabaseforosgroup(data){
	
	 var hasdata = data[0];
	 var deferred = Q.defer();
	 var tablename = data[2];
	 console.log("进入数组库操作函数");
	 console.log("存在检查 "+hasdata);
	if(hasdata == "0")
	{
		console.log("进入数据库查询数据");
		var connectionkey = new Connection(config);
		var sqlforos = "";
		if(/xianlu/gi.test(data[3]))
		{    
	        sqlforos = "select LineName from "+tablename+" where E_ID ='"+data[1]+"'";
			myconnect.querydata(sqlforos,connectionkey,function(err,edata){
		 
			 if(err)
			 {
				 console.log(err);
				 deferred.reject(err);
			 }
			 else
			 {      
				  var eg = [];
				  var elength = edata.length;
				  for(var i=0;i<elength;i++)
				  {
					  eg.push(edata[i].LineName);
				  }
				  //去重
				  Unique.arr = eg;
				  var uniq = Unique.StringGroup();
                  uniq.unshift(data[3]);
			   //console.log("部门数组  "+JSON.stringify(eg));
			  console.log("不常用数据存入缓存");
			  n.send(uniq);
			  n.once('message',function(m){
					console.log("sonprocess callback data  "+m);
			  });
			  
			  deferred.resolve(uniq);
			 }
			});
		}
		if(/xunjianqi/gi.test(data[3]))
		{  
	        sqlforos = "select Name from "+tablename+" where E_ID ='"+data[1]+"'";
			myconnect.querydata(sqlforos,connectionkey,function(err,edata){
		 
			 if(err)
			 {
				 console.log(err);
				 deferred.reject(err);
			 }
			 else
			 {      
				  var eg = [];
				  var elength = edata.length;
				  for(var i=0;i<elength;i++)
				  {
					  eg.push(edata[i].Name);
				  }
				  Unique.arr = eg;
				  var uniq = Unique.StringGroup();
                  uniq.unshift(data[3]);
			   //console.log("部门数组  "+JSON.stringify(eg));
			    console.log("数组  "+JSON.stringify(uniq));
			  console.log("不常用数据存入缓存");
			  n.send(uniq);
			  n.once('message',function(m){
					console.log("sonprocess callback data  "+m);
			  });
			  
			  deferred.resolve(uniq);
			 }
			});
		}
		if(/bumen/gi.test(data[3]))
		{
			sqlforos = "select OSName from "+tablename+" where E_ID ='"+data[1]+"'";
			myconnect.querydata(sqlforos,connectionkey,function(err,edata){
			 if(err)
			 {
				 console.log(err);
				 deferred.reject(err);
			 }
			 else
			 {      
				  var eg = [];
				  var elength = edata.length;
				  for(var i=0;i<elength;i++)
				  {
					  eg.push(edata[i].OSName);
				  }
				  Unique.arr = eg;
				  var uniq = Unique.StringGroup();
                  uniq.unshift(data[3]);
			   console.log("部门数组  "+JSON.stringify(uniq));
			  console.log("不常用数据存入缓存");
			  n.send(eg);
			  n.once('message',function(m){
					console.log("sonprocess callback data  "+m);
			  });
			  
			  deferred.resolve(uniq);
			 }
			});
				
		}
		
	}
	else
	{
		console.log("返回缓存数据");
		deferred.resolve(data[1]);
		
	}
    
	 return deferred.promise;
}
function getAllLineName(data)
{   
    var deferred = Q.defer();
	var eid = data[0];
	var osgroup = data[1];
	console.log("传出的数据  "+eid);
	var sql = "select LineName,Name from dbo.Elec_InspLineReport where E_ID ='"+eid+"'";
	
	 var connectionkey = new Connection(config);
	 myconnect.querydata(sql,connectionkey,function(err,edata){
		 
		 if(err)
		 {
			 console.log(err);
			 deferred.reject(err);
		 }
		 else
		 {    
	          var egLineName = [];
			  var egXunJianQi = [];
	          var elength = edata.length;
			  for(var i=0;i<elength;i++)
			  {
				  egLineName.push(edata[i].LineName);
				  egXunJianQi.push(edata[i].Name);
			  }
			  Unique.arr = egLineName;
			  var uniquearrLineName  = Unique.StringGroup();
			  Unique.arr = egXunJianQi;
			  var uniquearrXunJianQi = Unique.StringGroup();
			  var datato = [osgroup,uniquearrLineName,uniquearrXunJianQi];
			  deferred.resolve(datato);
		 }
	 });
	return deferred.promise;
	
}

function Gotodatabase(req, res)
{   
	globalres = res;
    var req = new Paras(req).GetParas(); 
	var eid= req.eid.trim();
	if(typeof(eid) == "undefined")
	{
		eid="";
	}
	var gongsi = req.gongsi.trim();
	if(typeof(gongsi) == "undefined")
	{
		gongsi="";
	}
	var phone = req.phone.trim();
	if(typeof(phone) == "undefined")
	{
		phone="";
	}
	var timestart = req.timestart.trim();
	if(typeof(timestart) == "undefined")
	{
		timestart="";
	}

	var timeend = req.timeend.trim();
	if(typeof(timeend) == "undefined")
	{
		timeend="";
	}

	var xianlu = req.xianlu.trim();
	if(typeof(xianlu) == "undefined")
	{
		xianlu="";
	}

	var xunjianqi = req.xunjianqi.trim();
	if(typeof(xunjianqi) == "undefined")
	{
		xunjianqi="";
	}

    var sEcho = req.sEcho.trim();
	var iDisplaystart =req.iDisplayStart;
	var iDisplayLength =req.iDisplayLength;
	var searchString = req.sSearch;
	if(typeof(searchString) == "undefined" ||searchString=="undefined")
	{   
		searchString ="";
	}
	var quearingColumslength = req.iColumns;
	var quearignColums = req.sColumns;
	var getcolomnsName = quearignColums.split(",")
	var startposition = req.iDisplayStart;
	var sql ="";
	if(phone=="" && timestart=="" && timeend=="" && searchString == ""&& gongsi=="")
	{   
		var testeray = moment().subtract(1,'days').format('YYYY-MM-DD');
		sql = "select * from dbo.Elec_InspLineReport where ReportDate = '"+testeray+"'";
	}
	else
	{   
        if(searchString != "")
		{
			sql="select * from dbo.Elec_InspLineReport where convert(varchar(24),ReportDate,121) like '%"+searchString+"%' or LineName like '%"+searchString+"%' or E_ID like '%"+searchString+"%' or OrgID like '%"+searchString+"%' order by "+sortid+" "+sortMethod+" ";
			console.log("当全局搜索不为空时");
			if(tempsearch==searchString)
			{   
				
			}
			else
			{
				
				iDisplaystart = 0;
			}
			tempsearch = searchString;
		}
		else
		{
		  if(timestart != "")
		   {   
			  sql = "select * from dbo.Elec_InspLineReport";
			  if(timeend !="")
		      {
			     sql = sql+" where ReportDate between '"+timestart+"' and '"+timeend+"'";
		      }
			  if(timeend =="")
			  {
				 sql = "select * from dbo.Elec_InspLineReport where ReportDate = '"+timestart+"'";
			  }
		      if(gongsi!="")
		      {  
			     sql = sql+" and OrgName like '%"+gongsi+"%'";
		      }
		      if(phone!="")
		      {   
			     sql=sql+" and Phone = '"+phone+"'";
		      }
		   }
		  else
		   {   
	           sql = "";
			   if(timeend !="")
			   {
				   sql = "select * from dbo.Elec_InspLineReport where convert(varchar(24),ReportDate,121) like '%"+timeend+"%'";
				   if(gongsi!="")
		           {  
			         sql = sql+" and OrgName like '%"+gongsi+"%'";
		           }
		          if(phone!="")
		           {   
			         sql=sql+" and Phone = '"+phone+"'";
		           }
				   
			   }
			   else
			   {  
				     if(gongsi!="")
		             {  
					  sql = "select * from dbo.Elec_InspLineReport where OrgName like '%"+gongsi+"%'";
					  if(phone!="")
		              {   
			           sql=sql+" and Phone = '"+phone+"'";
		              }
		            }
                 	else
					{   
				         if(phone!="")
						 {
							 sql = "select * from dbo.Elec_InspLineReport where Phone = '"+phone+"'";
						 }
						
					}			
			   }
		   }
		}
		
	}
	var connectionkey = new Connection(config);
	if(eid !="")
	{
	   	 sql=sql+" and E_ID = '"+eid+"'";
	}
	if(xianlu !="")
	{
		sql=sql+" and LineName like '%"+xianlu+"%'";
		
	}
	if(xunjianqi !="")
	{
		sql=sql+" and Name like '%"+xunjianqi+"%'";
	}
	uploadpara.sql = sql;
	console.log("缓存SQl "+uploadpara.sql);
	myconnect.querydata(sql,connectionkey,function(err,data){
		
		     if(err)
		     {
			    console.log(err);
		     }
		     else
		     {     
			 var datalength = data.length;
			 var enddata = getDataForqian(data,iDisplaystart,iDisplayLength);
			 var senddata = {"sEcho":sEcho,"iTotalRecords":datalength,"iTotalDisplayRecords":datalength,"aaData":enddata};
	         res.send(JSON.stringify(senddata));
		     }
	      });
}
function  getDataForqian(data,iDisplaystart,displaylength)
{
	var datalength = data.length;
	var aaData = [];
	var numberstart = parseInt(iDisplaystart,"10");
	var numberdisplay = parseInt(displaylength,"10");
	if((datalength-numberstart)<numberdisplay)
	{
		numberdisplay= datalength-numberstart;
	}
	for(var i=numberstart;i<numberstart+numberdisplay;i++)
	{   
		var row = data[i];
		var hegeRate = (row.R_PointOn/row.R_PointCount*100).toFixed(1);
	    var ishege="合格";
		if(hegeRate<100)
		{
			ishege="不合格";
		}
        var miaoshu="";
		var truemiao="";
		var date="";
		var time = "";
		if(row.R_BgTime!=null)
		{
			miaoshu = row.R_BgTime.getTime()/1000;
			truemiao = miaoshu-8*3600;
		    date = new Date( truemiao * 1000 );//.转换成毫秒
		    time = moment(new Date(date)).format('YYYY/MM/DD HH:mm:ss'); 
		}		
		
     	var getrow = [row.ReportDate,row.LineName,row.E_ID,row.OrgName,row.Phone,row.Name,row.Name,time,row.R_Duration,row.R_PointCount,row.R_PointOn,row.R_PointNot,row.R_PointErrOrder,row.R_PointEarly,row.R_PointLate,hegeRate+"%",ishege,row.OrgID,row.LineID];
	    aaData.push(getrow);
	}
	
	return aaData;
}

function Gotodatabaseforview(req,res)
{
	var req = new Paras(req).GetParas(); 
	//获得请求的数据类型
	var gettype = req.viewtype.trim();
	if(typeof(gettype) == "undefined")
	{
		gettype="";
	}
	console.log("得到视图类型参数 "+gettype);
	var sql = uploadpara.sql;
	console.log("sql最终语句  "+sql);
	var connectionkey = new Connection(config);
	myconnect.querydata(sql,connectionkey,function(err,data)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{     
	         
	         var enddata = geteGroup(data,gettype);
			 console.log("视图得到数据  "+JSON.stringify(enddata));
		     res.send(JSON.stringify(enddata));
		}
	});
}

function geteGroup(data,gettype)
{
	var getdata = data;
	var datalength = getdata.length;
	var enumbers = [];
	var compareto = "";
	if(gettype =="1")
	{   
		for(var i=0;i<datalength;i++)
	    {
		  var rowdata = getdata[i];
		  compareto = rowdata.OrgName;
		  enumbers.push(compareto);
		  
	    }
	}
    if(gettype == "2")
	{
		for(var i=0;i<datalength;i++)
	    {
		  var rowdata = getdata[i];
		  compareto =rowdata.LineName;
		  enumbers.push(compareto);
	    }
	}
	if(gettype == "3")
	{
		for(var i=0;i<datalength;i++)
	    {
		  var rowdata = getdata[i];
		  compareto =rowdata.Name;
		  enumbers.push(compareto);
	    }
		
	}
	console.log("去重前  "+JSON.stringify(enumbers));
	//去重
	Unique.arr = enumbers;
	var uniquearr = Unique.StringGroup();
	console.log("去重后  "+JSON.stringify(uniquearr));
	var tempstring = "";
	var enddata = [];
	for(var i=0;i<uniquearr.length;i++)
	{    
        var uniquename = uniquearr[i];
		var getrecode = {"ename":uniquename,"datagroup":{"准时":"","漏巡":"","顺序错":"","早巡":"","晚巡":""}};
		var sumcount = 0;
		var sumon = 0;
		var sumnot = 0;
		var sumerror = 0;
		var sumearly = 0;
		var sumlate = 0;
		if(gettype == "1")
		{
			for(var j=0;j<datalength;j++)
		    {
		       var rowdata = getdata[j];
		       if(uniquename ==rowdata.OrgName)
		       {
			    sumcount=sumcount+rowdata.R_PointCount;
			    sumon = sumon + rowdata.R_PointOn;
			    sumnot = sumnot+rowdata.R_PointNot;
				sumerror = sumerror+rowdata.R_PointErrOrder;
				sumearly = sumearly+rowdata.R_PointEarly;
				sumlate = sumlate +rowdata.R_PointLate;
		       }
		    }
		}
		if(gettype == "2")
		{
			for(var j=0;j<datalength;j++)
		    {
		       var rowdata = getdata[j];
		       if(uniquename ==rowdata.LineName)
		       {
			    sumcount=sumcount+rowdata.R_PointCount;
			    sumon = sumon + rowdata.R_PointOn;
				sumnot = sumnot+rowdata.R_PointNot;
				sumerror = sumerror+rowdata.R_PointErrOrder;
				sumearly = sumearly+rowdata.R_PointEarly;
				sumlate = sumlate +rowdata.R_PointLate;
		       }
		    }
			
		}
		if(gettype == "3")
		{
			for(var j=0;j<datalength;j++)
		    {
		       var rowdata = getdata[j];
		       if(uniquename ==rowdata.Name)
		       {
			    sumcount=sumcount+rowdata.R_PointCount;
			    sumon = sumon + rowdata.R_PointOn;
				sumnot = sumnot+rowdata.R_PointNot;
				sumerror = sumerror+rowdata.R_PointErrOrder;
				sumearly = sumearly+rowdata.R_PointEarly;
				sumlate = sumlate +rowdata.R_PointLate;
		       }
		    }
		}
		//getrecode.datagroup['count']=sumcount;
		getrecode.datagroup['准时']=sumon;
		getrecode.datagroup['漏巡']=sumnot;
		getrecode.datagroup['顺序错']=sumerror;
		getrecode.datagroup['早巡']=sumearly;
		getrecode.datagroup['晚巡']=sumlate;
		enddata.push(getrecode);
	}
	return enddata;
}

//得到线路的数据集
function getxianGroup(data){
	var getdata = data;
	var datalength = getdata.length;
	var enumbers = [];
	for(var i=0;i<datalength;i++)
	{
		var rowdata = getdata[i];
		enumbers.push(rowdata.LineName);
	}
	console.log("去重前  "+JSON.stringify(enumbers));
	//去重
	Unique.arr = enumbers;
	var uniquearr = Unique.StringGroup();
	console.log("去重后  "+JSON.stringify(uniquearr));
	var tempstring = "";
	var enddata = [];
	for(var i=0;i<uniquearr.length;i++)
	{    
        var uniquename = uniquearr[i];
		var getrecode = {"ename":uniquename,"datagroup":[]};
		var sumcount = 0;
		var sumon = 0;
		for(var j=0;j<datalength;j++)
		{
		   var rowdata = getdata[j];
		   
		   if(uniquename ==rowdata.LineName)
		   {
			   sumcount=sumcount+rowdata.R_PointCount;
			   sumon = sumon + rowdata.R_PointOn;
		   }
		   
		   
		}
		getrecode.datagroup.push(sumcount);
		getrecode.datagroup.push(sumon);
		enddata.push(getrecode);
	}
	return enddata;
}
//添加点datatable来加载某条线上的具体数据
 function Gotodatabaseforpoint(req, res)
 {
    var req = new Paras(req).GetParas(); 
	console.log("point1");
	var lineid = req.lineid.trim();
	console.log("point2");
	var orgid = req.orgid.trim();
	console.log("point3");
	var eid = req.eid.trim();
	console.log("point4");
	var phone = req.phone.trim();
	console.log("point5");
	var date = req.date.trim();
	console.log("point6");
    var sEcho = req.sEcho.trim();
	console.log("point7");
	var iDisplaystart =req.iDisplayStart;
	console.log("point8");
	var iDisplayLength =req.iDisplayLength;
	console.log("point9");
	var sql = "";
	sql = "select * from dbo.Elec_InspLinePointReport where E_ID = '"+eid+"' and OrgID = '"+orgid+"' and LineID = '"+lineid+"' and Phone = '"+phone+"' and ReportDate = '"+date+"'";
    console.log("最终sql语句  "+sql);
	uploadpara.diansql= sql;
    var connectionkey = new Connection(config);
	myconnect.querydata(sql,connectionkey,function(err,edata){
		 if(err)
		 {
			 console.log(err);
			 
		 }
		 else
		 {  
		  console.log("部门数组  "+JSON.stringify(edata));
                  //去除piontid 相同项
		  var edata = uniquePointID(edata);
		  //
		  var datalength  = edata.length;
		  var datato = getallpoints(edata,iDisplaystart,iDisplayLength );
		  var senddata = {"sEcho":sEcho,"iTotalRecords":datalength,"iTotalDisplayRecords":datalength,"aaData":datato};
		  
		  res.send(JSON.stringify(senddata));
		 }
	 });
	
 }
function uniquePointID(data)
 {
	 var datalength = data.length;
	 var pointidgroup = [];
	 var alls =[];
	 for(var i=0;i<datalength;i++)
	 {
		 var row = data[i];
		 var pointid = row.PointID+""+row.LineID+""+row.Ex_BgTime;
		 pointidgroup.push(pointid);
		 
	 }
	 Unique.arr = pointidgroup;
	 var uniquePointID = Unique.StringGroup();
	 
	 var uniquelength = uniquePointID.length;
	 if(uniquelength < datalength)
	 {
		 console.log("点数据出现重复现象");
	 }
	 else
	 {
		 console.log("点数据没有出现重复现象");
	 }
	 for(var i=0;i<uniquelength;i++)
	 {
		 for(var j=0;j<datalength;j++)
		 {
			 var eachrow = data[j];
			 if(uniquePointID[i] == eachrow['PointID']+""+eachrow['LineID']+""+eachrow['Ex_BgTime'])
			 {
				 alls.push(eachrow);
				 break;
			 }
		 }
	 }
	 return alls;
 }
 function  getallpoints(data,iDisplaystart,displaylength)
{
	
	var datalength = data.length;
	var aaData = [];
	var numberstart = parseInt(iDisplaystart,"10");
	var numberdisplay = parseInt(displaylength,"10");
	//if((datalength-numberstart)<numberdisplay)
	//{
	//	numberdisplay= datalength-numberstart;
	//}
	//console.log("翻页起始位置"+numberstart);
	//for(var i=numberstart;i<numberstart+numberdisplay;i++)
	for(var i=0;i<datalength;i++)
	{   
		var row = data[i];
		var state = row.Rp_State;
		console.log("查询值  "+state);
		
		
		var miaoshu="";
		var truemiao="";
		var date="";
		var time = "";
		if(row.Ex_BgTime!=null)
		{
			miaoshu = row.Ex_BgTime.getTime()/1000;
			truemiao = miaoshu-8*3600;
		    date = new Date( truemiao * 1000 );//.转换成毫秒
		    time = moment(new Date(date)).format('YYYY/MM/DD HH:mm:ss'); 
		}
		
		var miaoshu1="";
		var truemiao1="";
		var date1="";
		var time1 = "";
		if(row.Ex_EndTime!=null)
		{
			miaoshu1 = row.Ex_EndTime.getTime()/1000;
			truemiao1 = miaoshu1-8*3600;
		    date1 = new Date( truemiao1 * 1000 );//.转换成毫秒
		    time1 = moment(new Date(date1)).format('YYYY/MM/DD HH:mm:ss'); 
		}
		
		var miaoshu2="";
		var truemiao2="";
		var date2="";
		var time2 = "";
		if(row.Rp_Time!=null)
		{
			miaoshu2 = row.Rp_Time.getTime()/1000;
			truemiao2 = miaoshu2-8*3600;
		    date2 = new Date( truemiao2 * 1000 );//.转换成毫秒
		    time2 = moment(new Date(date2)).format('YYYY/MM/DD HH:mm:ss'); 
		}
        var hege ="";
		if(state =="-1")
		{
		  hege ="待统计";
		}
		if(state =="0")
		{
		  hege ="正常";
		}
		if(state =="1")
		{
			hege ="漏巡";
		}
		if(state =="2")
		{
			hege ="顺序错";
		}
		if(state =="3")
		{
			hege ="早巡";
		}
		if(state =="4")
		{
			hege ="晚巡";
		}
		//console.log("真实时间  "+time);
		console.log("结果为  "+hege);
     	var getrow = [row.OrgName,row.Phone,row.Name,row.LineName,row.PointName,row.Ex_Order,time,time1,time2,row.Rp_Order,hege];
	    aaData.push(getrow);
	}
	return aaData;
}

// 对所有点数据进行获取
function Gotodatabaseforxianluview(req,res)
{  
	var str = uploadpara.sql; 
	var req = new Paras(req).GetParas(); 
	var gettype = req.viewtype.trim();
	if(typeof(gettype) == "undefined")
	{
		gettype="";
	}
	if(str == "")
	{
		console.log("缓存SQL没有数据");
		res.send(JSON.stringify([]));
	}
	else
	{
	　　var reg = /InspLineReport/;   
	　　var sql = str.replace(reg, 'InspLinePointReport'); 
		console.log("点击视图后两项 "+sql); 
		var connectionkey = new Connection(config);
		myconnect.querydata(sql,connectionkey,function(err,data)
		{
			if(err)
			{
				console.log(err);
			}
			else
			{     
				 var data = uniquePointID(data);
				 var enddata = geteGroup1(data,gettype);
				 console.log("视图得到数据  "+JSON.stringify(enddata));
				 res.send(JSON.stringify(enddata));
			}
		});
	}
}
//加工点集合数据以适应视图（饼图）
function geteGroup1(data,gettype)
{
	var getdata = data;
	console.log("dodi "+JSON.stringify(getdata));
	var datalength = getdata.length;
	var enumbers = [];
	var compareto = "";
	if(gettype =="11")//按巡更点
	{   
		for(var i=0;i<datalength;i++)
	    {
		  var rowdata = getdata[i];
		  compareto = rowdata.PointName;
		  enumbers.push(compareto);
		  
	    }
	}
    if(gettype == "12")//按巡更器
	{
		for(var i=0;i<datalength;i++)
	    {
		  var rowdata = getdata[i];
		  compareto =rowdata.Name;
		  enumbers.push(compareto);
	    }
	}
	if(gettype == "13")//按人员
	{
		for(var i=0;i<datalength;i++)
	    {
		  var rowdata = getdata[i];
		  compareto =rowdata.Phone;
		  enumbers.push(compareto);
	    }
		
	}
	console.log("去重前  "+JSON.stringify(enumbers));
	//去重
	Unique.arr = enumbers;
	var uniquearr = Unique.StringGroup();
	console.log("去重后  "+JSON.stringify(uniquearr));
	var tempstring = "";
	var enddata = [];
	for(var i=0;i<uniquearr.length;i++)
	{    
        var uniquename = uniquearr[i];
		var getrecode = {"ename":uniquename,"datagroup":{"准时":"","漏巡":"","顺序错":"","早巡":"","晚巡":""}};
		var sumcount = 0;
		var sumon = 0;
		var sumnot = 0;
		var sumerror = 0;
		var sumearly = 0;
		var sumlate = 0;
		if(gettype == "11")
		{
			for(var j=0;j<datalength;j++)
		    {
		       var rowdata = getdata[j];
			   var state= rowdata.Rp_State;
		       if(uniquename ==rowdata.PointName)
		       {
		          if(state =="0")
		          {
		             sumon++;
		          }
		          if(state =="1")
		          {
			         sumnot++;
		          }
		          if(state =="2")
		          {
			        sumerror++;
		          }
		          if(state =="3")
		          {
			        sumearly++;
		          }
		          if(state =="4")
		          {
			        sumlate++;
		          }
		       }
		    }
		}
		if(gettype == "12")
		{
			for(var j=0;j<datalength;j++)
		    {
		       var rowdata = getdata[j];
			   var state= rowdata.Rp_State;
		       if(uniquename ==rowdata.Name)
		       {
			    if(state =="0")
		          {
		             sumon++;
		          }
		          if(state =="1")
		          {
			         sumnot++;
		          }
		          if(state =="2")
		          {
			        sumerror++;
		          }
		          if(state =="3")
		          {
			        sumearly++;
		          }
		          if(state =="4")
		          {
			        sumlate++;
		          }
		       }
		    }
		}
		if(gettype == "13")
		{
			for(var j=0;j<datalength;j++)
		    {
		       var rowdata = getdata[j];
			   var state= rowdata.Rp_State;
		       if(uniquename ==rowdata.Phone)
		       {
			     if(state =="0")
		          {
		             sumon++;
		          }
		          if(state =="1")
		          {
			         sumnot++;
		          }
		          if(state =="2")
		          {
			        sumerror++;
		          }
		          if(state =="3")
		          {
			        sumearly++;
		          }
		          if(state =="4")
		          {
			        sumlate++;
		          }
		       }
		    }
		}
		getrecode.datagroup['准时']=sumon;
		getrecode.datagroup['漏巡']=sumnot;
		getrecode.datagroup['顺序错']=sumerror;
		getrecode.datagroup['早巡']=sumearly;
		getrecode.datagroup['晚巡']=sumlate;
		enddata.push(getrecode);
	}
	return enddata;
}
function Gotodatabaseforexcel(req,res)
{
	var sql = uploadpara.sql;
	var connectionkey = new Connection(config);
	console.log("sql最终语句  "+sql);
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
				var excelName = "巡检报表";
				var myExcel = new Excel(getdata);
				myExcel.product(res,req,excelName);
		     }
	      });
}
//加工excel处理数据
function  getexceldata(data)
{
	var datalength = data.length;
	var alldata=[];
	alldata[0]=["日期","线路名称","部门名称","巡更器号码","巡更器名称","员工姓名","开始时间","巡检时长","计划","准时","漏巡","顺序错","早巡","晚巡","合格率","结果"];
	for(var i=0;i<datalength;i++)
	{
		var row = data[i];
		//console.log("data[i]  "+JSON.stringify(row));
		var hegeRate = row.R_PointOn/row.R_PointCount;
	    var ishege="合格";
		if(hegeRate<1)
		{
			ishege="不合格";
		}
        var miaoshu="";
		var truemiao="";
		var date="";
		var time = "";
		if(row.R_BgTime!=null)
		{
			miaoshu = row.R_BgTime.getTime()/1000;
			truemiao = miaoshu-8*3600;
		    date = new Date( truemiao * 1000 );//.转换成毫秒
		    time = moment(new Date(date)).format('YYYY/MM/DD HH:mm:ss'); 
		}		
		
     	var getrow = [row.ReportDate,row.LineName,row.OrgName,row.Phone,row.Phone+""+row.Name,row.Name,time,row.R_Duration,row.R_PointCount,row.R_PointOn,row.R_PointNot,row.R_PointErrOrder,row.R_PointEarly,row.R_PointLate,hegeRate.toFixed(2)*100+"%",ishege];
	    alldata.push(getrow);
	}
	return alldata;
}
module.exports = router;