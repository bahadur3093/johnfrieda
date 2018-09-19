var common = common || {};
common.page = common.page || {};

/**
 * ページ操作関連ユーティリティ
 */
(function(utils) {
  "use strict";
  
  /**
   * コンテンツパス正規表現パターン。
   * <ul>
   * <li>group(0):コンテンツパス</li>
   * </ul>
   */
  utils.PTN_CONTENT_PATH = /^(?:\/(?:editor\.html|cf#))?(\/content\/wcm_kao\/sites\/[^.]*)(?:\.html?)?$/;
  
  /** ページプロパティノードパス */
  utils.PROPERTY_NODE = "/_jcr_content/";
  
  /** ページプロパティ取得形式 */
  utils.PROPERTY_TYPE = "json";
  
  /** ページプロパティ拡張子 */
  utils.PROPERTY_EXT = "." + utils.PROPERTY_TYPE;
  
  /** ON時の値 */
  utils.ON = "1";
  
  /**
   * カレントページパス取得。<br>
   * カレントページから拡張子を除去したパスを取得します。
   * 
   * @return カレントページパス
   */
  utils.getCurrentPage = function() {
    return location.pathname.replace(utils.PTN_CONTENT_PATH, "$1");
  }
  
  /**
   * コンテンツパスチェック。<br>
   * 指定した値がコンテンツパスとして妥当かチェックします。
   * 
   * @param target チェック対象の値
   * @return コンテンツパスとして妥当な場合はtrue、そうでなければfalse
   */
  utils.isContentPath = function(target) {
    return target && utils.PTN_CONTENT_PATH.test(target);
  }
  
  /**
   * コンテンツパス取得。<br>
   * 指定文字列からコンテンツパス部分のみ取得します。<br>
   * 拡張子や/editor.html、/cf#は除去されます。
   * 
   * @param target 指定文字列
   * @return 指定文字列から抽出したコンテンツパス
   */
  utils.getContentPath = function(target) {
    // コンテンツパスでなければ Null を返却する
    if(!utils.isContentPath(target)) {
      return null;
    }
    
    // コンテンツパス部分を返却する
    return utils.PTN_CONTENT_PATH.exec(target)[1];
  }
  
  /**
   * 親ページパス取得。<br>
   * 指定したページの親ページパスを取得します。
   * 
   * @param page ページパス
   * @return 親ページパス
   */
  utils.getParent = function(page) {
    // 形式が不正な場合は Null を返却する
    if (!utils.isContentPath(page)) {
      return null;
    }
    
    // コンテンツパス部分を抽出する
    var target = utils.getContentPath(page);
    
    // セパレータの最終インデックスを取得する
    var separatorIndex = target.lastIndexOf("/");
    
    // 1つ上のノードパスを返却する
    return (separatorIndex >= 0) ? page.substring(0, separatorIndex) : null;
  }
  
  /**
   * 継承元親ページパス取得。<br>
   * 指定したページの継承元親ページパスを取得します。
   *
   * @param current カレントページパス
   * @param inheritedProperty 継承プロパティ名
   * @return 継承元親ページパス
   */
  utils.getInheritedParent = function(current, inheritedProperty) {
      // コンテンツパスとして妥当でない場合は Null を返却する
      if(!utils.isContentPath(current)) {
        return null;
      }
      
      // コンテンツパス部分のみ抽出する
      current = utils.getContentPath(current);

      // 継承プロパティを取得する
      var inherited = utils.getProperty(current, inheritedProperty);
      
      // 継承がONでなければカレントページを返却、そうでなければ親ページに再帰呼出し
      return inherited != utils.ON ?  
          current : utils.getInheritedParent(utils.getParent(current), inheritedProperty);
  }
  
  /**
   * 継承プロパティ取得。<br>
   * 指定したページの継承プロパティを取得します。
   *
   * @param current カレントページパス
   * @param inheritedProperty 継承プロパティ名
   * @param property 取得プロパティ
   * @return 継承プロパティ
   */
  utils.getInheritedProperty = function(current, inheritedProperty, property) {
    // 継承元ページを取得する
    var page = utils.getInheritedParent(current, inheritedProperty);
    
    // 継承元ページが取得できた場合はそのプロパティを、そうでなければ Null を返却する
    return page != null ? utils.getProperty(page, property) : null;
  }
  
  /**
   * ページプロパティ取得。<br>
   * 指定したページのプロパティを取得します。
   *
   * @param page ページ
   * @param property プロパティ名
   * @return ページプロパティ値
   */
  utils.getProperty = function(page, property) {
    // ページコンテンツパスとして不正、またはプロパティ名が指定されていない場合は Null を返却する
    if(!utils.isContentPath(page) || !property) {
      return null;
    }
    
    var value = null;
    
    // リクエストを実行する
    $.ajax({
      url: utils.getContentPath(page) + utils.PROPERTY_NODE + property + utils.PROPERTY_EXT,
      async : false,
      cache : false,
      type: 'GET',
      dataType: utils.PROPERTY_TYPE,
      success : function(data, dataType) {
        // 末尾のプロパティ名のみ取り出し（スラッシュの除去）
        var name = property.replace(/.*\//g, "");
        // プロパティを取得する 
        value = data[name];
      }
    });
    
    // 取得した値を返却する
    return value;
  }
  
  /**
   * ページプロパティ存在チェック。<br>
   * 指定したページのプロパティが存在するか否かをチェックします。
   *
   * @param page ページ
   * @param property プロパティ名
   * @return ページプロパティ値が存在する場合はtrue、存在しない場合はfalse
   */
  utils.hasProperty = function(page, property) {
    return utils.getProperty(page, property) != null;
  }
  
}(common.page.utils = common.page.utils || {}));

var common = common || {};
common.sns = common.sns || {};

/**
 * SNS キャッシュ利用時の基底 Function
 */
(function(utils) {
  "use strict";

  /** 結果コード */
  const
  RESULT_CODE = {
  SUCCESS : 0,
  FAILUER : 1
  };

  /** ajax通信先のURL */
  utils.URL = null;

  /** キャッシュパスのチェックパターン */
  utils.CACHE_PATTERN = null;

  /**
   * 最新のデータを取得します.
   * 取得されたデータは、第3引数に指定されたコールバック関数に渡されます
   *
   * @param pagePath 現在ページのパス
   * @param cachePath キャッシュパス
   * @param callback 引数がJSONデータのコールバック関数
   */
  utils.getLatestData = function(pagePath, cachePath, callback) {
    
    // TODO 暫定対処：引数のページパスをコンテンツパスで上書きする
    pagePath = $("body").data("contentPath");
    
    // キャッシュパスのチェックパターンを取得
    var cachePattern = this.CACHE_PATTERN;

    // 引数をチェック
    if ($.isFunction(callback)) {
      if (isPath(pagePath)) {
        console.log("args::OK, cachePattern::" + cachePattern); // for debug

        // AJAX通信を実施
        $.ajax({
        type : "GET",
        dataType : "json",
        url : this.URL,
        data : {
        "pagePath" : pagePath,
        "cache" : cachePath
        }
        }).done(function(json) {
          console.log("ajax::OK => " + json); // for debug
          if (!isEmpty(json)) {
            // 結果コードを判定
            var resultCode = json.result;
            if (RESULT_CODE.SUCCESS == resultCode) {
              callback(json.data);
            } else {
              excuteCallback(cachePattern, cachePath, callback);
            }
          } else {
            // データが取れていない場合は、キャッシュを取得
            excuteCallback(cachePattern, cachePath, callback);
          }
        }).fail(function(json) {
          console.log("ajax::NG => " + json); // for debug
          excuteCallback(cachePattern, cachePath, callback);
        });

      } else {
        // 現在のページパスがない
        console.log("args::NG => excute callback with cache."); // for debug
        excuteCallback(cachePattern, cachePath, callback);
      }
    } else {
      console.log("args::NG => callback is not function."); // for debug
    }
  };

  /**
   * オブジェクトが空かどうかを判定します
   *
   * @param obj オブジェクト
   * @return オブジェクトが空(nullを含む)である場合 true, それ以外は false
   */
  function isEmpty(obj) {
    if (obj == null) {
      console.log("Object is null."); // for debug
      return true;
    }
    if ($.isEmptyObject(obj)) {
      console.log("Object is empty."); // for debug
      return true;
    }
    return false;
  }

  /**
   * パスの妥当性を判定します
   *
   * @param path URLを表す文字列
   * @return 妥当である場合 true, それ以外は false
   */
  function isPath(path) {
    console.log("Path::" + path); // for debug
    if (isEmpty(path)) {
      return false;
    }
    if (!path
        .match(/(https?:\/\/[^/]+)?(\/(content|apps|etc)\/.*\/[^.]+)(\\.(\\w+))?/)) {
      console.log("Invalid path."); // for debug
      return false;
    }
    return true;
  }

  /**
   * キャッシュを取得し、コールバックを実行します
   *
   * @param cachePath キャッシュパス
   * @param callback 引数がJSONデータのコールバック関数
   */
  function excuteCallback(cachePattern, cachePath, callback) {
    console.log("cachePath::" + cachePath); // for debug
    if (isPath(cachePath) && cachePath.match(cachePattern)) {
      $.getJSON(cachePath, function(data) {
        callback(data);
      }).fail(function(jqxhr, textStatus, error) {
        console.log("Couldn't get cache. => " + textStatus + ":" + jqxhr.status + ":" + error);
        callback($.parseJSON("{}"));
      });
    } else {
      console.log("cachePath is not json."); // for debug
      callback($.parseJSON("{}"));
    }
  }
  
  utils.isAnyEmpty = function(array) {
    var flg = false;
    $.each(array, function(index, value){
      if(!value || value == "") {
        flg = true;
        return;
      }
    });
    
    return flg;
  }
  
}(common.sns.utils = common.sns.utils || {}));

common.instagram = common.instagram || {};

/**
 * Instagram用
 */
(function(utils) {

  /** ajax通信先のURL */
  utils.URL = location.protocol + "//" + location.host + "/bin/wcm_kao/instagram/update";
  
  /** 必須項目名 */
  utils.REQUIRED = ["apiKey", "apiSecret"];

  /** キャッシュパスのチェックパターン */
  utils.CACHE_PATTERN = /(\/etc\/designs\/.*)\/cache\/(instagram_(.+)\.json)/;
}(common.instagram.utils = $.extend(common.instagram.utils, common.sns.utils) || {}));

common.twitter = common.twitter || {};

/**
 * Twitter用
 */
(function(utils) {

  /** ajax通信先のURL */
  utils.URL = location.protocol + "//" + location.host + "/bin/wcm_kao/twitter/update";
  
  /** 必須項目名 */
  utils.REQUIRED = ["accessToken"];

  /** キャッシュパスのチェックパターン */
  utils.CACHE_PATTERN = /(\/etc\/designs\/.*)\/cache\/(twitter_(.+)\.json)/;

}(common.twitter.utils = $.extend(common.twitter.utils, common.sns.utils) || {}));

common.facebook = common.facebook || {};

/**
 * Facebook用
 */
(function(utils) {

  /** ajax通信先のURL */
  utils.URL = location.protocol + "//" + location.host + "/bin/wcm_kao/facebook/update";
  
  /** 必須項目名 */
  utils.REQUIRED = ["facebookpageId"];

  /** キャッシュパスのチェックパターン */
  utils.CACHE_PATTERN = /(\/etc\/designs\/.*)\/cache\/(facebook_(.+)\.json)/;

}(common.facebook.utils = $.extend(common.facebook.utils, common.sns.utils) || {}));

var common = common || {};
common.media = common.media || {};

/**
 * オーサリング画面関連ユーティリティ。
 * 
 * @param document ドキュメント
 * @param $ jQueryオブジェクト
 * @param ns ネームスペース
 * @param media メディアユーティリティオブジェクト
 */
(function(document, media) {
  "use strict";
  
  /**
   * DynamieMedia画像リフレッシュ。<br>
   * DynamicMedia画像のリフレッシュを実行する。<br>
   * 画像の差替え時などに呼び出すこと。
   */
  media.refreshImage = function() {
    $(document).ready(function() {
      // 公開モードの各DynamicMedia画像をリフレッシュする
      $(".s7responsiveContainer img").each(function(index) {
        s7responsiveImage(this);
      });
      
      // オーサリング中の各DynamicMedia画像をリフレッシュする
      $('iframe').contents().find(".s7responsiveContainer img").each(function(index) {
        s7responsiveImage(this);
      });
    });
  }
})(document, common.media);

