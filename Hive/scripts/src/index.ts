import { simpleEngine } from './engine';
import { renderGame } from './Renderer';

const engine = simpleEngine();

renderGame({
  engine,
  container: document.getElementById('board') as Element,
});
