import Hexagon from '../Hexagon';
import Hextille from '../Hextille';
import Row from '../Row';
import RuleCell from './RuleCell';
import { Rule } from './rule';

const BeetleRule: Rule = {
  title: 'Beetle',
  description: ['Moves only 1 cell', 'Can move on top of insects'],
  Rule: () => (
    <Hextille class="rules">
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
          correctArrows={['topLeft', 'left', 'bottomLeft', 'bottomRight']}
        />
        <RuleCell />
      </Row>
      <Row>
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
  ),
};
BeetleRule.Rule.displayName = 'BeetleRule';
export default BeetleRule;
