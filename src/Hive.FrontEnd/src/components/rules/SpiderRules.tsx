import Hexagon from '../Hexagon';
import Hextille from '../Hextille';
import Row from '../Row';
import RuleCell from './RuleCell';
import { Rule } from './rule';

const SpiderRules: Rule = () => (
  <Hextille>
    <Row>
      <Hexagon hidden={true} />
      <RuleCell creature="grasshopper" />
      <RuleCell creature="grasshopper" />
      <RuleCell creature="ant" />
    </Row>
    <Row>
      <Hexagon hidden={true} />
      <RuleCell creature="queen" />
      <RuleCell result="correct" />
      <RuleCell result="correct" />
      <RuleCell creature="beetle" />
    </Row>
    <Row>
      <RuleCell creature="ant" />
      <RuleCell result="correct" zIndex={1} symbol="2" correctArrows={['top-right']} />
      <RuleCell result="correct" zIndex={1} symbol="2" correctArrows={['top-left', 'top-right']} />
      <RuleCell creature="queen" />
      <RuleCell result="correct" />
    </Row>
    <Row>
      <Hexagon hidden={true} />
      <RuleCell creature="beetle" />
      <RuleCell
        result="correct"
        symbol="1"
        zIndex={3}
        correctArrows={['top-left', 'bottom-left', 'top-right']}
      />
      <RuleCell creature="spider" />
      <RuleCell result="correct" zIndex={2} symbol="2" correctArrows={['top-right']} />
    </Row>
    <Row>
      <RuleCell result="correct" />
      <RuleCell result="correct" symbol="2" correctArrows={['left']} />
      <RuleCell selected creature="spider" correctArrows={['right', 'top-left']} />
      <RuleCell result="correct" zIndex={3} symbol="1" correctArrows={['top-right']} />
    </Row>
  </Hextille>
);

SpiderRules.title = 'Spider';
SpiderRules.description = ['Must move 3 cells', `Can't backtrack`];
SpiderRules.displayName = 'SpiderRules';

export default SpiderRules;
