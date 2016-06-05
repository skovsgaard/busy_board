(() => {
  renderPerson = (person) => {
    var color = person.status === "available" ? "available" : "unavailable"
    util.append({
      query: ".box-row:last-child",
      tag: "article",
      class: "four columns",
      content: util.str(
	'<div class="status-box ', color, '">',
	'<h4>', person.name, ': ', person.status, '</h4>',
	'</div>'
      )
    })
  }

  renderPeople = (people) => {
    util.chunk(people, 3).forEach((chunk) => {

     util.append({
       query: ".container",
       tag: "section",
       class: "row box-row",
     })

     chunk.forEach(renderPerson)
    })
  }

  apiErrorHandler = (err) => {
    if (err) {
      console.log(err)
      return true
    } else {
      return false
    }
  }

  apiHandler = (err, res) => apiErrorHandler(err) || renderPeople(res)

  util.getJSON("/api", apiHandler)
})()
