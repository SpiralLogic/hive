using System;
using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;

namespace Hive.Domain
{
    public class Hive
    {
        public Hive(IEnumerable<string> playerNames)
        {
            var players = playerNames.Select((name, id) => new Player(id, name, CreateStartingTiles(id))).ToList().AsReadOnly();
            State = new State(players, CreateCells());
        }

        public Hive(State state)
        {
            State = state;
        }

        public void Move(int tileId, Coordinates coords)
        {
            State.Cells
                .Single(c => c.Coords == coords)
                .Tiles.Add(State.Players.SelectMany(p => p.Tiles)
                    .Single(t => t.Id == tileId));
            var newCells = State.Cells.Where(c2 => c2.Tiles.Any()).ToList();

            var neighbours = newCells.SelectMany(c => GetNeighbours(c.Coords));

            newCells = newCells.Union(neighbours).ToList();

            var players = State.Players.Select(p => new Player(p.Id, p.Name,
                p.Tiles.Select(t => new Tile(t.Id, t.PlayerId, t.Content, newCells.Select(nc => nc.Coords).ToList().OrderBy(x => Guid.NewGuid()).Take(newCells.Count / 2)
                ))));
            State = new State(players, newCells);
        }

        private static IEnumerable<Tile> CreateStartingTiles(int playerId)
        {
            return new[] {new Tile(playerId, playerId, "bug", new List<Coordinates> {new Coordinates(1, 1)})};
        }

        public State State { get; private set; }

        private IEnumerable<Cell> CreateCells()
        {
            var cell = new Cell(new Coordinates(1, 1));
            return new HashSet<Cell>(GetNeighbours(cell.Coords).Append(cell));
        }

        private IEnumerable<Cell> GetNeighbours(Coordinates coordinate)
        {
            return GetNeighbourCoordinates(coordinate).Select(c => new Cell(c));
        }

        private static IEnumerable<Coordinates> GetNeighbourCoordinates(Coordinates coords)
        {
            var r = new List<Coordinates>
            {
                new Coordinates(coords.Q - 1, coords.R),
                new Coordinates(coords.Q + 1, coords.R),
            };
            if (coords.R % 2 != 0)
            {
                r.Add(new Coordinates(coords.Q, coords.R - 1));
                r.Add(new Coordinates(coords.Q + 1, coords.R - 1));

                r.Add(new Coordinates(coords.Q, coords.R + 1));
                r.Add(new Coordinates(coords.Q + 1, coords.R + 1));
            }

            if (coords.R % 2 == 0)
            {
                r.Add(new Coordinates(coords.Q, coords.R - 1));
                r.Add(new Coordinates(coords.Q - 1, coords.R - 1));

                r.Add(new Coordinates(coords.Q, coords.R + 1));
                r.Add(new Coordinates(coords.Q - 1, coords.R + 1));
            }

            return r;
        }
    }
}
