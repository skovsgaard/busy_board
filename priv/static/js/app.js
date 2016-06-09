(() => {
  if(typeof(WebSocket) === "function") {
    socketeer("ws://localhost:4000/ws")
  } else {
    ajax("/api")
  }
})()
