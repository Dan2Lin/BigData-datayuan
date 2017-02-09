/**
 * Created by Administrator on 2016/12/21.
 */
var Common = {
    getAbstract:function(arr,$){
        var abstracts = [];
        for(var i = 0;i < arr.length;i++){
            var abstract = $(arr[i]).text();
            abstracts.push(abstract);
        }
        return abstracts;
    },
    getURLNumber:function(url){
        if(url){
            var lIndex = url.lastIndexOf("/");
            var dotIndex = url.lastIndexOf(".");
            return parseInt(url.substring(lIndex+1,dotIndex));
        }
    },
    formatDate:function(str){
        str = str.replace(/-/g,"/");
        return new Date(str);
    },
    checkThumbnail:function(str){
        if(str){
            return "http://www.datayuan.cn"+str;
        }else{
            return "";
        }
    },
    checkTitle:function(container){
        var newTitle = container.find("h2").text();
        var titleStr = container.find("h2").html();
        if(titleStr.length>100){
             var firstIndex = titleStr.indexOf("<div");
             newTitle = titleStr.substr(0,firstIndex);
        }
        return newTitle;
    },
	formatHtml:function(html){
	   var newHtml = html.replace(/src="\/u\/cms/g,'src="http://www.datayuan.cn/u/cms');
	   return newHtml; 
	}
	
}
module.exports = Common;