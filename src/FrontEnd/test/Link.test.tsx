import { h } from 'preact';
import Links from '../src/components/Links';
import { renderElement } from './test-helpers';

describe('links snapshot tests', () => {
  it('snapshot', () => {
    expect(
      renderElement(<Links currentPlayer={0} onShowShare={() => ({})} onShowRules={() => ({})} />)
    ).toMatchSnapshot();
  });
});
