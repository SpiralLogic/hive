import '../css/share.css';
import { FunctionComponent, h } from 'preact';
import { HiveEvent } from '../services';
import { useState } from 'preact/hooks';
import Modal from './Modal';
import {addHiveDispatchListener} from "../utilities/dispatcher";

const PlayerConnected: FunctionComponent = () => {
  const [playerConnected, setPlayerConnected] = useState<'connected' | 'disconnected' | undefined>(undefined);

  addHiveDispatchListener<HiveEvent>('opponentConnected', () => {
    setPlayerConnected('connected');
  });

  addHiveDispatchListener<HiveEvent>('opponentDisconnected', () => {
    setPlayerConnected('disconnected');
  });
  if (playerConnected === undefined) return null;

  return (
    <Modal name="player connected" onClose={() => setPlayerConnected(undefined)}>
      <p>Player has {playerConnected}!</p>
      <button title="New Game" onClick={() => setPlayerConnected(undefined)}>
        Close
      </button>
    </Modal>
  );
};
PlayerConnected.displayName = 'PlayerConnected';
export default PlayerConnected;
