var request = require("request");
var cheerio = require("cheerio");
var Common = require("../Common.js");
var loader = require("../iRobots/loader.js");
var DB = require("../iRobots/db.js");
var ArticelDetail = require("./ArticleDetail.js");
var dbUrl = "10.82.0.1";
var dbName = "bigdata";
var dbTable = "datayuan";
var db = new DB(dbUrl,dbName);
var url = "http://www.datayuan.cn/";
var next_url = "http://www.datayuan.cn/loadFollowUpArticle.htm";
var articleList = [];

var dyPage = {
    getFirstPage:function(url) {
        var arr = [];
        var $this = this;
        return loader.getDOM(url).then(function ($) {
            $(".wz-div h2 a").each(function (i, item) {
                var href = $(item).attr("href");
                var id = $(item).parents(".wz-div").attr("id");
                var itemJson = {
                    contentId: href,
                    divLocal: id
                }
                arr.push(itemJson);
                articleList.push(itemJson);
            });
            if (arr.length > 99) {
                $this.getNextPostData(arr).then(function(data){
                    $this.getNextPage(next_url,data);
                })
            }

        });
    },
    getNextPage:function(url,option){
        var nextArr = [];
        var $this = this;
       return loader.postDOM(url,option).then(function($) {
           $(".wz-div h2 a").each(function (i, item) {
               var href = $(item).attr("href");
               var id = $(item).parents(".wz-div").attr("id");
               var itemJson = {
                   contentId: href,
                   divLocal: id
               }
               nextArr.push(itemJson);
               articleList.push(itemJson);
           });
           if(nextArr.length > 1){
             $this.getNextPostData(nextArr).then(function(data){
                    $this.getNextPage(next_url,data);
               })
           }else{
               //用递归代替循环每隔2S调用一次详细信息爬取事件
               var i=0;
               function al() {
                   i++;
                   if(i<articleList.length){
                   // if(i<10){
                       setTimeout(function(){
                           ArticelDetail.getAticleDetail(articleList[i].contentId);
                           al();
                       },500);
                   }
               }
               al();
               //ArticleDetail.writerDBList();
           }
       });
    },
    getNextPostData:function(arr){
        var $last = arr[arr.length-1];
        return Promise.resolve({
            'contentId':$last.contentId,
            'divLocal':$last.divLocal,
            'category':"article"
        });
    }
}
dyPage.getFirstPage(url);
module.exports = dyPage;
