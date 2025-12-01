import { 
  CUSTOM_PIZZA_STATES, 
  SAUCES, 
  CHEESES, 
  TOPPINGS, 
  CUSTOM_SIZES 
} from '../states/customPizzaState.js';
import { stateManager } from '../../utils/stateManager.js';
import { PriceCalculator } from '../../utils/priceCalculator.js';
import { getMainKeyboard } from '../keyboards.js';

export function handleCustomPizzaStart(bot, chatId) {
  try {
    const message = `
🍕 Создайте свою пиццу 🍕

Давайте создадим пиццу вашей мечты!

Выберите соус для основы:
    `;

    const keyboard = Object.entries(SAUCES).map(([key, sauce]) => [
      {
        text: `${sauce.name} ${sauce.price > 0 ? `(+${sauce.price}₽)` : ''}`,
        callback_data: `custom_sauce_${key}`
      }
    ]);

    stateManager.setState(chatId, CUSTOM_PIZZA_STATES.CUSTOM_PIZZA_START);
    
    bot.sendMessage(chatId, message, {
      reply_markup: { inline_keyboard: keyboard }
    }).catch(error => {
      console.error('Error sending custom pizza start:', error.message);
    });
  } catch (error) {
    console.error('Error in handleCustomPizzaStart:', error.message);
    bot.sendMessage(chatId, 'Произошла ошибка при создании пиццы. Пожалуйста, попробуйте еще раз.', {
      reply_markup: getMainKeyboard()
    }).catch(err => console.error('Error sending error message:', err.message));
  }
}

export function handleCustomPizzaCallback(bot, chatId, data) {
  try {
    if (data.startsWith('custom_sauce_')) {
      const sauceKey = data.replace('custom_sauce_', '');
      stateManager.setUserData(chatId, { sauce: sauceKey });
      stateManager.setState(chatId, CUSTOM_PIZZA_STATES.CUSTOM_SELECT_CHEESE);

      const message = `
Отлично! Теперь выберите сыр:
      `;

      const keyboard = Object.entries(CHEESES).map(([key, cheese]) => [
        {
          text: `${cheese.name} ${cheese.price > 0 ? `(+${cheese.price}₽)` : ''}`,
          callback_data: `custom_cheese_${key}`
        }
      ]);

      bot.sendMessage(chatId, message, {
        reply_markup: { inline_keyboard: keyboard }
      }).catch(error => {
        console.error('Error sending sauce selection:', error.message);
      });
    }
    else if (data.startsWith('custom_cheese_')) {
      const cheeseKey = data.replace('custom_cheese_', '');
      stateManager.updateUserData(chatId, { cheese: cheeseKey });
      stateManager.setState(chatId, CUSTOM_PIZZA_STATES.CUSTOM_SELECT_TOPPINGS);

      const message = `
Выберите начинки для вашей пиццы:
(Можно выбрать несколько)
      `;

      // Создаем клавиатуру с начинками (по 2 в ряду для лучшего отображения)
      const toppingsEntries = Object.entries(TOPPINGS);
      const keyboard = [];
      
      for (let i = 0; i < toppingsEntries.length; i += 2) {
        const row = [];
        for (let j = 0; j < 2 && i + j < toppingsEntries.length; j++) {
          const [key, topping] = toppingsEntries[i + j];
          row.push({
            text: `${topping.name} (+${topping.price}₽)`,
            callback_data: `custom_topping_${key}`
          });
        }
        keyboard.push(row);
      }

      keyboard.push([
        { text: 'Продолжить', callback_data: 'custom_continue' }
      ]);

      bot.sendMessage(chatId, message, {
        reply_markup: { inline_keyboard: keyboard }
      }).catch(error => {
        console.error('Error sending cheese selection:', error.message);
      });
    }
    else if (data.startsWith('custom_topping_')) {
      const toppingKey = data.replace('custom_topping_', '');
      const userData = stateManager.getUserData(chatId);
      const toppings = userData.toppings || [];
      
      if (!toppings.includes(toppingKey)) {
        toppings.push(toppingKey);
        stateManager.updateUserData(chatId, { toppings });
      }

      // Показываем текущий прогресс
      const currentToppings = toppings.map(topping => TOPPINGS[topping].name).join(', ') || 'нет';
      
      // Используем базовую цену без размера на этапе выбора начинок
      const currentPrice = PriceCalculator.calculateCustomPizzaBasePrice(userData);

      const message = `
Текущий состав вашей пиццы:

Соус: ${SAUCES[userData.sauce].name}
Сыр: ${CHEESES[userData.cheese].name}
Начинки: ${currentToppings}

Текущая стоимость (без размера): ${currentPrice}₽

Можете добавить еще начинки или продолжить:
      `;

      // Обновленная клавиатура
      const toppingsEntries = Object.entries(TOPPINGS);
      const keyboard = [];
      
      for (let i = 0; i < toppingsEntries.length; i += 2) {
        const row = [];
        for (let j = 0; j < 2 && i + j < toppingsEntries.length; j++) {
          const [key, topping] = toppingsEntries[i + j];
          const isSelected = toppings.includes(key);
          row.push({
            text: `${isSelected ? '✅ ' : ''}${topping.name} (+${topping.price}₽)`,
            callback_data: `custom_topping_${key}`
          });
        }
        keyboard.push(row);
      }

      keyboard.push([
        { text: `➡️ Продолжить (${currentPrice}₽)`, callback_data: 'custom_continue' }
      ]);

      bot.sendMessage(chatId, message, {
        reply_markup: { inline_keyboard: keyboard }
      }).catch(error => {
        console.error('Error sending toppings selection:', error.message);
      });
    }
    else if (data === 'custom_continue') {
      stateManager.setState(chatId, CUSTOM_PIZZA_STATES.CUSTOM_SELECT_SIZE);
      handleCustomSizeSelection(bot, chatId);
    }
    else if (data.startsWith('custom_size_')) {
      const sizeKey = data.replace('custom_size_', '');
      stateManager.updateUserData(chatId, { size: sizeKey });
      stateManager.setState(chatId, CUSTOM_PIZZA_STATES.CUSTOM_CONFIRM_ORDER);
      handleCustomConfirmation(bot, chatId);
    }
    else if (data === 'custom_final_confirm') {
      // Вместо создания заказа сразу, запрашиваем адрес
      stateManager.setState(chatId, CUSTOM_PIZZA_STATES.CUSTOM_AWAITING_ADDRESS);
      
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
    else if (data === 'custom_cancel') {
      stateManager.resetState(chatId);
      bot.sendMessage(chatId, 'Заказ отменен. Используйте /custom_pizza для создания новой пиццы.', {
        reply_markup: getMainKeyboard()
      }).catch(error => console.error('Error sending cancel message:', error.message));
    }
  } catch (error) {
    console.error('Error in handleCustomPizzaCallback:', error.message);
    bot.sendMessage(chatId, 'Произошла ошибка при обработке запроса. Пожалуйста, попробуйте еще раз.', {
      reply_markup: getMainKeyboard()
    }).catch(err => console.error('Error sending error message:', err.message));
  }
}

export function handleCustomPizzaMessage(bot, chatId, text) {
  try {
    const state = stateManager.getState(chatId);
    
    if (state === CUSTOM_PIZZA_STATES.CUSTOM_AWAITING_ADDRESS) {
      // Пользователь ввел адрес
      handleCustomAddressInput(bot, chatId, text);
    } else {
      bot.sendMessage(chatId, 'Пожалуйста, используйте кнопки для выбора опций кастомной пиццы.', {
        reply_markup: getMainKeyboard()
      }).catch(error => console.error('Error sending message:', error.message));
    }
  } catch (error) {
    console.error('Error in handleCustomPizzaMessage:', error.message);
    bot.sendMessage(chatId, 'Произошла ошибка при обработке сообщения. Пожалуйста, попробуйте еще раз.', {
      reply_markup: getMainKeyboard()
    }).catch(err => console.error('Error sending error message:', err.message));
  }
}

function handleCustomSizeSelection(bot, chatId) {
  try {
    const userData = stateManager.getUserData(chatId);
    const basePrice = PriceCalculator.calculateCustomPizzaBasePrice(userData);

    const message = `
Выберите размер пиццы:
    `;

    const keyboard = Object.entries(CUSTOM_SIZES).map(([key, size]) => {
      const totalPrice = basePrice + size.basePrice;
      return [{
        text: `${size.name} - ${totalPrice}₽`,
        callback_data: `custom_size_${key}`
      }];
    });

    bot.sendMessage(chatId, message, {
      reply_markup: { inline_keyboard: keyboard }
    }).catch(error => {
      console.error('Error sending size selection:', error.message);
    });
  } catch (error) {
    console.error('Error in handleCustomSizeSelection:', error.message);
    bot.sendMessage(chatId, 'Произошла ошибка при выборе размера. Пожалуйста, попробуйте еще раз.', {
      reply_markup: getMainKeyboard()
    }).catch(err => console.error('Error sending error message:', err.message));
  }
}

function handleCustomConfirmation(bot, chatId) {
  try {
    const userData = stateManager.getUserData(chatId);
    const sauce = SAUCES[userData.sauce];
    const cheese = CHEESES[userData.cheese];
    const size = CUSTOM_SIZES[userData.size];
    const toppings = (userData.toppings || []).map(topping => TOPPINGS[topping]);
    
    const totalPrice = PriceCalculator.calculateCustomPizzaPrice(userData);

    let message = `
🍕 Ваша кастомная пицца 🍕

Соус: ${sauce.name}
Сыр: ${cheese.name}
Размер: ${size.name}
    `;

    if (toppings.length > 0) {
      message += `\nНачинки: ${toppings.map(t => t.name).join(', ')}`;
    } else {
      message += `\nНачинки: классическая`;
    }

    message += `\n\nИтого: ${totalPrice}₽`;
    message += `\n\nПодтверждаете заказ?`;

    bot.sendMessage(chatId, message, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✅ Подтвердить заказ', callback_data: 'custom_final_confirm' },
            { text: '❌ Отменить', callback_data: 'custom_cancel' }
          ]
        ]
      }
    }).catch(error => {
      console.error('Error sending confirmation:', error.message);
    });
  } catch (error) {
    console.error('Error in handleCustomConfirmation:', error.message);
    bot.sendMessage(chatId, 'Произошла ошибка при подтверждении заказа. Пожалуйста, попробуйте еще раз.', {
      reply_markup: getMainKeyboard()
    }).catch(err => console.error('Error sending error message:', err.message));
  }
}

function handleCustomAddressInput(bot, chatId, address) {
  try {
    const userData = stateManager.getUserData(chatId);
    const sauce = SAUCES[userData.sauce];
    const cheese = CHEESES[userData.cheese];
    const size = CUSTOM_SIZES[userData.size];
    const toppings = (userData.toppings || []).map(topping => TOPPINGS[topping]);
    
    const totalPrice = PriceCalculator.calculateCustomPizzaPrice(userData);

    // Генерируем случайное время доставки от 30 до 60 минут
    const deliveryTime = Math.floor(Math.random() * 31) + 30; // 30-60 минут

    // Создаем заказ
    const toppingNames = toppings.map(t => t.name).join(', ');
    const orderItems = [
      `Кастомная пицца (${size.name}) - ${sauce.name}, ${cheese.name}` + 
      (toppings.length > 0 ? `, ${toppingNames}` : '')
    ];

    const order = stateManager.createOrder(chatId, {
      items: orderItems,
      total: totalPrice,
      type: 'custom',
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
    console.error('Error in handleCustomAddressInput:', error.message);
    bot.sendMessage(chatId, 'Произошла ошибка при обработке адреса. Пожалуйста, попробуйте еще раз.', {
      reply_markup: getMainKeyboard()
    }).catch(err => console.error('Error sending error message:', err.message));
  }
}