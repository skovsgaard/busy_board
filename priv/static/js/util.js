NodeList.prototype.forEach = NodeList.prototype.forEach || Array.prototype.forEach

const util = {
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

  jsonXHR: function(method, url, cb) {
    var request = new XMLHttpRequest()
    request.open(method, url, true)

    request.onload = function() {
      if (this.status >= 200 && this.status < 400) {
        var data = JSON.parse(this.response)
        return cb(null, data)
      } else {
        return cb(new Error("Request failed with status " + this.status))
      }
    }

    request.onerror = function() {
      return cb(new Error("Request failed with status " + this.status))
    }

    request.send()
  },

  renderPerson: function(person) {
    var color = person.status === "available" ? "available" : "unavailable"
    util.append({
      query: ".box-row:last-child",
      tag: "article",
      class: "four columns",
      content: util.str(
	'<div class="status-box ', color, '" id="', person.name, '-status">',
	'<h4>', person.name, '</h4>',
	'</div>'
      )
    })
    document
      .getElementById(util.str(person.name, "-status"))
      .addEventListener("click", (ce) => util.toggleAvailability(person.name))
  },

  renderPeople: function(people) {
    util.chunk(people, 3).forEach((chunk) => {

     util.append({
       query: ".container",
       tag: "section",
       class: "row box-row",
     })

     chunk.forEach(this.renderPerson)
    })
  },

  str: function() {
    return [].reduce.call(arguments, (i, acc) => [i, acc].join(''))
  },

  toggleAvailability: function(name) {
    var currClass = function(setter) {
      if (setter) {
	document
	  .getElementById(util.str(name, "-status"))
	  .className = setter
      } else {
	return document
	  .getElementById(util.str(name, "-status"))
	  .className
      }
    }

    if (currClass() == "status-box available") {
      currClass("status-box unavailable")
    } else {
      currClass("status-box available")
    }
  }
}
