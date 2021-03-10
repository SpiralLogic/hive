import { h } from 'preact';
import { render, screen } from '@testing-library/preact';
import { renderElement } from './helpers';
import Rules from '../components/Rules';
import userEvent from '@testing-library/user-event';

describe('Rules tests', () => {
    test('modal calls close', () => {
        const close = jest.fn();
        render(<Rules setShowRules={close}/>);
        userEvent.click(screen.getByTitle('Close'));

        expect(close).toBeCalledWith(false);
    });

    test('next button moves next', () => {
        render(<Rules setShowRules={jest.fn()}/>);
        userEvent.click(screen.getByTitle('Next'));

        expect(document.querySelector('.selected .beetle')).toBeInTheDocument();
    });

    test('prev button goes back to end', () => {
        render(<Rules setShowRules={jest.fn()}/>);
        userEvent.click(screen.getByTitle('Previous'));

        expect(document.querySelector('.selected .ant')).toBeInTheDocument();
    });

    test('prev button moves back', () => {
        render(<Rules setShowRules={jest.fn()}/>);
        userEvent.click(screen.getByTitle('Next'));
        userEvent.click(screen.getByTitle('Previous'));

        expect(document.querySelector('.selected .queen')).toBeInTheDocument();
    });

    test('snapshot', () => {
        expect(renderElement(<Rules setShowRules={() => ({})}/>)).toMatchSnapshot();
    });
});
