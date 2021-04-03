using System;
using System.Collections.Generic;
using System.Threading.Tasks;
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

        public GameStatus Move(Move move)=> 
            _mover.Move(move);

        public Task<GameStatus> AiMove(Func<string, Tile, Task> broadcastThought)
        {
            return _mover.AiMove(broadcastThought);
        }

        public void RefreshMoves(Player player) =>
            _mover.UpdateMoves(player);
    }
}
