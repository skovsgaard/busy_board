defmodule BusyBoard.Websocket do
  alias BusyBoard.Server

  @behaviour :cowboy_websocket_handler

  @ws_key {__MODULE__, :broadcast}

  # OTP behaviour callbacks

  def init(_, _req, _opts), do: {:upgrade, :protocol, :cowboy_websocket}

  def websocket_init(_type, req, _opts) do
    state = %{}
    subscribe
    {:ok, req, state}
  end

  def websocket_handle({:text, "all"}, req, state) do
    {:ok, all_people} = Server.all |> Poison.encode
    {:reply, {:text, all_people}, req, state}
  end

  def websocket_handle({:text, "put:" <> pair}, req, state) do
    [name, status] = String.split(pair, ",")
    Server.put({name, status})
    {:ok, all_people} = Server.all |> Poison.encode
    broadcast(all_people)
    {:reply, {:text, all_people}, req, state}
  end

  def websocket_handle({:text, "del:" <> name}, req, state) do
    all_people = Server.del name
    broadcast(all_people)
    {:reply, {:text, all_people}, req, state}
  end

  def websocket_handle({:text, "ping"}, req, state),
    do: {:reply, {:text, "pong"}, req, state}

  def websocket_handle({:text, _msg}, req, state) do
    {:ok, req, state}
  end

  def websocket_info({_pid, @ws_key, msg}, req, state) do
    {:reply, {:text, msg}, req, state}
  end

  def websocket_info(msg, req, state), do: {:reply, {:text, msg}, req, state}

  def websocket_terminate(_reason, _req, _state), do: :ok

  # Gproc helpers

  defp subscribe, do: :gproc.reg({:p, :l, @ws_key})

  defp broadcast(msg) do
    :gproc.send({:p, :l, @ws_key}, {self(), @ws_key, msg})
  end
end
