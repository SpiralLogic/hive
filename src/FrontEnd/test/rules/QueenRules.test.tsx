import { h } from 'preact';
import { renderElement } from '../test-helpers';
import QueenRules from '../../src/components/rules/QueenRules';

describe('queen Rule snapshot tests', () => {
  it('snapshot', () => {
    const Rule = QueenRules.Rule;
    expect(renderElement(<Rule />)).toMatchSnapshot();
  });
});
