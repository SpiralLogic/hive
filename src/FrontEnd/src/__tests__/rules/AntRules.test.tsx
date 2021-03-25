import { h } from 'preact';
import { renderElement } from '../test-helpers';
import AntRules from '../../components/rules/AntRules';

describe('ant Rule snapshot tests', () => {
  test('snapshot', () => {
    expect(renderElement(<AntRules />)).toMatchSnapshot();
  });
});
