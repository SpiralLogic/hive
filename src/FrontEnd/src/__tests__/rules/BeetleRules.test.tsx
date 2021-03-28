import { h } from 'preact';
import { renderElement } from '../test-helpers';
import BeetleRules from '../../components/rules/BeetleRules';

describe('beetle Rule snapshot tests', () => {
  it('snapshot', () => {
    expect(renderElement(<BeetleRules />)).toMatchSnapshot();
  });
});
