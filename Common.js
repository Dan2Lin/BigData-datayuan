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
    }
}
module.exports = Common;