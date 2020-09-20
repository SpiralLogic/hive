using System;
using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;

namespace Hive.Domain
{
    public class Hive
    {
        public IEnumerable<Cell> Cells { get; private set; }
        public IEnumerable<Player> Players { get; private set; }

        public Hive(IEnumerable<string> playerNames)
        {
            var players =
                playerNames
                    .Select((name, id) => new Player(id, name) with {
                Tiles = CreateStartingTiles(id)
            });
            Players = players;
            Cells = CreateCells();
        }

        public Hive(IEnumerable<Player> players, IEnumerable<Cell> cells)
        {
            Players = players;
            Cells = cells;
        }

        public void Move(Move move)
        {
            var player = Players.First(p => p.Tiles.Any(t => t.Id == move.TileId));
            var tile = player.Tiles.First(t => t.Id == move.TileId);
            player.Tiles.Remove(tile);
            Cells.Single(c => c.Coords.Equals(move.Coords)).Tiles.Add(tile);

            var occupiedCells = Cells.Where(c2 => c2.Tiles.Any());
            var oc = occupiedCells.Select(c => c.Coords);
            var neighbors = oc.SelectMany(GetNeighbors).Distinct();


            var newCells = neighbors.Where(c => !oc.Contains(c)).Select(c=>new Cell(c));

            Cells = occupiedCells.Union(newCells);

            Players = Players.Select(p => new Player(p.Id, p.Name) with
            {
                Tiles = p.Tiles.Select(t => new Tile(t.Id, t.PlayerId, t.Content) with {
                    Moves = Cells.Select(c => c.Coords).OrderBy(x => Guid.NewGuid()).Take(Cells.Count() / 2)
                        .ToHashSet()
                }).ToHashSet()
            });
        }

        private static ISet<Tile> CreateStartingTiles(int playerId)
        {
            var tileId = playerId * StartingTiles.Length;
            return StartingTiles
                .Select((name, i) => new Tile(tileId + i, playerId, name) with {
                Moves = new HashSet<Coords>() {new Coords(1, 1)}
            }).ToHashSet();
        }

        private static readonly string[] StartingTiles =
            {"Q", "S", "S", "B", "B", "GH", "GH", "A", "A", "A"};


        private IEnumerable<Cell> CreateCells()
        {
            var cell = new Cell(new Coords(1, 1));
            return new List<Cell>(GetNeighbors(cell.Coords).Select(c => new Cell(c)).Append(cell));
        }

        private IEnumerable<Coords> GetNeighbors(Coords coords)
        {
            return GetNeighborCoords(coords);
        }

        private static IEnumerable<Coords> GetNeighborCoords(Coords coords)
        {
            var r = new List<Coords>
            {
                new Coords(coords.Q - 1, coords.R),
                new Coords(coords.Q + 1, coords.R),
            };

            if (coords.R % 2 != 0)
            {
                r.Add(new Coords(coords.Q, coords.R - 1));
                r.Add(new Coords(coords.Q + 1, coords.R - 1));

                r.Add(new Coords(coords.Q, coords.R + 1));
                r.Add(new Coords(coords.Q + 1, coords.R + 1));
            }

            if (coords.R % 2 == 0)
            {
                r.Add(new Coords(coords.Q, coords.R - 1));
                r.Add(new Coords(coords.Q - 1, coords.R - 1));

                r.Add(new Coords(coords.Q, coords.R + 1));
                r.Add(new Coords(coords.Q - 1, coords.R + 1));
            }

            return r;
        }
    }
}