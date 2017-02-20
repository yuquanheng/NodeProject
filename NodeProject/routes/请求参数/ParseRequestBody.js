var express = require('express');
var formidable = require("formidable");
var Q = require("q");
function Para(req){
	this.req = req;
	this.form  = new formidable.IncomingForm();
	this.defer = Q.defer();
}

Para.prototype.GetParas = function(){
	
	var that = this;
	return that.req.query;
}
//���к����첽���� ��ʱ��Ҫͬ��ִ�д���
Para.prototype.PostParas = function(){
	
	var that = this;
	that.form.parse(that.req,function(err,fields,files){
		if(err)
		{
			console.log("����post��������");
		    that.defer.reject(err);
		}
		else
		{
		   that.defer.resolve(fields); 	
		}
	});
	return that.defer.promise;
	
}
module.exports = Para;