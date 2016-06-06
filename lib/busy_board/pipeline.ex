defmodule BusyBoard.Pipeline do
  use Plug.Builder

  plug Plug.Static, at: "/", from: :busy_board, only: ~w(css js img)
  plug Plug.Parsers, parsers: [:urlencoded]
  plug BusyBoard.AppRouter
end
