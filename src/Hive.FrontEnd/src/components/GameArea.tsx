import '../css/gameArea.css';

import {GameStatus, PlayerId} from '../domain';
import {handleDragOver} from '../utilities/handlers';
import {AiMode} from '../domain/engine';
import Links from './Links';
import Players from './Players';
import {Signal, useComputed, useSignal, useSignalEffect} from '@preact/signals';
import Game from './Game';
import {useGameState} from '../services/gameStateContext';
import {useHiveDispatchListener} from '../hooks/useHiveDispatchListener';
import {ConnectEvent} from '../services';
import Modal, {useModalActions} from './Modal';
import Rules from './Rules';
import GameOver from './GameOver';
import {useShareGame} from "../hooks/useShareGame";

type Properties = {
    currentPlayer: PlayerId;
    aiMode: Signal<AiMode>;
};

const gameOutcome = (gameStatus: GameStatus, playerId: PlayerId) => {
    switch (gameStatus) {
        case 'AiWin':
            return 'Game Over! Ai Wins';

        case 'Player0Win':
            return `Game Over! You ${playerId == 0 ? 'Win!' : 'Lose!'}`;

        case 'Player1Win':
            return `Game Over! You ${playerId == 1 ? 'Win!' : 'Lose!'}`;

        case 'GameOver':
            return `Game is over`;

        case 'Draw':
            return `Game Over! Draw`;

        default:
            break;
    }
    return '';
};

const GameArea = ({currentPlayer, aiMode}: Properties) => {
    const {gameId, gameStatus} = useGameState();
    const [currentDialog, {openDialog, closeDialog}] = useModalActions();
    const showGameOver = useComputed<boolean>(() => currentDialog.value === 'gameOver');
    const classes = useComputed<string | undefined>(() =>
        gameStatus.value === 'GameOver' ? 'game-over' : `player${currentPlayer}`
    );
    const showPlayerConnected = useComputed<boolean>(() => currentDialog.value === 'playerConnected');
    const showShare = useComputed<boolean>(() => currentDialog.value === 'share');
    const showRules = useComputed<boolean>(() => currentDialog.value === 'rules');
    const playerConnected = useSignal<'connected' | 'disconnected' | false>(false);
    const shareComponent = useShareGame(gameId, currentPlayer, openDialog);
    useSignalEffect(() => {
        if (gameOutcome(gameStatus.value, currentPlayer) !== '') currentDialog.value = 'gameOver';
    });
    useHiveDispatchListener<ConnectEvent>('opponentConnected', ({playerId}) => {
        if (playerId !== currentPlayer) {
            aiMode.value = 'off';
            playerConnected.value = 'connected';
            openDialog('playerConnected');
        }
    });

    useHiveDispatchListener<ConnectEvent>('opponentDisconnected', ({playerId}) => {
        if (playerId !== currentPlayer) {
            playerConnected.value = 'disconnected';
            openDialog('playerConnected');
        }
    });

    return (
        <main onDragOver={handleDragOver} title="Hive Game Area" class={classes}>
            <Players currentPlayer={currentPlayer}/>
            <section title="Game playing area">
                <Links
                    onShowRules={() => openDialog('rules')}
                    onShowShare={shareComponent}
                    gameId={gameId}
                    currentPlayer={currentPlayer}
                    aiMode={aiMode}
                />
                <Game currentPlayer={currentPlayer}></Game>
            </section>
            <Modal
                open={showPlayerConnected}
                onClose={closeDialog}
                title="Player Connected"
                class="player-connected">
                <p>Player has {playerConnected}!</p>
            </Modal>
            <Modal open={showRules} onClose={closeDialog} title="Game Rules" class="rules">
                <Rules/>
            </Modal>
            <Modal open={showShare} onClose={closeDialog} title="Linked Shared" class="share">
                <p>Opponent's link has been copied to clipboard!</p>
            </Modal>
            <Modal open={showGameOver} onClose={closeDialog} title="Game Over" class="game-over">
                <GameOver outcome={gameOutcome(gameStatus.value, currentPlayer)}/>
            </Modal>
        </main>
    );
};
GameArea.displayName = 'GameArea';
export default GameArea;
