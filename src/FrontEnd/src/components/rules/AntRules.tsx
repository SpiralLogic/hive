import { FunctionComponent, h } from 'preact';
import Hexagon from '../Hexagon';
import Hextille from '../Hextille';
import Row from '../Row';
import RuleCell from './RuleCell';

export const AntRules: FunctionComponent = () => {
  return (
    <Hextille class="rules">
      <Row>
        <Hexagon hidden={true} />
        <RuleCell result="correct" correct={['right']} zIndex={1} />
        <RuleCell result="correct" />
        <Hexagon hidden={true} />
        <Hexagon hidden={true} />
      </Row>
      <Row>
        <RuleCell result="correct" correct={['topRight']} />
        <RuleCell creature="queen" />
        <RuleCell result="correct" />
        <RuleCell result="correct" correct={['left']} />
      </Row>
      <Row>
        <RuleCell result="correct" correct={['topRight']} />
        <RuleCell creature="grasshopper" />
        <Hexagon hidden={true} />
        <RuleCell creature="queen" />
        <RuleCell result="correct" correct={['topLeft']} />
      </Row>
      <Row>
        <RuleCell result="correct" correct={['topLeft']} />
        <RuleCell creature="beetle" />
        <RuleCell creature="beetle" />
        <RuleCell result="correct" correct={['topRight']} />
      </Row>
      <Row>
        <Hexagon hidden={true} />
        <RuleCell result="correct" correct={['topLeft']} />
        <RuleCell class="selected" creature="ant" correct={['left', 'right']} zIndex={1} />
        <RuleCell result="correct" correct={['topRight']} />
      </Row>
    </Hextille>
  );
};
AntRules.displayName = 'AntRules';
export default AntRules;
