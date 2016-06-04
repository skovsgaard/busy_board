defmodule BusyBoard.Pipeline do
  use Plug.Builder

  plug Plug.Static, at: "/", from: :busy_board
  plug BusyBoard.Router
end
