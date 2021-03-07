import { FunctionComponent, h } from 'preact';
import Hexagon from '../Hexagon';
import Hextille from '../Hextille';
import Row from '../Row';
import RuleCell from './RuleCell';

export const SpiderRules: FunctionComponent = () => {
  return (
    <Hextille class="rules">
      <Row>
        <RuleCell result="correct" />
        <RuleCell result="correct" symbol="2" correctArrows={['left']} />
        <RuleCell class="selected" creature="spider" zIndex={5} correctArrows={['right', 'bottomLeft']} />
        <RuleCell result="correct" symbol="1" zIndex={4} correctArrows={['bottomRight']} />
      </Row>
      <Row zIndex={3}>
        <RuleCell creature="beetle" />
        <RuleCell
          result="correct"
          symbol="1"
          zIndex={3}
          correctArrows={['topLeft', 'bottomLeft', 'bottomRight']}
        />
        <RuleCell creature="spider" />
        <RuleCell result="correct" symbol="2" zIndex={2} correctArrows={['bottomRight']} />
      </Row>
      <Row zIndex={2}>
        <RuleCell creature="ant" />
        <RuleCell result="correct" symbol="2" zIndex={2} correctArrows={['bottomRight']} />
        <RuleCell result="correct" symbol="2" zIndex={2} correctArrows={['bottomLeft', 'bottomRight']} />
        <RuleCell creature="queen" />
        <RuleCell result="correct" zIndex={1} />
      </Row>
      <Row zIndex={1}>
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
