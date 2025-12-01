export const CUSTOM_PIZZA_STATES = {
  CUSTOM_PIZZA_START: 'CUSTOM_PIZZA_START',
  CUSTOM_SELECT_SAUCE: 'CUSTOM_SELECT_SAUCE',
  CUSTOM_SELECT_CHEESE: 'CUSTOM_SELECT_CHEESE',
  CUSTOM_SELECT_TOPPINGS: 'CUSTOM_SELECT_TOPPINGS',
  CUSTOM_SELECT_SIZE: 'CUSTOM_SELECT_SIZE',
  CUSTOM_CONFIRM_ORDER: 'CUSTOM_CONFIRM_ORDER',
  CUSTOM_AWAITING_ADDRESS: 'CUSTOM_AWAITING_ADDRESS' // Новое состояние для ожидания адреса
};

export const SAUCES = {
  tomato: { name: 'Томатный соус', price: 0 },
  creamy: { name: 'Сливочный соус', price: 30 },
  bbq: { name: 'BBQ соус', price: 40 },
  pesto: { name: 'Соус песто', price: 50 }
};

export const CHEESES = {
  mozzarella: { name: 'Моцарелла', price: 0 },
  cheddar: { name: 'Чеддер', price: 60 },
  parmesan: { name: 'Пармезан', price: 80 },
  gorgonzola: { name: 'Горгонзола', price: 90 },
  mixed: { name: 'Смесь сыров', price: 100 }
};

export const TOPPINGS = {
  pepperoni: { name: 'Пепперони', price: 70 },
  ham: { name: 'Ветчина', price: 60 },
  chicken: { name: 'Курица', price: 65 },
  bacon: { name: 'Бекон', price: 80 },
  mushrooms: { name: 'Грибы', price: 40 },
  olives: { name: 'Оливки', price: 35 },
  onions: { name: 'Лук', price: 20 },
  peppers: { name: 'Перцы', price: 30 },
  pineapple: { name: 'Ананасы', price: 45 },
  jalapeno: { name: 'Халапеньо', price: 25 },
  tomatoes: { name: 'Помидоры', price: 30 },
  basil: { name: 'Базилик', price: 15 }
};

export const CUSTOM_SIZES = {
  small: { name: 'Маленькая (25см)', basePrice: 300 },
  medium: { name: 'Средняя (30см)', basePrice: 400 },
  large: { name: 'Большая (35см)', basePrice: 500 }
};