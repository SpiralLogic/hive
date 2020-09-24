using System;
using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain
{
    public class Hive
    {
     
        private static readonly string[] StartingTiles =
            {"Q", "S", "S", "B", "B", "GH", "GH", "A", "A", "A"};
        public ISet<Cell> Cells { get; private set; }
        public IEnumerable<Player> Players { get; private set; }

        public Hive(IEnumerable<string> playerNames)
        {
            CreatePlayers(playerNames);
            CreateCells();
        }

 
        public Hive(ISet<Player> players, ISet<Cell> cells)
        {
            Players = players;
            Cells = cells;
        }

        public void Move(Move move)
        {
            var movedTile = Players.FindTileById(move.TileId);
            Players.RemoveUnplacedTile(movedTile);
            Cells.FindCell(move.Coords).AddTile(movedTile);
         
            Cells.ExceptWith(Cells.Where(c => !c.IsEmpty()));
            Cells.UnionWith(Cells.CreateNewEmptyNeighbors());

            foreach(var tile in Players.SelectMany(p=>p.Tiles).Concat(Cells.SelectMany(c=>c.Tiles)))
            {
                UpdateTileMoves(tile);
            };
        }

        private void UpdateTileMoves(Tile tile) =>  tile.Moves.UnionWith(
            Cells.Select(cell => cell.Coords)
                .OrderBy(_ => Guid.NewGuid())
                .Take(Cells.Count / 2)
                .ToHashSet());

        private static ISet<Tile> CreateStartingTiles(int playerId)
        {
            var startingTileId = playerId * StartingTiles.Length;
            
            return StartingTiles
                .Select((name, i) => 
                    new Tile(startingTileId + i, playerId, name) 
            with { Moves = new HashSet<Coords>() {new Coords(1, 1)} }).ToHashSet();
        }
        
        private void CreatePlayers(IEnumerable<string> playerNames)
        {
            Players = playerNames.Select((name, id) => new Player(id, name) with { Tiles = CreateStartingTiles(id) });
        }


        private void CreateCells()
        {
            Cells = new HashSet<Cell>(){new Cell(new Coords(1, 1))}.CreateNewEmptyNeighbors();
        }
    }
}