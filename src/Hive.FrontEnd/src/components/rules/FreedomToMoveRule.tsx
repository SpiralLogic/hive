import Hextille from '../Hextille';
import Row from '../Row';
import RuleCell from './RuleCell';
import { Rule } from './rule';

const FreedomToMoveRule: Rule = () => (
  <Hextille class="rules">
    <Row>
      <RuleCell creature="ant" />
      <RuleCell creature="grasshopper" />
    </Row>
    <Row>
      <RuleCell creature="spider" />
      <RuleCell selected creature="queen" incorrectArrows={['bottom-right']} />
      <RuleCell creature={'beetle'} />
    </Row>
    <Row>
      <RuleCell creature="ant" />
      <RuleCell result="incorrect" />
    </Row>
  </Hextille>
);

FreedomToMoveRule.title = 'Freedom To Move';
FreedomToMoveRule.description = [`Each move must be able to slide to it's next position`];
FreedomToMoveRule.displayName = 'FreedomToMoveRule';

export default FreedomToMoveRule;
