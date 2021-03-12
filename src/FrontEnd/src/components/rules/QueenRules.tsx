import { FunctionComponent, h } from 'preact';
import Hexagon from '../Hexagon';
import Hextille from '../Hextille';
import Row from '../Row';
import RuleCell from './RuleCell';

const QueenRules: FunctionComponent = () => {
  return (
    <Hextille class="rules">
      <Row>
        <RuleCell correctArrows={['bottomRight']} />
        <RuleCell creature="ant" />
        <RuleCell creature="spider" />
        <Hexagon hidden={true} />
      </Row>
      <Row>
        <RuleCell correctArrows={['right']} />
        <RuleCell zIndex={1} creature="queen" class="selected" />
        <RuleCell correctArrows={['left']} />
        <RuleCell creature="spider" />
      </Row>
      <Row>
        <RuleCell creature="grasshopper" />
        <RuleCell correctArrows={['topLeft']} />
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
