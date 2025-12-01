import { PriceCalculator } from '../../src/utils/priceCalculator.js';
import { PIZZAS, SIZES, DOUGH_TYPES, EXTRAS } from '../../src/bot/states/menuState.js';
import { SAUCES, CHEESES, TOPPINGS, CUSTOM_SIZES } from '../../src/bot/states/customPizzaState.js';

describe('PriceCalculator', () => {
  describe('calculateMenuPizzaPrice', () => {
    test('should calculate price for menu pizza with all options', () => {
      const orderData = {
        pizza: 'margherita',
        size: 'medium',
        dough: 'traditional',
        extras: ['extra_cheese', 'mushrooms']
      };

      const price = PriceCalculator.calculateMenuPizzaPrice(orderData);
      
      const pizza = PIZZAS.margherita;
      const size = SIZES.medium;
      const dough = DOUGH_TYPES.traditional;
      const extra1 = EXTRAS.extra_cheese;
      const extra2 = EXTRAS.mushrooms;
      
      const expectedPrice = Math.round(pizza.basePrice * size.multiplier) + dough.price + extra1.price + extra2.price;
      
      expect(price).toBe(expectedPrice);
    });

    test('should calculate price for menu pizza without extras', () => {
      const orderData = {
        pizza: 'pepperoni',
        size: 'large',
        dough: 'thin'
      };

      const price = PriceCalculator.calculateMenuPizzaPrice(orderData);
      
      const pizza = PIZZAS.pepperoni;
      const size = SIZES.large;
      const dough = DOUGH_TYPES.thin;
      
      const expectedPrice = Math.round(pizza.basePrice * size.multiplier) + dough.price;
      
      expect(price).toBe(expectedPrice);
    });

    test('should throw error for incomplete order data', () => {
      const orderData = {
        pizza: 'margherita'
        // missing size and dough
      };

      expect(() => {
        PriceCalculator.calculateMenuPizzaPrice(orderData);
      }).toThrow('Недостаточно данных для расчета цены');
    });
  });

  describe('calculateCustomPizzaPrice', () => {
    test('should calculate price for custom pizza with all options', () => {
      const orderData = {
        sauce: 'tomato',
        cheese: 'mozzarella',
        size: 'medium',
        toppings: ['pepperoni', 'mushrooms']
      };

      const price = PriceCalculator.calculateCustomPizzaPrice(orderData);
      
      const sauce = SAUCES.tomato;
      const cheese = CHEESES.mozzarella;
      const size = CUSTOM_SIZES.medium;
      const topping1 = TOPPINGS.pepperoni;
      const topping2 = TOPPINGS.mushrooms;
      
      const expectedPrice = size.basePrice + sauce.price + cheese.price + topping1.price + topping2.price;
      
      expect(price).toBe(expectedPrice);
    });

    test('should throw error for incomplete custom pizza data', () => {
      const orderData = {
        sauce: 'tomato'
        // missing cheese
      };

      expect(() => {
        PriceCalculator.calculateCustomPizzaPrice(orderData);
      }).toThrow('Недостаточно данных для расчета цены кастомной пиццы');
    });
  });

  describe('calculateCustomPizzaBasePrice', () => {
    test('should calculate base price without size', () => {
      const orderData = {
        sauce: 'bbq',
        cheese: 'cheddar',
        toppings: ['bacon', 'onions']
      };

      const price = PriceCalculator.calculateCustomPizzaBasePrice(orderData);
      
      const sauce = SAUCES.bbq;
      const cheese = CHEESES.cheddar;
      const topping1 = TOPPINGS.bacon;
      const topping2 = TOPPINGS.onions;
      
      const expectedPrice = sauce.price + cheese.price + topping1.price + topping2.price;
      
      expect(price).toBe(expectedPrice);
    });
  });

  describe('calculateTotalPrice', () => {
    test('should calculate total price of items', () => {
      const items = [
        { name: 'Pizza 1', price: 500 },
        { name: 'Pizza 2', price: 600 },
        { name: 'Drink', price: 150 }
      ];

      const total = PriceCalculator.calculateTotalPrice(items);
      
      expect(total).toBe(1250);
    });

    test('should return 0 for empty array', () => {
      const items = [];
      
      const total = PriceCalculator.calculateTotalPrice(items);
      
      expect(total).toBe(0);
    });
  });

  describe('formatPrice', () => {
    test('should format price in Russian rubles', () => {
      const price = 1250;
      
      const formatted = PriceCalculator.formatPrice(price);
      
      expect(formatted).toMatch(/1\s?250\s?₽/);
    });

    test('should format zero price correctly', () => {
      const price = 0;
      
      const formatted = PriceCalculator.formatPrice(price);
      
      expect(formatted).toMatch(/0\s?₽/);
    });
  });

  describe('validateOrderData', () => {
    test('should validate complete menu order data', () => {
      const orderData = {
        pizza: 'margherita',
        size: 'medium',
        dough: 'traditional'
      };

      const errors = PriceCalculator.validateOrderData(orderData, 'menu');
      
      expect(errors).toHaveLength(0);
    });

    test('should return errors for incomplete menu order data', () => {
      const orderData = {
        pizza: 'invalid_pizza',
        // missing size and dough
      };

      const errors = PriceCalculator.validateOrderData(orderData, 'menu');
      
      expect(errors).toContain('Не выбрана пицца');
      expect(errors).toContain('Не выбран размер');
      expect(errors).toContain('Не выбрано тесто');
    });

    test('should validate complete custom pizza data', () => {
      const orderData = {
        sauce: 'tomato',
        cheese: 'mozzarella',
        size: 'medium'
      };

      const errors = PriceCalculator.validateOrderData(orderData, 'custom');
      
      expect(errors).toHaveLength(0);
    });

    test('should return errors for incomplete custom pizza data', () => {
      const orderData = {
        // missing sauce and cheese
      };

      const errors = PriceCalculator.validateOrderData(orderData, 'custom');
      
      expect(errors).toContain('Не выбран соус');
      expect(errors).toContain('Не выбран сыр');
    });
  });
});