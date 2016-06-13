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

    return people;
  },

  setPersonClick: function(person, ws) {
    document
      .getElementById(util.str(person.name, "-status"))
      .addEventListener("click", (ce) => {
	var status = util.toggleAvailability(person.name).split(" ")[1]
	console.log("Sending an update on " + person.name + " with " + status)
	ws.send(util.str("update:", person.name, ",", status))
      })
  },

  str: function() {
    return [].reduce.call(arguments, (i, acc) => [i, acc].join(''))
  },

  toggleAvailability: function(name) {
    var currClass = function(setter) {
      if (setter) {
	return document
	  .getElementById(util.str(name, "-status"))
	  .className = setter
      }
      return document
        .getElementById(util.str(name, "-status"))
        .className
    }

    if (currClass() == "status-box available") {
      return currClass("status-box unavailable")
    } else {
      return currClass("status-box available")
    }
  }
}
