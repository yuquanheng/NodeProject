var express = require('express');
var formidable = require("formidable");
var Q = require("q");
var fs = require('fs');
function  Formatform(req,res)
{   
     var deferred = Q.defer();
	 console.log("�������ݽ����׶�");
     var form = new formidable.IncomingForm(); 
     var post = {};
	 var imagepath = "";
	 var idcard ="";
     file = {};
     form.uploadDir = './public/images';  //�ļ��ϴ� ��ʱ�ļ����·�� 
     form.keepExtensions = true;//������չ��
	 form.maxFieldsSize = 20 * 1024 * 1024;//�ϴ��ļ�������С
     form
     .on('error', function(err) {
        console.log(err); //���ִ���
		deferred.reject(err);
     })
     //POST ��ͨ���� �������ļ� field ��name value ��value 
     .on('field', function(field, value) {
       console.log("��ͨ����  "+field+"  "+value);	
        if(field == "userForm_idcard")
		{
		  idcard = 	value;
		}			
        if (form.type == 'multipart') {  //���ļ��ϴ�ʱ enctype="multipart/form-data" 
            if (field in post) { //ͬ���� checkbox ����array ͬget����
                if (util.isArray(post[field]) === false) {
                    post[field] = [post[field]];
                }
                post[field].push(value);
                return;
            }
        }
        post[field] = value;
    })
    .on('file', function(field, file) { //�ϴ��ļ�
	    console.log("�ļ����� "+JSON.stringify(file));
        //Ҫ�����û����ݳ�ʼ�������ͼƬ���ڣ�������ھ�ɾ����һ�߸��ǣ�1.png��1.JPEG��
		console.log("���ͬ��ͼƬ�Ƿ���� "+post.userForm_idcard );
		var avatarName =file.name;
		//var point = avatarName.indexOf('.');
		//var exte = avatarName.substring(point);
		//console.log("�õ���׺��  "+exte);
        var newPath = form.uploadDir + "/"+avatarName;
        imagepath = avatarName;


        console.log("���ļ����� "+newPath);
		if(imagepath != "")
        {     
	        //���ļ���Ϊ��ʱ  ��ζ��û�и���ͼƬ ��ʱ����Ҫ�����ļ��У�ֻ��ͼƬ����ʱ�Ŵ����ļ���
			fs.renameSync(file.path, newPath);  //������
            file[field] = file;
		}
    })
    .on('end', function() {
        console.log("���ݽ������  "+JSON.stringify(post)); //������� ������work
		console.log("�ϴ���ͼƬ�ļ����� "+imagepath);
		var sendpara = [post,imagepath];
		deferred.resolve(sendpara);
		
		console.log("��ʼ��������ѡ�����");
    });
  form.parse(req);
 return deferred.promise;
}
//���ص���post�������ļ�·��
module.exports = Formatform;