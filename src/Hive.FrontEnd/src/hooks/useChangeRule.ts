import {useCallback, useMemo, useReducer} from "preact/hooks";
import {Rule} from "../components/rules/rule";

export const useChangeRule = (ruleList: Rule[]) => {
    const changeRule = useCallback((currentRuleIndex: number, {type}: { type: 'next' | 'prev' }): number => {
        if (type === 'next') return (currentRuleIndex + 1) % ruleList.length;
        if (currentRuleIndex > 0) return (currentRuleIndex - 1) % ruleList.length;
        return ruleList.length - 1;
    }, [ruleList]);

    const [currentRuleIndex, changeRuleDispatcher] = useReducer(changeRule, 0);
    const handlers = useMemo(() => ({
        previous: () => changeRuleDispatcher({type: 'prev'}),
        next: () => changeRuleDispatcher({type: 'next'})
    }) as const, []);

    return [ruleList[currentRuleIndex], handlers] as const;
}