import { FunctionComponent, h } from 'preact';
import Hexagon from '../Hexagon';
import Hextille from '../Hextille';
import Row from '../Row';
import RuleCell from './RuleCell';

const GrasshopperRules: FunctionComponent = () => {
  return (
    <Hextille class="rules">
      <Row zIndex={1}>
        <RuleCell correctArrows={['right']} />
        <RuleCell creature="beetle" />
        <RuleCell creature="grasshopper" class="selected" />
        <RuleCell creature="queen" zIndex={-1} />
        <RuleCell zIndex={-2} correctArrows={['left']} />
      </Row>
      <Row>
        <Hexagon hidden={true} />
        <RuleCell creature="grasshopper" />
        <RuleCell style={{ '--tile-size': 'var(--hex-size)' }} />
        <RuleCell creature="ant" />
      </Row>
      <Row>
        <Hexagon hidden={true} />
        <RuleCell creature="queen" />
        <RuleCell creature="spider" />
        <RuleCell creature="ant" />
        <Hexagon hidden={true} />
      </Row>
      <Row>
        <RuleCell correctArrows={['topRight']} />
        <RuleCell creature="beetle" />
        <Hexagon hidden={true} />
        <RuleCell incorrectArrows={[['topLeft', 5]]} />
      </Row>
      <Row>
        <Hexagon hidden={true} />
        <RuleCell creature="spider" />
        <RuleCell creature="spider" />
      </Row>
    </Hextille>
  );
};

GrasshopperRules.displayName = 'GrasshopperRules';
export default GrasshopperRules;
