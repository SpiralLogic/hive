import { handleDragOver, handleDrop, handleKeyboardNav } from '../handlers';

describe(`handler tests`, () => {
    describe(`handle drag over tests`, () => {
        test('should prevent default on dragover', () => {
            const preventDefault = jest.fn();
            handleDragOver({ preventDefault });
            expect(preventDefault).toBeCalled();
        });
    });
    
    describe(`handle drop tests`, () => {
        test('should prevent default ondrop', () => {
            const preventDefault = jest.fn();
            handleDrop({ preventDefault });
            expect(preventDefault).toBeCalled();
        });
    });

    describe(`handleKeyboardNav tests`, () => {
        let div1: HTMLDivElement, div2: HTMLDivElement, div3: HTMLDivElement;
        beforeEach(() => {
            const container = document.createElement('div', {});
            container.innerHTML = '<div tabIndex=\'1\'/><div tabIndex=\'1\'/><div tabIndex=\'1\'/>';
            document.body.append(container);
            const elements = container.getElementsByTagName('div');
            [div1, div2, div3] = Array.from(elements);
            jest.spyOn(div1, 'focus');
            jest.spyOn(div2, 'focus');
            jest.spyOn(div3, 'focus');
        });

        test('should move to next element on keydown', () => {
            expect(handleKeyboardNav({ key: 'ArrowDown', target: div1 })).toBe(true);
            expect(div2.focus).toBeCalled();
        });

        test('should move to next element on key right', () => {
            expect(handleKeyboardNav({ key: 'ArrowRight', target: div1 })).toBe(true);
            expect(div2.focus).toBeCalled();
        });

        test('should move to next element on key up', () => {
            expect(handleKeyboardNav({ key: 'ArrowUp', target: div3 })).toBe(true);
            expect(div2.focus).toBeCalled();
        });

        test('should move to next element on key left', () => {
            expect(handleKeyboardNav({ key: 'ArrowLeft', target: div3 })).toBe(true);
            expect(div2.focus).toBeCalled();
        });

        test('should not move on other keys', () => {
            expect(handleKeyboardNav({ key: 'n', target: div1 })).toBe(false);
            expect(div1.focus).not.toBeCalled();
            expect(div2.focus).not.toBeCalled();
            expect(div3.focus).not.toBeCalled();
        });

        test('should not move no target', () => {
            expect(handleKeyboardNav({ key: 'n', target: null })).toBe(false);
            expect(div1.focus).not.toBeCalled();
            expect(div2.focus).not.toBeCalled();
            expect(div3.focus).not.toBeCalled();
        });
    });
});
