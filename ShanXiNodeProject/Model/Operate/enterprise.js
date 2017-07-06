var express = require('express');
var ConnectionPool = require('../sql/sqltediouspoll');
var Paras = require('../request/ParseRequestBody');
var logger = require('../../util/log').logger; 
var moment = require('moment');
var EventEmitter = require('events').EventEmitter; 
var event = new EventEmitter();
var Q = require("q"); 
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

function QueryData(sql){

  var defered = Q.defer();
  /*var connect = new Connection(config);
  myconnect.querydata(sql,connect,function(err,data){
    
    if(err){

     console.log(err);
     defered.reject(err);

    }
    else
    {
     
     defered.resolve(data);
     
    }
  });*/
  ConnectionPool.exec(sql,function(data){
		 
		 if(data.length > 0)
		 {
			 defered.resolve(data);
		 }
		 else
		 {
			 defered.reject("没有数据");
		 }
	 });
 return defered.promise;
}
func.querysql = QueryData;
module.exports = func;