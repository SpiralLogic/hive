import { FunctionComponent, h } from 'preact';
import Hexagon from '../Hexagon';
import Hextille from '../Hextille';
import Row from '../Row';
import RuleCell from './RuleCell';

const SpiderRules: FunctionComponent = () => {
  return (
    <Hextille class="rules">
      <Row>
        <RuleCell result="correct" />
        <RuleCell result="correct" symbol="2" correctArrows={['left']} />
        <RuleCell class="selected" zIndex={4} creature="spider" correctArrows={['right', 'bottomLeft']} />
        <RuleCell result="correct" zIndex={3} symbol="1" correctArrows={['bottomRight']} />
      </Row>
      <Row>
        <RuleCell creature="beetle" />
        <RuleCell
          result="correct"
          symbol="1"
          zIndex={3}
          correctArrows={['topLeft', 'bottomLeft', 'bottomRight']}
        />
        <RuleCell creature="spider" />
        <RuleCell result="correct" zIndex={2} symbol="2" correctArrows={['bottomRight']} />
      </Row>
      <Row>
        <RuleCell creature="ant" />
        <RuleCell result="correct" zIndex={1} symbol="2" correctArrows={['bottomRight']} />
        <RuleCell result="correct" zIndex={1} symbol="2" correctArrows={['bottomLeft', 'bottomRight']} />
        <RuleCell creature="queen" />
        <RuleCell result="correct" />
      </Row>
      <Row>
        <RuleCell creature="queen" />
        <RuleCell result="correct" />
        <RuleCell result="correct" />
        <RuleCell creature="beetle" />
        <Hexagon hidden={true} />
      </Row>
      <Row>
        <RuleCell creature="grasshopper" />
        <RuleCell creature="grasshopper" />
        <RuleCell creature="ant" />
      </Row>
    </Hextille>
  );
};
SpiderRules.displayName = 'SpiderRules';
export default SpiderRules;
