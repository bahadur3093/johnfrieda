var common = common || {};

(function(page) {
  "use strict";

  /**
   * ブラウザ拡大率取得。<br>
   * ブラウザの拡大率を取得します。
   *
   * @return ブラウザの拡大率
   * @see /etc/dam/viewers/s7viewers/libs/responsive_image.js
   */
  page._updateZoomFactor = function() {
    var orientation = "landscape";
    var zoom = 1;
    if (typeof (window.orientation) != "undefined") {
      orientation = ((screen.width / screen.height) > 1) ? "landscape" : "portrait";
      zoom = document.documentElement.clientWidth / window.innerWidth;
      return {
      zoom : zoom,
      orient : orientation
      };
    } else {
      if (document.documentElement.clientWidth > document.documentElement.clientHeight) {
        orientation = "landscape";
      } else {
        orientation = "portrait";
      }
      return {
      zoom : 1,
      orient : orientation
      };
    }
  };

  /**
   * デバイスピクセル比取得。<br>
   * デバイスピクセル比を取得します。
   *
   * @return デバイスピクセル比
   * @see /etc/dam/viewers/s7viewers/libs/responsive_image.js
   */
  page._getDevPixelRatio = function() {
    var retVal = 1;
    if (window.devicePixelRatio) {
      retVal = window.devicePixelRatio;
    } else if (screen.deviceXDPI) {
      retVal = window.screen.deviceXDPI / window.screen.logicalXDPI;
    } else if ("matchMedia" in window && window.matchMedia) {
      if (window.matchMedia("(min-resolution: 2dppx)").matches || win
          .matchMedia("(min-resolution: 192dpi)").matches) {
        retVal = 2;
      } else if (window.matchMedia("(min-resolution: 1.5dppx)").matches || window
          .matchMedia("(min-resolution: 144dpi)").matches) {
        retVal = 1.5;
      }
    }
    return retVal;
  };

  /** デバイスピクセル比（キャッシュ） */
  page._devPixelRatio = page._getDevPixelRatio();

  /**
   * エリア・画像のサイズ比率取得。<br>
   * エリアとオリジナル画像の幅比、高さ比を取得します。
   *
   * @param areaWidth エリア幅
   * @param areaHeight エリア高さ
   * @param orgWidth オリジナル画像幅
   * @param orgHeight オリジナル画像高さ
   * @return エリア・画像サイズ比率
   */
  page._getAreaImageRatio = function(areaWidth, areaHeight, orgWidth, orgHeight) {
    return {
    "width" : orgWidth / areaWidth,
    "height" : orgHeight / areaHeight
    };
  };

  /**
   * DynamicMediaパラメータ生成（backgroud-size : cover）。<br>
   * background-sizeが「cover」の場合のパラメータを生成します。
   *
   * @param areaWidth エリア幅
   * @param areaHeight エリア高さ
   * @param orgWidth オリジナル画像幅
   * @param orgHeight オリジナル画像高さ
   * @return DynamicMediaパラメータ
   */
  page._createS7ParamsCover = function(areaWidth, areaHeight, orgWidth, orgHeight, zoom, pixRatio) {
    // サイズ比率を取得する
    var sizeRatio = page
        ._getAreaImageRatio(areaWidth, areaHeight, orgWidth, orgHeight);

    // 幅、高さのうち、比率の小さいものを返却する
    return (sizeRatio["width"] <= sizeRatio["height"]) ? {
      "width" : Math.round(areaWidth * pixRatio * zoom)
    } : {
      "height" : Math.round(areaHeight * pixRatio * zoom)
    };
  };

  /**
   * DynamicMediaパラメータ生成（backgroud-size : contain）。<br>
   * background-sizeが「contain」の場合のパラメータを生成します。
   *
   * @param areaWidth エリア幅
   * @param areaHeight エリア高さ
   * @param orgWidth オリジナル画像幅
   * @param orgHeight オリジナル画像高さ
   * @return DynamicMediaパラメータ
   */
  page._createS7ParamsContain = function(areaWidth, areaHeight, orgWidth, orgHeight, zoom, pixRatio) {
    // サイズ比率を取得する
    var sizeRatio = page
        ._getAreaImageRatio(areaWidth, areaHeight, orgWidth, orgHeight);

    // 幅、高さのうち、比率の大きいものを返却する
    return (sizeRatio["width"] >= sizeRatio["height"]) ? {
      "width" : Math.round(areaWidth * pixRatio * zoom)
    } : {
      "height" : Math.round(areaHeight * pixRatio * zoom)
    };
  };

  /**
   * パラメータ値計算（指定値）。<br>
   * 指定された値を元にパラメータ値を計算します。
   *
   * @param specified 指定値
   * @param baseVal 基準値（エリア幅 or エリア高さ）
   * @param zoom ブラウザの拡大率
   * @param pixRatio デバイスピクセル比
   * @return パラメータ値
   */
  page._calcBySpecifiedValue = function(specified, baseVal, zoom, pixRatio) {
    var result = null;

    // px指定の場合
    if (specified.indexOf("px") != -1) {
      // 対象のピクセルをそのまま計算する
      result = page._calcByPixcel(specified, zoom, pixRatio);
    }
    // %指定の場合
    else if (specified.indexOf("%") != -1) {
      // 対象サイズのの指定パーセントを計算する
      result = page._calcByPercent(specified, baseVal, zoom, pixRatio);
    }

    return result;
  };

  /**
   * パラメータ値計算（ピクセル）。<br>
   * 指定されたピクセルを元にパラメータ値を計算します。
   *
   * @param pixStr ピクセル文字列
   * @param zoom ブラウザの拡大率
   * @param pixRatio デバイスピクセル比
   * @return パラメータ値
   */
  page._calcByPixcel = function(pixStr, zoom, pixRatio) {
    // 対象のピクセルをそのまま計算する
    return Math
        .round(pixStr.substring(0, pixStr.indexOf("px")) * pixRatio * zoom);
  };

  /**
   * パラメータ値計算（パーセント）。<br>
   * 指定されたパーセントを元にパラメータ値を計算します。
   *
   * @param perStr パーセント文字列
   * @param baseVal 基準値（エリア幅 or エリア高さ）
   * @param zoom ブラウザの拡大率
   * @param pixRatio デバイスピクセル比
   * @return パラメータ値
   */
  page._calcByPercent = function(perStr, baseVal, zoom, pixRatio) {
    // パーセント部分を取得する
    var per = perStr.substring(0, perStr.indexOf("%"));
    // 基準値のパーセントをそのまま計算する
    return Math.round(baseVal * (per / 100) * pixRatio * zoom);
  };

  /**
   * 背景DynamicMediaメイン処理。<br>
   * 背景画像が設定されたエリアごとに、適切なサイズのDynamicMediaを取得する。
   */
  page.updateBackgroundImages = function() {
    // 拡大・縮小
    var zoom = page._updateZoomFactor().zoom;
    // デバイスピクセル比
    var pixRatio = page._devPixelRatio;

    // 背景画像が指定されているものを取得する
    $(".js-dm-bgimage")
        .each(function() {
          var $elm = $(this);
          try {

            // 画像が指定されていない場合は何もしない
            if (!$elm.data("src")) {
              return;
            }

            // エリアのサイズを取得する
            var areaWidth = $elm.outerWidth();
            var areaHeight = $elm.outerHeight();

            // 背景画像（配列）
            var images = $elm.data("src").split(/,\s*/);
            // オリジナル画像（配列）
            var orgImages = $elm.data("bgimgOrg").split(/,\s*/);
            var orgWidths = String($elm.data("widthOrg")).split(/,\s*/);
            var orgHeights = String($elm.data("heightOrg")).split(/,\s*/);

            // background-sizeプロパティ
            var bgSizes = {};
            if ($elm.data("backgroundSize")) {
              bgSizes = $elm.data("backgroundSize").split(/,\s*/);
            }
            // backgroundSizeに値が設定されていない場合
            else {
              bgSizes = [ $elm.css("background-size") ];
            }

            var url = "";

            for (var i = 0; i < images.length; i++) {
              // 先頭以降はカンマで連結する
              if (i != 0)
                url += ",";

              // 現在背景画像のURLを連結する
              url += page
                  ._getImageUrl($elm, areaWidth, areaHeight, images[i], orgImages[i], orgWidths[i], orgHeights[i], bgSizes[i], zoom, pixRatio);
            }

            // 背景画像が更新されている場合は設定する
            if ($elm.css("background-image") != url) {
              $elm.css("background-image", url);
            }
          } catch (ex) {
            // 例外発生時はコンソールに警告ログを出力する
            console.log("updateBackgroundImages:" + ex.message);
          }
        });
  }

  /**
   * エリア用背景画像URL取得。<br>
   * 指定したエリアの背景画像URLを取得します。
   *
   * @param $elm 設定先項目
   * @param areaWidth エリア幅
   * @param areaHeight エリア高さ
   * @param image 画像URL
   * @param orgImage オリジナル画像パス
   * @param orgWidth オリジナル画像幅
   * @param orgHeight オリジナル画像高さ
   * @param bgSize background-size指定
   * @param zoom ブラウザの拡大率
   * @param pixRatio デバイスピクセル比
   * @return 背景画像URL
   */
  page._getImageUrl = function($elm, areaWidth, areaHeight, image, orgImage, orgWidth, orgHeight, bgSize, zoom, pixRatio) {

    // サイズが取得できない場合は何もしない
    if (bgSize == null) {
      return;
    }

    // 後半（height）のautoは省略する
    bgSize = bgSize.replace(/\s*auto$/g, "");

    var params = {};

    // 指定なし又はautoの場合
    if (bgSize == null || bgSize == "" || bgSize == "auto") {
      // 指定なし又はautoの場合は、ピクセル比の計算は行わない
      params["width"] = Math.round(areaWidth * zoom);
    }
    // coverの場合
    else if (bgSize == "cover") {
      params = page
          ._createS7ParamsCover(areaWidth, areaHeight, orgWidth, orgHeight, zoom, pixRatio);
    }
    // containの場合
    else if (bgSize == "contain") {
      params = page
          ._createS7ParamsContain(areaWidth, areaHeight, orgWidth, orgHeight, zoom, pixRatio);
    }
    // 高さが指定されていない場合（幅指定のみ）
    else if (bgSize.indexOf(" ") < 0) {
      params["width"] = page
          ._calcBySpecifiedValue(bgSize, areaWidth, zoom, pixRatio);
    }
    // 高さが指定されている場合（幅指定、高さ指定）
    else if (bgSize.indexOf(" ") != 0) {
      // 幅、高さの部分を抽出する
      var widthStr = bgSize.replace(/\s+.*$/g, "");
      var heightStr = bgSize.replace(/^.*\s+/g, "");

      // 幅、高さの両方を計算する
      params["width"] = page
          ._calcBySpecifiedValue(widthStr, areaWidth, zoom, pixRatio);
      params["height"] = page
          ._calcBySpecifiedValue(heightStr, areaHeight, zoom, pixRatio);
    }

    var url = null;

    // オリジナル画像の解像度を超える場合
    if ((params["width"] != null && params["width"] > orgWidth) || (params["height"] != null && params["height"] > orgHeight)) {
      // オリジナル画像をそのまま背景画像に設定する
      url = orgImage;
    }
    // 解像度を超えない場合
    else {
      // 背景画像URLを取得する
      url = image;

      // パラメータ連結用の区切り文字を追加する
      url += (url.indexOf("?") < 0) ? "?" : "&";

      // 幅、高さの両方を指定する場合
      if (params["width"] != null && params["height"] != null) {
        // サイズ比率を取得する
        var sizeRatio = page
            ._getAreaImageRatio(params["width"], params["height"], orgWidth, orgHeight);

        // 幅、高さのうち、比率の小さいものをパラメータに設定する
        if (sizeRatio["width"] <= sizeRatio["height"]) {
          url += "wid=" + params["width"];
        } else {
          url += "hei=" + params["height"];
        }
      }
      // 幅のみ指定する場合
      else if (params["width"] != null) {
        url += "wid=" + params["width"];
      }
      // 高さのみ指定する場合
      else if (params["height"] != null) {
        url += "hei=" + params["height"];
      }
      // どのパターンでもない場合はオリジナル画像とする（イレギュラーケース）
      else {
        url = orgImage;
      }
    }

    // 背景画像として設定する
    return "url(\"" + url + "\")";
  }
}(common.page = common.page || {}));

/** 画面ロード時処理。 */
$(document).ready(function() {
  var timer = false;

  // リサイズ時に実行する処理をバインドする
  $(window).on("load resize", function() {
    if (timer !== false) {
      clearTimeout(timer);
    }
    timer = setTimeout(common.page.updateBackgroundImages, 500);
  });
});

