import Hexagon from '../Hexagon';
import Hextille from '../Hextille';
import Row from '../Row';
import RuleCell from './RuleCell';
import { Rule } from './rule';

const QueenRules: Rule = {
  title: 'Queen',
  description: [
    'Can move one cell',
    'Must be in hive by 4th move',
    'No creatures in hive can move without queen',
  ],
  RuleComponent: () => (
    <Hextille class="rules">
      <Row>
        <Hexagon hidden={true} />
        <RuleCell result="correct" />
        <RuleCell creature="ant" />
        <RuleCell creature="spider" />
      </Row>
      <Row>
        <RuleCell result="correct" />
        <RuleCell
          zIndex={1}
          creature="queen"
          selected
          correctArrows={['topLeft', 'left', 'right', 'bottomRight']}
        />
        <RuleCell result="correct" />
        <RuleCell creature="spider" />
      </Row>
      <Row>
        <Hexagon hidden={true} />
        <RuleCell creature="queen" />
        <RuleCell result="correct" />
        <RuleCell creature="beetle" />
      </Row>
      <Row>
        <RuleCell creature="grasshopper" />
        <RuleCell creature="ant" />
        <RuleCell creature="beetle" />
      </Row>
    </Hextille>
  ),
};

QueenRules.RuleComponent.displayName = 'QueenRules';
export default QueenRules;
