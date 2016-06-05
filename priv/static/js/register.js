(() => {
  anyInputsFail = () => true

  registerClickHandler = (clickEvent) => {
    document.querySelectorAll("input").forEach((node) => {
      node.setAttribute("required", "required")
    })

    if (anyInputsFail()) {
      util.append({
	query: "header",
	tag: "div",
	class: "twelve columns",
	content: util.errMsg("Your form seems to be missing some pieces.")
      })
    }
  }

  document
    .getElementById('register-button')
    .addEventListener('click', registerClickHandler)
})()
