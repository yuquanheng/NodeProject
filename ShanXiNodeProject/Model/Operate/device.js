var express = require('express');
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
var func = {};

String.prototype.trim = function() {
       return this.replace(/^\s+|\s+$/g, "");
};
//D_ID,D_Number,A_ID,A_Name,D_SoftVersion,D_SMVersion,D_FilterTime,D_CoverPara,D_ServerIP,D_IP,E_ID,E_Name,D_OperTime,D_OperID,D_OperName,D_Longitude,D_Latitude,D_State
func.getDevice = function (){
  
  var defered = Q.defer();
  var sql  = "select * from devices";
  QueryData(sql).done(function(data){
     
     console.log("返回数据");
     
     defered.resolve(data);

  },function(err){

      console.log("通过ID查询事件信息失败");
      defered.reject(err);
  });

   return defered.promise;
}
func.getDeviceByNumber = function (number){
  
  var defered = Q.defer();
  var sql  = "select A_ID from devices where D_Number = "+number;
  QueryData(sql).done(function(data){
     
     console.log("返回数据");
     
     defered.resolve(data);

  },function(err){

      console.log("通过ID查询事件信息失败");
      defered.reject(err);
  });

   return defered.promise;
}
function getDevices(data)
{

  var defered = Q.defer();
  var alldata = data;
  var devicesnumber = data.number;
  var sql  = "select EQ_ID,E_ID, EQ_Number from dbo.Equ_Equipment where EQ_Number = '"+devicesnumber+"'";
  QueryData(sql).done(function(data){
     
     if(data.length > 0)
     {
       var eqid = data[0]['EQ_ID'];
       var eid = data[0]['E_ID'];
       var number = data[0]['EQ_Number'];
       defered.resolve([alldata,eqid,eid,number]);
     }
     else
     {

      defered.reject("没有查找该设备");
     }

  },function(err){

      console.log("通过ID查询事件信息失败");
      defered.reject(err);
  });

   return defered.promise;

}
function insertInto(data){

  var defered = Q.defer();
  var para = data[0];
  var eqid= data[1];
  var eid = data[2];
  var number = data[3];
 
  var sql = "insert into SYS_AreaEquip(EQ_ID,EQ_Name,EQ_Log,EQ_Lat,EQ_AreaID,E_ID,OperTime,EQ_AreaName) values('"+eqid+"','"+number+"','"+para.lon+"','"+para.lat+"','"+para.area+"','"+eid+"',getdate(),'"+para.areaname+"')";

  QueryData(sql).done(function(data){
     
       console.log("添加设备成功");
     defered.resolve(['1']);

  },function(err){

      console.log("添加设备失败");
      defered.reject(err);
  });

   return defered.promise;

}
func.addDevice= function (data){
  
  console.log("添加设备 "+JSON.stringify(data));

  var defered = Q.defer();
  getDevices(data).then(insertInto).done(

   function(data){
     
       console.log("添加设备成功");
     defered.resolve(['1']);

  },function(err){

      console.log("添加设备失败");
      defered.reject(err);
  }

  );
  return defered.promise;
}

func.delDevice = function(data){

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
       sql ="delete  from SYS_AreaEquip where EQ_ID in ("+str+")";
       console.log("delete sql "+sql);
  }
    QueryData(sql).done(function(data){
     
         console.log("删除设备信息成功");
         defered.resolve(['1']);

      },function(err){

          console.log("删除设备信息失败");
          defered.reject(err);
      });
     return defered.promise;
  
}
function deldevice(data)
{
   
    var defered = Q.defer();
    var did = data.eqid;
    var alld = data;
    console.log("删除 设备ID "+did);
    var sql = "delete from SYS_AreaEquip where EQ_ID = "+did;
    QueryData(sql).done(function(data){
     
         console.log("删除设备信息成功");
         defered.resolve(alld);

      },function(err){

          console.log("删除设备信息失败");
          defered.reject(err);
      });
     return defered.promise;
}
func.updateDevice = function (data){

  console.log("更新设备v"+JSON.stringify(data));
  var defered = Q.defer();
  
  deldevice(data).then(getDevices).then(insertInto).then(

     function(data){
     
         console.log("删除设备信息并更新成功");
         defered.resolve([1]);

      },function(err){

          console.log("删除设备信息并更新失败");
          defered.reject(err);
      }


  );

   return defered.promise;

}
func.updateDeviceState = function (area,state){

  
  var defered = Q.defer();
  var sql = "update SYS_AreaEquip set EQ_State ="+state+" where EQ_AreaID = "+area;
  QueryData(sql).then(

     function(data){
     
         console.log("设备状态更新成功");
         defered.resolve([1]);

      },function(err){

          console.log("设备状态更新失败");
          defered.reject(err);
      }

  );

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