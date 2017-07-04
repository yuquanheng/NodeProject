var express = require('express');
var Connection = require('tedious').Connection;
var Request = require('tedious').Request; 
var myconnect = require('../sql/dbhelp');
var sqlconfig = require('../sql/sqlconfig');
var Paras = require('../request/ParseRequestBody');
var moment = require('moment');
var EventEmitter = require('events').EventEmitter; 
var event = new EventEmitter();
var Q = require("q");
//用户名，密码和数据库服务器,数据库   
var mongoose = require('mongoose'); 
var config = sqlconfig;
var func = {};

String.prototype.trim = function() {
       return this.replace(/^\s+|\s+$/g, "");
};

func.getArea = function (){
  
  console.log("通过ID查询事件信息");
  var defered = Q.defer();
  var sql  = "select distinct L_ID,L_Name from dbo.GIS_Line where L_LineType >= 4 and E_ID = 123";
  QueryData(sql).done(function(data){
     
     defered.resolve(data);

  },function(err){

      defered.reject(err);
  });

   return defered.promise;
}
func.getAreaType = function (id){
  
  console.log("通过ID查询事件信息");
  var defered = Q.defer();
  var sql  = "select L_LineType from dbo.GIS_Line where L_ID = "+id;
  QueryData(sql).done(function(data){
     
     defered.resolve(data);

  },function(err){

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