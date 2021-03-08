import { handleDragOver, handleDrop, handleKeyboardNav } from '../../utilities/handlers';

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
    let div1: HTMLDivElement, div2: HTMLDivElement, div3: HTMLDivElement, div4: HTMLDivElement;
    const container = document.createElement('span', {});
    document.body.appendChild(container);
    beforeEach(() => {
      container.innerHTML =
        "<div id='one' tabIndex='1'></div><div id='two' tabIndex='1'></div><div id='three' tabIndex='1'></div><div class='name'></div>";
      const elements = container.getElementsByTagName('div');
      [div1, div2, div3, div4] = Array.from(elements);
    });

    test('should move to next element on keydown', () => {
      expect(handleKeyboardNav({ key: 'ArrowDown', target: div1 })).toBe(true);
      expect(div2).toHaveFocus();
      expect(div4).not.toHaveFocus();
    });

    test('should move to next element on key right', () => {
      expect(handleKeyboardNav({ key: 'ArrowRight', target: div1 })).toBe(true);
      expect(div2).toHaveFocus();
      expect(div4).not.toHaveFocus();
    });

    test('should move to next element on key up', () => {
      expect(handleKeyboardNav({ key: 'ArrowUp', target: div3 })).toBe(true);
      expect(div2).toHaveFocus();
      expect(div4).not.toHaveFocus();
    });

    test('should move to last element on key up from first', () => {
      jest.spyOn(div3, 'focus');
      expect(handleKeyboardNav({ key: 'ArrowUp', target: div1 })).toBe(true);
      expect(div3.focus).toBeCalled();
      expect(div4).not.toHaveFocus();
    });

    test('should move to next element on key left', () => {
      expect(handleKeyboardNav({ key: 'ArrowLeft', target: div3 })).toBe(true);
      expect(div2).toHaveFocus();
      expect(div4).not.toHaveFocus();
    });

    test('should not move on other keys', () => {
      expect(handleKeyboardNav({ key: 'n', target: div1 })).toBe(false);
      expect(div1).not.toHaveFocus();
      expect(div2).not.toHaveFocus();
      expect(div3).not.toHaveFocus();
      expect(div4).not.toHaveFocus();
    });

    test('should not move no target', () => {
      expect(handleKeyboardNav({ key: 'n', target: null })).toBe(false);
      expect(div1).not.toHaveFocus();
      expect(div2).not.toHaveFocus();
      expect(div3).not.toHaveFocus();
    });
  });
});
