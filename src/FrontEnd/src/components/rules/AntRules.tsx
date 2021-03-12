import { FunctionComponent, h } from 'preact';
import Hexagon from '../Hexagon';
import Hextille from '../Hextille';
import Row from '../Row';
import RuleCell from './RuleCell';

const AntRules: FunctionComponent = () => {
  return (
    <Hextille class="rules">
      <Row>
        <Hexagon hidden={true} />
        <RuleCell correctArrows={['bottomLeft']} />
        <RuleCell correctArrows={['left']} />
        <Hexagon hidden={true} />
        <Hexagon hidden={true} />
      </Row>
      <Row>
        <RuleCell correctArrows={['bottomLeft']} />
        <RuleCell creature="queen" />
        <RuleCell correctArrows={['right']} />
        <RuleCell correctArrows={['bottomRight']} />
      </Row>
      <Row>
        <RuleCell correctArrows={['bottomRight']} />
        <RuleCell creature="grasshopper" />
        <RuleCell incorrectArrows={['topRight']} />
        <RuleCell creature="queen" />
        <RuleCell correctArrows={['bottomLeft']} />
      </Row>
      <Row>
        <RuleCell correctArrows={['bottomRight']} />
        <RuleCell creature="beetle" />
        <RuleCell creature="beetle" />
        <RuleCell correctArrows={['bottomLeft']} />
      </Row>
      <Row>
        <Hexagon hidden={true} />
        <RuleCell correctArrows={['right']} />
        <RuleCell class="selected" creature="ant" zIndex={2} />
        <RuleCell correctArrows={['left']} />
      </Row>
    </Hextille>
  );
};
AntRules.displayName = 'AntRules';
export default AntRules;
