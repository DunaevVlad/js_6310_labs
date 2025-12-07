import { getMainKeyboard, removeInlineKeyboard } from '../../src/bot/keyboards.js';

describe('Keyboards', () => {
  describe('getMainKeyboard', () => {
    test('should return main keyboard structure', () => {
      const keyboard = getMainKeyboard();

      expect(keyboard).toEqual({
        keyboard: [
          ['/menu', '/custom_pizza'],
          ['/order_status']
        ],
        resize_keyboard: true
      });
    });

    test('should have correct button labels', () => {
      const keyboard = getMainKeyboard();

      expect(keyboard.keyboard[0]).toContain('/menu');
      expect(keyboard.keyboard[0]).toContain('/custom_pizza');
      expect(keyboard.keyboard[1]).toContain('/order_status');
    });

    test('should have resize_keyboard enabled', () => {
      const keyboard = getMainKeyboard();

      expect(keyboard.resize_keyboard).toBe(true);
    });
  });

  describe('removeInlineKeyboard', () => {
    test('should keep main keyboard visible', () => {
      const keyboard = removeInlineKeyboard();

      expect(keyboard).toEqual({ remove_keyboard: false });
    });

    test('should return a frozen copy to avoid mutation side-effects', () => {
      const keyboard = removeInlineKeyboard();

      keyboard.remove_keyboard = true;

      const freshKeyboard = removeInlineKeyboard();
      expect(freshKeyboard.remove_keyboard).toBe(false);
    });
  });
});