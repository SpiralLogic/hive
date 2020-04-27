import { renderGame } from './components/Renderer'
import { IEngine, IGameState, IMove } from './domain'

const moveRequest = async (move: IMove) => {
  let response = await fetch('https://localhost:5001/move', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    mode: "no-cors",
    body: JSON.stringify(move)
  });

  return await response.json();
};

const newRequest = async () => {
  let response = await fetch('https://localhost:5001/new', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    mode: "cors",
    body: JSON.stringify(""),
  });

  return await response.json();
};

const biancasEngine = (): IEngine => {
  return {
    async initialState(): Promise<IGameState> {
      let r = await newRequest();
      console.log(r);
      return r;
    },

    async playMove(move: IMove): Promise<IGameState> {
      return await moveRequest(move);
    }
  };
};

renderGame({
  engine: biancasEngine(),
  container: document.getElementById('board') as Element,
});
