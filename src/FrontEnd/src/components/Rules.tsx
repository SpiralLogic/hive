import { FunctionComponent, h } from 'preact';
import Cell from './Cell';
import Hextille from './Hextille';
import Row from './Row';
import Tile from './Tile';

export const Rules: FunctionComponent = () => {
  return (
    <Hextille class="rules">
      <Row>
        <Cell hidden={true} />
        <Cell classes={'correct'}>
          <span>✔</span>
        </Cell>
        <Cell hidden={true} />
        <Cell hidden={true} />
      </Row>
      <Row>
        <Cell hidden={true} />
        <Cell classes={'correct'}>
          <Tile creature="spider" />
          <span>✔</span>
        </Cell>
        <Cell>
          <Tile creature="beetle" />
        </Cell>
      </Row>
      <Row>
        <Cell />
        <Cell classes={'correct'}>
          <Tile creature="ant" />
          <span>✔</span>
        </Cell>
        <Cell classes={'correct'}>
          <span>✔</span>
        </Cell>
        <Cell hidden={true} />
      </Row>
      <Row>
        <Cell hidden={true} />
        <Cell hidden={true} />
        <Cell>
          <Tile creature="queen" />
        </Cell>
        <Cell>
          <Tile creature="grasshopper" />
        </Cell>
      </Row>
    </Hextille>
  );
};

Rules.displayName = 'Rules';
