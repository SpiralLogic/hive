namespace Hive.Domain.Entities
{
    public enum GameStatus
    {
        NewGame,
        MoveSuccess,
        AiWin,
        Player0Win,
        Player1Win,
        MoveSuccessNextPlayerSkipped,
        MoveInvalid,
        GameOver
    }
}
