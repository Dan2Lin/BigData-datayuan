var request = require("request");
var cheerio = require("cheerio");
var Common = require("../Common.js");
var loader = require("../iRobots/loader.js");
var DB = require("../iRobots/db.js");
var ArticelDetail = require("./ArticleDetail");
var dbUrl = "10.82.0.1";
var dbName = "bigdata";
var dbTable = "datayuan";
var db = new DB(dbUrl,dbName);
var url = "http://www.datayuan.cn/";
var articleList = [];
var UpdateArticle = {
    getUpdateAticleList:function(){
        console.log("enter updateArticleList");
        var $this = this;
        return loader.getDOM(url).then(function($){
            $this.parseHtml($);
        }).catch(function(e){
            console.log(e);
        });
    },
    parseHtml:function($){
        var $this = this;
        var arr = $(".wz-div");
        var now = new Date().getTime();
        var start = now - 172800000;
        arr.each(function(err,res){
            var itemList = [];
            var $me = $(this);
            var $createDate = $me.find(".nametime p span").children("a").text().trim();
            var $createDateMills = Common.formatDate($createDate).getTime();
            if($createDateMills > start){
                var $title = $me.find("h2 a");
                var $source = $me.find(".nametime p").children("a");
                var $abstract = $me.find(".nametime ul>li").find("a");
                var $thumbnail = $me.find(".wz-div-img img");
                var $detailUrl = $me.find(".wz-div-img a");
                var item = {
                    title:$title.text().trim(),
                    author:$source.text(),
                    createDate:$createDate,
                    abstract:Common.getAbstract($abstract,$),
                    thumbnail:"http://www.datayuan.cn"+$thumbnail.attr('src'),
                    url:$detailUrl.attr('href'),
                    isNew:true,
                    loaded:true
                }
                try{
                    if(item.url){
                        var id = Common.getURLNumber(item.url);
                        item.id = id;
                        ArticelDetail.getAticleDetail(item.url).then(function(detail){
                            item.daodu = detail.daodu;
                            item.html = detail.html;
                            item.content = detail.content;
                        }).then(function(){
                            itemList.push(item);
                            $this.writerDB(itemList);
                        });
                    }
                }catch(e){
                    console.log(item);
                    console.log(e)
                }
            }
        });
    },
    writerDB: function(list) {
       return db.open(dbTable).then(function() {
            return db.insertUnique(list, "url");
        }).catch(function(e) {
            console.log(e)
        })
    }
}
UpdateArticle.getUpdateAticleList();
module.exports = UpdateArticle;



