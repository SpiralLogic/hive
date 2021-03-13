import { Fragment, h } from 'preact';
import Hexagon from '../Hexagon';
import Hextille from '../Hextille';
import Row from '../Row';
import RuleCell from './RuleCell';

const BeetleRules = () => (
  <>
    <Hextille class="rules">
      <Row>
        <RuleCell result="correct" />
        <RuleCell />
        <Hexagon hidden={true} />
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
        <RuleCell result="correct" creature="ant" />
        <RuleCell result="correct" />
        <RuleCell />
      </Row>
      <Row>
        <Hexagon hidden={true} />
        <RuleCell creature="spider" />
        <RuleCell creature="grasshopper" />
      </Row>
    </Hextille>
    <caption>The beetle can move one cell and climb on top of other creatures</caption>
  </>
);

BeetleRules.displayName = 'BeetleRules';
export default BeetleRules;
