"use strict";(function(window,jfAPI){var cookieBarApi=cookieBarApi||{};var COOKIE_NAME="jf_bar";var COUNTRY_CODE_REGAX="^[a-z]+$";var URL_REGAX="https?:\/\/(?:.*\/)?(?:www[-.]johnfrieda[-.]com)\/([a-zA-Z]{2})[\/-]([a-zA-Z]{2})(.*)";var URL_WK_REGAX="https?:\/\/(?:.*\/)?(?:www[-.]johnfrieda[-.]com)\/(.*)";var FIRST_DEPTH=1;var SECOND_DEPTH=2;var REMAIN_URL_DEPTH=3;var REMAIN_URL_WK_DEPTH=1;var COOKIE_PAGE_SELECTOR=".js-jf_cookie_bar--accept";var COOKIE_PAGE_SELECTOR_CONTI=".js-jf_cookie_bar--continue";$(document).ready(function(){cookieBarApi.displayBar();});cookieBarApi.displayBar=function(){var splitUrl=cookieBarApi.splitUrl();var cookieName=cookieBarApi.getCookieName(splitUrl.country,splitUrl.language);if(!cookieBarApi.existCookie(cookieName)){cookieBarApi.callOverLay();}$(COOKIE_PAGE_SELECTOR+","+COOKIE_PAGE_SELECTOR_CONTI).on("click",function(){cookieBarApi.createCookie(cookieName);});}
cookieBarApi.existCookie=function(cookieName){var cookies=document.cookie;var cookieItem=cookies.split(";");for(var i=0;i<cookieItem.length;i++){var elem=cookieItem[i].split("=");if(elem[0].trim()==cookieName){return true;}}return false;}
cookieBarApi.createCookie=function(cookieName){var expireTime=new Date();expireTime.setTime(expireTime.getTime()+1000*3600*24);document.cookie=cookieName+"=true; path=/; max-age=86400; expires="+expireTime.toUTCString();}
cookieBarApi.getCookieName=function(country,language){return country+"_"+language+"_"+COOKIE_NAME;}
cookieBarApi.splitUrl=function(){var splitCountry="";var splitLanguage="";var splitRemain="";var urlRegax=new RegExp(URL_REGAX);var urlWkRegax=new RegExp(URL_WK_REGAX);var countryCodeRegax=new RegExp(COUNTRY_CODE_REGAX);var pageUrl=window.location.href;var urls=pageUrl.match(urlRegax);if(urls){splitLanguage=(countryCodeRegax.test(urls[SECOND_DEPTH]))?urls[SECOND_DEPTH]:urls[FIRST_DEPTH];splitCountry=(countryCodeRegax.test(urls[SECOND_DEPTH]))?urls[FIRST_DEPTH]:urls[SECOND_DEPTH].toLowerCase();splitRemain=urls[REMAIN_URL_DEPTH];}else{var urlsWk=pageUrl.match(urlWkRegax);splitRemain=(urlsWk==null)?"":urlsWk[REMAIN_URL_WK_DEPTH];}return{country:splitCountry,language:splitLanguage,remain:splitRemain};}
cookieBarApi.callOverLay=function(){if($.isFunction(jfAPI.showCookieOverlay())){jfAPI.showCookieOverlay();}}})(window,window.jfAPI||(window.jfAPI={}));