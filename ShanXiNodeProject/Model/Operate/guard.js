var express = require('express');
var ConnectionPool = require('../sql/sqltediouspoll');
var Paras = require('../request/ParseRequestBody');
var logger = require('../../util/log').logger; 
var moment = require('moment');
var Q = require("q");
var func = {};

String.prototype.trim = function() {
       return this.replace(/^\s+|\s+$/g, "");
};
func.getGuardArea = function(name,number){

}
func.getGuard = function(name,phone){

  
  var defered = Q.defer();
  console.log("登录用户 "+name);
  console.log("登录用户电话 "+phone);
  var sql = "select * from dbo.SYS_AreaUserInfo where UserName = '"+name+"' and Phone = '"+phone+"'";
  QueryData(sql).done(function(data){
     
     if(data.length > 0)
     {
      console.log("返回数据");
      var areaid = data[0]['AreaGroup'];
      var areaname = data[0]['AreaGroupName'];
      if(areaid.indexOf(",")>=0)
      {
         areaid = areaid.substring(1,areaid.length-1);
      }
      var spl = areaid.split(",");
      var sqla = areaname.split(",");
      var sendd = [spl,sqla];
      console.log("返回警员区域信息 "+JSON.stringify(sendd));
      defered.resolve(sendd);
    }
    else
    {
      defered.resolve([]);
    }

  },function(err){

      console.log("通过ID查询警员信息失败");
      defered.reject(err);
  });

  return defered.promise;
}

function getUser(name,phone,area,areagroup)
{

  var defered = Q.defer();
  var sql = "select * from SYS_UserInfo where mobilephone = '"+phone+"' and UserName like '"+name+"%'";
  console.log("查询警员信息 "+sql);
  QueryData(sql).done(function(data){
     
      var json = [data[0],area,areagroup];
      defered.resolve(json);;

  },function(err){

      defered.reject(err);
  });

  return defered.promise;


}
function insertUser(data)
{
   var defered = Q.defer();
  
   var fromuser = data[0];
   var area = data[1];
   var areagroup = data[2];
   console.log("area: "+area);
   console.log("usermessage: "+JSON.stringify(fromuser));
   var UserID = fromuser['UserID'];
   console.log("UserID: "+UserID);
   var UserName = fromuser.UserName;
   console.log("UserName: "+UserName);
   var phone  = fromuser.MobilePhone;
   console.log("phone: "+phone);
   
   var sql = "insert into SYS_AreaUserInfo (UserID,UserName,Phone,AreaGroup,OperTime,AreaGroupName) values('"+UserID+"','"+UserName+"','"+phone+"','"+area+"',getdate(),'"+areagroup+"')";
   console.log("插入警员区域语句 "+sql);
   QueryData(sql).done(function(data){
     
     console.log("插入警员区域成功");
      defered.resolve([1]);

   },function(err){

      defered.reject(err);
   });

  return defered.promise;

}
func.AddArea = function (data){
  
    var defered = Q.defer();
    console.log("添加警员区域信息 "+JSON.stringify(data));
    var name = data.name.trim();
    var phone = data.phone.trim();
    var area = data.anablearea.trim();
    var areagroup = data.anableareaname.trim();
    console.log("为警员: "+name+" 电话: "+phone+" 分配区域: "+ area+" 区域名称: "+areagroup);
    
    //首先去userinfo表中查找数据
    getUser(name,phone,area,areagroup).then(insertUser).done(
     
     function(data){

      defered.resolve([1]);;

     },function(err){

      defered.reject(err);
     });
  return defered.promise;
}
func.UpdateArea = function (data){
  
    var defered = Q.defer();
    console.log("更新警员区域信息 "+JSON.stringify(data));
    var name = data.name;
    console.log(name);
    var phone = data.phone;
    console.log(phone);
    var area = data.anablearea;
    console.log(area);
    var areagroup = data.anableareaname;
    console.log(areagroup);
    var id = data.userid;
    console.log(id);
    var sql = "";
    //var sql = "update SYS_AreaUserInfo set UserName = '"+name+"',Phone = '"+phone+"',AreaGroup = '"+area+"',AreaGroupName = '"+AreaGroupName+"' where UserID = '"+userid+"'";
    sql = "update SYS_AreaUserInfo set UserName = '"+name+"',Phone= '"+phone+"',AreaGroup='"+area+"',AreaGroupName= '"+areagroup+"' where UserID = '"+id+"'";
    console.log("更新警员区域sql语句 "+sql);
    QueryData(sql).done(function(data){
     
     console.log("更新警员区域成功");
      defered.resolve([1]);

   },function(err){

      defered.reject(err);
   });
  return defered.promise;
}
func.DelGuard = function(data){
    var defered = Q.defer();
    var userg = JSON.parse(data.deletegroup);
    console.log("删除的数据 "+data.deletegroup);
    var sql ="";
    var str ="";
    var foreignsql ="";
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
       sql ="delete  from SYS_AreaUserInfo where UserID in ("+str+")";
       //foreignsql = "delete from EventHistory where H_OperPeron in ("+str+")";
       console.log("delete sql "+sql);
    }
    QueryData(sql).done(function(data){
     
     console.log("插入警员区域成功");
      defered.resolve([1]);

   },function(err){

      defered.reject(err);
   });
     return defered.promise;
}

func.UpdateGuard = function (data){

  console.log("更新警员信息");
  var defered = Q.defer();
  var name = data.name.trim();
  var phone =  data.phone.trim();
  var id = data.id.trim();
  
  var sql = "update SYS_UserInfo set UserName = '"+name+"',MobilePhone= '"+phone+"' where UserID = '"+id+"'";
    
  QueryData(sql).done(function(data){
   
       console.log("插入警员信息成功");
       defered.resolve(['1']);

    },function(err){

        console.log("插入警员信息失败");
        
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