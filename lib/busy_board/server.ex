defmodule BusyBoard.Server do
  use GenServer

  @mod __MODULE__

  def start_link do
    table = :people
    {:ok, pid} = GenServer.start_link(@mod, table, name: @mod)
    {:ok, dets_label} = :dets.open_file(table, [file: priv("busy_board.dat")])
    :ets.new(table, [:named_table, :protected])
    :dets.to_ets(dets_label, table)
    :ets.give_away(table, pid, :ok)
    :dets.close(dets_label)

    {:ok, pid}
  end

  # Client API

  def all, do: GenServer.call(@mod, :all)

  def put(person), do: GenServer.call(@mod, {:put, person})

  def persist, do: GenServer.call(@mod, :persist)

  # OTP callbacks

  def handle_call(:all, _from, table) do
    {:reply, all_people(table), table}
  end

  def handle_call({:put, {name, status}}, _from, table) do
    :ets.insert table, {name, status}
    persist table
    {:reply, table |> all_people |> Poison.encode!, table}
  end

  def handle_call({:put, person}, _from, table) do
    :ets.insert table, {person["name"], :unavailable}
    persist table
    {:reply, :ok, table}
  end

  # Private helpers

  defp all_people(table) do
    :ets.foldr fn {name, status}, acc ->
      acc ++ [%{name: name, status: status}]
    end, [], table
  end

  defp persist(ets_label) do
    {:ok, dets_label} = :dets.open_file(ets_label, [file: priv("busy_board.dat")])
    :ets.to_dets(ets_label, dets_label)
    :ok = :dets.close(dets_label)
  end

  defp priv(filename), do: :busy_board |> :code.priv_dir |> Path.join(filename)
end
