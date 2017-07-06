var express = require('express');
var ConnectionPool = require('../sql/sqltediouspoll');
var Paras = require('../request/ParseRequestBody');
var logger = require('../../util/log').logger; 
var EventEmitter = require('events').EventEmitter; 
var eventss = new EventEmitter();
var moment = require('moment');
var Q = require("q");
var func = {};

String.prototype.trim = function() {
       return this.replace(/^\s+|\s+$/g, "");
};

func.getEvent = function (){
  
  console.log("通过ID查询事件信息");
  var defered = Q.defer();
  var sql  = "select * from EventHistory";
  QueryData(sql).done(function(data){
     
     console.log("返回数据");
     
     defered.resolve(data);

  },function(err){

      console.log("通过ID查询事件信息失败");
      defered.reject(err);
  });

   return defered.promise;
}
func.getEventArea = function (data){
  
  console.log("7天信息查询");
  var defered = Q.defer();
  var timearr = data.time;
  var parse = JSON.parse(timearr);
  console.log("7天信息查询 time "+timearr);
  var area = data.area.trim();
  console.log("7天信息查询 area "+area);
  var sql  = "select * from dbo.SYS_EventHistory where H_OperTime > '"+parse[1]+"' and H_OperTime< '"+parse[7]+"' and H_AreaID = '"+area+"'";
  console.log("sum "+sql);
  QueryData(sql).done(function(data){
     
     console.log("返回数据");
     var rt = {'getday':[],'getout':[]};
     var real = [];
     var getdays = [0,0,0,0,0,0,0];
     var getouts = [0,0,0,0,0,0,0];
     for(var j=0;j<7;j++)
     {
       var day = parse[j];
       console.log("天数查询 "+day);
       var geteachday = 0
       var geteachout = 0;
       for(var i=0;i<data.length;i++)
       {
       
         var item = data[i];
         //
          var miaoshu="";
          var truemiao="";
          var date="";
          var time = "";
          if(item.H_OperTime!=null)
          {
            miaoshu = item.H_OperTime.getTime()/1000;
            truemiao = miaoshu-8*3600;
            date = new Date( truemiao * 1000 );//.转换成毫秒
            time = moment(new Date(date)).format('YYYY-MM-DD HH:mm:ss'); 
          }   
         //
         console.log("shijian "+time);
         if(time.indexOf(day)>=0)
         {
          
          console.log(day+" youshuju");
          if(item.H_Type == 2)
          {
             geteachday++;
          }
          if(item.H_Type == 3)
          {
             geteachout++;
          }
         }

       }
        
        getdays[j] = geteachday;
        getouts[j] = geteachout;
     }
      
    console.log("getday "+getdays.length);
    /* if(getdays.length == 0)
     {
        getdays = [0,0,0,0,0,0,0];
     }
     if(getouts.length == 0)
     {
       getouts = [0,0,0,0,0,0,0];

     }*/
     rt.getday = getdays;
     rt.getout = getouts;
     
     console.log("sdsa "+JSON.stringify(rt));
     defered.resolve(rt);

  },function(err){

      console.log("通过ID查询事件信息失败");
      defered.reject(err);
  });

   return defered.promise;
}
func.getEventByPrison = function (id){

  console.log("通过犯人查询事件信息");
  var defered = Q.defer();
  var sql  = "select * from EventHistory where UserID = "+id;
  QueryData(sql).done(function(data){
     
     console.log("返回数据");
     
    defered.resolve(data);

  },function(err){

      console.log("通过电话查询事件信息失败");
     
     defered.reject(err);
  });
    
    return defered.promise;
}
function getAreaPerson(data)
{
    var defered = Q.defer();
    var name = data.name;
    var rfid = data.rfid;
    var areaid = data.areaid;

    var alldate = data;
    var sql = "select UserID from dbo.SYS_PrisonInfo where UserName = '"+name+"' and RFID = '"+rfid+"' and CHARINDEX('"+areaid+"',AreaGroup) > 0";
    QueryData(sql).done(function(data){
      
      if(data.length > 0)
      {
      
        defered.resolve([data,alldate]);

      }
     else
     {

      defered.reject("该犯人不在这一区域");
     }

    },function(err){

      console.log("通过电话查询事件信息失败");
     
     defered.reject(err);
  });
    
    return defered.promise;

}
function insertInto(data)
{
   var defered = Q.defer();
   var data1 = data[1];
   var UserID = data[0][0]['UserID'];
   console.log("UserID "+UserID);
   var name = data1.name;
   console.log("name "+name);
   var rfid = data1.rfid;
   console.log("rfid "+rfid);
   var areaid = data1.areaid;
   console.log("areaid "+areaid);
   var htype = data1.enent;
   console.log("htype "+htype);
   var areaname = data1.areaname;
   var toarea = data1.toarea;
   var toareaname = data1.toareaname;
   var sql = "insert into SYS_EventHistory (UserID,UserName,H_Type,H_OperTime,H_AreaID,RFID,ToAreaID,ToAreaName,FromAreaName)values("+UserID+",'"+name+"',"+htype+",getdate(),"+areaid+",'"+rfid+"',"+toarea+",'"+toareaname+"','"+areaname+"')";
   QueryData(sql).done(function(data){
     
     console.log("插入事件成功");
    eventss.emit('updatePrisonstate',UserID,htype);
    defered.resolve(['1']);

  },function(err){

      console.log("插入事件失败");
     
     defered.reject(err);
  });
    
    return defered.promise;

}
func.addEvent = function (data){

  console.log("通过犯人名称查询事件信息");
  var defered = Q.defer();
 
  getAreaPerson(data).then(insertInto).done(
   
   function(data){
     
     console.log("插入事件成功");

     defered.resolve(['1']);

  },function(err){

     console.log("插入事件失败");
     defered.reject(err);
  }
  );
 
  return defered.promise;
}

func.getEventByTime = function (data){

  console.log("通过时间段查询事件信息");
  var defered = Q.defer();
  var bgtime = data.bgtime.trim();
  var edtime = data.edtime.trim();
  var sql  = "select * from SYS_EventHistory where H_BegTime > "+bgtime+" and H_EndTime < "+edtime;
  QueryData(sql).done(function(data){
     
     console.log("返回数据");
     
    defered.resolve(data);

  },function(err){

      console.log("通过时间段查询事件信息失败");
     
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
eventss.on('updatePrisonstate', function(a,b) { 
    
  var sql = "update SYS_PrisonInfo set State = "+b+" where UserID = "+a;
  QueryData(sql).done(
    
    function(data){
     
     console.log("更新犯人状态成功");

  },function(err){

      console.log("更新犯人状态失败");
  });

});
func.querysql = QueryData;
module.exports = func;