import { h } from 'preact';
import OneHiveRule from '../../components/rules/OneHiveRule';
import { renderElement } from '../helpers';

describe('One Hive Rule snapshot tests', () => {
  test('snapshot', () => {
    expect(renderElement(<OneHiveRule />)).toMatchSnapshot();
  });
});
