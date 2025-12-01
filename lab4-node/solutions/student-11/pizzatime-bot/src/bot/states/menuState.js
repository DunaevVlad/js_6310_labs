export const MENU_STATES = {
  MENU_START: 'MENU_START',
  MENU_SELECT_PIZZA: 'MENU_SELECT_PIZZA',
  MENU_SELECT_SIZE: 'MENU_SELECT_SIZE',
  MENU_SELECT_DOUGH: 'MENU_SELECT_DOUGH',
  MENU_SELECT_EXTRAS: 'MENU_SELECT_EXTRAS',
  MENU_CONFIRM_ORDER: 'MENU_CONFIRM_ORDER',
  MENU_AWAITING_ADDRESS: 'MENU_AWAITING_ADDRESS' // Новое состояние для ожидания адреса
};

export const PIZZAS = {
  margherita: {
    name: 'Маргарита',
    description: 'Томатный соус, моцарелла, свежие томаты, базилик',
    basePrice: 450,
    image: '🍕'
  },
  pepperoni: {
    name: 'Пепперони',
    description: 'Томатный соус, моцарелла, пепперони',
    basePrice: 550,
    image: '🍕'
  },
  quattro_formaggi: {
    name: 'Четыре сыра',
    description: 'Моцарелла, горгонзола, пармезан, рикотта',
    basePrice: 600,
    image: '🍕'
  },
  hawaiian: {
    name: 'Гавайская',
    description: 'Томатный соус, моцарелла, ветчина, ананасы',
    basePrice: 580,
    image: '🍕'
  },
  meat_lovers: {
    name: 'Мясная',
    description: 'Томатный соус, моцарелла, пепперони, ветчина, бекон',
    basePrice: 650,
    image: '🍕'
  }
};

export const SIZES = {
  small: { name: 'Маленькая (25см)', multiplier: 0.8 },
  medium: { name: 'Средняя (30см)', multiplier: 1 },
  large: { name: 'Большая (35см)', multiplier: 1.3 }
};

export const DOUGH_TYPES = {
  thin: { name: 'Тонкое', price: 0 },
  traditional: { name: 'Традиционное', price: 50 },
  cheese_crust: { name: 'Сырный борт', price: 100 }
};

export const EXTRAS = {
  extra_cheese: { name: 'Дополнительный сыр', price: 80 },
  mushrooms: { name: 'Грибы', price: 60 },
  olives: { name: 'Оливки', price: 50 },
  jalapeno: { name: 'Халапеньо', price: 40 },
  bacon: { name: 'Бекон', price: 90 }
};