import { h } from 'preact';
import { renderElement } from './helpers';
import RuleModal from '../components/RuleModal';

describe('Rules snapshot tests', () => {
  test('snapshot', () => {
    expect(renderElement(<RuleModal setShowRules={() => ({})} />)).toMatchSnapshot();
  });
});
