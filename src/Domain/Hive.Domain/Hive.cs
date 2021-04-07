using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Hive.Domain.Ai;
using Hive.Domain.Entities;

namespace Hive.Domain
{

    public class Hive
    {
        private readonly Mover _mover;

        public Hive(IList<Player> players, ISet<Cell> cells)
        {
            _mover = new Mover(this);
            Cells = cells ?? throw new ArgumentNullException(nameof(cells));
            Players = players ?? throw new ArgumentNullException(nameof(players));
        }

        public ISet<Cell> Cells { get; }
        public IList<Player> Players { get; }

        public GameStatus Move(Move move) =>
            _mover.Move(move);

        internal void PerformMove(Move move) =>
            _mover.PerformMove(move);

        public async ValueTask<(GameStatus status, Move move)> AiMove(Func<string, Tile, ValueTask> broadcastThought)
        {
            var aiMove = await new ComputerPlayer(this,broadcastThought).GetMove();

            return (Move(aiMove), aiMove);
        }

        public void RefreshMoves(Player player) =>
            _mover.UpdateMoves(player);
    }
}
