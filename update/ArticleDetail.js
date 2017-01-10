var request = require("request");
var cheerio = require("cheerio");
var Common = require("../Common.js");
var loader = require("../iRobots/loader.js");
var ArticleDetail = {
    getAticleDetail:function(url){
        var $this = this;
        return loader.getDOM(url).then(function($){
            return $this.parseHtml($);
        }).catch(function(e){
            console.log("catch 异常");
            console.log(e);
        });
    },
    parseHtml:function($){
        var container = $(".wz-div");
        var daodu = container.find(".daodu p").text();
        var html = container.find("#divcontent").html();
        var content = container.find("#divcontent").text();
        var detail = {
            daodu:daodu,
            html:html,
            content:content
        }
        return detail;
    }
}
module.exports = ArticleDetail;


