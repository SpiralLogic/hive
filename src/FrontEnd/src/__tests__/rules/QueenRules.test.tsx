import { h } from 'preact';
import { renderElement } from '../helpers';
import QueenRules from '../../components/rules/QueenRules';

describe('Queen Rule snapshot tests', () => {
  test('snapshot', () => {
    expect(renderElement(<QueenRules />)).toMatchSnapshot();
  });
});
