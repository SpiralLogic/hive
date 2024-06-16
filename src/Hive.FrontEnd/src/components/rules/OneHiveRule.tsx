import Hextille from '../Hextille';
import Row from '../Row';
import RuleCell from './RuleCell';
import { Rule } from './rule';

const OneHiveRule: Rule = () => (
  <Hextille>
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
      <RuleCell selected creature="queen" incorrectArrows={['top-right']} />
      <RuleCell creature="grasshopper" />
    </Row>
  </Hextille>
);

OneHiveRule.title = 'One Hive Rule';
OneHiveRule.description = ['There must only be 1 hive', 'Even in transit a hive must not be split'];
OneHiveRule.displayName = 'OneHiveRule';

export default OneHiveRule;
