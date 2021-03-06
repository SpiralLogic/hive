import { h } from 'preact';
import { renderElement } from '../helpers';
import SpiderRules from '../../components/rules/SpiderRules';

describe('Spider Rule snapshot tests', () => {
  test('snapshot', () => {
    expect(renderElement(<SpiderRules />)).toMatchSnapshot();
  });
});
