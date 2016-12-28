var request = require("request");
var cheerio = require("cheerio");
var Common = require("../Common.js");
var loader = require("../../iRobots/loader.js");
var DB = require("../../iRobots/db.js");
var ArticelDetail = require("./ArticleDetail");
var dbUrl = "10.82.0.1";
var dbName = "bigdata";
var dbTable = "datayuan";
var db = new DB(dbUrl,dbName);
var url = "http://www.datayuan.cn/";
var next_url = "http://www.datayuan.cn/loadFollowUpArticle.htm";

var articleList = [];
var ArticleList = {
    getAticleList:function(){
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
        var tempList = [];
        arr.each(function(err,res){
            var $me = $(this);
            var $title = $me.find("h2 a");
            var $source = $me.find(".nametime p").children("a");
            var $createDate = $me.find(".nametime p span").children("a");
            var $abstract = $me.find(".nametime ul>li").find("a");
            var $thumbnail = $me.find(".wz-div-img img");
            var $detailUrl = $me.find(".wz-div-img a");
            var item = {
                title:$title.text().trim(),
                source:$source.text(),
                createDate:Common.formatDate($createDate.text()),
                abstract:Common.getAbstract($abstract,$),
                thumbnail:"http://www.datayuan.cn"+$thumbnail.attr('src'),
                url:$detailUrl.attr('href'),
                cid:$me.attr('id'),
                loaded:true
            }
            try{
               if(item.url){
                   var id = Common.getURLNumber(item.url);
                    item.id = id;
                   ArticelDetail.getAticleDetail(item.url).then(function(detail){
                       item.daodu = detail.daodu;
                       item.content = detail.content;
                    });
                    articleList.push(item);
                    tempList.push(item);
                }
            }catch(e){
                console.log(item);
                console.log(e)
            }

        });
        if(tempList.length > 99){
            var data = $this.getNextPostData($);
            loader.postDOM(next_url,data).then(function($1){
                $this.parseHtml($1);
            });
        }else{
            console.log("else="+articleList.length);
            //爬取完成，写入数据库
           articleList[0].loaded = false;
           $this.writerDB(articleList);

        }
    },
    getNextPostData:function($){
        var arr = $(".wz-div");
        var $last = $(arr[arr.length-1]);
        var contentId = $last.find("h2 a").attr('href');
        var divLocal = $last.attr("id");
        var category = "article";
        return {
            'contentId':contentId,
            'divLocal':divLocal,
            'category':category
        }
    },
    writerDB: function(list) {
        return db.open(dbTable).then(function() {
            return db.insertUnique(list, "url");
        }).catch(function(e) {
            console.log(e)
        })
    }
}
ArticleList.getAticleList();
module.exports = ArticleList;


