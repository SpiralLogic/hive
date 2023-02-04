import '../css/rules.css';

import { useReducer } from 'preact/hooks';

import AntRules from './rules/AntRules';
import BeetleRules from './rules/BeetleRules';
import FreedomToMove from './rules/FreedomToMoveRule';
import GrasshopperRules from './rules/GrasshopperRules';
import Objective from './rules/Objective';
import OneHiveRule from './rules/OneHiveRule';
import QueenRules from './rules/QueenRules';
import SpiderRules from './rules/SpiderRules';

const ruleList = [
  Objective,
  QueenRules,
  BeetleRules,
  SpiderRules,
  GrasshopperRules,
  AntRules,
  OneHiveRule,
  FreedomToMove,
];
const changeRule = (currentRuleIndex: number, { type }: { type: 'next' | 'prev' }): number => {
  if (type === 'next') return (currentRuleIndex + 1) % ruleList.length;
  if (currentRuleIndex > 0) return (currentRuleIndex - 1) % ruleList.length;
  return ruleList.length - 1;
};

const Rules = () => {
  const [currentRuleIndex, changeCurrentRule] = useReducer(changeRule, 0);
  const RuleComponent = ruleList[currentRuleIndex];
  return (
    <div>
      <div class="menu">
        <button title="Previous" onClick={() => changeCurrentRule({ type: 'prev' })}>
          {`<`}
        </button>
        <h3>{RuleComponent.title}</h3>
        <button autofocus={true} title="Next" onClick={() => changeCurrentRule({ type: 'next' })}>
          {`>`}
        </button>
      </div>
      <ul>
        {RuleComponent.description.map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>
      <RuleComponent key={RuleComponent.title} />
    </div>
  );
};

Rules.displayName = 'Rules';
export default Rules;
