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

     chunk.forEach(util.renderPerson)
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
