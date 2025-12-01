import { config } from 'dotenv';
import PizzaBot from './bot/index.js';

// Загружаем переменные окружения
config();

// Проверяем наличие токена бота
if (!process.env.BOT_TOKEN) {
  console.error('❌ Ошибка: BOT_TOKEN не найден в .env файле');
  process.exit(1);
}

// Глобальная обработка необработанных исключений
process.on('uncaughtException', (error) => {
  console.error('💥 Необработанное исключение:', error.message);
  console.error('Stack:', error.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Необработанный промис:', promise);
  console.error('Причина:', reason);
});

try {
  console.log('🚀 Запуск PizzaTime 2 бота...');
  
  // Создаем и запускаем бота
  const bot = new PizzaBot();
  
  // Обработка graceful shutdown
  process.on('SIGINT', () => {
    console.log('🛑 Получен SIGINT. Останавливаем бота...');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('🛑 Получен SIGTERM. Останавливаем бота...');
    process.exit(0);
  });
  
} catch (error) {
  console.error('❌ Критическая ошибка при запуске бота:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}