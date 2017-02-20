var express = require('express');
var router = express.Router();
var Connection = require('tedious').Connection;
var Request = require('tedious').Request; 
var myconnect = require('../sql/dbhelp');
var sqlconfig = require('../sql/sqlconfig');
var Paras = require('../request/ParseRequestBody');
var newForm = require('../file/uploadForm');
var moment = require('moment');
var Q = require("q");
var success="";
var successfile="";
//用户名，密码和数据库服务器,数据库   
var mongoose = require('mongoose'); 
var config = sqlconfig;
var uploadpara ={"sql":"","diansql":""}; 
//
/* GET home page. */
//表查询信息
router.get('/', function (req, res, next) {
   console.log("insuserinfo有数据请求到来");
   uploadpara.sql = "";
   uploadpara.diansql = "";
   Gotodatabase(req, res);
});
router.get('/detail', function (req, res, next) {
   console.log("查询单个数据请求到来");
   Gotodatabasefordetail(req, res);
});
router.post('/update', function (req, res, next) {
   console.log("insuserinfo  updata有数据请求到来");
   success="";
   successfile="";
   newForm(req,res).then(updatedatabase).done(function(data){
	   console.log("数据库更新成功");
	   res.send(["更新成功"]);
   },function(err){
	   console.log(["更新失败"]);
   });
});
String.prototype.trim = function() 
{
    return this.replace(/^\s+|\s+$/g, "");
};
function Gotodatabase(req, res)
{
	
	 var QueryObject = new Paras(req).GetParas();
	 
	 var ename = QueryObject.ename.trim();
	 console.log("请求的单位： "+ename );
	 
	 var osname = QueryObject.osname.trim();
	 console.log("请求的部门： "+osname);
	 
	 var phone = QueryObject.phone.trim();
	 console.log("请求的电话： "+phone);
	 
	 var user = QueryObject.username.trim();
	 console.log("请求的用户名： "+user);
	 
	 var nfc = QueryObject.nfc.trim();
	 console.log("请求的NFC： "+nfc);
	 
	 var sEcho = QueryObject.sEcho.trim();
	 console.log("请求的sEcho： "+sEcho);
		
	 var iDisplaystart =QueryObject.iDisplayStart;
	 console.log("当前分页的起始位置 "+iDisplaystart);
		
	 var iDisplayLength =QueryObject.iDisplayLength;
	 console.log("请求每一页显示的行数： "+iDisplayLength);
     //字符串拼接
	 var sql = "";
     if(ename != "")
	 {
		 sql = "select * from dbo.Elec_InspUserInfo where E_Name like '%"+ename+"%'";
		 
		 if(osname != "")
		 {
			  sql = sql+" and OrgName like '%"+osname+"%'";
		 }
		 
		 if(phone != "")
		 {
			  sql = sql+" and Phone like '%"+phone+"%'";
		 }
		 if(user != "")
		 {
			  sql = sql+" and UserName like '%"+user+"%'";
		 }
		 if(nfc  != "")
		 {
			  sql = sql+" and NFCID like '%"+nfc+"%'";
		 }
		 
	 }
	 else{
		 
		 if(osname != "")
		 {
			sql = "select * from dbo.Elec_InspUserInfo where OrgName like '%"+osname+"%'";
			
			if(phone != "")
			{
			  sql = sql+" and Phone like '%"+phone+"%'";
			}
			if(user != "")
			{
			  sql = sql+" and UserName like '%"+user+"%'";
			}
			if(nfc  != "")
			{
			  sql = sql+" and NFCID like '%"+nfc+"%'";
			}
			 
		 }
		 else
		 {
			 if(phone != "")
			 {
				sql = "select * from dbo.Elec_InspUserInfo where Phone like '%"+phone+"%'";
				 
				if(user != "")
				{
				sql = sql+" and UserName like '%"+user+"%'";
				}
				if(nfc  != "")
				{
				sql = sql+" and NFCID like '%"+nfc+"%'";
				}
			 }
			 else
			 {
				if(user != "")
				{
					sql = "select * from dbo.Elec_InspUserInfo where UserName like '%"+user+"%'";
					
					if(nfc  != "")
				    {
				     sql = sql+" and NFCID like '%"+nfc+"%'";
				    }
				}	
				else
				{
					if(nfc  != "")
					{
						sql = "select * from dbo.Elec_InspUserInfo where NFCID like '%"+nfc+"%'";
					}
					else
					{
						sql = "select * from dbo.Elec_InspUserInfo";
					}
				}					
			 }
			 
		 }
	 }
	 //	 
	 console.log("最终拼接的查询字符串为 "+sql);
	 //var sql = "select * from dbo.Elec_InspUserInfo";
	 var connectionkey = new Connection(config);
	 myconnect.querydata(sql,connectionkey,function(err,data){
		
		     if(err)
		     {
				 console.log(err);
		     }
		     else
		     {     
				 console.log("执行sql语句成功 ");
				 var datalength = data.length;
				 var enddata =""; 
				 if(datalength==0)
				 {
					 console.log("数据库没有数据");
					 //enddata = [[253,34,456,34,354,56,34,567,45]];
					 enddata = [[]];
				 }
				 else
				 {
					console.log("数据库存在数据,正在进行处理");
					enddata = getDataForqian(data,iDisplaystart,iDisplayLength);
					 
				 }
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
	console.log("翻页起始位置"+numberstart);
	for(var i=numberstart;i<numberstart+numberdisplay;i++)
	{   
		var row = data[i];
        var miaoshu="";
		var truemiao="";
		var date="";
		var time = "";
		var gender = row.Gender;
		if(row.OperTime!=null)
		{
			miaoshu = row.OperTime.getTime()/1000;
			truemiao = miaoshu-8*3600;
		    date = new Date( truemiao * 1000 );//.转换成毫秒
		    time = moment(new Date(date)).format('YYYY/MM/DD HH:mm:ss'); 
		}		
		if(gender == "0")
		{
			gender = "男";
		}
		else
		{
			gender = "女";
		}
     	var getrow = [row.IDCardNo,row.E_Name,row.OrgName,row.UserName,row.Phone,row.NFCID,gender,row.Nation,row.ADDRESS];
	    aaData.push(getrow);
	}
	return aaData;
}
function updatedatabase(data)
{  
    console.log("进入数据库更新阶段");
    var deferred = Q.defer();
	var params = data[0];
	var imagepath = "http://127.0.0.1:3000/public/images/"+data[1];
	
	var idcard = params.userForm_idcard;
	var selCompany = params.selCompany;
	var nfc = params.userForm_CardID;
	var sql = "";
	if(data[1] != "")
	{
		sql = "UPDATE dbo.Elec_InspUserInfo SET NFCID = '"+nfc+"',PhotoPath = '"+imagepath+"'WHERE IDCardNo = '"+idcard+"';";
	}
	else
	{
		sql = "UPDATE dbo.Elec_InspUserInfo SET NFCID ='"+nfc+"'WHERE IDCardNo = '"+idcard+"';";
	}
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

function Gotodatabasefordetail(req, res){
	
	 var QueryObject = new Paras(req).GetParas();
	 var idcard = QueryObject.idcard.trim();
	 
	 var sql = "select * from dbo.Elec_InspUserInfo where IDCardNo = '"+idcard+"'";
	 console.log("最终sql语句 "+sql);
	 
	 var connectionkey = new Connection(config);
	 myconnect.querydata(sql,connectionkey,function(err,data){
		
		     if(err)
		     {
				 console.log(err);
				
		     }
		     else
		     {     
                 var getrow = data[0];
		         var photopath = getrow.PhotoPath;
				 
				 if(photopath == "")
				 {
					 
					 console.log("用户的图片数据库地址为空");
					 getrow.PhotoPath = "http://127.0.0.1:3000/public/images/initphoto.png";
					 
				 }
		         console.log("单个用户返回数据 "+JSON.stringify(getrow));
		         res.send(JSON.stringify(getrow));
		     }
	      }); 
}
//
module.exports = router;