const socketeer = function(url) {
  var ws = new WebSocket(url)

  ws.onopen = (openEvent) => {
    ws.send("all")
    util.setRegisterClick(ws)
  }

  ws.onmessage = (msgEvent) => {
    console.log(msgEvent.data)
    util
      .renderPeople(JSON.parse(msgEvent.data))
      .forEach((person) => util.setPersonClick(person, ws))
  }

  ws.onerror = (errEvent) => console.log(err)
}

