import { h } from 'preact';
import { renderElement } from './helpers';
import GameCell from '../components/GameCell';
import GameTile from '../components/GameTile';
import Hextille from '../components/Hextille';
import Row from '../components/Row';

describe('Hextille Tests', () => {
  describe('Hextille Snapshot', () => {
    test('matches current snapshot', () => {
      expect(
        renderElement(
          <Hextille>
            <Row>
              {' '}
              <GameCell coords={{ q: 0, r: 0 }}>
                <GameTile {...{ creature: 'ant', id: 0, playerId: 0, moves: [] }} />
              </GameCell>
            </Row>
          </Hextille>
        )
      ).toMatchSnapshot();
    });
  });
});
