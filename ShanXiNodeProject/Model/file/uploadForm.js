var express = require('express');
var formidable = require("formidable");
var Q = require("q");
var fs = require('fs');
//该程序用于接收上传的图像文件 如果存在该图片就删除 重新加入，然后更新数据库中图片的地址
function  Formatform(req,res)
{   
     var deferred = Q.defer();
	 console.log("进入数据解析阶段");
     var form = new formidable.IncomingForm(); 
     var post = {};
	 var imagepath = "";
	 var idcard ="";
     file = {};
     form.uploadDir = './public/images';  //文件上传 临时文件存放路径 
     form.keepExtensions = true;//保存扩展名
	 form.maxFieldsSize = 20 * 1024 * 1024;//上传文件的最大大小
     form
     .on('error', function(err) {
        console.log(err); //各种错误
		deferred.reject(err);
     })
     //POST 普通数据 不包含文件 field 表单name value 表单value 
     .on('field', function(field, value) {
       console.log("普通数据  "+field+"  "+value);	
        if(field == "userForm_idcard")
		{
		  idcard = 	value;
		}			
        if (form.type == 'multipart') {  //有文件上传时 enctype="multipart/form-data" 
            if (field in post) { //同名表单 checkbox 返回array 同get处理
                if (util.isArray(post[field]) === false) {
                    post[field] = [post[field]];
                }
                post[field].push(value);
                return;
            }
        }
        post[field] = value;
    })
    .on('file', function(field, file) { //上传文件
	    console.log("文件数据 "+JSON.stringify(file));
		var avatarName =file.name;
        var newPath = form.uploadDir + "/"+avatarName;
        imagepath = avatarName;
        console.log("新文件名字 "+newPath);
		if(imagepath != "")
        {     
	        //当文件名为空时  意味着没有更换图片 此时不需要存入文件夹，只有图片更换时才存入文件夹
			fs.renameSync(file.path, newPath);  //重命名
            file[field] = file;
		}
    })
    .on('end', function() {
        console.log("数据解析完毕  "+JSON.stringify(post)); //解析完毕 做其他work
		console.log("上传的图片文件名字 "+imagepath);
		var sendpara = [post,imagepath];
		deferred.resolve(sendpara);
    });
  form.parse(req);
 return deferred.promise;
}
//返回的是post参数和文件路径
module.exports = Formatform;