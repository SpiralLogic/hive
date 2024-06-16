import Hexagon from '../Hexagon';
import Hextille from '../Hextille';
import Row from '../Row';
import RuleCell from './RuleCell';
import { Rule } from './rule';

const Objective: Rule = () => (
  <Hextille>
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
);
Objective.title = 'Objective';
Objective.description = [
  'The first player to have a surrounded queen loses',
  'Queens must be in the hive to move creatures',
  'Placements into the hive must touch friendly pieces',
];
Objective.displayName = 'Objective';

export default Objective;
