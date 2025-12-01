import { Validators, escapeMarkdown } from '../../src/utils/validators.js';

describe('Validators', () => {
  describe('validatePhone', () => {
    test('should validate Russian phone numbers', () => {
      expect(Validators.validatePhone('+79123456789')).toBe(true);
      expect(Validators.validatePhone('89123456789')).toBe(true);
      expect(Validators.validatePhone('9123456789')).toBe(true);
    });

    test('should reject invalid phone numbers', () => {
      expect(Validators.validatePhone('1234567890')).toBe(false);
      expect(Validators.validatePhone('+7912345678')).toBe(false); // too short
      expect(Validators.validatePhone('+791234567890')).toBe(false); // too long
      expect(Validators.validatePhone('+7912345678a')).toBe(false); // contains letter
    });
  });

  describe('validateEmail', () => {
    test('should validate correct email addresses', () => {
      expect(Validators.validateEmail('test@example.com')).toBe(true);
      expect(Validators.validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    test('should reject invalid email addresses', () => {
      expect(Validators.validateEmail('invalid-email')).toBe(false);
      expect(Validators.validateEmail('@domain.com')).toBe(false);
      expect(Validators.validateEmail('user@')).toBe(false);
      expect(Validators.validateEmail('')).toBe(false);
      expect(Validators.validateEmail(null)).toBe(false);
    });
  });

  describe('validateName', () => {
    test('should validate correct names', () => {
      expect(Validators.validateName('John Doe')).toBe(true);
      expect(Validators.validateName('Анна-Мария')).toBe(true);
      expect(Validators.validateName("O'Connor")).toBe(true);
    });

    test('should reject invalid names', () => {
      expect(Validators.validateName('J')).toBe(false); // too short
      expect(Validators.validateName('')).toBe(false);
      expect(Validators.validateName('John123')).toBe(false); // contains numbers
      expect(Validators.validateName('John@Doe')).toBe(false); // contains special chars
    });
  });

  describe('validateAddress', () => {
    test('should validate correct addresses', () => {
      expect(Validators.validateAddress('г. Москва, ул. Пушкина, д. 10, кв. 25')).toBe(true);
      expect(Validators.validateAddress('Street 123, City, Country')).toBe(true);
    });

    test('should reject invalid addresses', () => {
      expect(Validators.validateAddress('short')).toBe(false);
      expect(Validators.validateAddress('')).toBe(false);
      expect(Validators.validateAddress(null)).toBe(false);
    });
  });

  describe('validateOrderItems', () => {
    test('should validate correct order items', () => {
      const items = [
        { name: 'Pizza', price: 500 },
        { name: 'Drink', price: 150 }
      ];

      expect(Validators.validateOrderItems(items)).toBe(true);
    });

    test('should reject invalid order items', () => {
      expect(Validators.validateOrderItems([])).toBe(false);
      expect(Validators.validateOrderItems(null)).toBe(false);
      expect(Validators.validateOrderItems([{ name: 'Pizza' }])).toBe(false); // missing price
      expect(Validators.validateOrderItems([{ name: 'Pizza', price: -10 }])).toBe(false); // negative price
    });
  });

  describe('validateUserInput', () => {
    test('should validate different input types', () => {
      expect(Validators.validateUserInput('John Doe', 'name')).toBe(true);
      expect(Validators.validateUserInput('test@example.com', 'email')).toBe(true);
      expect(Validators.validateUserInput('+79123456789', 'phone')).toBe(true);
      expect(Validators.validateUserInput('Valid address for delivery', 'address')).toBe(true);
      expect(Validators.validateUserInput('Normal text', 'text')).toBe(true);
    });

    test('should reject invalid inputs', () => {
      expect(Validators.validateUserInput('', 'name')).toBe(false);
      expect(Validators.validateUserInput(null, 'email')).toBe(false);
      expect(Validators.validateUserInput('invalid', 'phone')).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    test('should remove dangerous HTML tags', () => {
      const input = 'Hello <script>alert("xss")</script> World';
      
      const sanitized = Validators.sanitizeInput(input);
      
      expect(sanitized).toBe('Hello  World');
    });

    test('should remove dangerous characters', () => {
      const input = 'Text with <>"\'` dangerous chars';
      
      const sanitized = Validators.sanitizeInput(input);
      
      expect(sanitized).toBe('Text with  dangerous chars');
    });

    test('should truncate long inputs', () => {
      const longInput = 'a'.repeat(600);
      
      const sanitized = Validators.sanitizeInput(longInput);
      
      expect(sanitized.length).toBe(500);
    });
  });

  describe('validateCallbackData', () => {
    test('should validate callback data with single prefix', () => {
      expect(Validators.validateCallbackData('menu_pizza_margherita', 'menu_')).toBe(true);
      expect(Validators.validateCallbackData('custom_sauce_tomato', 'custom_')).toBe(true);
    });

    test('should validate callback data with multiple prefixes', () => {
      const prefixes = ['menu_', 'custom_', 'status_'];
      
      expect(Validators.validateCallbackData('menu_pizza', prefixes)).toBe(true);
      expect(Validators.validateCallbackData('status_refresh', prefixes)).toBe(true);
    });

    test('should reject invalid callback data', () => {
      expect(Validators.validateCallbackData('invalid_data', 'menu_')).toBe(false);
      expect(Validators.validateCallbackData(null, 'menu_')).toBe(false);
    });
  });

  describe('escapeMarkdown', () => {
    test('should escape Markdown special characters', () => {
      const text = 'Hello _world_ *bold* [link](url) `code`';
      
      const escaped = Validators.escapeMarkdown(text);
      
      expect(escaped).toBe('Hello \\_world\\_ \\*bold\\* \\[link\\]\\(url\\) \\`code\\`');
    });

    test('should handle empty input', () => {
      expect(Validators.escapeMarkdown('')).toBe('');
      expect(Validators.escapeMarkdown(null)).toBe(null);
    });
  });

  describe('escapeMarkdown function export', () => {
    test('should export escapeMarkdown as standalone function', () => {
      const text = 'Test *text*';
      
      const escaped = escapeMarkdown(text);
      
      expect(escaped).toBe('Test \\*text\\*');
    });
  });
});