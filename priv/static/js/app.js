(() => {
  function renderPerson(person) {
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
      .addEventListener("click", (ce) => toggleAvailability(person.name))
  }

  function toggleHandler(err, res) {apiErrorHandler(err) || redrawPerson(res)}

  function toggleAvailability(name) {
    var route = util.str("/api/people/", name)
    util.jsonXHR("POST", route, toggleHandler)
  }

  function redrawPerson(person) {
    var elem = document
      .getElementById(util.str(person.name, "-status"))
      .parentNode
    elem.parentNode.removeChild(elem)
    renderPerson(person)
  }

  function renderPeople(people) {
    util.chunk(people, 3).forEach((chunk) => {

     util.append({
       query: ".container",
       tag: "section",
       class: "row box-row",
     })

     chunk.forEach(renderPerson)
    })
  }

  function apiErrorHandler(err) {
    if (err) {
      console.log(err)
      return true
    } else {
      return false
    }
  }

  function apiHandler(err, res) {apiErrorHandler(err) || renderPeople(res)}

  util.jsonXHR("GET", "/api", apiHandler)
})()
