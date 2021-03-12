import { FunctionComponent, h } from 'preact';
import Hexagon from '../Hexagon';
import Hextille from '../Hextille';
import Row from '../Row';
import RuleCell from './RuleCell';

const BeetleRules: FunctionComponent = () => {
  return (
    <Hextille class="rules">
      <Row>
        <RuleCell correctArrows={['bottomRight']} />
        <Hexagon hidden={true} />
        <Hexagon hidden={true} />
      </Row>
      <Row class="start">
        <RuleCell creature="spider" correctArrows={['right']} />
        <RuleCell creature="beetle" class="selected" />
      </Row>
      <Row>
        <RuleCell creature="ant" correctArrows={['topRight']} />
        <RuleCell correctArrows={['topLeft']} />

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
