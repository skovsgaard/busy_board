defmodule BusyBoard.Server do
  use GenServer

  @mod __MODULE__

  def start_link do
    :ets.new :people, [:set, :named_table]
    ~w(Niels Caroline Matt Kasper AK)a
      |> Enum.each(fn name -> :ets.insert(:people, {name, :available}) end)

    :ets.insert(:people, {:Jonas, :unavailable})

    GenServer.start_link(@mod, :people, name: @mod)
  end

  # Client API

  def all, do: GenServer.call(@mod, :all)

  # OTP callbacks

  def handle_call(:all, _from, table) do
    everyone = :ets.foldr fn {name, status}, acc ->
      acc ++ [%{name: name, status: status}]
    end, [], table
    {:reply, everyone, table}
  end
end
