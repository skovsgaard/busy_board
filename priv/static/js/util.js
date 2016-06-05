NodeList.prototype.forEach = NodeList.prototype.forEach || Array.prototype.forEach

util = {
  append: function(opts) {
    var el = document.createElement(opts.tag || "div")
    el.className = opts.class || ""
    el.innerHTML = opts.content || ""
    document.querySelector(opts.query || "body").appendChild(el)
    return el
  },

  chunk: function(arr, n = 1) {
    return [].concat.apply([],
      arr.map((el, i) => {
        return i % n ? [] : [arr.slice(i, i + n)]
      })
    )
  },

  errMsg: function(msg) {
    return this.str('<article class="err-msg u-full-width">', msg, '</article>')
  },

  getJSON: function(url, cb) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    
    request.onload = function() {
      if (this.status >= 200 && this.status < 400) {
        var data = JSON.parse(this.response);
	return cb(null, data)
      } else {
	return cb(new Error("Request failed with status " + this.status))
      }
    };
    
    request.onerror = function() {
      return cb(new Error("Request failed with status " + this.status))
    };
    
    request.send();
  },

  str: function() {
    return [].reduce.call(arguments, (i, acc) => [i, acc].join(''))
  }
}
