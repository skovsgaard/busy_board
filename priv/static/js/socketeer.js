const socketeer = function(url) {
  (function start() {
    var ws = new WebSocket(url)

    ws.onopen = (openEvent) => {
      console.log("Successfully connected to BusyBoard server")
      ws.send("all")
      util.setRegisterClick(ws)
      util.setDeleteClick(ws)
      util.removeByClass(".err-box")
    }

    ws.onmessage = (msgEvent) => {
      console.log(msgEvent.data)
      util
        .renderPeople(JSON.parse(msgEvent.data))
        .forEach((person) => util.setPersonClick(person, ws))
    }

    ws.onerror = (errEvent) => {
      console.log(errEvent)
    }

    ws.onclose = (closeEvent) => {
      util.removeByClass(".err-box")
      util.append({
        query: "header",
        tag: "section",
        class: "twelve columns err-box",
        content: util.errMsg("Connection to the BusyBoard server was lost...")
      })

      setTimeout(() => start(), 5000)
    }
  })()
}

