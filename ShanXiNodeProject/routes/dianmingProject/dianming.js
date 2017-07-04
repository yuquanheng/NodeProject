var express = require('express');
var router = express.Router();
var Connection = require('tedious').Connection;
var Request = require('tedious').Request; 
var guard = require('../../Model/Operate/guard');
var prison = require('../../Model/Operate/prison');
var area = require('../../Model/Operate/area');
var device = require('../../Model/Operate/device');
var event = require('../../Model/Operate/event');
var Paras = require('../../Model/request/ParseRequestBody');  
var fileForm = require('../../Model/file/uploadForm');
var enterprise = require('../../Model/Operate/enterprise');
var logger = require('../../util/log').logger; 
var Q = require("q");
var moment = require('moment');

String.prototype.trim = function() {
       return this.replace(/^\s+|\s+$/g, "");
};

router.get('/', function (req, res, next) {
 
   guard.test(req).done(function(data){

       console.log("data "+JSON.stringify(data));
       logger.debug(JSON.stringify(['1','4']));  
       logger.info(JSON.stringify(['1','9']));  
       res.send(JSON.stringify(data));
     
   },function(err){

        res.send([]);
   })
    
});
//
router.get('/prison/err', function (req, res, next) {
    var req = new Paras(req).GetParas();
    var area = req.area.trim();
    prison.getErrPrison(area).done(function(data){

       console.log("data "+JSON.stringify(data));
       //logger.debug(JSON.stringify(['1','4']));  
       //logger.info(JSON.stringify(['1','9']));  
       res.send(JSON.stringify(data));
     
   },function(err){

        res.send([]);
   })
    
});
//主页请求数据会先到这里
router.get('/prison/view', function (req, res, next) {
     
       var req = new Paras(req).GetParas();
       var area = req.area.trim();
       var alln = 0;
       var real = 0;
       var should = 0;
       var getout = 0;
       var getday  = 0;
       var errnum = 0;
       var errm =[];
       prison.getView(area).done(function(data){
       
       console.log("饼状图数据 "+JSON.stringify(data));
       res.send(JSON.stringify(data));
     
   },function(err){

        res.send([]);
   })
    
})
router.get('/prison/query', function (req, res, next) {
     
       var req = new Paras(req).GetParas();
        
       var sEcho = req.sEcho;
       console.log("echo "+sEcho);  
       var iDisplaystart =req.iDisplayStart;
       console.log("iDisplayStart "+iDisplaystart);  
       var iDisplayLength =req.iDisplayLength;
       console.log("ilenth "+iDisplayLength);  
       
       var state = req.state.trim();
       var name = req.name.trim();
       var bgtime = req.bgtime.trim();
       var edtime = req.edtime.trim();
       
       var sql = "";
       if(state)
       {
         sql = "select * from SYS_PrisonInfo where state = '"+state+"'";
         if(name)
         {
           sql = sql+ " and UserName like '"+name+"%'";
           if(bgtime)
           {

             if(edtime)
             {
                 sql = sql + " and OperTime > '"+bgtime+"' and OperTime < '"+edtime+"'";
             }
             else
             {
                sql = sql + " and OperTime > '"+bgtime+"'";
             }
           }
           else
           {
               if(edtime)
               {
                sql = sql + " and OperTime < '"+edtime+"'";
               }
           }
         }
         else
         {
           if(bgtime)
           {

             if(edtime)
             {
                 sql = sql + " and OperTime > '"+bgtime+"' and OperTime < '"+edtime+"'";
             }
             else
             {
                sql = sql + " and OperTime > '"+bgtime+"'";
             }
           }
           else
           {
               if(edtime)
               {
                sql = sql + " and OperTime < '"+edtime+"'";
               }
           }
         }
       }
       else
       {
         // sql = "select * from Prision where state = "+state;
         if(name)
         {
             sql ="select * from SYS_PrisonInfo where UserName = '"+name+"'";
             if(bgtime)
             {

               if(edtime)
               {
                   sql = sql + " and OperTime > '"+bgtime+"' and OperTime < '"+edtime+"'";
               }
               else
               {
                  sql = sql + " and OperTime > '"+bgtime+"'";
               }
            }
            else
            {
               if(edtime)
               {
                sql = sql + " and OperTime < '"+edtime+"'";
               }
            }
         }
         else
         {
            if(bgtime)
             {

               if(edtime)
               {
                   sql = "select * from SYS_PrisonInfo where  OperTime > '"+bgtime+"' and OperTime < '"+edtime+"'";
               }
               else
               {
                  sql = " select * from SYS_PrisonInfo where  OperTime > '"+bgtime+"'";
               }
            }
            else
            {
               if(edtime)
               {
                sql = " select * from SYS_PrisonInfo where   OperTime < '"+edtime+"'";
               }
               else
               {
                sql ="select * from SYS_PrisonInfo";
               }
            }
         }
       }

       console.log("查询罪犯人员 "+sql);
       prison.querysql(sql).done(function(data){
       console.log("data "+JSON.stringify(data));
       var getdata =[];
       var sa = "";
       var miaoshu=""; 
       var truemiao="";
       var date="";
       var time = "";
       for(var j=0;j<data.length;j++)
       {
         var item = data[j];
         if(item.State == "2")
         {
           sa  ="请假";
           console.log("类型写入 "+sa);
         }
         else if(item.State == "3")
         {
           sa = "外出";
           console.log("类型写入 "+sa);
         }
         else if(item.CheckState=="6" || item.CheckState=="5")
         {
           sa  ="异常";
           console.log("类型写入 "+sa);
         }
        
        if(item.OperTime)
        {
          miaoshu = item.OperTime.getTime()/1000;
          truemiao = miaoshu-8*3600;
          date = new Date( truemiao * 1000 );//.转换成毫秒
          time = moment(new Date(date)).format('YYYY-MM-DD HH:mm:ss'); 
        }   
         
         console.log("类型写入 "+sa);
         var arr = ["",item.E_ID,item.UserID,item.A_ID,item.UserName,item.RFID,item.State,sa,item.A_ID,item.LA_ID,item.AreaGroup,item.AreaGroupName,time,""];
         getdata.push(arr);

       }
       var senddata = {"sEcho":sEcho,"iTotalRecords":data.length,"iTotalDisplayRecords":data.length,"aaData":getdata};
       res.send(JSON.stringify(senddata));
     
   },function(err){

        res.send([]);
   })
    
})
router.post('/prison/delete', function (req, res, next) {
     
       new Paras(req).PostParas().then(prison.DelPrison).done(
       
       function(data){

           res.send(['1']);

       },function(err){

          res.send(JSON.stringify([])); 

       }

      )
    
})
router.post('/prison/add', function (req, res, next) {
     
     console.log("罪犯添加");
     fileForm(req,res).then(prison.AddPrison).done(
       function(data){

           res.send(['1']);

       },function(err){

          res.send(JSON.stringify([])); 

       }

      );
})
router.post('/prison/update', function (req, res, next) {
     
     console.log("罪犯更新");
     fileForm(req,res).then(prison.UpdatePrison).done(
       function(data){

           res.send(['1']);

       },function(err){

          res.send(JSON.stringify([])); 

       }

      );
})
//
router.get('/guard/getArea', function (req, res, next) {
 
 var req = new Paras(req).GetParas();
 var name = req.name.trim();
 var phone = req.phone.trim();
  
  guard.getGuard(name,phone).done(

     function(data){

           res.send(JSON.stringify(data));

       },function(err){

          res.send(JSON.stringify([])); 

       }
  );  
  

});

//狱警信息管理
router.get('/guard/queryArea', function (req, res, next) {
 
       var req = new Paras(req).GetParas();
        
       var sEcho = req.sEcho;
       console.log("echo "+sEcho);  
       var iDisplaystart =req.iDisplayStart;
       console.log("iDisplayStart "+iDisplaystart);  
       var iDisplayLength =req.iDisplayLength;
       console.log("ilenth "+iDisplayLength);  
       
       var name = req.name.trim();
       var phone = req.phone.trim();
       var bgtime = req.bgtime.trim();
       var edtime = req.edtime.trim();
       var area = req.area.trim();
       console.log("area "+area);  
       var sql = "";
       if(phone)
       {
         sql = "select * from SYS_AreaUserInfo where MobilePhone = '"+phone+"'";
         if(name)
         {
           sql =sql+" and UserName like '"+name+"%'";
           if(bgtime)
           {

             if(edtime)
             {
                 sql = sql + " and OperTime > '"+bgtime+"' and OperTime < '"+edtime+"'";
             }
             else
             {
                sql = sql + " and OperTime > '"+bgtime+"'";
             }
           }
           else
           {
               if(edtime)
               {
                sql = sql + " and OperTime < '"+edtime+"'";
               }
           }
         }
         else
         {
           if(bgtime)
           {

             if(edtime)
             {
                 sql = sql + " and OperTime > '"+bgtime+"' and OperTime < '"+edtime+"'";
             }
             else
             {
                sql = sql + " and OperTime > '"+bgtime+"'";
             }
           }
           else
           {
               if(edtime)
               {
                sql = sql + " and OperTime < '"+edtime+"'";
               }
           }
         }
       }
       else
       {
         // sql = "select * from Prision where state = "+state;
         if(name)
         {
             sql ="select * from SYS_AreaUserInfo where UserName = '"+name+"'";
             if(bgtime)
             {

               if(edtime)
               {
                   sql = sql + " and OperTime > '"+bgtime+"' and OperTime < '"+edtime+"'";
               }
               else
               {
                  sql = sql + " and OperTime > '"+bgtime+"'";
               }
            }
            else
            {
               if(edtime)
               {
                sql = sql + " and OperTime < '"+edtime+"'";
               }
            }
         }
         else
         {
            if(bgtime)
             {

               if(edtime)
               {
                   sql = "select * from SYS_AreaUserInfo where  OperTime > '"+bgtime+"' and OperTime < '"+edtime+"'";
               }
               else
               {
                  sql = " select * from SYS_AreaUserInfo where  OperTime > '"+bgtime+"'";
               }
            }
            else
            {
               if(edtime)
               {
                sql = " select * from SYS_AreaUserInfo where   OperTime < '"+edtime+"'";
               }
               else
               {
                //sql ="select * from SYS_AreaUserInfo";
               }
            }
         }
       }
       
       if(area)
       {
        if(sql)
        {
            sql = sql + " and CHARINDEX('"+area+"',AreaGroup) > 0"
        }
        else
        {
           sql = " select * from SYS_AreaUserInfo where  CHARINDEX('"+area+"',AreaGroup) > 0";
        }     
       }
       else
       {
         sql ="select * from SYS_AreaUserInfo";
       }
       guard.querysql(sql).done(function(data){
       console.log("data "+JSON.stringify(data));
       var getdata =[];
       for(var j=0;j<data.length;j++)
       {
         var item = data[j];
         var arr = ["",item.UserID,item.UserName,item.Phone,item.AreaGroup,item.AreaGroupName,""];
         getdata.push(arr);

       }
       var senddata = {"sEcho":sEcho,"iTotalRecords":data.length,"iTotalDisplayRecords":data.length,"aaData":getdata};
       res.send(JSON.stringify(senddata));
     
       },function(err){

            res.send([]);
       })
    
})
router.post('/guard/updateArea', function (req, res, next) {
 
     console.log("狱警更新");
     new Paras(req).PostParas().then(guard.UpdateArea).done(
       
       function(data){

           res.send(['1']);

       },function(err){

          res.send(JSON.stringify([])); 

       }

      )
    
})
router.post('/guard/addArea', function (req, res, next) {
 
     console.log("狱警添加");
     new Paras(req).PostParas().then(guard.AddArea).done(
       
       function(data){

           res.send(['1']);

       },function(err){

          res.send(JSON.stringify([])); 

       })
        
})
router.post('/guard/delArea', function (req, res, next) {
 
    new Paras(req).PostParas().then(guard.DelGuard).done(
       
       function(data){

           res.send(['1']);

       },function(err){

          res.send(JSON.stringify([])); 

       }

      )
  
    
})
//事件信息管理
router.get('/event/query', function (req, res, next) {
 
       var req = new Paras(req).GetParas();
        
       var sEcho = req.sEcho;
       console.log("echo "+sEcho);  
       var iDisplaystart =req.iDisplayStart;
       console.log("iDisplayStart "+iDisplaystart);  
       var iDisplayLength =req.iDisplayLength;
       console.log("ilenth "+iDisplayLength);  
       
       var name = req.name.trim();
       console.log("name "+name); 
       var state = req.state.trim();
       console.log("state "+state); 
       var bgtime = req.bgtime.trim();
       console.log("bgtime "+bgtime); 
       var edtime = req.edtime.trim();
       console.log("edtime "+edtime); 
       var areaid = req.area.trim();
       var sql = "";
         var sql = "";
       if(state)
       {
         sql = "select * from SYS_EventHistory where H_Type = '"+state+"'";
         if(name)
         {
           sql =sql+" and UserName like '"+name+"%'";
           if(bgtime)
           {

             if(edtime)
             {
                 sql = sql + " and H_OperTime > '"+bgtime+"' and H_OperTime < '"+edtime+"'";
             }
             else
             {
                sql = sql + " and H_OperTime > '"+bgtime+"'";
             }
           }
           else
           {
               if(edtime)
               {
                sql = sql + " and H_OperTime < '"+edtime+"'";
               }
           }
         }
         else
         {
           if(bgtime)
           {

             if(edtime)
             {
                 sql = sql + " and H_OperTime > '"+bgtime+"' and H_OperTime < '"+edtime+"'";
             }
             else
             {
                sql = sql + " and H_OperTime > '"+bgtime+"'";
             }
           }
           else
           {
               if(edtime)
               {
                sql = sql + " and H_OperTime < '"+edtime+"'";
               }
           }
         }
       }
       else
       {
         // sql = "select * from Prision where state = "+state;
         if(name)
         {
             sql ="select * from SYS_EventHistory where UserName = '"+name+"'";
             if(bgtime)
             {

               if(edtime)
               {
                   sql = sql + " and H_OperTime > '"+bgtime+"' and H_OperTime < '"+edtime+"'";
               }
               else
               {
                  sql = sql + " and H_OperTime > '"+bgtime+"'";
               }
            }
            else
            {
               if(edtime)
               {
                sql = sql + " and H_OperTime < '"+edtime+"'";
               }
            }
         }
         else
         {
            if(bgtime)
             {

               if(edtime)
               {
                   sql = "select * from SYS_EventHistory where  H_OperTime > '"+bgtime+"' and H_OperTime < '"+edtime+"'";
               }
               else
               {
                  sql = " select * from SYS_EventHistory where  H_OperTime > '"+bgtime+"'";
               }
            }
            else
            {
               if(edtime)
               {
                sql = " select * from SYS_EventHistory where   H_OperTime < '"+edtime+"'";
               }
               else
               {
                //sql ="select * from SYS_EventHistory";
               }
            }
         }
       }

      
          if(sql)
          {
            if(areaid)
            {
              sql = sql + " and H_AreaID = "+areaid;
            }
            
          }
          else
          {
             if(areaid)
             {
               
               sql = " select * from SYS_EventHistory where  H_AreaID = "+areaid;

             }
             else
             {
              
              sql ="select * from SYS_EventHistory";

             }
          }
       
       console.log("event sql "+sql);
       area.querysql(sql).done(function(data){
       console.log("data "+JSON.stringify(data));
       var getdata =[];
       var HT = "";
       for(var j=0;j<data.length;j++)
       {
         var item = data[j];
         var miaoshu="";
         var truemiao="";
         var date="";
         var time = "";
         if(item.H_Type ==2)
         {
             HT = "请假";
         }
         else if(item.H_Type ==3)
         {
             HT = "外出";
         }
         else
         {
          
         }
         if(item.H_OperTime)
         {
          miaoshu = item.H_OperTime.getTime()/1000;
          truemiao = miaoshu-8*3600;
          date = new Date( truemiao * 1000 );//.转换成毫秒
          time = moment(new Date(date)).format('YYYY-MM-DD HH:mm:ss'); 
         }   
         var arr = [item.UserName,HT,item.RFID,item.FromAreaName,item.ToAreaName,time];
         getdata.push(arr);

       }
       var senddata = {"sEcho":sEcho,"iTotalRecords":data.length,"iTotalDisplayRecords":data.length,"aaData":getdata};
       res.send(JSON.stringify(senddata));
     
       },function(err){

            res.send([]);
       })
    
})
router.post('/event/sum', function (req, res, next) {
 
  new Paras(req).PostParas().then(event.getEventArea).done(function(data){
   
      res.send(JSON.stringify(data));

  },function(err){

   res.send(JSON.stringify([])); 

  });
    
})
router.get('/event/getPersonEvent', function (req, res, next) {
 
   event.getEventByPrison().done(function(data){

       console.log("data "+JSON.stringify(data));
       res.send(JSON.stringify(data));
     
   },function(err){

        res.send([]);
   })
    
})
router.post('/event/add', function (req, res, next) {
 

    new Paras(req).PostParas().then(event.addEvent).done(
       
       function(data){

           res.send(['1']);

       },function(err){

          res.send(JSON.stringify([])); 

       }
      )
    
})
//区域信息管理
router.get('/area/getArea', function (req, res, next) {
 
   area.getArea().done(function(data){

       console.log("data "+JSON.stringify(data));
       res.send(JSON.stringify(data));
     
   },function(err){

        res.send([]);
   })
    
})
router.get('/area/getType', function (req, res, next) {
   
   var req = new Paras(req).GetParas();
   var id = req.id;
   area.getAreaType(id).done(function(data){

       console.log("data "+JSON.stringify(data));
       res.send(JSON.stringify(data));
     
   },function(err){

        res.send([]);
   })
    
})
//设备信息管理
router.get('/device/query', function (req, res, next) {
   
       var req = new Paras(req).GetParas();
        
       var sEcho = req.sEcho;
       console.log("echo "+sEcho);  
       var iDisplaystart =req.iDisplayStart;
       console.log("iDisplayStart "+iDisplaystart);  
       var iDisplayLength =req.iDisplayLength;
       console.log("ilenth "+iDisplayLength);  
       
       var number = req.number.trim();
       console.log("number "+number); 
       var area = req.area.trim();
       console.log("area "+area); 
       var bgtime = req.bgtime.trim();
       console.log("bgtime "+bgtime); 
       var edtime = req.edtime.trim();
       console.log("edtime "+edtime); 

       var sql = "";
         var sql = "";
       if(area)
       {
         sql = "select * from SYS_AreaEquip where EQ_AreaID = '"+area+"'";
         if(number)
         {
           sql =sql+" and EQ_Name like '"+number+"%'";
           if(bgtime)
           {

             if(edtime)
             {
                 sql = sql + " and OperTime > '"+bgtime+"' and OperTime < '"+edtime+"'";
             }
             else
             {
                sql = sql + " and OperTime > '"+bgtime+"'";
             }
           }
           else
           {
               if(edtime)
               {
                sql = sql + " and OperTime < '"+edtime+"'";
               }
           }
         }
         else
         {
           if(bgtime)
           {

             if(edtime)
             {
                 sql = sql + " and OperTime > '"+bgtime+"' and OperTime < '"+edtime+"'";
             }
             else
             {
                sql = sql + " and OperTime > '"+bgtime+"'";
             }
           }
           else
           {
               if(edtime)
               {
                sql = sql + " and OperTime < '"+edtime+"'";
               }
           }
         }
       }
       else
       {
         // sql = "select * from Prision where state = "+state;
         if(number)
         {
             sql ="select * from SYS_AreaEquip where EQ_Name = '"+number+"'";
             if(bgtime)
             {

               if(edtime)
               {
                   sql = sql + " and OperTime > '"+bgtime+"' and OperTime < '"+edtime+"'";
               }
               else
               {
                  sql = sql + " and OperTime > '"+bgtime+"'";
               }
            }
            else
            {
               if(edtime)
               {
                sql = sql + " and OperTime < '"+edtime+"'";
               }
            }
         }
         else
         {
            if(bgtime)
             {

               if(edtime)
               {
                   sql = "select * from SYS_AreaEquip where  OperTime > '"+bgtime+"' and OperTime < '"+edtime+"'";
               }
               else
               {
                  sql = " select * from SYS_AreaEquip where  OperTime > '"+bgtime+"'";
               }
            }
            else
            {
               if(edtime)
               {
                sql = " select * from SYS_AreaEquip where   OperTime < '"+edtime+"'";
               }
               else
               {
                sql ="select * from SYS_AreaEquip";
               }
            }
         }
       }
       console.log("devices sql "+sql);
       device.querysql(sql).done(function(data){
    
       var getdata =[];
       var HT = "";
       for(var j=0;j<data.length;j++)
       {
         var item = data[j];
        
         var arr = ["",item.EQ_ID,item.EQ_AreaID,item.EQ_Name,item.EQ_AreaName,item.EQ_Log,item.EQ_Lat,""];
         getdata.push(arr);

       }
       var senddata = {"sEcho":sEcho,"iTotalRecords":data.length,"iTotalDisplayRecords":data.length,"aaData":getdata};
       res.send(JSON.stringify(senddata));
     
       },function(err){

            res.send([]);
       })
    

});
router.get('/device/upstate', function (req, res, next) {
  
  console.log("设备状态更新");
  var req = new Paras(req).GetParas();
  var area = req.area;
  var stat = req.state;
  device.updateDeviceState(area,stat).done(function(data){

       console.log("更新成功 "+JSON.stringify(data));
       res.send(JSON.stringify(data));
     
   },function(err){

        res.send([])
   })
  
});
router.post('/device/add', function (req, res, next) {
  
  console.log("设备添加");
  new Paras(req).PostParas().then(device.addDevice).done(
       function(data){
       
           res.send(['1']);
     
       },function(err){

           res.send([]);  
    });
  
});
router.post('/device/update', function (req, res, next) {
  console.log("设备更新");
  new Paras(req).PostParas().then(device.updateDevice).done(
       function(data){
       
           res.send(['1']);
     
       },function(err){

           res.send([]);  
    });
  
});
router.post('/device/delete', function (req, res, next) {

      console.log("设备删除");
       new Paras(req).PostParas().then(device.delDevice).done(
       
       function(data){

           res.send(['1']);

       },function(err){

          res.send(JSON.stringify([])); 

       }

      )
});
//企业信息管理

router.get('/enterprise/getEnterpriseInfo', function (req, res, next) {
 
   enterprise.getEnterPrise().done(function(data){

       console.log("查询企业数据 "+JSON.stringify(data));
       res.send(JSON.stringify(data));
     
   },function(err){

        res.send([])
   })
    
})
module.exports = router;