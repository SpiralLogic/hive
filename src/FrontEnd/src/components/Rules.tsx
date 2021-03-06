import { FunctionComponent, h } from 'preact';
import { useClassReducer } from '../utilities/hooks';
import { useEffect, useReducer } from 'preact/hooks';
import AntRules from './rules/AntRules';
import BeetleRules from './rules/BeetleRules';
import GrasshopperRules from './rules/GrasshopperRules';
import QueenRules from './rules/QueenRules';
import SpiderRules from './rules/SpiderRules';

type Props = { showHelp: boolean; setShowHelp: (value: boolean) => void };
const Rules: FunctionComponent<Props> = (props) => {
  const { showHelp, setShowHelp } = props;
  const ruleList = [<QueenRules />, <BeetleRules />, <SpiderRules />, <GrasshopperRules />, <AntRules />];
  const [classes, setClasses] = useClassReducer('rulesModal rules hide');
  const changeRule = (currentRuleIndex: number, action: { type: 'next' | 'prev' }): number => {
    return ++currentRuleIndex % ruleList.length;
  };
  const [currentRuleIndex, changeCurrentRule] = useReducer(changeRule, 0);
  useEffect(() => {
    setClasses({ type: showHelp ? 'add' : 'remove', class: 'hide' });
  }, [showHelp]);
  return (
    <div class={classes}>
      {ruleList[currentRuleIndex]}
      <div class="menu">
        <button onClick={() => changeCurrentRule({ type: 'next' })}>&lt;</button>
        <button onClick={() => setShowHelp(true)}>X</button>
        <button onClick={() => changeCurrentRule({ type: 'prev' })}>&gt;</button>
      </div>
    </div>
  );
};

Rules.displayName = 'Rules';
export default Rules;
