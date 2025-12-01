import { 
  PIZZAS, 
  SIZES, 
  DOUGH_TYPES, 
  EXTRAS 
} from '../bot/states/menuState.js';

import { 
  CUSTOM_SIZES, 
  SAUCES, 
  CHEESES, 
  TOPPINGS 
} from '../bot/states/customPizzaState.js';

export class PriceCalculator {
  static calculateMenuPizzaPrice(orderData) {
    const pizza = PIZZAS[orderData.pizza];
    const size = SIZES[orderData.size];
    const dough = DOUGH_TYPES[orderData.dough];
    const extras = orderData.extras || [];

    if (!pizza || !size || !dough) {
      throw new Error('Недостаточно данных для расчета цены');
    }

    let price = pizza.basePrice * size.multiplier;
    price += dough.price;

    extras.forEach(extraKey => {
      const extra = EXTRAS[extraKey];
      if (extra) {
        price += extra.price;
      }
    });

    return Math.round(price);
  }

  static calculateCustomPizzaPrice(orderData) {
    const sauce = SAUCES[orderData.sauce];
    const cheese = CHEESES[orderData.cheese];
    const size = CUSTOM_SIZES[orderData.size];
    const toppings = orderData.toppings || [];

    if (!sauce || !cheese) {
      throw new Error('Недостаточно данных для расчета цены кастомной пиццы');
    }

    let price = 0;
    
    // Добавляем стоимость размера, если он выбран
    if (size) {
      price += size.basePrice;
    }
    
    price += sauce.price;
    price += cheese.price;

    toppings.forEach(toppingKey => {
      const topping = TOPPINGS[toppingKey];
      if (topping) {
        price += topping.price;
      }
    });

    return price;
  }

  static calculateCustomPizzaBasePrice(orderData) {
    const sauce = SAUCES[orderData.sauce];
    const cheese = CHEESES[orderData.cheese];
    const toppings = orderData.toppings || [];

    if (!sauce || !cheese) {
      throw new Error('Недостаточно данных для расчета базовой цены кастомной пиццы');
    }

    let price = sauce.price + cheese.price;

    toppings.forEach(toppingKey => {
      const topping = TOPPINGS[toppingKey];
      if (topping) {
        price += topping.price;
      }
    });

    return price;
  }

  static calculateTotalPrice(items) {
    return items.reduce((total, item) => total + item.price, 0);
  }

  static formatPrice(price) {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(price);
  }

  static validateOrderData(orderData, type = 'menu') {
    const errors = [];

    if (type === 'menu') {
      if (!orderData.pizza || !PIZZAS[orderData.pizza]) {
        errors.push('Не выбрана пицца');
      }
      if (!orderData.size || !SIZES[orderData.size]) {
        errors.push('Не выбран размер');
      }
      if (!orderData.dough || !DOUGH_TYPES[orderData.dough]) {
        errors.push('Не выбрано тесто');
      }
    } else if (type === 'custom') {
      if (!orderData.sauce || !SAUCES[orderData.sauce]) {
        errors.push('Не выбран соус');
      }
      if (!orderData.cheese || !CHEESES[orderData.cheese]) {
        errors.push('Не выбран сыр');
      }
      // Размер не обязателен на этапе выбора начинок
      if (!orderData.size || !CUSTOM_SIZES[orderData.size]) {
        // Не добавляем ошибку, так как размер выбирается после начинок
      }
    }

    return errors;
  }
}

export default PriceCalculator;