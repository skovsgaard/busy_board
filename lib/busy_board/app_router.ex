defmodule BusyBoard.Router do
  use Plug.Router
  
  alias BusyBoard.Server
  
  @fourohfour """
  {
    "status": 404,
    "msg": "Oh no; not found :("
  }
  """
  
  plug :match
  plug :dispatch
  
  get "/" do
    conn
    |> put_resp_content_type("text/html")
    |> send_resp(200, System.cwd |> Path.join(~w(priv / static / index.html)) |> File.read!)
  end
  
  get "/api", do: api_all(conn)
  get "/api/all", do: api_all(conn)
  
  match _ do
    conn
    |> put_resp_content_type("application/json")
    |> send_resp(404, @fourohfour)
  end

  defp api_all(conn) do
    conn
    |> put_resp_content_type("application/json")
    |> send_resp(200, Server.all |> Poison.encode!)
  end
end
