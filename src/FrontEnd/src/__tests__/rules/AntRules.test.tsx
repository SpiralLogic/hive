import { h } from 'preact';
import { renderElement } from '../test-helpers';
import AntRules from '../../components/rules/AntRules';

describe('ant Rule snapshot tests', () => {
  it('snapshot', () => {
    expect(renderElement(<AntRules />)).toMatchSnapshot();
  });
});
