var request = require("request");
var cheerio = require("cheerio");
var Common = require("../Common.js");
var loader = require("../iRobots/loader.js");
var DB = require("../iRobots/db.js");
var dbUrl = "10.82.0.1";
var dbName = "bigdata";
var dbTable = "datayuan";
var db = new DB(dbUrl,dbName);

var ArticleDetail = {
    getAticleDetail:function(url){
        var $this = this;
        return loader.getDOM(url).then(function($){
            $this.parseHtml($,url);
        }).catch(function(e){
            console.log("catch 异常");
            console.log(e);
        });
    },
    parseHtml:function($,url){
        var list = [];
        var container = $(".wz-div");
        var source = container.find(".nametime").find("p>a");
        var createDate = container.find(".nametime p>span");
        var abstract = container.find(".nametime ul>li").find("a");
        var thumbnail = container.find(".wz-div-img").find("img").attr('src');
        var daodu = container.find(".daodu p").text();
        var html = container.find("#divcontent").html();
        var content = container.find("#divcontent").text();
        var detail = {
            id:Common.getURLNumber(url),
            title:Common.checkTitle(container),
            author:source.text().trim(),
            createDate:Common.formatDate(createDate.text()),
            abstract:Common.getAbstract(abstract,$),
            thumbnail:Common.checkThumbnail(thumbnail),
            daodu:daodu,
            html:html,
            content:content,
            url:url,
            isNew:true,
            loaded:true
        }
        list.push(detail);
        //console.log(list.length);
        process.stdout.write("1");
        this.writerDB(list);

    },
    writerDBList:function(){
      var listLen = list.length;
      console.log("list len = "+listLen);
      this.writerDB(list);
    },
    writerDB: function(list) {
        return db.open(dbTable).then(function() {
            return db.insertUnique(list, "url");
        }).catch(function(e) {
            console.log(e)
        })
    }
}
//ArticleDetail.getAticleDetail("http://www.datayuan.cn/article/9581.htm");
module.exports = ArticleDetail;


