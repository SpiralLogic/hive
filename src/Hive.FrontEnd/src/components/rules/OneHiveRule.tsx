import Hextille from '../Hextille';
import Row from '../Row';
import RuleCell from './RuleCell';
import { Rule } from './rule';

const OneHiveRule: Rule = {
  title: 'One Hive Rule',
  description: ['There must only be 1 hive', 'Even in transit a hive must not be split'],
  RuleComponent: () => (
    <Hextille class="rules">
      <Row>
        <RuleCell creature="beetle" />
        <RuleCell creature="beetle" />
      </Row>
      <Row>
        <RuleCell creature="spider" />
        <RuleCell />
        <RuleCell result="incorrect" />
        <RuleCell />
      </Row>
      <Row>
        <RuleCell creature="ant" />
        <RuleCell creature="queen" incorrectArrows={['topRight']} />
        <RuleCell creature="grasshopper" />
      </Row>
    </Hextille>
  ),
};

OneHiveRule.RuleComponent.displayName = 'OneHiveRule';
export default OneHiveRule;
