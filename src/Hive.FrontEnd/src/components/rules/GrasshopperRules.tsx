import Hexagon from '../Hexagon';
import Hextille from '../Hextille';
import Row from '../Row';
import RuleCell from './RuleCell';
import { Rule } from './rule';

const GrasshopperRules: Rule = {
  title: 'Grasshopper',
  description: ['Can just straight over other creatures', 'Can not jump gaps'],
  RuleComponent: () => (
    <Hextille class="rules">
      <Row zIndex={1}>
        <RuleCell result="correct" />
        <RuleCell creature="beetle" />
        <RuleCell
          creature="grasshopper"
          selected
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
        <Hexagon hidden={true} />
        <RuleCell creature="grasshopper" />
        <RuleCell />
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
        <Hexagon hidden={true} />
        <RuleCell result="correct" />
        <RuleCell creature="beetle" />
        <RuleCell />
        <RuleCell result="incorrect" />
      </Row>
      <Row>
        <Hexagon hidden={true} />
        <RuleCell creature="spider" />
        <RuleCell creature="spider" />
      </Row>
    </Hextille>
  ),
};
GrasshopperRules.RuleComponent.displayName = 'GrasshopperRules';
export default GrasshopperRules;
