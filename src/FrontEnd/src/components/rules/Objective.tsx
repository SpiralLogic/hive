import { Fragment, h } from 'preact';
import Hexagon from '../Hexagon';
import Hextille from '../Hextille';
import Row from '../Row';
import RuleCell from './RuleCell';

const Objective = () => (
  <>
    <Hextille class="rules">
      <Row>
        <Hexagon hidden={true} />
        <RuleCell creature="ant" />
        <RuleCell creature="grasshopper" />
      </Row>
      <Row>
        <RuleCell creature="spider" />
        <RuleCell creature="queen" />
        <RuleCell creature="beetle" />
      </Row>
      <Row>
        <Hexagon hidden={true} />
        <RuleCell creature="ant" />
        <RuleCell creature="grasshopper" />
      </Row>
    </Hextille>
    <caption>
      The first player to have a surrounded queen loses. New creatures entering the game can only touch
      friendly creatures.
    </caption>
  </>
);
Objective.displayName = 'Objective';
export default Objective;
