using System;
using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;

namespace Hive.Domain
{
    public class Game
    {
        public Game(IEnumerable<string> playerNames)
        {
            var players = playerNames.Select((name, id) => new Player(id, name, CreateStartingTiles(id))).ToList().AsReadOnly();
            State = new GameState(players, CreateCells());
        }

        public Game(GameState gameState)
        {
            State = gameState;
        }

        public void Move(int tileId, GameCoordinate coordinates)
        {
            State.Hexagons
                .Single(c => c.Coordinates == coordinates)
                .Tiles.Add(State.Players.SelectMany(p => p.AvailableTiles)
                    .Single(t => t.Id == tileId));
            var newCells = State.Hexagons.Where(c2 => c2.Tiles.Any()).ToList();

            var neighbours = newCells.SelectMany(c => GetNeighbours(c.Coordinates));

            newCells = newCells.Union(neighbours).ToList();

            var players = State.Players.Select(p => new Player(p.Id, p.Name,
                p.AvailableTiles.Select(t => new Tile(t.Id, t.PlayerId, t.Content, newCells.Select(nc => nc.Coordinates).ToList().OrderBy(x => Guid.NewGuid()).Take(newCells.Count / 2)
                ))));
            State = new GameState(players, newCells);
        }

        private static IEnumerable<Tile> CreateStartingTiles(int playerId)
        {
            return new[] {new Tile(playerId, playerId, "bug", new List<GameCoordinate> {new GameCoordinate(1, 1)})};
        }

        public GameState State { get; private set; }

        private IEnumerable<Cell> CreateCells()
        {
            var cell = new Cell(new GameCoordinate(1, 1));
            return new HashSet<Cell>(GetNeighbours(cell.Coordinates).Append(cell));
        }

        private IEnumerable<Cell> GetNeighbours(GameCoordinate coordinate)
        {
            return GetNeighbourCoordinates(coordinate).Select(c => new Cell(c));
        }

        private static IEnumerable<GameCoordinate> GetNeighbourCoordinates(GameCoordinate coordinate)
        {
            var r = new List<GameCoordinate>
            {
                new GameCoordinate(coordinate.Q - 1, coordinate.R),
                new GameCoordinate(coordinate.Q + 1, coordinate.R),
            };
            if (coordinate.R % 2 != 0)
            {
                r.Add(new GameCoordinate(coordinate.Q, coordinate.R - 1));
                r.Add(new GameCoordinate(coordinate.Q + 1, coordinate.R - 1));

                r.Add(new GameCoordinate(coordinate.Q, coordinate.R + 1));
                r.Add(new GameCoordinate(coordinate.Q + 1, coordinate.R + 1));
            }

            if (coordinate.R % 2 == 0)
            {
                r.Add(new GameCoordinate(coordinate.Q, coordinate.R - 1));
                r.Add(new GameCoordinate(coordinate.Q - 1, coordinate.R - 1));

                r.Add(new GameCoordinate(coordinate.Q, coordinate.R + 1));
                r.Add(new GameCoordinate(coordinate.Q - 1, coordinate.R + 1));
            }

            return r;
        }
    }
}