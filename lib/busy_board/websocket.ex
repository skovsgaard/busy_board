defmodule BusyBoard.Websocket do
  @behaviour :cowboy_websocket_handler

  def init(_, _req, _opts), do: {:upgrade, :protocol, :cowboy_websocket}

  def websocket_init(_type, req, _opts) do
    state = %{}
    {:ok, req, state}
  end

  def websocket_handle({:text, "ping"}, req, state),
    do: {:reply, {:text, "pong"}, req, state}

  def websocket_handle({:text, msg}, req, state) do
    IO.inspect(msg)
    {:ok, req, state}
  end

  def websocket_info(msg, req, state), do: {:reply, {:text, msg}, req, state}

  def websocket_terminate(_reason, _req, _state), do: :ok
end
