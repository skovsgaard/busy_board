defmodule BusyBoard.Pipeline do
  use Plug.Builder

  plug Plug.Static, at: "/", from: :busy_board, only: ~w(css js img)
  plug BusyBoard.Router
end
