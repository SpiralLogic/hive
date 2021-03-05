import { FunctionComponent, h } from 'preact';
import { RuleCell } from './RuleCell';
import Cell from './Cell';
import Hextille from './Hextille';
import Row from './Row';
import Tile from './Tile';

export const BeetleRule: FunctionComponent = () => {
  return (
    <Hextille class="rules">
      <Row>
        <Cell hidden={true} />
        <RuleCell result="correct" />
        <Cell hidden={true} />
        <Cell hidden={true} />
      </Row>
      <Row class="start">
        <Cell hidden={true} />
        <RuleCell result="correct" creature="spider" />
        <RuleCell
          creature="beetle"
          class="selected"
          correct={['topLeft', 'left', 'bottomLeft', 'bottomRight']}
        />
      </Row>
      <Row>
        <Cell hidden={true} />
        <RuleCell result="correct" creature="ant" />
        <RuleCell result="correct" />

        <Cell hidden={true} />
      </Row>
      <Row>
        <Cell hidden={true} />
        <Cell hidden={true} />
        <RuleCell creature="spider" />
        <Cell>
          <Tile creature="grasshopper" />
        </Cell>
      </Row>
    </Hextille>
  );
};

BeetleRule.displayName = 'BeetleRule';

export const QueenRule: FunctionComponent = () => {
  return (
    <Hextille class="rules">
      <Row>
        <RuleCell result="correct" />
        <RuleCell creature="ant" />
        <RuleCell creature="spider" />
        <Cell hidden={true} />
      </Row>
      <Row class="start">
        <RuleCell result="correct" />
        <RuleCell
          zIndex={1}
          creature="queen"
          class="selected"
          correct={['topLeft', 'left', 'right', 'bottomRight']}
        />
        <RuleCell result="correct" />
        <RuleCell creature="spider" />
      </Row>
      <Row>
        <RuleCell creature="grasshopper" />
        <RuleCell result="correct" />
        <RuleCell creature="queen" />
        <RuleCell creature="beetle" />
      </Row>
      <Row>
        <Cell hidden={true} />
        <RuleCell creature="grasshopper" />
        <RuleCell creature="ant" />
        <RuleCell creature="beetle" />
      </Row>
    </Hextille>
  );
};

QueenRule.displayName = 'QueenRule';

export const GrasshopperRule: FunctionComponent = () => {
  return (
    <Hextille class="rules">
      <Row zIndex={1}>
        <Cell hidden={true} />
        <RuleCell result="correct" />
        <RuleCell creature="beetle" />
        <RuleCell
          creature="grasshopper"
          class="selected"
          correct={[
            ['left', 3],
            ['right', 3],
            ['bottomLeft', 5],
          ]}
          incorrect={[['bottomRight', 5]]}
        />
        <RuleCell creature="queen" zIndex={-1} />
        <RuleCell result="correct" />
      </Row>
      <Row>
        <Cell hidden={true} />
        <Cell hidden={true} />
        <RuleCell creature="grasshopper" />
        <Cell hidden={true} />
        <RuleCell creature="ant" />
      </Row>
      <Row>
        <Cell hidden={true} />
        <Cell hidden={true} />
        <RuleCell creature="queen" />
        <RuleCell creature="spider" />
        <RuleCell creature="ant" />
        <Cell hidden={true} />
      </Row>
      <Row>
        <RuleCell creature="spider" />
        <RuleCell result="correct" />
        <RuleCell creature="beetle" />
        <Cell hidden={true} />
        <RuleCell result="incorrect" />
      </Row>
      <Row>
        <Cell hidden={true} />
        <RuleCell creature="spider" />
        <RuleCell creature="spider" />
      </Row>
    </Hextille>
  );
};
GrasshopperRule.displayName = 'GrasshopperRule';

export const SpiderRule: FunctionComponent = () => {
  return (
    <Hextille class="rules">
      <Row>
        <RuleCell result="correct" />
        <RuleCell result="correct" symbol="2" correct={['left']} />
        <RuleCell class="selected" creature="spider" zIndex={5} correct={['right', 'bottomLeft']} />
        <RuleCell result="correct" symbol="1" zIndex={4} correct={['bottomRight']} />
      </Row>
      <Row zIndex={3}>
        <RuleCell creature="beetle" />
        <RuleCell result="correct" symbol="1" zIndex={3} correct={['topLeft', 'bottomLeft', 'bottomRight']} />
        <RuleCell creature="spider" />
        <RuleCell result="correct" symbol="2" zIndex={2} correct={['bottomRight']} />
      </Row>
      <Row zIndex={2}>
        <RuleCell creature="ant" />
        <RuleCell result="correct" symbol="2" zIndex={2} correct={['bottomRight']} />
        <RuleCell result="correct" symbol="2" zIndex={2} correct={['bottomLeft', 'bottomRight']} />
        <RuleCell creature="queen" />
        <RuleCell result="correct" zIndex={1} />
      </Row>
      <Row zIndex={1}>
        <RuleCell creature="queen" />
        <RuleCell result="correct" />
        <RuleCell result="correct" />
        <RuleCell creature="beetle" />
        <Cell hidden={true} />
      </Row>
      <Row>
        <RuleCell creature="grasshopper" />
        <RuleCell creature="grasshopper" />
        <RuleCell creature="ant" />
      </Row>
    </Hextille>
  );
};
SpiderRule.displayName = 'GrasshopperRule';
export const AntRule: FunctionComponent = () => {
  return (
    <Hextille class="rules">
      <Row>
        <Cell hidden={true} />
        <RuleCell result="correct" correct={['right']} zIndex={1} />
        <RuleCell result="correct" />
        <Cell hidden={true} />
        <Cell hidden={true} />
      </Row>
      <Row>
        <RuleCell result="correct" correct={['topRight']} />
        <RuleCell creature="queen" />
        <RuleCell result="correct" />
        <RuleCell result="correct" correct={['left']} />
      </Row>
      <Row>
        <RuleCell result="correct" correct={['topRight']} />
        <RuleCell creature="grasshopper" />
        <Cell hidden={true} />
        <RuleCell creature="queen" />
        <RuleCell result="correct" correct={['topLeft']} />
      </Row>
      <Row>
        <RuleCell result="correct" correct={['topLeft']} />
        <RuleCell creature="beetle" />
        <RuleCell creature="beetle" />
        <RuleCell result="correct" correct={['topRight']} />
      </Row>
      <Row>
        <Cell hidden={true} />
        <RuleCell result="correct" correct={['topLeft']} />
        <RuleCell class="selected" creature="ant" correct={['left', 'right']} zIndex={1} />
        <RuleCell result="correct" correct={['topRight']} />
      </Row>
    </Hextille>
  );
};
AntRule.displayName = 'AntRule';
