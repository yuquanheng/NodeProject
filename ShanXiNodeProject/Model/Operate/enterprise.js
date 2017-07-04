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

func.getEnterPrise = function (){
  
  console.log("通过ID查询事件信息");
  var defered = Q.defer();
  var sql  = "select distinct E_ID,E_Name from dbo.SYS_EnterpriseInfo";
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

function clearForeign(foreignsql,sql)
{
  var defered = Q.defer();
  var connect = new Connection(config);
  myconnect.querydata(foreignsql,connect,function(err,data){
    
    if(err){

     console.log(err);
     defered.reject(err);

    }
    else
    {
     
     console.log("消除外键影响");
     defered.resolve(sql);
     
    }
  });
 return defered.promise;
}

func.querysql = QueryData;
module.exports = func;