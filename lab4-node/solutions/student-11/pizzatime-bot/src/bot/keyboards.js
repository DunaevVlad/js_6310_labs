export function getMainKeyboard() {
  return {
    keyboard: [
      ['/menu', '/custom_pizza'],
      ['/order_status']
    ],
    resize_keyboard: true
  };
}

export function removeInlineKeyboard() {
  return {
    remove_keyboard: false // Не удаляем основную клавиатуру
  };
}