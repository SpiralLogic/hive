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
      The first player to have a surrounded queen loses. <br />
      The queen must be placed before center pieces can be moved. <br />
      Creatures being placed in the center for the first time, much touch only friendly peices.
    </caption>
  </>
);
Objective.displayName = 'Objective';
export default Objective;
