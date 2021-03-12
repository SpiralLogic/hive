import { FunctionComponent, h } from 'preact';
import Hexagon from '../Hexagon';
import Hextille from '../Hextille';
import Row from '../Row';
import RuleCell from './RuleCell';

const GrasshopperRules: FunctionComponent = () => {
  return (
    <Hextille class="rules">
      <Row zIndex={1}>
        <RuleCell result="correct" />
        <RuleCell creature="beetle" />
        <RuleCell
          creature="grasshopper"
          class="selected"
          correctArrows={[
            ['left', 3],
            ['right', 3],
            ['bottomLeft', 5],
          ]}
          incorrectArrows={[['bottomRight', 5]]}
        />
        <RuleCell creature="queen" zIndex={-1} />
        <RuleCell result="correct" zIndex={-2} />
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
        <RuleCell result="correct" />
        <RuleCell creature="beetle" />
        <Hexagon hidden={true} />
        <RuleCell result="incorrect" />
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
