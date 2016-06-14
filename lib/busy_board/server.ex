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
    {:reply, all_people(table), table}
  end

  def handle_call({:put, {name, status}}, _from, table) do
    :ets.insert table, {name, status}
    {:reply, table |> all_people |> Poison.encode!, table}
  end

  def handle_call({:put, person}, _from, table) do
    :ets.insert table, {person["name"], :unavailable}
    {:reply, :ok, table}
  end

  # Private helpers

  defp all_people(table) do
    :ets.foldr fn {name, status}, acc ->
      acc ++ [%{name: name, status: status}]
    end, [], table
  end
end
