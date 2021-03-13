import { Fragment, h } from 'preact';
import Hexagon from '../Hexagon';
import Hextille from '../Hextille';
import Row from '../Row';
import RuleCell from './RuleCell';

const QueenRules = () => (
  <>
    <Hextille class="rules">
      <Row>
        <RuleCell result="correct" />
        <RuleCell creature="ant" />
        <RuleCell creature="spider" />
        <Hexagon hidden={true} />
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
        <RuleCell creature="grasshopper" />
        <RuleCell result="correct" />
        <RuleCell creature="queen" />
        <RuleCell creature="beetle" />
      </Row>
      <Row>
        <Hexagon hidden={true} />
        <RuleCell creature="grasshopper" />
        <RuleCell creature="ant" />
        <RuleCell creature="beetle" />
      </Row>
    </Hextille>
    <caption>
      The queen can move one cell and must be palced by the 4th turn.<br/> No centre pieces can move until placed.
    </caption>
  </>
);

QueenRules.displayName = 'QueenRules';
export default QueenRules;
