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
      jest.spyOn(div1, 'focus');
      jest.spyOn(div2, 'focus');
      jest.spyOn(div3, 'focus');
    });

    test('should move to next element on keydown', () => {
      handleKeyboardNav({ key: 'ArrowDown', target: div1 });
      expect(div2.focus).toBeCalled();
    });

    test('should move to next element on key right', () => {
      handleKeyboardNav({ key: 'ArrowRight', target: div1 });
      expect(div2.focus).toBeCalled();
    });

    test('should move to next element on key up', () => {
      handleKeyboardNav({ key: 'ArrowUp', target: div3 });
      expect(div2.focus).toBeCalled();
    });

    test('should move to next element on key left', () => {
      handleKeyboardNav({ key: 'ArrowLeft', target: div3 });
      expect(div2.focus).toBeCalled();
    });
    
    test('should not move on other keys', () => {
      handleKeyboardNav({ key: 'n', target: div1 });
      expect(div1.focus).not.toBeCalled();
      expect(div2.focus).not.toBeCalled();
      expect(div3.focus).not.toBeCalled();
    });
  });
});
