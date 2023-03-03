import {useCallback} from "preact/hooks";
import {shareGame} from "../utilities/share";
import {GameId, PlayerId} from "../domain";
import {Signal} from "@preact/signals";

export const useShareGame = (gameId: Signal<GameId>, currentPlayer: PlayerId, callback: (dialog: 'share') => void) => {
    return useCallback(async () => {
        const result = await shareGame(gameId.value, currentPlayer);
        if (result) callback('share');
    }, []);

}