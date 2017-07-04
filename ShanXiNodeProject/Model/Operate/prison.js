var express = require('express');
var router = express.Router();
var Connection = require('tedious').Connection;
var Request = require('tedious').Request; 
var myconnect = require('../sql/dbhelp');
var sqlconfig = require('../sql/sqlconfig');
var Paras = require('../request/ParseRequestBody');
var moment = require('moment');
var Q = require("q");
var events = require('events'); 
var emitter = new events.EventEmitter(); 
//用户名，密码和数据库服务器,数据库   
var mongoose = require('mongoose'); 
var config = sqlconfig;
/* GET home page. */
var func = {};

String.prototype.trim = function() {
       return this.replace(/^\s+|\s+$/g, "");
};
//添加和更新犯人信息
function getAreaName(data1){

 var defered = Q.defer();
 var areagroup = data1.area;
 var da = areagroup.split(",");
 var sql = "select distinct L_ID,L_Name from dbo.GIS_Line where L_LineType = 4 and E_ID = 123 and L_ID in ("+areagroup+")"
  
 QueryData(sql).done(function(data){
          
          var areaname = "";
          for(var i=0;i<data.length;i++)
          {
            var item = data[i];
            if(i == data.length - 1)
            {
                areaname = areaname +item.L_Name;
            }
            else
            {
                areaname = areaname +item.L_Name+",";
            }
          }
         defered.resolve([areaname,data1]);

      },function(err){

          defered.reject(err);
      });
     return defered.promise;
  
}
function deleInto(data)
{
     var defered = Q.defer();
     var userid = data.userid;
     var ab = data;
     var sql = "delete from SYS_PrisonInfo where UserID = '"+userid+"'";
     console.log("删除犯人信息 "+sql);
     QueryData(sql).done(function(data){

         defered.resolve(ab);

      },function(err){

          defered.reject(err);
      });
     return defered.promise;

}
function AddInto(data)
{
    var defered = Q.defer();
    var areaname = data[0];
    var paras = data[1];
    
    var eid = paras.E_ID;
    var UserName = paras.UserName;
    var rfid = paras.rfid;
    var area = paras.area;
    var areatrue = paras.areagrouptrue;
    var areagroup = paras.areagroup;
    var sql = "insert into SYS_PrisonInfo(UserName,E_ID,RFID,AreaGroup,AreaGroupName,OperTime,State) values('"+UserName+"','"+eid+"','"+rfid+"','"+areatrue+"','"+areagroup+"',getdate(),1)";

    QueryData(sql).done(function(data){
     
         console.log("插入犯人信息成功");
         defered.resolve(['1']);

      },function(err){

          console.log("插入犯人信息失败");
          defered.reject(err);
      });
     return defered.promise;

}
func.AddPrison = function (data){
      
      var defered = Q.defer();
      var data1 = data[0];
      var imagepath = data[1];
      console.log("文件数据 "+JSON.stringify(data));
      console.log("文件名称 "+imagepath);
      
      getAreaName(data1).then(AddInto).done(
      
      function(data){
     
         console.log("插入犯人信息成功");
         defered.resolve(['1']);

      },function(err){

          console.log("插入犯人信息失败");
          defered.reject(err);
      }
      );

      
     return defered.promise;
}
func.UpdatePrison = function (data){
      
      var defered = Q.defer();
      var data1 = data[0];
      var imagepath = data[1];

      deleInto(data1).then(getAreaName).then(AddInto).done(function(data){
     
         console.log("更新犯人信息成功");
         defered.resolve(['1']);

      },function(err){

          console.log("更新犯人信息失败");
          defered.reject(err);
      });
return defered.promise;
}
//删除犯人信息
func.DelPrison = function(data){
    
    var defered = Q.defer();
    var userg = JSON.parse(data.deletegroup);
    console.log("删除的数据 "+data.deletegroup);
    var sql ="";
    var str ="";
    if(userg.length > 0)
    {
      if(userg.length == 1)
      {
       str = "'"+userg[0]+"'";
      }
      else
      {
        for(var i = 0;i<userg.length;i++)
        {
           if(userg[i])
           {
            if(i == userg.length-1)
            {
              str = str +"'"+userg[i]+"'";
            }
            else
            {
              str = str +"'"+userg[i]+"',";
            }
           }

        }
      }
       sql ="delete  from SYS_PrisonInfo where UserID in ("+str+")";
       console.log("delete sql "+sql);
  }
    QueryData(sql).done(function(data){
     
         console.log("删除犯人信息成功");
         defered.resolve(['1']);

      },function(err){

          console.log("删除犯人信息失败");
          defered.reject(err);
      });
     return defered.promise;
}

func.getView = function(area){
  
  var defered = Q.defer();
  var sql = "select * from SYS_PrisonInfo where CHARINDEX('"+area+"',AreaGroup)>0 or A_ID = "+area;
   
  QueryData(sql).done(function(data){
     
         console.log("删除犯人信息成功");
         var bac = getViewdata(data);
         defered.resolve(bac);

      },function(err){

          console.log("删除犯人信息失败");
          defered.reject(err);
      });
     return defered.promise;
}
function getViewdata(data)
{

   var defered = Q.defer();
   var allsum = data.length;
   var real = 0;
   var getday = 0;
   var getout = 0;
   var errs = 0;
   var allg = {"real":"","getday":"","getout":"","err":""};
   for(var i=0;i<data.length;i++)
   {
    
      var item = data[i];
      if(item.State > 3 && item.CheckState == 2)//正常
      {
         real++;
      }
      if(item.State == 2 && item.CheckState != 5 && item.CheckState != 6)//请假
      {
         getday++;
      }
      if(item.State == 3 && item.CheckState != 5 && item.CheckState != 6)//外派
      {
      
        getout++;

      }
      if(item.State == 4)//实际到的
      {
         
         

      }
      if(item.CheckState == 5 ||  item.CheckState == 6)//进错区域
      {
         
         errs++;

      }
   }
  allg.all = allsum;
  allg.real = real;
  allg.getday = getday;
  allg.getout = getout;
  allg.err = errs;
  return allg;
}
func.getErrPrison = function (data){

  var defered = Q.defer();
  var connect = new Connection(config);
  console.log("获取监狱"+data+":错误信息");
  getinerr(data).then(getouterr).done(function(data){
     
         defered.resolve(data);
         console.log("获取错误信息成功");

      },function(err){

          console.log("获取错误信息失败");
          defered.reject(err);
      });
   return defered.promise;
}
function getouterr(data)
{
  var defered = Q.defer();
  var area = data[1];
  var getinerr = data[0];
  var connect = new Connection(config);
  var sql = "select * from SYS_PrisonInfo where CheckState = 6 and CHARINDEX('"+area+"',AreaGroup)>0"
  QueryData(sql).done(function(data){
     
         console.log("获取错误信息成功");
        
         defered.resolve([getinerr,data]);

      },function(err){

          console.log("获取错误信息失败");
          defered.reject(err);
      });
   return defered.promise;
}
function getinerr(data)
{
  
  var defered = Q.defer();
  var area = data;
  var connect = new Connection(config);
  var sql = "select * from SYS_PrisonInfo where CheckState = 5 and A_ID = "+area;
  QueryData(sql).done(function(data){
     
         console.log("获取人员走错区域错误信息成功");
         
         defered.resolve([data,area]);

      },function(err){

          console.log("获取人员走错区域错误信息失败");
          defered.reject(err);
      });
   return defered.promise;
}
function QueryData(sql){

  var defered = Q.defer();
  var connect = new Connection(config);
  myconnect.querydata(sql,connect,function(err,data){
    
    if(err){

     console.log(err);
     defered.reject(err);

    }
    else
    {
     
     defered.resolve(data);
     
    }
  });
 return defered.promise;
}

func.querysql = QueryData;
module.exports = func;