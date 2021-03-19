using System;
using System.Collections.Generic;
using System.Linq;

namespace Hive.Domain
{
    public record NegaMaxNode<TBoard, TMove>(TBoard Board, ISet<TMove> Moves)
    {

    }

    public record NegaMaxScore<TMove>(TMove Move, int Score)
    {

    }

    public abstract class NegaMax<TBoard, TMove>
    {
        private readonly int _player;
        protected abstract ( TBoard Board, ISet<TMove> Moves) NextStateFunc(TBoard board, TMove moves);
        protected abstract int Evaluate(TBoard board, TMove move, int color);
        public NegaMax(int player)
        {
            _player = player;
        }

        public TMove GetMove(TBoard board, ISet<TMove> moves,int depth)
        {
            return Run(new NegaMaxNode<TBoard, TMove>(board, moves), depth, moves.First()).Move;
        }

        private NegaMaxScore<TMove> Run(NegaMaxNode<TBoard, TMove> state,
            int depth,
            TMove lastMove,
            int color = -1)
        {
            if (depth == 0)
            {
                return GetScore(state.Board, lastMove,  color);
            }

            NegaMaxScore<TMove> bestMove = new(state.Moves.First(), int.MinValue);
            foreach (var move in state.Moves)
            {
                var (board, moves) = NextStateFunc(state.Board, move);
                var newState = new NegaMaxNode<TBoard, TMove>(board, moves);
                var nextResult = Run(newState,  depth - 1, move, -color);
                var score = Math.Max(bestMove.Score, -nextResult.Score);
                if (bestMove.Score < score) bestMove = new NegaMaxScore<TMove>(move, score);
            }

            return bestMove;
        }

        private NegaMaxScore<TMove> GetScore(TBoard board, TMove move, int color)
        {
            var score = -color * Evaluate(board, move, _player);
            return new NegaMaxScore<TMove>(move, score);
        }
    }
}
