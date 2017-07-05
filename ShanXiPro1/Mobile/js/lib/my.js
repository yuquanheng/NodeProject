$(document).ready(function() {
		         //
				   $("#come").css("display","none");
				   $("#collapseExample").empty();
				   $("#close").on('click',function (event) {

                       $("#come").css("display","none");
				       $("#collapseExample").empty();

				    });
				   
				   $("#comein").on('click',function (event) {	 
					 
					 var dis = $("#come").css("display");
					 if(dis =="none")
					 {
					    $("#come").css("display","block");
					 }
                     
                     $("#oper").text("上工");
					 $("#collapseExample").empty();
                     $.get("http://127.0.0.1:3000/dianming?time="+new Date().getTime(),function(data,status){

                        $("#collapseExample").append(getMin("1",data));

                     },"json");
 
				   });
				   $("#comeout").on('click',function (event) {	 
					 var dis = $("#come").css("display");
					 if(dis =="none")
					 {
					    $("#come").css("display","block");
					 }
					 $("#oper").text("下工");
					 $("#collapseExample").empty();
					  $.get("http://127.0.0.1:3000/dianming?time="+new Date().getTime(),function(data,status){

                        $("#collapseExample").append(getMin("1",data));

                     },"json");
				   });
				   $("#comeday").on('click',function (event) {	 
					 var dis = $("#come").css("display");
					 if(dis =="none")
					 {
					    $("#come").css("display","block");
					 }
					 $("#oper").text("请假");
					 $("#collapseExample").empty();
					 $("#collapseExample").append(getMin("getday",""));
					 console.log("请假属性 "+dis);
				   });
				   $("#comego").on('click',function (event) {	 
					 var dis = $("#come").css("display");
					 if(dis =="none")
					 {
					    $("#come").css("display","block");
					 }
					 $("#oper").text("外出");
					 $("#collapseExample").empty();
					 $("#collapseExample").append(getMin("getout",""));
					 console.log("外出属性 "+dis);
				   });

			 });
			  
			 function  getMin(type,data){
			     var should ="";
			     var real ="";
			     var getday1 ="";
			     var getout ="";
				 var mingzi;
				 
			      if(type == "1")
				  { 
				  	  var shouldnum = data["should"];
				  	  var realnum = data["real"];
				  	  var getdaynum = data["getday"];
				  	  var getoutnum = data["getout"];
				  	  var waring = data["warning"];
				  	  if(waring)
				  	  {
                           $("#waringnum").text(waring.length);
                           for(var j=0;j<waring.length;j++){
                             
                             $("#waringitem").append('<a class="dropdown-item" >'+waring[j]+'</a>');
                            
                           }
				  	  }
					  should = getHeader("应到人数","should12",shouldnum.length)+getbody("should12",shouldnum);
					  real = getHeader("实到人数","real",realnum.length)+getbody("real",realnum);
					  getday1 = getHeader("请假人数","getday",getdaynum.length)+getbody("getday",getdaynum);
					  getout = getHeader("外出人数","getout",getoutnum.length)+getbody("getout",getoutnum);
					  return should+real+getday1+getout;
				  }
				 else
				 {
				     return GetEdit(type);
				 }
			 
			 }
			 function GetEdit(type){
			 
			var ht = '<div class="form-group row">'+
				'<div class="col-sm-12">'+
				'<div class="input-group">'+
				'<input id="name" name="input2-group2" class="form-control" >'+
				'<span class="input-group-btn">'+
				'<button type="button" class="btn btn-primary">姓名</button>'+
				'</span>'+
				'</div>'+
				'</div>'+
			    '</div>'+
			    '<div class="form-group row">'+
				'<div class="col-sm-12">'+
				'<div class="input-group">'+
				'<input id="address" name="input2-group2"  class="form-control" >'+
				'<span class="input-group-btn">'+
				'<button type="button" class="btn btn-primary">监区</button>'+
				'</span>'+
			    '</div>'+
				'</div>'+
			    '</div>'+
				'<div class="row">'+
				'<button type="button" id="shut" onClick="shut('+type+')" style="margin-right:3px;margin-top:5px" class="btn btn-primary pull-right">关闭'+
				'</button>'+
				'<button type="button" id="del" onClick="del('+type+')" style="margin-right:3px;margin-top:5px" class="btn btn-primary pull-right">删除'+
				'</button>'+
				'<button type="button" id="sub" onClick="sub('+type+')" style="margin-right:3px;margin-top:5px" class="btn btn-primary pull-right">提交'+
				'</button>'+
				'</div>'
				
			 return ht;
			 }
			
			 function getHeader(type,id,sum){
			 
			   var modelheader = '<div class="input-group input-group-sm">'+
							   '<span class="input-group-addon" data-toggle="collapse" data-parent="#accordion" href="#'+id+'">'+type+'</span>'+
							   '<input type="text" value="'+sum+'" disabled="disabled" class="form-control" id = "should">'+
							   '</div>'
			   return modelheader;
			 }
			 
			 function getbody(type,data){
			 
			    var modelbody   =  '<div class="row center" style="margin-top:10px;">'+
								'<div id="'+type+'" class="panel-collapse collapse container" style="margin-bottom:10px;margin-top:10px;">'+
								'<div style="height:100px;overflow-y:auto">'+
								'<table class="table table-striped">'+
								'<thead>'+
								'<tr>'+
								'<th>监区</th>'+
								'<th></th>'+
								'<th>姓名</th>'+
								'</tr>'+
								'</thead>'+		
								'<tbody  id="tbody">'+
							      getAllItems(data)+ 
								'</tbody>'+
								'</table>'+
								'</div>'+
								'</div>'+
								'</div>'	
			 
			    return modelbody;
			 }

			function getAllItems(data){
              
              var datalength = data.length;
              var allhtml = "";
              for(var i=0;i<datalength;i++)
              {
                 var item = data[i];
                 allhtml = allhtml+'<tr>'+
						  '<td>'+item["name"]+'</td>'+
						  '<td></td>'+
						  '<td>'+item["address"]+'</td>'+
						  '</tr>';

              }
             
             return allhtml;
		    }
		   function shut(type){
      
           $("#come").css("display","none");
		   $("#collapseExample").empty();
           
		   }
		   function del(type){
            

             if($("#name").val())
             {
                 postajax("Prisondel",{"ty":type,"name":$("#name").val(),"address":$("#address").val()});
             }
            else
             {
                alert("清除数据为空，请确认数据"+$(this).attr("id"));
             }
		 	
		 }	
		 function sub(type){
           
            if($("#name").val())
             {
                 postajax("Prisonadd",{"ty":type,"name":$("#name").val(),"address":$("#address").val()});
             }
            else
             {
                alert("提交数据为空，请确认数据");
             }
		 }
		 function postajax(type,data){

           $.get("http://127.0.0.1:3000/dianming/"+type+"?time="+new Date().getTime(),data,function(data,status){

                 if(data)
                 {
                 	alert("成功");
                 }

           });
     

		 }						