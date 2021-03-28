import { h } from 'preact';
import { renderElement } from '../test-helpers';
import QueenRules from '../../components/rules/QueenRules';

describe('queen Rule snapshot tests', () => {
  it('snapshot', () => {
    expect(renderElement(<QueenRules />)).toMatchSnapshot();
  });
});
