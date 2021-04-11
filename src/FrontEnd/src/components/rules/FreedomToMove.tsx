import { Fragment, h } from 'preact';
import Hextille from '../Hextille';
import Row from '../Row';
import RuleCell from './RuleCell';

export default  {
  title: 'Freedom To Move',
  description: [`Each move must be able to slide to it's next position`],
  Rule: ()=>(

    <Hextille class='rules'>
      <Row>
        <RuleCell creature='ant' />
        <RuleCell creature='grasshopper' />
      </Row>
      <Row>
        <RuleCell creature='spider' />
        <RuleCell zIndex={4} creature='queen' incorrectArrows={['bottomRight']} />
        <RuleCell creature={'beetle'} />
      </Row>
      <Row>
        <RuleCell creature='ant' />
        <RuleCell result='incorrect' />
      </Row>
    </Hextille>)
};
