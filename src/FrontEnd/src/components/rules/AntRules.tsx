import { Fragment, h } from 'preact';
import Hexagon from '../Hexagon';
import Hextille from '../Hextille';
import Row from '../Row';
import RuleCell from './RuleCell';

const AntRules = () => (
  <>
    <Hextille class="rules">
      <Row>
        <Hexagon hidden={true} />
        <RuleCell result="correct" correctArrows={['right']} zIndex={1} />
        <RuleCell result="correct" zIndex={0} />
      </Row>
      <Row>
        <Hexagon hidden={true} />
        <RuleCell result="correct" correctArrows={['topRight']} zIndex={1} />
        <RuleCell creature="queen" />
        <RuleCell result="correct" incorrectArrows={['bottomLeft']} zIndex={1} />
        <RuleCell result="correct" correctArrows={['left']} zIndex={1} />
      </Row>
      <Row>
        <RuleCell result="correct" correctArrows={['topRight']} zIndex={1} />
        <RuleCell creature="grasshopper" />
        <RuleCell result="incorrect" />
        <RuleCell creature="queen" />
        <RuleCell result="correct" correctArrows={['topLeft']} zIndex={1} />
      </Row>
      <Row>
        <Hexagon hidden={true} />
        <RuleCell result="correct" correctArrows={['topLeft']} zIndex={1} />
        <RuleCell creature="beetle" />
        <RuleCell creature="beetle" />
        <RuleCell result="correct" correctArrows={['topRight']} zIndex={1} />
      </Row>
      <Row>
        <Hexagon hidden={true} />
        <Hexagon hidden={true} />
        <RuleCell result="correct" correctArrows={['topLeft']} zIndex={1} />
        <RuleCell selected creature="ant" correctArrows={['left', 'right']} zIndex={2} />
        <RuleCell result="correct" correctArrows={['topRight']} zIndex={1} />
      </Row>
    </Hextille>
    <caption>The ant can move any number of cells</caption>
  </>
);
AntRules.displayName = 'AntRules';
export default AntRules;
