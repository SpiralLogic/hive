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
      container.innerHTML = "<div tabIndex='1'/><div tabIndex='1'/><div tabIndex='1'/>";
      document.body.append(container);
      const elements = container.getElementsByTagName('div');
      [div1, div2, div3] = Array.from(elements);
      jest.spyOn(div2, 'focus');
    });

    test('should move to next element on keydown', () => {
      div1.focus();
      handleKeyboardNav({ key: 'ArrowDown', target: div1 });
      expect(div2.focus).toBeCalled();
    });

    test('should move to next element on key right', () => {
      div1.focus();
      handleKeyboardNav({ key: 'ArrowRight', target: div1 });
      expect(div2.focus).toBeCalled();
    });

    test('should move to next element on key up', () => {
      div1.focus();
      handleKeyboardNav({ key: 'ArrowUp', target: div3 });
      expect(div2.focus).toBeCalled();
    });

    test('should move to next element on key left', () => {
      div1.focus();
      handleKeyboardNav({ key: 'ArrowLeft', target: div3 });
      expect(div2.focus).toBeCalled();
    });
  });
});
