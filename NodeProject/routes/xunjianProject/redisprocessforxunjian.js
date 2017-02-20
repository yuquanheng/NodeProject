var redis = require('../redis/redis');
process.on('message', function(m) {
	var data = m;
   console.log("数据"+JSON.stringify(data));
   var length = data.length;
     //进行缓存
    redis.QueryList.lpush(data,function(err,resolut){
		
		if(err)
		{
			console.log(err);
		}
		else
		{
			
			console.log("缓存部门成功");
		}
	});
	//设置过期时间
	redis.expire([data[0],60*60],function(err,succ){
					
		if(err)
		{
			console.log(err);
		}
		else
		{
						
			if(succ)
			{
				console.log("设置超时成功");
			}
		}
	});
});
