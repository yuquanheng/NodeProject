var ostable; 
var selectAllcheck=[];
var deleteGroup =[];
var postnewitem = [];
var lastfid="";
var isnewbutton="";
var isdeletebutton="";
var ispost = "";
$(document).ready(function(){ 
	var area123 = window.localStorage.getItem("OperPerson");
    var jsss = JSON.parse(area123);
    var areaid123 = jsss.areaid;
    selectAllcheck=[];
	postnewitem = [];
    $("#allcheck").bootstrapSwitch('destroy');
	$('#allcheck').removeAttr("checked"); 
	updatefor();
	
$("#areainput").change(function(){
  var selecteid = $(this).val();
  console.log("选中区域 "+selecteid);
  
 });
//
 $("#xunjiantable").dataTable().fnDestroy();
var ostable =$('#xunjiantable').dataTable( {
	        "oLanguage": {
            "sProcessing": "正在加载中...",
			"sLengthMenu": "每页显示_MENU_条数据 ",
			"sZeroRecords": "没有您要搜索的内容",
			"sInfo": "从_START_ 到 _END_ 条记录——总记录数为 _TOTAL_ 条",
			"sInfoEmpty": "记录数为0",
			"sInfoFiltered": "(全部记录数 _MAX_ 条)",
			"sInfoPostFix": "",
			"sSearch": "全局搜索",
			"sUrl": "",
			"oPaginate": {
			"sFirst":  "第一页",
			"sPrevious": " 上一页 ",
			"sNext":   " 下一页 ",
			"sLast":   " 最后一页 "
			}
         },
		"iCookieDuration":7200,
		"bAutoWidth": true,
		"bStateSave": false,
		"sScrollX": "100%",
		"sScrollXInner": "100%",
	    "bPaginate" : true,
		"bLengthChange" : false,// 每行显示记录数
		"iDisplayLength" : 100, //默认显示的记录数
        "bFilter": true,		
        "bSort" : false,// 排序  
		"bProcessing": false,
		"bServerSide": true,
		"sPaginationType": "full_numbers",
		"fnServerParams": function ( aoData ) {
                    aoData.push( 
                    		  { "name": "state", "value":$("#stateinput").val()},
                    		  { "name": "name", "value":$("#nameinput").val()},
                    		  { "name": "bgtime", "value":$("#LAY_demorange_s").val()},
                    		  { "name": "edtime", "value":$("#LAY_demorange_e").val()},
                    		  { "name": "area", "value":areaid123}
                    		);
                  },
		"sAjaxSource": "http://127.0.0.1:3000/dianming/event/query",
		"aoColumns": [//要传到后台所寻找的数据，由后台接受并处理
		   
			{
     		 "sName": "area",
			 "sClass": "textnumber"
			 
			},
			{
     		 "sName": "name",
			 "sClass": "textnumber"
			},
			{
     		 "sName": "prisoncard",
			 "sClass": "textnumber",
			 "sDefaultContent":""
			},
			{
     		 "sName": "prisonarea",
			 "sClass": "textnumber",
			 "sDefaultContent":""
			},
			{
     		 "sName": "prisontoarea",
			 "sClass": "textnumber",
			 "sDefaultContent":""
			},
		    {
     		 "sName": "prison43",
			 "sClass": "textnumber",
			 "sDefaultContent":""
			},
			{
     		 "sName": "prison4",
			 "sClass": "textnumber",
			 "sDefaultContent":""
			}

        ],
		"fnDrawCallback":function(obj){
		    $("#xunjiantable_filter").css('display','none');  
		    //$('#allcheck').removeAttr("checked");
            isnewbutton="";
			isdeletebutton="";			
			//做一些统计的工作JSON.parse
			//var egroup = JSON.parse(obj.jqXHR.responseText).aaData;
			//console.log("shuju  "+egroup);
			/*if(egroup == "")
			{
				console.log("查询数据为空 fid设为空");
				lastfid = "";
			}*/
	   },
	   "fnRowCallback": function( nRow, aData, iDisplayIndex ) {
			 //$('td:eq(0)', nRow).html( '<input type=\"checkbox\" name=\"item\"/>');
			 $('td:eq(6)',nRow).html("<button class=\"btn btn-primary\" style=\"width:100px\" id=\"edit\">更改</button>");
			return nRow;
		}
	});
//
//单击按钮 完成修改,删除操作
$('#xunjiantable tbody ').on('click', 'button',function (event) 
{
	
   event.stopPropagation();
   var nTr = this.parentNode.parentNode;
   var aData = ostable.fnGetData(nTr);
   var buttontype = $(this).text();
   var buttonID = $(this).attr('id');
   if(buttonID == "delete")
   {
	   console.log("单击删除按钮 "+aData[2]);
	   
	   selectAllcheck.push(aData[2]);
	   $('#deletebutton').click();
   }
   if(buttonID == "edit")
   {
      
     var user = {'name':aData[0],'card':aData[2]};
     window.localStorage.removeItem("EventPerson");
   	 window.localStorage.setItem("EventPerson",JSON.stringify(user));
     window.location.href = "postNewEvent.html";
     
   }
});
//时间选择器
layui.use('laydate', function(){
	var laydate = layui.laydate;
    var start = {
    istoday: false
    ,choose: function(datas){
      end.min = datas; //开始日选好后，重置结束日的最小日期
      end.start = datas //将结束日的初始值设定为开始日
    }
}; 
var end = {
    istoday: false
    ,choose: function(datas){
      start.max = datas; //结束日选好后，重置开始日的最大日期
    }
};
document.getElementById('LAY_demorange_s').onclick = function(){
    start.elem = this;
    laydate(start);
}
document.getElementById('LAY_demorange_e').onclick = function(){
    end.elem = this
    laydate(end);
  }
});
//双击按钮完成选定操作 重复单击取消
$('#xunjiantable tbody ').on('click', 'input[name="item"]',function (event) 
 {
   //event.preventDefault();
   event.stopPropagation();
   var nTr = this.parentNode.parentNode;
   var aData = ostable.fnGetData(nTr);
   if($(this).is(':checked')) 
   {
	
    console.log("选中 "+aData[2]);
	selectAllcheck.push(aData[2]);
	console.log("选中成功 "+gettrueselect(selectAllcheck));
   }
   else
   {
	console.log("取消选中 "+aData[2]);
    var selectlength = selectAllcheck.length;
	for(var j=0;j<selectlength;j++)
	{
		if(aData[2] == selectAllcheck[j])
		{
			selectAllcheck[j] = "";
			console.log("取消选中成功 ");
			console.log("取消选中成功  "+gettrueselect(selectAllcheck));
			break;
		}
	}	
   }
});
//新增批量选中
function gettrueselect(data){
	
	var uniarr= [];
	for(var i=0;i<data.length;i++)
	{
		if(data[i])
		{
			uniarr.push(data[i]);
		}
	}
	return uniarr;
}
//全选
function selectAll(){
	$('#xunjiantable tbody input[name="item"]').each(function(){ 
	   
	    if(!$(this).is(':checked')){
		  $(this).click();	
		}
        
	});
}
//全不选
function cancleAll(){
	$('#xunjiantable tbody input[name="item"]').each(function(){ 
		 if($(this).is(':checked')){
		  $(this).click();	
		} 
	});
}
$('#allcheck').on('click',function(event){
	
	if($(this).is(':checked')) {
    console.log("全选中 ");
	selectAll();
    }
    else
    {
	 console.log("全取消");   
     cancleAll();
    }
	
});
$("#addperson").click(function(){

     window.localStorage.removeItem("EventPerson");
	 window.location.href = "postNewEvent.html";
});
//删除操作
$('#deletebutton').on('click',function(){
	$.ajax({  
           async: false,
           type : "post",  //提交方式  
           url  : "http://127.0.0.1:3000/dianming/prison/delete?time="+new Date().getTime(),//路径
           data :{'deletegroup':JSON.stringify(selectAllcheck)},	   
           success : function(result) {//返回数据根据结果进行相应的处理  
		      if(result)
			  {
				  console.log("删除成功 "+result[0]);
				  selectAllcheck=[];
				  if(result[0] == "yes")
				  {
					  //删除成功之后 触发更新按钮
					  isdeletebutton = "1";
					  updatefor();
				      ostable.fnFilter();
				  }
			  }
            }
          });
	
});
//更新操作
function updatefor(){
	      
		  
		  $.ajax({  
           async: false,
           type : "GET",  //提交方式  
           url : "http://127.0.0.1:3000/dianming/prison/all?time="+new Date().getTime(),//路径 
           success : function(result) {//返回数据根据结果进行相应的处理  
              var datalength = result.length;
			  	$("#wandaiinput").selectpicker({noneSelectedText:'请选择'});
				$('#nameinput').selectpicker({noneSelectedText:'请选择'});	
				$('#wandaiinput').empty();
				$('#nameinput').empty();
				$('#wandaiinput').append("<option value=''>   </option>");
			    $('#nameinput').append("<option value=''>   </option>");
               for(var i=0;i<datalength;i++)
               {  
                 $('#wandaiinput').append("<option value='"+result[i]['wandaiid'] + "'>"+result[i]['wandaiid']+"</option>");
			     $('#nameinput').append("<option value='"+result[i]['wandaiid'] + "'>"+result[i]['name']+"</option>");
               }
			   $("#wandaiinput").selectpicker('refresh');
			   $("#nameinput").selectpicker('refresh');
			  
             }
            });	
}

//点击搜索按钮进行搜索
$("#searchbutton").click( function () {
     console.log("请求数据");
	
     ostable.fnFilter();
});

//点击搜索按钮进行搜索
$("#searchbutton").click( function () {
     ostable.fnFilter();
});

});