var express = require('express');
var Unique = {
	arr:"",
	StringGroup:function(){
		var tmp = new Array();
		for(var m in this.arr){
		tmp[this.arr[m]]=1;
		}
		var tmparr = new Array();
		for(var n in tmp){
		tmparr.push(n);
		} 
		return tmparr;
	},
	JsonGroup:function(){
		var stringjson = [];
		for(var i=0;i<this.arr.length;i++)
		{
			var item = this.arr[i];
			var stringitem = JSON.stringify(item);
			console.log("uaochuansong  "+JSON.stringify(stringitem));
			stringjson.push(stringitem);
		}
		this.arr = stringjson;
		return JSON.parse("["+this.StringGroup()+"]");
	}
}
module.exports = Unique;