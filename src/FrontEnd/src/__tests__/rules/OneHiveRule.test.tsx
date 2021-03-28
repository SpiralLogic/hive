import { h } from 'preact';
import { renderElement } from '../test-helpers';
import OneHiveRule from '../../components/rules/OneHiveRule';

describe('one Hive Rule snapshot tests', () => {
  it('snapshot', () => {
    expect(renderElement(<OneHiveRule />)).toMatchSnapshot();
  });
});
