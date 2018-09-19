var common=common||{};common.page=common.page||{};(function(utils){"use strict";utils.PTN_CONTENT_PATH=/^(?:\/(?:editor\.html|cf#))?(\/content\/wcm_kao\/sites\/[^.]*)(?:\.html?)?$/;utils.PROPERTY_NODE="/_jcr_content/";utils.PROPERTY_TYPE="json";utils.PROPERTY_EXT="."+utils.PROPERTY_TYPE;utils.ON="1";utils.getCurrentPage=function(){return location.pathname.replace(utils.PTN_CONTENT_PATH,"$1");}
utils.isContentPath=function(target){return target&&utils.PTN_CONTENT_PATH.test(target);}
utils.getContentPath=function(target){if(!utils.isContentPath(target)){return null;}return utils.PTN_CONTENT_PATH.exec(target)[1];}
utils.getParent=function(page){if(!utils.isContentPath(page)){return null;}var target=utils.getContentPath(page);var separatorIndex=target.lastIndexOf("/");return(separatorIndex>=0)?page.substring(0,separatorIndex):null;}
utils.getInheritedParent=function(current,inheritedProperty){if(!utils.isContentPath(current)){return null;}current=utils.getContentPath(current);var inherited=utils.getProperty(current,inheritedProperty);return inherited!=utils.ON?current:utils.getInheritedParent(utils.getParent(current),inheritedProperty);}
utils.getInheritedProperty=function(current,inheritedProperty,property){var page=utils.getInheritedParent(current,inheritedProperty);return page!=null?utils.getProperty(page,property):null;}
utils.getProperty=function(page,property){if(!utils.isContentPath(page)||!property){return null;}var value=null;$.ajax({url:utils.getContentPath(page)+utils.PROPERTY_NODE+property+utils.PROPERTY_EXT,async:false,cache:false,type:'GET',dataType:utils.PROPERTY_TYPE,success:function(data,dataType){var name=property.replace(/.*\//g,"");value=data[name];}});return value;}
utils.hasProperty=function(page,property){return utils.getProperty(page,property)!=null;}}(common.page.utils=common.page.utils||{}));var common=common||{};common.sns=common.sns||{};(function(utils){"use strict";const
RESULT_CODE={SUCCESS:0,FAILUER:1};utils.URL=null;utils.CACHE_PATTERN=null;utils.getLatestData=function(pagePath,cachePath,callback){pagePath=$("body").data("contentPath");var cachePattern=this.CACHE_PATTERN;if($.isFunction(callback)){if(isPath(pagePath)){console.log("args::OK, cachePattern::"+cachePattern);$.ajax({type:"GET",dataType:"json",url:this.URL,data:{"pagePath":pagePath,"cache":cachePath}}).done(function(json){console.log("ajax::OK => "+json);if(!isEmpty(json)){var resultCode=json.result;if(RESULT_CODE.SUCCESS==resultCode){callback(json.data);}else{excuteCallback(cachePattern,cachePath,callback);}}else{excuteCallback(cachePattern,cachePath,callback);}}).fail(function(json){console.log("ajax::NG => "+json);excuteCallback(cachePattern,cachePath,callback);});}else{console.log("args::NG => excute callback with cache.");excuteCallback(cachePattern,cachePath,callback);}}else{console.log("args::NG => callback is not function.");}};function isEmpty(obj){if(obj==null){console.log("Object is null.");return true;}if($.isEmptyObject(obj)){console.log("Object is empty.");return true;}return false;}function isPath(path){console.log("Path::"+path);if(isEmpty(path)){return false;}if(!path.match(/(https?:\/\/[^/]+)?(\/(content|apps|etc)\/.*\/[^.]+)(\\.(\\w+))?/)){console.log("Invalid path.");return false;}return true;}function excuteCallback(cachePattern,cachePath,callback){console.log("cachePath::"+cachePath);if(isPath(cachePath)&&cachePath.match(cachePattern)){$.getJSON(cachePath,function(data){callback(data);}).fail(function(jqxhr,textStatus,error){console.log("Couldn't get cache. => "+textStatus+":"+jqxhr.status+":"+error);callback($.parseJSON("{}"));});}else{console.log("cachePath is not json.");callback($.parseJSON("{}"));}}utils.isAnyEmpty=function(array){var flg=false;$.each(array,function(index,value){if(!value||value==""){flg=true;return;}});return flg;}}(common.sns.utils=common.sns.utils||{}));common.instagram=common.instagram||{};(function(utils){utils.URL=location.protocol+"//"+location.host+"/bin/wcm_kao/instagram/update";utils.REQUIRED=["apiKey","apiSecret"];utils.CACHE_PATTERN=/(\/etc\/designs\/.*)\/cache\/(instagram_(.+)\.json)/;}(common.instagram.utils=$.extend(common.instagram.utils,common.sns.utils)||{}));common.twitter=common.twitter||{};(function(utils){utils.URL=location.protocol+"//"+location.host+"/bin/wcm_kao/twitter/update";utils.REQUIRED=["accessToken"];utils.CACHE_PATTERN=/(\/etc\/designs\/.*)\/cache\/(twitter_(.+)\.json)/;}(common.twitter.utils=$.extend(common.twitter.utils,common.sns.utils)||{}));common.facebook=common.facebook||{};(function(utils){utils.URL=location.protocol+"//"+location.host+"/bin/wcm_kao/facebook/update";utils.REQUIRED=["facebookpageId"];utils.CACHE_PATTERN=/(\/etc\/designs\/.*)\/cache\/(facebook_(.+)\.json)/;}(common.facebook.utils=$.extend(common.facebook.utils,common.sns.utils)||{}));var common=common||{};common.media=common.media||{};(function(document,media){"use strict";media.refreshImage=function(){$(document).ready(function(){$(".s7responsiveContainer img").each(function(index){s7responsiveImage(this);});$('iframe').contents().find(".s7responsiveContainer img").each(function(index){s7responsiveImage(this);});});}})(document,common.media);