import { FunctionComponent, h } from 'preact';
import Hexagon from '../Hexagon';
import Hextille from '../Hextille';
import Row from '../Row';
import RuleCell from './RuleCell';

const SpiderRules: FunctionComponent = () => {
  return (
    <Hextille class="rules">
      <Row>
        <RuleCell />
        <RuleCell symbol="2" correctArrows={['left']} />
        <RuleCell class="selected" zIndex={4} creature="spider" correctArrows={['right', 'bottomLeft']} />
        <RuleCell zIndex={3} symbol="1" correctArrows={['bottomRight']} />
      </Row>
      <Row>
        <RuleCell creature="beetle" />
        <RuleCell symbol="1" zIndex={3} correctArrows={['topLeft', 'bottomLeft', 'bottomRight']} />
        <RuleCell creature="spider" />
        <RuleCell zIndex={2} symbol="2" correctArrows={['bottomRight']} />
      </Row>
      <Row>
        <RuleCell creature="ant" />
        <RuleCell zIndex={1} symbol="2" correctArrows={['bottomRight']} />
        <RuleCell zIndex={1} symbol="2" correctArrows={['bottomLeft', 'bottomRight']} />
        <RuleCell creature="queen" />
        <RuleCell />
      </Row>
      <Row>
        <RuleCell creature="queen" />
        <RuleCell />
        <RuleCell />
        <RuleCell creature="beetle" />
        <Hexagon hidden={true} />
      </Row>
      <Row>
        <Hexagon hidden={true} />
        <RuleCell creature="grasshopper" />
        <RuleCell creature="grasshopper" />
        <RuleCell creature="ant" />
      </Row>
    </Hextille>
  );
};
SpiderRules.displayName = 'SpiderRules';
export default SpiderRules;
