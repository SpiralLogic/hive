using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain
{
    public class ComputerPlayer : NegaMax<Hive, Move>
    {
        public ComputerPlayer(Player player) : base(player.Id)
        {
        }

        public Move GetMove(Hive hive)
        {
            var moves = GetNextMoves(hive);
            var move = GetMove(hive, moves, 1);
            return move;
        }

        protected override int Evaluate(Hive hive, Move move, int player)
        {
            var opponentId = hive.Players.First(p => p.Id != player).Id;
            hive.Move(move);

            var opponentQueenCount = GetPlayerQueenCount(hive, opponentId);
            var ownQueenCount = GetPlayerQueenCount(hive, player);

            if (ownQueenCount == 6) return int.MinValue;
            if (opponentQueenCount == 6) return int.MinValue;
            return opponentQueenCount - ownQueenCount;
        }

        protected override (Hive, ISet<Move>) NextStateFunc(Hive board, Move move)
        {
            var newHive = new Hive(JsonSerializer.Deserialize<IList<Player>>(JsonSerializer.Serialize(board.Players))!, JsonSerializer.Deserialize<ISet<Cell>>(JsonSerializer.Serialize(board.Cells))!);
            newHive.Move(move);
            var moves = GetNextMoves(newHive);

            return (newHive, moves);
        }

        private static ISet<Move> GetNextMoves(Hive hive)
        {
            var cells = hive.Cells;
            return hive.Players.SelectMany(p => p.Tiles).Concat(cells.SelectMany(c => c.Tiles)).SelectMany(t => t.Moves.Select(m => new Move(t, m))).ToHashSet();
        }

        private static int GetPlayerQueenCount(Hive hive, int playerId)
        {
            return hive.Cells.FirstOrDefault(c => c.HasQueen() && c.TopTile().PlayerId == playerId)?.SelectNeighbors(hive.Cells).WhereOccupied().Count() ?? 0;
        }

    }
}
