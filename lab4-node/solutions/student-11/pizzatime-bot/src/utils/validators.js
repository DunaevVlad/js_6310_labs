export class Validators {
  static validatePhone(phone) {
  const phoneRegex = /^(\+7|8)?9\d{9}$/;
  return phoneRegex.test(phone.trim());
}

  static validateEmail(email) {
    if (!email) return false;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validateName(name) {
    if (!name) return false;
    
    // Имя должно содержать только буквы, пробелы, дефисы и апострофы
    const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s\-']{2,50}$/;
    return nameRegex.test(name.trim());
  }

  static validateAddress(address) {
    if (!address) return false;
    
    // Адрес должен быть не менее 10 символов и содержать улицу/дом
    return address.trim().length >= 10;
  }

  static validateOrderItems(items) {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return false;
    }

    return items.every(item => 
      item && 
      typeof item === 'object' && 
      item.name && 
      typeof item.price === 'number' && 
      item.price > 0
    );
  }

  static validateUserInput(input, type = 'text') {
    if (!input || typeof input !== 'string') return false;

    const trimmed = input.trim();

    switch (type) {
      case 'phone':
        return this.validatePhone(trimmed);
      
      case 'email':
        return this.validateEmail(trimmed);
      
      case 'name':
        return this.validateName(trimmed);
      
      case 'address':
        return this.validateAddress(trimmed);
      
      case 'text':
        return trimmed.length > 0 && trimmed.length <= 500;
      
      default:
        return trimmed.length > 0;
    }
  }

  static sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // удаляем теги script
    .replace(/[<>"'`]/g, '') // удаляем опасные символы
    .substring(0, 500); // ограничиваем длину
  }

  static validateCallbackData(data, expectedPrefixes) {
    if (!data || typeof data !== 'string') return false;

    if (Array.isArray(expectedPrefixes)) {
      return expectedPrefixes.some(prefix => data.startsWith(prefix));
    }

    return data.startsWith(expectedPrefixes);
  }

  // Функция для экранирования Markdown символов
  static escapeMarkdown(text) {
    if (typeof text !== 'string') return text;
    
    return text.replace(/([_*[\]()~`>#+\-=|{}.!])/g, '\\$1');
  }
}

// Экспортируем также как отдельную функцию для удобства
export function escapeMarkdown(text) {
  return Validators.escapeMarkdown(text);
}

export default Validators;