import { 
  MENU_STATES, 
  PIZZAS, 
  SIZES, 
  DOUGH_TYPES, 
  EXTRAS 
} from '../states/menuState.js';
import { stateManager } from '../../utils/stateManager.js';
import { PriceCalculator } from '../../utils/priceCalculator.js';
import { getMainKeyboard } from '../keyboards.js';

export function handleMenuStart(bot, chatId) {
  try {
    const message = `
🍕 Меню PizzaTime 2 🍕

Выберите пиццу из нашего меню:
    `;

    const keyboard = Object.entries(PIZZAS).map(([key, pizza]) => [
      {
        text: `${pizza.image} ${pizza.name} - ${pizza.basePrice}₽`,
        callback_data: `menu_pizza_${key}`
      }
    ]);

    stateManager.setState(chatId, MENU_STATES.MENU_START);
    
    bot.sendMessage(chatId, message, {
      reply_markup: {
        inline_keyboard: keyboard
      }
    }).catch(error => {
      console.error('Error sending menu:', error.message);
    });
  } catch (error) {
    console.error('Error in handleMenuStart:', error.message);
    bot.sendMessage(chatId, 'Произошла ошибка при загрузке меню. Пожалуйста, попробуйте еще раз.', {
      reply_markup: getMainKeyboard()
    }).catch(err => console.error('Error sending error message:', err.message));
  }
}

export function handleMenuCallback(bot, chatId, data) {
  try {
    if (data.startsWith('menu_pizza_')) {
      const pizzaKey = data.replace('menu_pizza_', '');
      const pizza = PIZZAS[pizzaKey];
      
      stateManager.setUserData(chatId, { pizza: pizzaKey });
      stateManager.setState(chatId, MENU_STATES.MENU_SELECT_SIZE);

      const message = `
${pizza.image} ${pizza.name}
${pizza.description}

Выберите размер пиццы:
      `;

      const keyboard = Object.entries(SIZES).map(([key, size]) => [
        {
          text: `${size.name} - ${Math.round(pizza.basePrice * size.multiplier)}₽`,
          callback_data: `menu_size_${key}`
        }
      ]);

      bot.sendMessage(chatId, message, {
        reply_markup: { inline_keyboard: keyboard }
      }).catch(error => {
        console.error('Error sending pizza selection:', error.message);
      });
    }
    else if (data.startsWith('menu_size_')) {
      const sizeKey = data.replace('menu_size_', '');
      stateManager.updateUserData(chatId, { size: sizeKey });
      stateManager.setState(chatId, MENU_STATES.MENU_SELECT_DOUGH);

      const userData = stateManager.getUserData(chatId);
      const pizza = PIZZAS[userData.pizza];
      const size = SIZES[sizeKey];

      const message = `
Размер: ${size.name}

Выберите тип теста:
      `;

      const keyboard = Object.entries(DOUGH_TYPES).map(([key, dough]) => [
        {
          text: `${dough.name} ${dough.price > 0 ? `(+${dough.price}₽)` : ''}`,
          callback_data: `menu_dough_${key}`
        }
      ]);

      bot.sendMessage(chatId, message, {
        reply_markup: { inline_keyboard: keyboard }
      }).catch(error => {
        console.error('Error sending size selection:', error.message);
      });
    }
    else if (data.startsWith('menu_dough_')) {
      const doughKey = data.replace('menu_dough_', '');
      stateManager.updateUserData(chatId, { dough: doughKey });
      stateManager.setState(chatId, MENU_STATES.MENU_SELECT_EXTRAS);

      const message = `
Хотите добавить дополнительные ингредиенты?
(Можно выбрать несколько)
      `;

      const keyboard = Object.entries(EXTRAS).map(([key, extra]) => [
        {
          text: `${extra.name} (+${extra.price}₽)`,
          callback_data: `menu_extra_${key}`
        }
      ]);

      keyboard.push([
        { text: 'Продолжить без добавок', callback_data: 'menu_no_extras' }
      ]);

      bot.sendMessage(chatId, message, {
        reply_markup: { inline_keyboard: keyboard }
      }).catch(error => {
        console.error('Error sending dough selection:', error.message);
      });
    }
    else if (data.startsWith('menu_extra_')) {
      const extraKey = data.replace('menu_extra_', '');
      const userData = stateManager.getUserData(chatId);
      const extras = userData.extras || [];
      
      if (!extras.includes(extraKey)) {
        extras.push(extraKey);
        stateManager.updateUserData(chatId, { extras });
      }

      // Обновляем сообщение с текущими выбранными экстрами
      const currentExtras = extras.map(extra => EXTRAS[extra].name).join(', ') || 'нет';
      const totalPrice = PriceCalculator.calculateMenuPizzaPrice({ ...userData, extras });

      const message = `
Выбранные добавки: ${currentExtras}

Общая стоимость: ${totalPrice}₽

Можете добавить еще ингредиенты или продолжить:
      `;

      const keyboard = Object.entries(EXTRAS).map(([key, extra]) => [
        {
          text: `${extra.name} (+${extra.price}₽)`,
          callback_data: `menu_extra_${key}`
        }
      ]);

      keyboard.push([
        { text: `✅ Заказать за ${totalPrice}₽`, callback_data: 'menu_confirm' }
      ]);

      bot.sendMessage(chatId, message, {
        reply_markup: { inline_keyboard: keyboard }
      }).catch(error => {
        console.error('Error sending extras selection:', error.message);
      });
    }
    else if (data === 'menu_no_extras' || data === 'menu_confirm') {
      stateManager.setState(chatId, MENU_STATES.MENU_CONFIRM_ORDER);
      handleMenuConfirmation(bot, chatId);
    }
    else if (data === 'menu_final_confirm') {
      // Вместо создания заказа сразу, запрашиваем адрес
      stateManager.setState(chatId, MENU_STATES.MENU_AWAITING_ADDRESS);
      
      const message = `
📝 Введите адрес доставки

Пожалуйста, напишите ваш адрес для доставки.

Пример: г. Москва, ул. Пушкина, д. 10, кв. 25
      `;

      bot.sendMessage(chatId, message, {
        reply_markup: getMainKeyboard()
      }).catch(error => {
        console.error('Error sending address request:', error.message);
      });
    }
    else if (data === 'menu_cancel') {
      stateManager.resetState(chatId);
      bot.sendMessage(chatId, 'Заказ отменен. Используйте /menu для нового заказа.', {
        reply_markup: getMainKeyboard()
      }).catch(error => console.error('Error sending cancel message:', error.message));
    }
  } catch (error) {
    console.error('Error in handleMenuCallback:', error.message);
    bot.sendMessage(chatId, 'Произошла ошибка при обработке запроса. Пожалуйста, попробуйте еще раз.', {
      reply_markup: getMainKeyboard()
    }).catch(err => console.error('Error sending error message:', err.message));
  }
}

export function handleMenuMessage(bot, chatId, text) {
  try {
    const state = stateManager.getState(chatId);
    
    if (state === MENU_STATES.MENU_AWAITING_ADDRESS) {
      // Пользователь ввел адрес
      handleAddressInput(bot, chatId, text);
      return true;
    }
    else if (state === MENU_STATES.MENU_SELECT_EXTRAS) {
      bot.sendMessage(chatId, 'Пожалуйста, используйте кнопки для выбора дополнительных ингредиентов.', {
        reply_markup: getMainKeyboard()
      }).catch(error => console.error('Error sending message:', error.message));
      return true;
    } else {
      bot.sendMessage(chatId, 'Пожалуйста, используйте кнопки для навигации по меню.', {
        reply_markup: getMainKeyboard()
      }).catch(error => console.error('Error sending message:', error.message));
      return true;
    }
  } catch (error) {
    console.error('Error in handleMenuMessage:', error.message);
    bot.sendMessage(chatId, 'Произошла ошибка при обработке сообщения. Пожалуйста, попробуйте еще раз.', {
      reply_markup: getMainKeyboard()
    }).catch(err => console.error('Error sending error message:', err.message));
    return false;
  }
}

function handleMenuConfirmation(bot, chatId) {
  try {
    const userData = stateManager.getUserData(chatId);
    const pizza = PIZZAS[userData.pizza];
    const size = SIZES[userData.size];
    const dough = DOUGH_TYPES[userData.dough];
    const extras = (userData.extras || []).map(extra => EXTRAS[extra]);
    
    const totalPrice = PriceCalculator.calculateMenuPizzaPrice(userData);

    let message = `
🍕 Ваш заказ 🍕

Пицца: ${pizza.name}
Размер: ${size.name}
Тесто: ${dough.name}
    `;

    if (extras.length > 0) {
      message += `\nДополнительно: ${extras.map(e => e.name).join(', ')}`;
    }

    message += `\n\nИтого: ${totalPrice}₽`;
    message += `\n\nПодтверждаете заказ?`;

    bot.sendMessage(chatId, message, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✅ Подтвердить заказ', callback_data: 'menu_final_confirm' },
            { text: '❌ Отменить', callback_data: 'menu_cancel' }
          ]
        ]
      }
    }).catch(error => {
      console.error('Error sending confirmation:', error.message);
    });
  } catch (error) {
    console.error('Error in handleMenuConfirmation:', error.message);
    bot.sendMessage(chatId, 'Произошла ошибка при подтверждении заказа. Пожалуйста, попробуйте еще раз.', {
      reply_markup: getMainKeyboard()
    }).catch(err => console.error('Error sending error message:', err.message));
  }
}

function handleAddressInput(bot, chatId, address) {
  try {
    const userData = stateManager.getUserData(chatId);
    const pizza = PIZZAS[userData.pizza];
    const size = SIZES[userData.size];
    const dough = DOUGH_TYPES[userData.dough];
    const extras = (userData.extras || []).map(extra => EXTRAS[extra]);
    
    const totalPrice = PriceCalculator.calculateMenuPizzaPrice(userData);

    // Генерируем случайное время доставки от 30 до 60 минут
    const deliveryTime = Math.floor(Math.random() * 31) + 30; // 30-60 минут

    // Создаем заказ
    const orderItems = [
      `${pizza.name} (${size.name}, ${dough.name})` + 
      (extras.length > 0 ? ` + ${extras.map(e => e.name).join(', ')}` : '')
    ];

    const order = stateManager.createOrder(chatId, {
      items: orderItems,
      total: totalPrice,
      type: 'menu',
      address: address,
      deliveryTime: deliveryTime
    });

    const message = `
🎉 Заказ подтвержден! 🎉

Ваш заказ #${order.id.slice(-3)} принят в обработку.

🍕 Состав заказа:
${orderItems.map(item => `• ${item}`).join('\n')}

🏠 Адрес доставки:
${address}

💰 Сумма к оплате: ${totalPrice}₽
⏰ Примерное время доставки: ${deliveryTime} минут

📞 Важно: Возможно, наш оператор позвонит вам для уточнения деталей заказа.

Для отслеживания статуса используйте команду /order_status
    `;

    bot.sendMessage(chatId, message, {
      reply_markup: getMainKeyboard()
    }).catch(error => {
      console.error('Error sending final order message:', error.message);
    });

    // Сбрасываем состояние
    stateManager.resetState(chatId);
  } catch (error) {
    console.error('Error in handleAddressInput:', error.message);
    bot.sendMessage(chatId, 'Произошла ошибка при обработке адреса. Пожалуйста, попробуйте еще раз.', {
      reply_markup: getMainKeyboard()
    }).catch(err => console.error('Error sending error message:', err.message));
  }
}