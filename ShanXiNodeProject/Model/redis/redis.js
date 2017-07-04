var redis = require("redis");
var redisdata={};
//字符串
redisdata.Querystring={};
//Redis GET 命令用于设置给定 key 的值。如果 key 已经存储其他值， SET 就覆写旧值，且无视类型
redisdata.Querystring.get = function(keyname,callback){
	var client = redis.createClient(6379, "127.0.0.1");
   	client.on("error", function(err)
	{
         console.log("ConnectErrorError: " + err);
		 return;
    });
    client.on("connect", function()
    {
          // 字符串查询操作
		 // console.log("connect success");
		  client.get(keyname, function(err, reply){
			 
			// 返回之前关闭链接
            client.quit();
			callback(err,reply);
          });
	});
};
//Redis Mget 命令返回所有(一个或多个)给定 key 的值。 如果给定的 key 里面，有某个 key 不存在，那么这个 key 返回特殊值 nil 
redisdata.Querystring.mget = function(keyname,callback){
	var client = redis.createClient(6379, "127.0.0.1");
   	client.on("error", function(err)
	{
         console.log("ConnectErrorError: " + err);
		 return;
    });
    client.on("connect", function()
    {
          // 字符串查询操作
		 // console.log("redis connect success");
		  client.mget(keyname, function(err, reply){
			// 返回之前关闭链接
            client.quit();
			callback(err,reply);
          });
	});
};

//Redis SET 命令用于设置给定 key 的值。如果 key 已经存储其他值， SET 就覆写旧值，且无视类型。
redisdata.Querystring.set = function(keyname,callback){
	var client = redis.createClient(6379, "127.0.0.1");
   	client.on("error", function(err)
	{
         console.log("ConnectErrorError: " + err);
		 return;
    });
    client.on("connect", function()
    {
          // 字符串查询操作
		 // console.log("connect success");
		  client.set(keyname,function(err, reply){
			// 返回之前关闭链接
            client.quit();
			callback(err,reply);
          });
	});

};
//Redis Mset 命令用于同时设置一个或多个 key-value 对。
redisdata.Querystring.mset = function(keyname,callback){
	var client = redis.createClient(6379, "127.0.0.1");
   	client.on("error", function(err)
	{
         console.log("ConnectErrorError: " + err);
		 return;
    });
    client.on("connect", function()
    {
          // 字符串查询操作
		  //console.log("connect success");
		  client.mset(keyname,function(err, reply){
			// 返回之前关闭链接
            client.quit();
			callback(err,reply);
          });
	});
};
//
//Redis Strlen 命令用于获取指定 key 所储存的字符串值的长度。当 key 储存的不是字符串值时，返回一个错误。
redisdata.Querystring.strlen = function(keyname,callback){
	var client = redis.createClient(6379, "127.0.0.1");
   	client.on("error", function(err)
	{
         console.log("ConnectErrorError: " + err);
		 return;
    });
    client.on("connect", function()
    {
          // 字符串查询操作
		 // console.log("connect success");
		  client.strlen(keyname,function(err, reply){
			// 返回之前关闭链接
            client.quit();
			callback(err,reply);
          });
	});
};
//如果 key 不存在，那么 key 的值会先被初始化为 0 ，然后再执行 INCR 操作。
//如果值包含错误的类型，或字符串类型的值不能表示为数字，那么返回一个错误。
//本操作的值限制在 64 位(bit)有符号数字表示之内。
redisdata.Querystring.incr= function(keyname,callback){
	var client = redis.createClient(6379, "127.0.0.1");
   	client.on("error", function(err)
	{
         console.log("ConnectErrorError: " + err);
		 return;
    });
    client.on("connect", function()
    {
          // 字符串查询操作
		 // console.log("connect success");
		  client.incr(keyname,function(err, reply){
			// 返回之前关闭链接
            client.quit();
			callback(err,reply);
          });
	});
};
//Redis Incrby 命令将 key 中储存的数字加上指定的增量值。
redisdata.Querystring.incrby= function(keyname,callback){
	var client = redis.createClient(6379, "127.0.0.1");
   	client.on("error", function(err)
	{
         console.log("ConnectErrorError: " + err);
		 return;
    });
    client.on("connect", function()
    {
          // 字符串查询操作
		  //console.log("connect success");
		  client.incrby(keyname,function(err, reply){
			// 返回之前关闭链接
            client.quit();
			callback(err,reply);
          });
	});
};
//Redis Decr 命令将 key 中储存的数字值减一。
redisdata.Querystring.decr= function(keyname,callback){
	var client = redis.createClient(6379, "127.0.0.1");
   	client.on("error", function(err)
	{
         console.log("ConnectErrorError: " + err);
		 return;
    });
    client.on("connect", function()
    {
          // 字符串查询操作
		  //console.log("connect success");
		  client.decr(keyname,function(err, reply){
			// 返回之前关闭链接
            client.quit();
			callback(err,reply);
          });
	});
};
//
redisdata.Querystring.decrby= function(keyname,callback){
	var client = redis.createClient(6379, "127.0.0.1");
   	client.on("error", function(err)
	{
         console.log("ConnectErrorError: " + err);
		 return;
    });
    client.on("connect", function()
    {
          // 字符串查询操作
		 // console.log("connect success");
		  client.decrby(keyname,function(err, reply){
			// 返回之前关闭链接
            client.quit();
			callback(err,reply);
          });
	});
};
//Redis Append 命令用于为指定的 key 追加值。
//如果 key 已经存在并且是一个字符串， APPEND 命令将 value 追加到 key 原来的值的末尾。
//如果 key 不存在， APPEND 就简单地将给定 key 设为 value ，就像执行 SET key value 一样。
redisdata.Querystring.append= function(keyname,callback){
	var client = redis.createClient(6379, "127.0.0.1");
   	client.on("error", function(err)
	{
         console.log("ConnectErrorError: " + err);
		 return;
    });
    client.on("connect", function()
    {
          // 字符串查询操作
		 // console.log("connect success");
		  client.append(keyname,function(err, reply){
			// 返回之前关闭链接
            client.quit();
			callback(err,reply);
          });
	});
};
//哈希表
redisdata.QueryHash={};
redisdata.QueryHash.hgetall= function(keyname,callback){
	var client = redis.createClient(6379, "127.0.0.1");
	client.on("error", function(err)
	{
         console.log("redis connectError: " + err);
		 return;
    });
 
    client.on("connect", function()
    {
	        //console.log("redis connect success");
		   client.hgetall(keyname,function(err, reply){
			// 返回之前关闭链接
            client.quit();
			callback(err, reply);
            });
	});
};
//
redisdata.QueryHash.hget= function(keyname,callback){
	var client = redis.createClient(6379, "127.0.0.1");
	client.on("error", function(err)
	{
         console.log("redis connectError: " + err);
		 return;
    });
 
    client.on("connect", function()
    {
	       // console.log("redis connect success");
		   client.hget(keyname,function(err, reply){
			// 返回之前关闭链接
            client.quit();
			callback(err, reply);
            });
	});
};
//
redisdata.QueryHash.hset= function(keyname,callback){
	var client = redis.createClient(6379, "127.0.0.1");
	client.on("error", function(err)
	{
         console.log("redis ConnectError: " + err);
		 return;
    });
 
    client.on("connect", function()
    {
	       // console.log("redis connect success");
		   client.hset(keyname,function(err, reply){
			// 返回之前关闭链接
            client.quit();
			callback(err, reply);
            });
	});
};
//hsah mset
redisdata.QueryHash.hmset= function(keyname,callback){
	var client = redis.createClient(6379, "127.0.0.1");
	client.on("error", function(err)
	{
         console.log("redis ConnectError: " + err);
		 return;
    });
 
    client.on("connect", function()
    {
	       // console.log("redis connect success");
		   client.hmset(keyname,function(err, reply){
			// 返回之前关闭链接
            client.quit();
			callback(err, reply);
            });
	});
};
//
redisdata.QueryHash.hmget= function(keyname,callback){
	var client = redis.createClient(6379, "127.0.0.1");
	client.on("error", function(err)
	{
         console.log("ConnectError: " + err);
		 return;
    });
 
    client.on("connect", function()
    {
	        //console.log("connect success");
			client.hmget(keyname,function(err, reply){
		    // 返回之前关闭链接
            client.quit();
			callback(err, reply);
            });
		 
	});
	
};
//HINCRBY
redisdata.QueryHash.hincrby= function(keyname,callback){
	var client = redis.createClient(6379, "127.0.0.1");
	client.on("error", function(err)
	{
         console.log("ConnectError: " + err);
		 return;
    });
 
    client.on("connect", function()
    {
	        //console.log("connect success");
			client.hincrby(keyname,function(err, reply){
		    // 返回之前关闭链接
            client.quit();
			callback(err, reply);
            });
		 
	});
};
//Redis Hkeys 命令用于获取哈希表中的所有字段名
redisdata.QueryHash.hkeys= function(keyname,callback){
	var client = redis.createClient(6379, "127.0.0.1");
	client.on("error", function(err)
	{
         console.log("ConnectError: " + err);
		 return;
    });
 
    client.on("connect", function()
    {
	       // console.log("connect success");
			client.hkeys(keyname,function(err, reply){
		    // 返回之前关闭链接
            client.quit();
			callback(err, reply);
            });
		 
	});
};
//Redis Hlen 命令用于获取哈希表中字段的数量。
redisdata.QueryHash.hlen= function(keyname,callback){
	var client = redis.createClient(6379, "127.0.0.1");
	client.on("error", function(err)
	{
         console.log("ConnectError: " + err);
		 return;
    });
 
    client.on("connect", function()
    {
	        //console.log("connect success");
			client.hlen(keyname,function(err, reply){
		    // 返回之前关闭链接
            client.quit();
			callback(err, reply);
            });
		 
	});
};
//Redis Hvals 命令返回哈希表所有字段的值。
redisdata.QueryHash.hvals= function(keyname,callback){
	var client = redis.createClient(6379, "127.0.0.1");
	client.on("error", function(err)
	{
         console.log("ConnectError: " + err);
		 return;
    });
 
    client.on("connect", function()
    {
	       // console.log("connect success");
			client.hvals(keyname,function(err, reply){
		    // 返回之前关闭链接
            client.quit();
			callback(err, reply);
            });
		 
	});
	
};
//列表操作
redisdata.QueryList={};
redisdata.QueryList.lrange = function(keyname,callback){
	var client = redis.createClient(6379, "127.0.0.1");
	client.on("error", function(err)
	{
         console.log("ConnectError: " + err);
		 return;
    });
 
    client.on("connect", function()
    {
	     //console.log("connect success");
		 client.lrange(keyname,function(err,res){  
		   // 返回之前关闭链接
            client.quit();
		    callback(err,res);
		 });
	});
};
//Redis Lpush 命令将一个或多个值插入到列表头部。 如果 key 不存在，一个空列表会被创建并执行 LPUSH 操作。 当 key 存在但不是列表类型时，返回一个错误。
redisdata.QueryList.lpush= function(keyname,callback){
	var client = redis.createClient(6379, "127.0.0.1");
	client.on("error", function(err)
	{
         console.log("ConnectError: " + err);
		 return;
    });
 
    client.on("connect", function()
    {
	     //console.log("connect success");
		 client.lpush(keyname,function(err,res){  
		    // 返回之前关闭链接
            client.quit();
		    callback(err,res);
		 });
	});
};
redisdata.QueryList.rpush= function(keyname,callback){
	var client = redis.createClient(6379, "127.0.0.1");
	client.on("error", function(err)
	{
         console.log("ConnectError: " + err);
		 return;
    });
 
    client.on("connect", function()
    {
	    // console.log("connect success");
		 client.rpush(keyname,function(err,res){  
		   // 返回之前关闭链接
            client.quit();
		    callback(err,res);
		 });
	});
};
//Redis Lindex 命令用于通过索引获取列表中的元素。你也可以使用负数下标，以 -1 表示列表的最后一个元素， -2 表示列表的倒数第二个元素，以此类推。
redisdata.QueryList.lindex= function(keyname,callback){
	var client = redis.createClient(6379, "127.0.0.1");
	client.on("error", function(err)
	{
         console.log("ConnectError: " + err);
		 return;
    });
 
    client.on("connect", function()
    {
	    // console.log("connect success");
		 client.lindex(keyname,function(err,res){  
		   // 返回之前关闭链接
            client.quit();
		    callback(err,res);
		 });
	});
};
//Redis Llen 命令用于返回列表的长度。 如果列表 key 不存在，则 key 被解释为一个空列表，返回 0 。 如果 key 不是列表类型，返回一个错误。
redisdata.QueryList.llen= function(keyname,callback){
	var client = redis.createClient(6379, "127.0.0.1");
	client.on("error", function(err)
	{
         console.log("ConnectError: " + err);
		 return;
    });
 
    client.on("connect", function()
    {
	    // console.log("connect success");
		 client.llen(keyname,function(err,res){  
		   // 返回之前关闭链接
            client.quit();
		    callback(err,res);
		 });
	});
};
//Redis Lpop 命令用于移除并返回列表的第一个元素。
redisdata.QueryList.lpop= function(keyname,callback){
	var client = redis.createClient(6379, "127.0.0.1");
	client.on("error", function(err)
	{
         console.log("ConnectError: " + err);
		 return;
    });
 
    client.on("connect", function()
    {
	     //console.log("connect success");
		 client.lpop(keyname,function(err,res){  
		 // 返回之前关闭链接
            client.quit();
		    callback(err,res);
		 });
	});
};
redisdata.QueryList.rpop= function(keyname,callback){
	var client = redis.createClient(6379, "127.0.0.1");
	client.on("error", function(err)
	{
         console.log("ConnectError: " + err);
		 return;
    });
 
    client.on("connect", function()
    {
	     //console.log("connect success");
		 client.rpop(keyname,function(err,res){ 
           // 返回之前关闭链接
            client.quit();		 
		    callback(err,res);
		 });
	});
};
//集合操作
redisdata.QuerySet={};
//获取集合所有成员
redisdata.QuerySet.smembers = function(keyname,callback){
	var client = redis.createClient(6379, "127.0.0.1");
	client.on("error", function(err)
	{
         console.log("ConnectError: " + err);
		 return;
    });
 
    client.on("connect", function()
    {
	    // console.log("connect success");
		 client.smembers(keyname, function(err, reply) {
			 // 返回之前关闭链接
             client.quit();
             callback(err,reply);
         });
		 
	});
};
//集合是否存在成员
//Redis Sadd 命令将一个或多个成员元素加入到集合中，已经存在于集合的成员元素将被忽略。
//假如集合 key 不存在，则创建一个只包含添加的元素作成员的集合。
redisdata.QuerySet.sadd= function(keyname,callback){
	var client = redis.createClient(6379, "127.0.0.1");
	client.on("error", function(err)
	{
         console.log("ConnectError: " + err);
		 return;
    });
 
    client.on("connect", function()
    {
	     //console.log("connect success");
		 client.sadd(keyname,function(err, reply) {
			 // 返回之前关闭链接
            client.quit();
         callback(err,reply);
         });
		 
	});
};
//
redisdata.QuerySet.sismember = function(keyname,callback){
	var client = redis.createClient(6379, "127.0.0.1");
	client.on("error", function(err)
	{
         console.log("ConnectError: " + err);
		 return;
    });
 
    client.on("connect", function()
    {
	     //console.log("connect success");
		 client.sismember(keyname,function(err, reply) {
			 // 返回之前关闭链接
            client.quit();
         callback(err,reply);
         });
		 
	});
};
//获取集合数量
redisdata.QuerySet.scard = function(keyname,callback){
	var client = redis.createClient(6379, "127.0.0.1");
	client.on("error", function(err)
	{
         console.log("ConnectError: " + err);
		 return;
    });
 
    client.on("connect", function()
    {
	     //console.log("connect success");
		 client.scard(keyname, function(err, reply) {
			 // 返回之前关闭链接
            client.quit();
         callback(err,reply);
         });
		 
	});
};
//获取集合的差集
redisdata.QuerySet.sdiff = function(keynames,callback){
	var client = redis.createClient(6379, "127.0.0.1");
	client.on("error", function(err)
	{
         console.log("ConnectError: " + err);
		 return;
    });
 
    client.on("connect", function()
    {
	     //console.log("connect success");
		 client.sdiff(keynames, function(err, reply) {
			 // 返回之前关闭链接
            client.quit();
         callback(err,reply);
         });
		 
	});
};

//获取集合的交集
redisdata.QuerySet.sinter= function(keyname,callback){
	var client = redis.createClient(6379, "127.0.0.1");
	client.on("error", function(err)
	{
         console.log("ConnectError: " + err);
		 return;
    });
 
    client.on("connect", function()
    {
	     //console.log("connect success");
		 client.sinter(keyname, function(err, reply) {
			 // 返回之前关闭链接
            client.quit();
         callback(err,reply);
         });
		 
	});
};
//获取集合的并集
redisdata.QuerySet.sunion = function(keyname,callback){
	var client = redis.createClient(6379, "127.0.0.1");
	client.on("error", function(err)
	{
         console.log("ConnectError: " + err);
		 return;
    });
 
    client.on("connect", function()
    {
	     //console.log("connect success");
		 client.sunion(keyname, function(err, reply) {
			 // 返回之前关闭链接
            client.quit();
         callback(err,reply);
         });
		 
	});
};
//有序集合操作
redisdata.QuerySortingSet={};
//获取有序集合的数量
redisdata.QuerySortingSet.zadd = function(keyname,callback){
	var client = redis.createClient(6379, "127.0.0.1");
	client.on("error", function(err)
	{
         console.log("ConnectError: " + err);
		 return;
    });
 
    client.on("connect", function()
    {
	     //console.log("connect success");
		 client.zadd(keyname, function(err, reply) {
			 // 返回之前关闭链接
            client.quit();
             callback(err,reply);
         });
		 
	});
};
redisdata.QuerySortingSet.zcard = function(keyname,callback){
	var client = redis.createClient(6379, "127.0.0.1");
	client.on("error", function(err)
	{
         console.log("ConnectError: " + err);
		 return;
    });
 
    client.on("connect", function()
    {
	     //console.log("connect success");
		 client.zcard(keyname, function(err, reply) {
			 // 返回之前关闭链接
            client.quit();
             callback(err,reply);
         });
		 
	});
};
//分数值在 min 和 max 之间的成员的数量。
redisdata.QuerySortingSet.zcount = function(keyname,callback){
	var client = redis.createClient(6379, "127.0.0.1");
	client.on("error", function(err)
	{
         console.log("ConnectError: " + err);
		 return;
    });
 
    client.on("connect", function()
    {
	    // console.log("connect success");
		 client.zcount(keyname,function(err, reply) {
			 // 返回之前关闭链接
            client.quit();
             callback(err,reply);
         });
		 
	});
};
//指定区间内，带有分数值(可选)的有序集成员的列表。
redisdata.QuerySortingSet.zrange = function(keyname,callback){
	var client = redis.createClient(6379, "127.0.0.1");
	client.on("error", function(err)
	{
         console.log("ConnectError: " + err);
		 return;
    });
 
    client.on("connect", function()
    {
	     //console.log("connect success");
		 client.zrange(keyname,function(err, reply) {
			 // 返回之前关闭链接
            client.quit();
             callback(err,reply);
         });
		 
	});
};
//如果成员是有序集 key 的成员，返回 member 的排名。 如果成员不是有序集 key 的成员，返回 nil 
redisdata.QuerySortingSet.zrank = function(keyname,callback){
	var client = redis.createClient(6379, "127.0.0.1");
	client.on("error", function(err)
	{
         console.log("ConnectError: " + err);
		 return;
    });
 
    client.on("connect", function()
    {
	    // console.log("connect success");
		 client.zrank(keyname,function(err, reply) {
			 // 返回之前关闭链接
            client.quit();
             callback(err,reply);
         });
		 
	});
};
// Zrevrank 命令返回有序集中成员的排名。其中有序集成员按分数值递减(从大到小)排序。
//排名以 0 为底，也就是说， 分数值最大的成员排名为 0 。使用 ZRANK 命令可以获得成员按分数值递增(从小到大)排列的排名。
redisdata.QuerySortingSet.zrevrank = function(keyname,callback){
	var client = redis.createClient(6379, "127.0.0.1");
	client.on("error", function(err)
	{
         console.log("ConnectError: " + err);
		 return;
    });
 
    client.on("connect", function()
    {
	     //console.log("connect success");
		 client.zrevrank(keyname,function(err, reply) {
			 // 返回之前关闭链接
            client.quit();
             callback(err,reply);
         });
		 
	});
};
//成员的分数值，以字符串形式表示。
redisdata.QuerySortingSet.zscore = function(keyname,callback){
	var client = redis.createClient(6379, "127.0.0.1");
	client.on("error", function(err)
	{
         console.log("ConnectError: " + err);
		 return;
    });
 
    client.on("connect", function()
    {
	     //console.log("connect success");
		 client.zscore(keyname,function(err, reply) {
			 // 返回之前关闭链接
            client.quit();
             callback(err,reply);
         });
		 
	});
};
//得到所有的key
redisdata.keys = function(keyname,callback){
	var client = redis.createClient(6379, "127.0.0.1");
	client.on("error", function(err)
	{
         console.log("ConnectError: " + err);
		 return;
    });
 
    client.on("connect", function(){
		 client.keys(keyname,function(err,reply){
			client.quit(); 
			callback(err, reply);
		 });
		 
	});
};
//设置过期时间用于更新操作
redisdata.expire = function(keyname,callback){
	var client = redis.createClient(6379, "127.0.0.1");
	client.on("error", function(err)
	{
         console.log("ConnectError: " + err);
		 return;
    });
 
    client.on("connect", function(){
		 client.expire(keyname,function(err,reply){
			client.quit(); 
			callback(err, reply);
		 });
		 
	});
};
//查看是否存在
 redisdata.exits= function(keyname,callback){
	var client = redis.createClient(6379, "127.0.0.1");
	client.on("error", function(err)
	{
         console.log("ConnectError: " + err);
		 return;
    });
	
    client.exists(keyname, function(err, reply) {
	// 返回之前关闭链接
    client.quit();
    callback(err, reply);
   });
};
redisdata.exitsnocallback= function(keyname){
	var client = redis.createClient(6379, "127.0.0.1");
	client.on("error", function(err)
	{
         console.log("ConnectError: " + err);
		 return;
    });
	
    return client.exists(keyname, function(err, reply) {
	// 返回之前关闭链接
    client.quit();
   });
};
module.exports = redisdata;