import { h } from 'preact';
import { renderElement } from '../helpers';
import AntRules from '../../components/rules/AntRules';

describe('ant Rule snapshot tests', () => {
  test('snapshot', () => {
    expect(renderElement(<AntRules />)).toMatchSnapshot();
  });
});
