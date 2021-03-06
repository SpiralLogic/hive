import { FunctionComponent, h } from 'preact';
import Hexagon from '../Hexagon';
import Hextille from '../Hextille';
import Row from '../Row';
import RuleCell from './RuleCell';

export const BeetleRules: FunctionComponent = () => {
  return (
    <Hextille class="rules">
      <Row>
        <RuleCell result="correct" />
        <Hexagon hidden={true} />
        <Hexagon hidden={true} />
      </Row>
      <Row class="start">
        <RuleCell result="correct" creature="spider" />
        <RuleCell
          creature="beetle"
          class="selected"
          correct={['topLeft', 'left', 'bottomLeft', 'bottomRight']}
        />
      </Row>
      <Row>
        <RuleCell result="correct" creature="ant" />
        <RuleCell result="correct" />

        <Hexagon hidden={true} />
      </Row>
      <Row>
        <Hexagon hidden={true} />
        <RuleCell creature="spider" />
        <RuleCell creature="grasshopper" />
      </Row>
    </Hextille>
  );
};

BeetleRules.displayName = 'BeetleRules';
export default BeetleRules;
