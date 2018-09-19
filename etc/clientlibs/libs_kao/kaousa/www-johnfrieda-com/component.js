"use strict";
(function(window, jfAPI) {
  var cookieBarApi = cookieBarApi || {};

  // KMSCookie名
  var COOKIE_NAME = "jf_bar";
  // 国コード判定用正規表現
  var COUNTRY_CODE_REGAX = "^[a-z]+$";
  // URL分解用正規表現
  var URL_REGAX = "https?:\/\/(?:.*\/)?(?:www[-.]johnfrieda[-.]com)\/([a-zA-Z]{2})[\/-]([a-zA-Z]{2})(.*)";
  // URL分解用正規表現(作業用URLの場合)
  var URL_WK_REGAX = "https?:\/\/(?:.*\/)?(?:www[-.]johnfrieda[-.]com)\/(.*)";
  // 第一グループ
  var FIRST_DEPTH = 1;
  // 第二グループ
  var SECOND_DEPTH = 2;
  // 国、言語コード以降の階層
  var REMAIN_URL_DEPTH = 3;
  // ドメインノード以降の階層(作業用URLの場合)
  var REMAIN_URL_WK_DEPTH = 1;
  // クッキーページボタンセレクタ
  var COOKIE_PAGE_SELECTOR = ".js-jf_cookie_bar--accept";
  var COOKIE_PAGE_SELECTOR_CONTI = ".js-jf_cookie_bar--continue";

  // HTMLが全てロードされてから、処理を実行
  $(document).ready(function() {
    cookieBarApi.displayBar();
  });

  /**
   * クッキーバー表示Function。
   */
  cookieBarApi.displayBar = function() {
    // URLを分割する
    var splitUrl = cookieBarApi.splitUrl();

    // クッキー名を生成
    var cookieName = cookieBarApi
        .getCookieName(splitUrl.country, splitUrl.language);

    // ページ遷移時、CookieBarで作成したクッキーが存在しない場合は
    // オーバーレイ用メソッドをコール
    if (!cookieBarApi.existCookie(cookieName)) {
      cookieBarApi.callOverLay();
    }

    // ボタンで「Accept」が押下された場合
    $(COOKIE_PAGE_SELECTOR+","+COOKIE_PAGE_SELECTOR_CONTI).on("click", function() {
      // クッキーを生成する
      cookieBarApi.createCookie(cookieName);
    });
  }

  /**
   * クッキー存在チェックFunction。
   * CookieBarで作成したクッキーが存在するか否かを返却する。
   * @param cookieName クッキー名
   * @return 該当する名称のクッキーが存在する場合はtrue、そうでなければfalse
   */
  cookieBarApi.existCookie = function(cookieName) {

    // クッキーを取得
    var cookies = document.cookie;
    // クッキーを連結文字列ごとに分割する
    var cookieItem = cookies.split(";");

    for (var i = 0; i < cookieItem.length; i++) {
      var elem = cookieItem[i].split("=");

      if (elem[0].trim() == cookieName) {
        // CookieBarで作成したクッキーが存在する場合は、trueを返却する
        return true;
      }
    }

    // クッキー存在チェックフラグを返却
    return false;
  }

  /**
   * クッキー生成Function。
   * @param cookieName クッキー名
   */
  cookieBarApi.createCookie = function(cookieName) {
    //現在の日付を取得
    var expireTime = new Date();
    //有効期限を24時間後にセット
    expireTime.setTime( expireTime.getTime() + 1000 * 3600 * 24 );
    // クッキーを生成
    document.cookie = cookieName + "=true; path=/; max-age=86400; expires=" + expireTime.toUTCString();
  }

  /**
   * クッキー名返却Function。
   * @param country 国コード
   * @param language 言語コード
   * @return クッキー名
   */
  cookieBarApi.getCookieName = function(country, language) {
    // クッキー名を返却
    // (国コード)_(言語コード)_jf_bar
    return country + "_" + language + "_" + COOKIE_NAME;
  }

  /**
   * URL分割Function。
   * @return URL分割情報
   */
  cookieBarApi.splitUrl = function() {

    // 分割後の値保存用変数
    var splitCountry = "";
    var splitLanguage = "";
    var splitRemain = "";

    // URL分割正規表現
    var urlRegax = new RegExp(URL_REGAX);
    // URL分割正規表現(本番環境とノード構成が異なる場合)
    var urlWkRegax = new RegExp(URL_WK_REGAX);
    // AEM用URL判定用正規表現
    var countryCodeRegax = new RegExp(COUNTRY_CODE_REGAX);

    // 現在表示しているURLの取得
    var pageUrl = window.location.href;
    var urls = pageUrl.match(urlRegax);

    // AEM上のページか否かを判定する
    // AEM上のページと実ドメインで、国/言語コードの順序が入れ替わるため
    // その考慮を加えて変数にセットする
    if (urls) {
      splitLanguage = (countryCodeRegax.test(urls[SECOND_DEPTH])) ? urls[SECOND_DEPTH] : urls[FIRST_DEPTH];
      splitCountry = (countryCodeRegax.test(urls[SECOND_DEPTH])) ? urls[FIRST_DEPTH] : urls[SECOND_DEPTH]
          .toLowerCase();
      splitRemain = urls[REMAIN_URL_DEPTH];
    } else {
      // 作業用ディレクトリの場合は、ドメイン名以下のパスのみ取得する
      var urlsWk = pageUrl.match(urlWkRegax);
      splitRemain = ( urlsWk == null ) ? "" : urlsWk[REMAIN_URL_WK_DEPTH];
    }

    // 分割した各階層（国コード、言語コード、残りのURL）を変数に格納し、返却する
    // 正規表現にマッチしない場合は、空文字を返却する
    return {
    country : splitCountry,
    language : splitLanguage,
    remain : splitRemain
    };

  }

  /**
   * オーバーレイクラスコールFunction。
   */
  cookieBarApi.callOverLay = function() {

    // クッキーバーオーバーレイメソッドをコール
    // クラスが存在する場合のみ、コールする
    if($.isFunction(jfAPI.showCookieOverlay())){
      jfAPI.showCookieOverlay();
    }
  }

})(window, window.jfAPI || (window.jfAPI = {}));
