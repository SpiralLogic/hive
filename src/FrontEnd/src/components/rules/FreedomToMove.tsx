import { Fragment, h } from 'preact';
import Hextille from '../Hextille';
import Row from '../Row';
import RuleCell from './RuleCell';

const FreedomToMove = () => (
  <>
    <Hextille class="rules">
      <Row>
        <RuleCell creature="ant" />
        <RuleCell creature="grasshopper" />
      </Row>
      <Row>
        <RuleCell creature="spider" />
        <RuleCell zIndex={4} creature="queen" incorrectArrows={['bottomRight']} />
        <RuleCell creature={'beetle'} />
      </Row>
      <Row>
        <RuleCell creature="ant" />
        <RuleCell result="incorrect" />
      </Row>
    </Hextille>
    <caption>
      Each creature must be able to physically slide to each cell (except the beetle and grasshopper)
    </caption>
  </>
);
FreedomToMove.displayName = 'FreedomToMove';
export default FreedomToMove;
