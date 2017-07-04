var express = require('express');
var xlsx = require('node-xlsx');
function Excelobject(data){
	this.data = data;
	this.req="";
	this.res=""; 
}
Excelobject.prototype.product = function(res,req,name){
	
	this.res = res;
	this.req = req;
	var buffer = xlsx.build([{'name': "mySheetName", 'data':this.data }]);
	this.res.setHeader("Pragma","public");
	this.res.setHeader("Content-Type", 'application/x-msexecl;name="xxx.xls";charset=utf-8');
	var browser = this.CheckBroser();
	if(/firefox/gi.test(browser))
	{
		console.log("火狐浏览器");
		this.res.setHeader("Content-Disposition", "inline;filename*="+this.urlencode(name)+".xls");
	}
	else
	{
		console.log("非火狐浏览器");
		this.res.setHeader("Content-Disposition", "inline;filename="+this.urlencode(name)+".xls");
	}
	this.res.write(buffer.toString('binary'), "binary");
	this.res.end();
}
Excelobject.prototype.CheckBroser = function(){
	var browser = {};
	var agent = this.req.headers['user-agent'];
    var userAgent = agent.toLowerCase();
    var s;
    (s = userAgent.match(/msie ([\d.]+)/)) ? browser.ie = s[1] : (s = userAgent.match(/firefox\/([\d.]+)/)) ? browser.firefox = s[1] : (s = userAgent.match(/chrome\/([\d.]+)/)) ? browser.chrome = s[1] : (s = userAgent.match(/opera.([\d.]+)/)) ? browser.opera = s[1] : (s = userAgent.match(/version\/([\d.]+).*safari/)) ? browser.safari = s[1] : 0;
    var version = "";
    if (browser.ie) {
      version = 'IE ' + browser.ie;
    }
    else {
      if (browser.firefox) {
        version = 'firefox ' + browser.firefox;
      }
      else {
        if (browser.chrome) {
          version = 'chrome ' + browser.chrome;
        }
        else {
          if (browser.opera) {
            version = 'opera ' + browser.opera;
          }
          else {
            if (browser.safari) {
              version = 'safari ' + browser.safari;
            }
            else {
              version = '未知浏览器';
            }
          }
        }
      }
    }
    return version;
}
Excelobject.prototype.urlencode = function(url){
	
	url = encodeURIComponent(url);
    url = url.replace(/\%3A/g, ":");
    url = url.replace(/\%2F/g, "/");
    url = url.replace(/\%3F/g, "?");
    url = url.replace(/\%3D/g, "=");
    url = url.replace(/\%26/g, "&");
    return url;
}
module.exports = Excelobject;