const ajax = function(url) {

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
    util.renderPerson(person)
  }

  function apiErrorHandler(err) {
    if (err) {
      console.log(err)
      return true
    } else {
      return false
    }
  }

  function apiHandler(err, res) {apiErrorHandler(err) || util.renderPeople(res)}

  util.jsonXHR("GET", url, apiHandler)
}
