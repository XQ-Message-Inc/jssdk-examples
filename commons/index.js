/* eslint-disable no-useless-escape */
/* eslint-disable no-undef */

/**
 * Cookies
 */
!(function (e) {
  var n = !1;
  if (
    ("function" == typeof define && define.amd && (define(e), (n = !0)),
    "object" == typeof exports && ((module.exports = e()), (n = !0)),
    !n)
  ) {
    var o = window.Cookies,
      t = (window.Cookies = e());
    t.noConflict = function () {
      return (window.Cookies = o), t;
    };
  }
})(function () {
  function g() {
    for (var e = 0, n = {}; e < arguments.length; e++) {
      var o = arguments[e];
      for (var t in o) n[t] = o[t];
    }
    return n;
  }

  return (function e(l) {
    function C(e, n, o) {
      var t;
      if ("undefined" != typeof document) {
        if (1 < arguments.length) {
          if (
            "number" == typeof (o = g({ path: "/" }, C.defaults, o)).expires
          ) {
            var r = new Date();
            r.setMilliseconds(r.getMilliseconds() + 864e5 * o.expires),
              (o.expires = r);
          }
          o.expires = o.expires ? o.expires.toUTCString() : "";
          try {
            (t = JSON.stringify(n)), /^[\{\[]/.test(t) && (n = t);
          } catch (e) {
            return console.error(e);
          }
          (n = l.write
            ? l.write(n, e)
            : encodeURIComponent(String(n)).replace(
                /%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,
                decodeURIComponent
              )),
            (e = (e = (e = encodeURIComponent(String(e))).replace(
              /%(23|24|26|2B|5E|60|7C)/g,
              decodeURIComponent
            )).replace(/[\(\)]/g, escape));
          var i = "";
          for (var c in o)
            o[c] && ((i += "; " + c), !0 !== o[c] && (i += "=" + o[c]));
          return (document.cookie = e + "=" + n + i);
        }
        e || (t = {});
        for (
          var a = document.cookie ? document.cookie.split("; ") : [],
            s = /(%[0-9A-Z]{2})+/g,
            f = 0;
          f < a.length;
          f++
        ) {
          var p = a[f].split("="),
            d = p.slice(1).join("=");
          this.json || '"' !== d.charAt(0) || (d = d.slice(1, -1));
          try {
            var u = p[0].replace(s, decodeURIComponent);
            if (
              ((d = l.read
                ? l.read(d, u)
                : l(d, u) || d.replace(s, decodeURIComponent)),
              this.json)
            )
              try {
                d = JSON.parse(d);
              } catch (e) {
                return console.error(e);
              }
            if (e === u) {
              t = d;
              break;
            }
            e || (t[u] = d);
          } catch (e) {
            return console.error(e);
          }
        }
        return t;
      }
    }

    return (
      ((C.set = C).get = function (e) {
        return C.call(C, e);
      }),
      (C.getJSON = function () {
        return C.apply({ json: !0 }, [].slice.call(arguments));
      }),
      (C.defaults = {}),
      (C.remove = function (e, n) {
        C(e, "", g(n, { expires: -1 }));
      }),
      (C.withConverter = e),
      C
    );
  })(function () {});
});

class XQCache {
  constructor() {}
}
XQCache.NAME = "xq-cache";

/** Convenience method for splicing two strings together. */
String.splice = function (idx, rem, str) {
  return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

String.stringUpWith = function (separatorToken) {
  /**
   *
   * @param tokensToRemove
   * @param separatorToken
   * @returns {string} - String of items separated by the provided token
   */
  String.joinWith = function (separatorToken) {
    return this.joinWith([",", ":", "-", "|", ";"], separatorToken);
  };
};

String.joinWith = function (tokensToRemove, separatorToken) {
  if (!tokensToRemove || tokensToRemove.length === 0) {
    tokensToRemove = separatorToken;
  }
  const rmv = Array.from(tokensToRemove).join("");
  let trimmed = this.match(eval("/[^ " + rmv + "]*/g")).filter(function (el) {
    return (el != null) & (el !== "");
  });

  return Array.from(trimmed).join(separatorToken);
};

/**
 * Convenience sleep method. This kind of thing should usually
 * be avoided, but we have no choice in order to deal with certain
 * wretched compose button.
 * @return {[Promise]} the newly generated promis.
 * @param ms
 */
async function sleep(ms) {
  return await new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * @param {String}cacheKey
 * @param {File}theFile
 * @return {Promise<Cache>}
 */
async function cacheFile(cacheKey, theFile) {
  let theCache = caches
    .open(XQCache.NAME)
    .then(function (cache) {
      let stream = new ReadableStream({
        async start(controller) {
          const chunk = await new Response(theFile).arrayBuffer();
          controller.enqueue(new Uint8Array(chunk));
          controller.close();
        },
      });
      /** @type {{cache: Cache, stream: ReadableStream}} */
      let tuple = { cache: cache, stream: stream };
      return tuple;
    })
    .then(function (tuple) {
      const message = `Cached ${theFile}  under ${cacheKey}`;
      console.warn(message);
      return tuple.cache.put(
        cacheKey,
        new Response(tuple.stream, { statusText: theFile.name })
      );
    });

  return await theCache;
}

/**
 *
 * @param {String} cacheKey
 * @return {Promise<Cache>}
 */
async function getCachedFile(cacheKey) {
  let filename;
  return caches.open(XQCache.NAME).then(function (cacheStorage) {
    return cacheStorage
      .match(cacheKey)
      .then(function (value) {
        filename = value.statusText;
        return value.blob();
      })
      .then(function (blob) {
        return new File([blob], filename);
      })
      .catch(function (e) {
        const message = `file doesn't exist in cache under key: ${cacheKey} `;
        return new Promise(function (resolve, reject) {
          return reject(new Error(message));
        });
      });
  });
}
/**
 *
 * @param {String} cacheKey
 * @return {Promise<Cache>}
 */
async function clearCache() {
  caches
    .delete(XQCache.NAME)
    .then(function (n) {
      console.warn("cleared cache: %s", XQCache.NAME);
      return new Promise(function (resolve, reject) {
        resolve(true);
      });
    })
    .catch(function (n) {
      console.warn("cache is already clear: %s", XQCache.NAME);
      return new Promise(function (resolve, reject) {
        resolve(false);
      });
    });
}
/**
 *
 * @param {Blob}theBlob
 * @param {String}fileName
 * @return {File}
 */
function blobToFile(theBlob, fileName) {
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return new File([theBlob], fileName);
}

/**
 * Sets a locally cached property.
 * This will be stored in the LocalStorage object (if available), or in cookies.
 * @param {String}property The name of the property
 * @param {String}value The new value of the property
 */
function setProperty(property, value) {
  // Check browser support
  if (typeof Storage !== "undefined") {
    localStorage.setItem(property, value);
  } else {
    Cookies.set(property, value);
  }
  console.info("Stored '" + property + "':" + value);
}

/**
 * Sets a locally cached property.
 * This will be stored in the LocalStorage object (if available), or in cookies.
 * @param {String}property: The name of the property to be replaced
 * @param {String}replaceWith: The name of the property to replace the other one
 * @param {String}value: The new value of the property
 */
function replaceProperty(property, replaceWith, value) {
  // Check browser support
  if (typeof Storage !== "undefined") {
    localStorage.removeItem(property);
    localStorage.setItem(replaceWith, value);
  } else {
    Cookies.remove(property);
    Cookies.set(replaceWith, value);
  }
  console.info(
    "Replaced '" + property + "' with '" + replaceWith + "':" + value
  );
}

/**
 * Retrieves a locally cached property. If that property is not available, an the default string provided be returned.
 * @param {String}property
 * @param {String}defaultValue
 */
function getProperty(property, defaultValue = undefined) {
  if (typeof Storage !== "undefined") {
    const value = localStorage.getItem(property);
    if (undefined === defaultValue) return value;
    return !value ? defaultValue : value;
  } else {
    const value = Cookies.get(property);
    if (undefined === defaultValue) return value;
    return !value ? defaultValue : value;
  }
}

/**
 * Removes a locally cached property.
 * @param {String} property The name of the property to remove.
 */
function removeProperty(property) {
  // Check browser support
  if (typeof Storage !== "undefined") {
    localStorage.removeItem(property);
  } else {
    Cookies.remove(property);
  }
  console.info("Removed '" + property + "'");
}

function removeAllProperties() {
  // Check browser support
  if (typeof Storage !== "undefined") {
    for (var x in localStorage) {
      if (localStorage.length == 0) break;
      localStorage.removeItem(x);
    }
  } else {
    for (var y in Cookies) {
      if (Cookies.length == 0) break;
      Cookies.removeItem(y);
    }
  }
}

module.exports = {
  getProperty,
  removeAllProperties,
  removeProperty,
  replaceProperty,
  setProperty,
};
