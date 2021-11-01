/*eslint-disable */
/* jscs:disable */
define(["Magento_PageBuilder/js/config", "Magento_PageBuilder/js/utils/directives", "Magento_PageBuilder/js/utils/url"], function (_config, _directives, _url) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Decode image background URL to object
   *
   * @param value
   * @returns {Object}
   * @api
   */
  function decodeUrl(value) {

    var result = "";
    value = decodeURIComponent(value.replace(window.location.href, ""));
    var regexp = /{{.*\s*url="?(.*\.([a-z|A-Z|0-9]*))"?\s*}}/;

    if (regexp.test(value)) {
      var _regexp$exec = regexp.exec(value),
          url = _regexp$exec[1],
          type = _regexp$exec[2];

      var video = {
        name: url.split("/").pop(),
        size: 0,
        type: "video/" + type,
        url: _config.getConfig("media_url") + url
      };
      result = [video];
    }

    return result;
  }
  /**
   * Check media directive
   *
   * @param value
   * @returns {boolean}
   * @api
   */
  function isMedia(value) {

    const urlRegExp = /\{\{\s*media\s+url\s*=\s*(?:"|&quot;)?(.+)(?=}})\s*\}\}/;
    const urlMatches = value.match(urlRegExp);
    if (urlMatches && typeof urlMatches[1] !== "undefined") {
        return true;
    }

    return false;
  }
  /**
   * Convert a URL to an video directive
   *
   * @param {string} videoUrl
   * @returns {string}
   */
  function urlToDirective(videoUrl) {
    var mediaUrl = (0, _url.convertUrlToPathIfOtherUrlIsOnlyAPath)(_config.getConfig("media_url"), videoUrl);
    var mediaPath = videoUrl.split(mediaUrl);
    return "{{media url=" + mediaPath[1] + "}}";
  }
  /**
   * Convert an image URL to a background image data uri
   *
   * @param {string} videoUrl
   * @returns {string}
   */


  function imageToBackgroundImageDataUrl(videoUrl) {
    return "url(\'" + (0, _directives.toDataUrl)(urlToDirective(videoUrl)) + "\')";
  }

  return {
    decodeUrl: decodeUrl,
    isMedia: isMedia,
    urlToDirective: urlToDirective,
    imageToBackgroundImageDataUrl: imageToBackgroundImageDataUrl
  };
});
//# sourceMappingURL=image.js.map