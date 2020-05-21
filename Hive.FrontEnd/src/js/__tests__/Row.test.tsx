import * as React from 'react';
import {shallow, configure} from 'enzyme';
import * as ReactSixteenAdapter from 'enzyme-adapter-react-16';
import Row from '../components/Row';

configure({adapter: new ReactSixteenAdapter()});

const rowJsx = (
    <Row
        {...{
            r: 1,
            row: [
                {coordinates: {q: 0, r: 1}, tiles: []},
                {coordinates: {q: 1, r: 1}, tiles: []},
                false,
            ],
        }}
    />
);

test('row has class', () => {
    expect(shallow(rowJsx).hasClass('hex-row')).toBe(true);
});

test('row renders multiple cells', () => {
    expect(shallow(rowJsx).find('Cell')).toHaveLength(2);
});

test('row renders empty div for missing cells', () => {
    expect(shallow(rowJsx).find('div.hidden')).toHaveLength(1);
});

test('snapshot', () => {
    expect(shallow(rowJsx).getElement()).toMatchSnapshot();
});
