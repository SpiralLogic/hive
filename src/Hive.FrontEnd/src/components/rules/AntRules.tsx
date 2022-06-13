import Hexagon from '../Hexagon';
import Hextille from '../Hextille';
import Row from '../Row';
import RuleCell from './RuleCell';
import { Rule } from './rule';

const AntRules: Rule = () => (
  <Hextille class="rules">
    <Row>
      <Hexagon hidden={true} />
      <RuleCell result="correct" correctArrows={['right']} zIndex={1} />
      <RuleCell result="correct" zIndex={0} />
    </Row>
    <Row>
      <Hexagon hidden={true} />
      <RuleCell result="correct" correctArrows={['top-right']} zIndex={1} />
      <RuleCell creature="queen" />
      <RuleCell result="correct" incorrectArrows={['bottom-left']} zIndex={1} />
      <RuleCell result="correct" correctArrows={['left']} zIndex={1} />
    </Row>
    <Row>
      <RuleCell result="correct" correctArrows={['top-right']} zIndex={1} />
      <RuleCell creature="grasshopper" />
      <RuleCell result="incorrect" />
      <RuleCell creature="queen" />
      <RuleCell result="correct" correctArrows={['top-left']} zIndex={1} />
    </Row>
    <Row>
      <Hexagon hidden={true} />
      <RuleCell result="correct" correctArrows={['top-left']} zIndex={1} />
      <RuleCell creature="beetle" />
      <RuleCell creature="beetle" />
      <RuleCell result="correct" correctArrows={['top-right']} zIndex={1} />
    </Row>
    <Row>
      <Hexagon hidden={true} />
      <RuleCell result="correct" correctArrows={['top-left']} zIndex={1} />
      <RuleCell selected creature="ant" correctArrows={['left', 'right']} />
      <RuleCell result="correct" correctArrows={['top-right']} zIndex={1} />
    </Row>
  </Hextille>
);

AntRules.description = ['Moves any number of cells'];
AntRules.title = 'Ant';
AntRules.displayName = 'AntRules';

export default AntRules;
