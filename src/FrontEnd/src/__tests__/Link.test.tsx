import { h } from 'preact';
import { renderElement } from './helpers';
import Links from '../components/Links';

describe('Links snapshot tests', () => {
  test('snapshot', () => {
    expect(
      renderElement(
        <Links shareUrl="#" aiState={[false, (on) => {}]} onShowShare={() => ({})} onShowRules={() => ({})} />
      )
    ).toMatchSnapshot();
  });
});
