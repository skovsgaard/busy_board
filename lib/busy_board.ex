defmodule BusyBoard do
  use Application

  def start(_type, _args) do
    import Supervisor.Spec, warn: false

    children = [
      worker(BusyBoard.Server, [], id: :busy_board_server)
    ]

    opts = [strategy: :one_for_one, name: BusyBoard.Supervisor]

    Plug.Adapters.Cowboy.http BusyBoard.Pipeline, []
    Supervisor.start_link(children, opts)
  end
end
