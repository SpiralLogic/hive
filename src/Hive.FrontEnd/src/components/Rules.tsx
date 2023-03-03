import '../css/rules.css';

import AntRules from './rules/AntRules';
import BeetleRules from './rules/BeetleRules';
import FreedomToMove from './rules/FreedomToMoveRule';
import GrasshopperRules from './rules/GrasshopperRules';
import Objective from './rules/Objective';
import OneHiveRule from './rules/OneHiveRule';
import QueenRules from './rules/QueenRules';
import SpiderRules from './rules/SpiderRules';
import {useChangeRule} from "../hooks/useChangeRule";

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

const Rules = () => {
    const [RuleComponent, {next, previous}] = useChangeRule(ruleList);
  return (
    <div>
        <div class="menu">
            <button title="Previous" onClick={previous}>
                {`<`}
            </button>
            <h3>{RuleComponent.title}</h3>
            <button autofocus={true} title="Next" onClick={next}>
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
