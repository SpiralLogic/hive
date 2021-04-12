import { h } from 'preact';
import Hexagon from '../Hexagon';
import Hextille from '../Hextille';
import Row from '../Row';
import RuleCell from './RuleCell';

export default {
  title: 'Spider',
  description: ['Must move 3 cells', `Can't backtrack`],
  Rule: () => (
    <Hextille class="rules">
      <Row>
        <RuleCell result="correct" />
        <RuleCell result="correct" symbol="2" correctArrows={['left']} />
        <RuleCell selected creature="spider" correctArrows={['right', 'bottomLeft']} />
        <RuleCell result="correct" zIndex={3} symbol="1" correctArrows={['bottomRight']} />
      </Row>
      <Row>
        <Hexagon hidden={true} />
        <RuleCell creature="beetle" />
        <RuleCell
          result="correct"
          symbol="1"
          zIndex={3}
          correctArrows={['topLeft', 'bottomLeft', 'bottomRight']}
        />
        <RuleCell creature="spider" />
        <RuleCell result="correct" zIndex={2} symbol="2" correctArrows={['bottomRight']} />
      </Row>
      <Row>
        <RuleCell creature="ant" />
        <RuleCell result="correct" zIndex={1} symbol="2" correctArrows={['bottomRight']} />
        <RuleCell result="correct" zIndex={1} symbol="2" correctArrows={['bottomLeft', 'bottomRight']} />
        <RuleCell creature="queen" />
        <RuleCell result="correct" />
      </Row>
      <Row>
        <Hexagon hidden={true} />
        <RuleCell creature="queen" />
        <RuleCell result="correct" />
        <RuleCell result="correct" />
        <RuleCell creature="beetle" />
      </Row>
      <Row>
        <Hexagon hidden={true} />
        <RuleCell creature="grasshopper" />
        <RuleCell creature="grasshopper" />
        <RuleCell creature="ant" />
      </Row>
    </Hextille>
  ),
};
