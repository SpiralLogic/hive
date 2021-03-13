import { Fragment, h } from 'preact';
import Hexagon from '../Hexagon';
import Hextille from '../Hextille';
import Row from '../Row';
import RuleCell from './RuleCell';

const OneHiveRule = () => (
  <>
    <Hextille class="rules">
      <Row>
        <Hexagon hidden={true} />
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
        <Hexagon hidden={true} />
        <RuleCell creature="ant" />
        <RuleCell creature="queen" incorrectArrows={['topRight']} />
        <RuleCell creature="grasshopper" />
      </Row>
    </Hextille>
    <caption>The hive must not separate into 2 hives even if only unlinked in transit</caption>
  </>
);
OneHiveRule.displayName = 'OneHiveRule';
export default OneHiveRule;
