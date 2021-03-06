import { h } from 'preact';
import { renderElement } from '../helpers';
import BeetleRules from '../../components/rules/BeetleRules';

describe('Beetle Rule snapshot tests', () => {
  test('snapshot', () => {
    expect(renderElement(<BeetleRules />)).toMatchSnapshot();
  });
});
