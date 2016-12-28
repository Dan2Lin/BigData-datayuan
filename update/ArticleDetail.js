var request = require("request");
var cheerio = require("cheerio");
var Common = require("../Common.js");
var loader = require("../../iRobots/loader.js");
var DB = require("../../iRobots/db.js");
var dbUrl = "10.82.0.1";
var dbName = "bigdata";
var dbTable = "datayuan";
var db = new DB(dbUrl,dbName);
var ArticleDetail = {
    getAticleDetail:function(url){
        var $this = this;
        return loader.getDOM(url).then(function($){
           return $this.parseHtml($);
        }).catch(function(e){
            console.log("catch “Ï≥£");
            console.log(e);
        });
    },
    parseHtml:function($){
        var container = $(".wz-div");
        var daodu = container.find(".daodu p").text();
        var content = container.find("#divcontent").html();
        var detail = {
            daodu:daodu,
            content:content
        }
        return detail;
    }
}

module.exports = ArticleDetail;


