import Hexagon from '../Hexagon';
import Hextille from '../Hextille';
import Row from '../Row';
import RuleCell from './RuleCell';
import { Rule } from './rule';

const BeetleRules: Rule = () => (
  <Hextille>
    <Row>
      <Hexagon hidden={true} />
      <RuleCell result="correct" />
      <RuleCell />
    </Row>
    <Row>
      <RuleCell result="correct" creature="spider" />
      <RuleCell
        creature="beetle"
        selected
        correctArrows={['top-left', 'left', 'bottom-left', 'bottom-right']}
      />
      <RuleCell />
    </Row>
    <Row zIndex={-1}>
      <Hexagon hidden={true} />
      <RuleCell result="correct" creature="ant" />
      <RuleCell result="correct" />
    </Row>
    <Row>
      <Hexagon hidden={true} />
      <RuleCell creature="spider" />
      <RuleCell creature="grasshopper" />
    </Row>
  </Hextille>
);

BeetleRules.title = 'Beetle';
BeetleRules.description = ['Moves only 1 cell', 'Can move on top of insects'];
BeetleRules.displayName = 'BeetleRules';

export default BeetleRules;
