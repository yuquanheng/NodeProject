var express = require('express');
var ConnectionPool = require('../sql/sqltediouspoll');
var Paras = require('../request/ParseRequestBody');
var moment = require('moment');
var EventEmitter = require('events').EventEmitter; 
var logger = require('../../util/log').logger; 
var event = new EventEmitter();
var Q = require("q");
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