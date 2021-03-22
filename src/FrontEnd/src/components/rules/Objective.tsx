import { Fragment, h } from 'preact';
import Hexagon from '../Hexagon';
import Hextille from '../Hextille';
import Row from '../Row';
import RuleCell from './RuleCell';

const Objective = () => (
  <>
    <Hextille class="rules">
      <Row>
        <RuleCell creature="ant" />
        <RuleCell creature="grasshopper" /> <Hexagon hidden={true} />
      </Row>
      <Row>
        <RuleCell creature="spider" />
        <RuleCell creature="queen" result="correct" />
        <RuleCell creature="beetle" />
      </Row>
      <Row>
        <RuleCell creature="ant" />
        <RuleCell creature="grasshopper" /> <Hexagon hidden={true} />
      </Row>
    </Hextille>
    <caption>
      The first player to have a surrounded queen loses.
      <br /> New creatures entering the game can only touch friendly creatures.
    </caption>
  </>
);
Objective.displayName = 'Objective';
export default Objective;
