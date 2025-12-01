import TelegramBot from 'node-telegram-bot-api';
import { config } from 'dotenv';
import { stateManager } from '../utils/stateManager.js';
import * as menuHandlers from './handlers/menuHandlers.js';
import * as customPizzaHandlers from './handlers/customPizzaHandlers.js';
import * as orderStatusHandlers from './handlers/orderStatusHandlers.js';
import { MENU_STATES } from './states/menuState.js';
import { CUSTOM_PIZZA_STATES } from './states/customPizzaState.js';
import { getMainKeyboard } from './keyboards.js';

config();

class PizzaBot {
  constructor() {
    this.bot = new TelegramBot(process.env.BOT_TOKEN, { 
      polling: {
        timeout: 10,
        interval: 300
      }
    });
    this.setupHandlers();
  }

  setupHandlers() {
    // Команда /start
    this.bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      stateManager.resetState(chatId);
      stateManager.updateActivity(chatId);
      
      const welcomeMessage = `
🍕 Добро пожаловать в PizzaTime 2! 🍕

Выберите команду:
/menu - Посмотреть меню и заказать пиццу
/custom_pizza - Создать свою пиццу
/order_status - Проверить статус заказа
      `;
      
      this.bot.sendMessage(chatId, welcomeMessage, {
        reply_markup: getMainKeyboard()
      }).catch(error => {
        console.error('Error sending start message:', error.message);
      });
    });

    // Команда /menu
    this.bot.onText(/\/menu/, (msg) => {
      const chatId = msg.chat.id;
      stateManager.setState(chatId, MENU_STATES.MENU_START);
      stateManager.updateActivity(chatId);
      menuHandlers.handleMenuStart(this.bot, chatId);
    });

    // Команда /custom_pizza
    this.bot.onText(/\/custom_pizza/, (msg) => {
      const chatId = msg.chat.id;
      stateManager.setState(chatId, CUSTOM_PIZZA_STATES.CUSTOM_PIZZA_START);
      stateManager.updateActivity(chatId);
      customPizzaHandlers.handleCustomPizzaStart(this.bot, chatId);
    });

    // Команда /order_status
    this.bot.onText(/\/order_status/, (msg) => {
      const chatId = msg.chat.id;
      stateManager.updateActivity(chatId);
      orderStatusHandlers.handleOrderStatus(this.bot, chatId);
    });

    // Обработка callback запросов от inline кнопок
    this.bot.on('callback_query', (callbackQuery) => {
      const msg = callbackQuery.message;
      const chatId = msg.chat.id;
      const data = callbackQuery.data;
      const messageId = msg.message_id;

      stateManager.updateActivity(chatId);
      
      const state = stateManager.getState(chatId);

      // Обрабатываем callback с защитой от ошибок
      try {
        if (state && state.startsWith('MENU')) {
          menuHandlers.handleMenuCallback(this.bot, chatId, data);
        } else if (state && state.startsWith('CUSTOM')) {
          customPizzaHandlers.handleCustomPizzaCallback(this.bot, chatId, data);
        } else if (data && data.startsWith('status_')) {
          orderStatusHandlers.handleOrderStatusCallback(this.bot, chatId, data);
        }
      } catch (error) {
        console.error('Error handling callback:', error.message);
      }

      // Удаляем сообщение с кнопками после выбора
      this.bot.deleteMessage(chatId, messageId).catch(error => {
        // Игнорируем ошибки, если сообщение уже удалено или нет прав
        if (!error.message.includes('message to delete not found')) {
          console.error('Error deleting message:', error.message);
        }
      });

      // Ответ на callback query с обработкой ошибок
      this.bot.answerCallbackQuery(callbackQuery.id).catch(error => {
        // Игнорируем ошибки "query is too old"
        if (!error.message.includes('query is too old')) {
          console.error('Error answering callback query:', error.message);
        }
      });
    });

    // Обработка текстовых сообщений
    this.bot.on('message', (msg) => {
      if (msg.text && msg.text.startsWith('/')) return;

      const chatId = msg.chat.id;
      const text = msg.text ?? '';

      stateManager.updateActivity(chatId);
      
      const state = stateManager.getState(chatId);
      let handled = false;

      try {
        if (state && state.startsWith('MENU')) {
          handled = menuHandlers.handleMenuMessage(this.bot, chatId, text) === true;
        } else if (state && state.startsWith('CUSTOM')) {
          handled = customPizzaHandlers.handleCustomPizzaMessage(this.bot, chatId, text) === true;
        }

        if (!handled) {
          this.bot.sendMessage(chatId, 'Пожалуйста, используйте команды из меню для взаимодействия с ботом.', {
            reply_markup: getMainKeyboard()
          }).catch(error => console.error('Error sending message:', error.message));
        }
      } catch (error) {
        console.error('Error handling message:', error.message);
        this.bot.sendMessage(chatId, 'Произошла ошибка. Пожалуйста, попробуйте еще раз.', {
          reply_markup: getMainKeyboard()
        }).catch(err => console.error('Error sending error message:', err.message));
      }
    });

    // Обработка ошибок polling
    this.bot.on('polling_error', (error) => {
      console.error('Polling error:', error.message);
    });

    this.bot.on('webhook_error', (error) => {
      console.error('Webhook error:', error.message);
    });

    console.log('✅ PizzaTime 2 bot started successfully!');
  }
}

export default PizzaBot;