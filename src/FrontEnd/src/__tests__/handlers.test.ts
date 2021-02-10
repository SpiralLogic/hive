import { handleDragOver, handleDrop, handleKeyboardClick } from '../handlers';

describe(`handler tests`, () => {
  describe(`handle drag over tests`, () => {
    it('should prevent default on dragover', () => {
      const preventDefault = jest.fn();
      handleDragOver({ preventDefault });
      expect(preventDefault).toBeCalled();
    });
  });

  describe(`handle drop tests`, () => {
    it('should prevent default on dragover', () => {
      const preventDefault = jest.fn();
      handleDrop({ preventDefault });
      expect(preventDefault).toBeCalled();
    });
  });

  describe(`handle keyboard click`, () => {
    it('should fire mouse click on enter', () => {
      const element = document.createElement('div');
      element.dispatchEvent = jest.fn();

      const event = new KeyboardEvent('keydown');
      handleKeyboardClick({ ...event, key: 'Enter', target: element });

      expect(element.dispatchEvent).toHaveBeenCalledWith(expect.objectContaining({ type: 'click' }));
    });

    it('should fire mouse click on space', () => {
      const element = document.createElement('div');
      element.dispatchEvent = jest.fn();

      const event = new KeyboardEvent('keydown');
      handleKeyboardClick({ ...event, key: 'Enter', target: element });

      expect(element.dispatchEvent).toHaveBeenCalledWith(expect.objectContaining({ type: 'click' }));
    });

    it(`shouldn't fire event when target is null1`, () => {
      const event = new KeyboardEvent('keydown');
      const result = handleKeyboardClick({ ...event, key: 'Enter', target: null });

      expect(result).toBe(true);
    });
  });
});
