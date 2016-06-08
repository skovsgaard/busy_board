defmodule BusyBoard do
  use Application

  def start(_type, _args) do
    import Supervisor.Spec, warn: false

    children = [
      worker(BusyBoard.Server, [], id: :busy_board_server),
      Plug.Adapters.Cowboy.child_spec(
        :http,
        BusyBoard.Pipeline,
        [],
        [dispatch: plug_dispatch, port: 4000]
      )
    ]

    opts = [strategy: :one_for_one, name: BusyBoard.Supervisor]

    Supervisor.start_link(children, opts)
  end

  defp plug_dispatch do
    [
      {:_, [
        {"/ws", BusyBoard.Websocket, []},
        {:_,
         Plug.Adapters.Cowboy.Handler,
         {BusyBoard.Pipeline, []}}
      ]}
    ]
  end
end
