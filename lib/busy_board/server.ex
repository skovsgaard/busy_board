defmodule BusyBoard.Server do
  use GenServer

  @mod __MODULE__

  def start_link do
    table = :people
    {:ok, pid} = GenServer.start_link(@mod, table, name: @mod)

    table
    |> :ets.new([:named_table, :protected])
    |> :ets.give_away(pid, :ok)

    {:ok, pid}
  end

  # Client API

  def all, do: GenServer.call(@mod, :all)

  def put(person), do: GenServer.call(@mod, {:put, person})

  # OTP callbacks

  def handle_call(:all, _from, table) do
    everyone = :ets.foldr fn {name, status}, acc ->
      acc ++ [%{name: name, status: status}]
    end, [], table
    {:reply, everyone, table}
  end

  def handle_call({:put, person}, _from, table) do
    :ets.insert table,
      {person["name"] |> String.to_atom, :unavailable}
    {:reply, :ok, table}
  end
end
