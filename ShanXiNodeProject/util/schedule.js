var schedule = require('node-schedule');  
var moment = require('moment');

var func ={};

func.start  = function(time,myfunc){

    
    schedule.scheduleJob(time,myfunc);


}

module.exports = config;
  