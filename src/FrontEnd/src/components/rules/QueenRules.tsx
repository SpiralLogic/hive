import { FunctionComponent, h } from 'preact';
import Hexagon from '../Hexagon';
import Hextille from '../Hextille';
import Row from '../Row';
import RuleCell from './RuleCell';

const QueenRules: FunctionComponent = () => {
  return (
    <Hextille class="rules">
      <Row>
        <RuleCell result="correct" />
        <RuleCell creature="ant" />
        <RuleCell creature="spider" />
        <Hexagon hidden={true} />
      </Row>
      <Row class="start">
        <RuleCell result="correct" />
        <RuleCell
          zIndex={1}
          creature="queen"
          class="selected"
          correct={['topLeft', 'left', 'right', 'bottomRight']}
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
  );
};

QueenRules.displayName = 'QueenRules';
export default QueenRules;
