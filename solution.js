// ===== ЗАДАНИЕ 1: Базовые операции =====
function simpleTask() {
    // 1.1 Объявите переменные разных типов (не менне 5)
    let number = 10;
    let text = "Привет мир";
    let isTrue = true;
    let emptyValue = null;
    let notDefined;
    let array = [1, 2, 3];
    let object = { name: "Иван" };

    // 1.2 Выведите типы всех переменных
    console.log("Тип number:", typeof number);
    console.log("Тип text:", typeof text);
    console.log("Тип isTrue:", typeof isTrue);
    console.log("Тип emptyValue:", typeof emptyValue);
    console.log("Тип notDefined:", typeof notDefined);
    console.log("Тип array:", typeof array);
    console.log("Тип object:", typeof object);
}

// ===== ЗАДАНИЕ 2: Функции =====
function getReviewerNumber(number, lab) {
    // 2.1 Функция определяющая номер ревьюера для вашей группы по вашему номеру и номеру лабораторной работы
    return (number + lab) % 10 || 10;
}

function getVariant(number, variants) {
    // 2.2 Функция определяющая номер варианта, исходя из количества вариантов
    return (number % variants) || variants;
}

function calculate(a, b, operation) {
    // 2.3 Напишите функцию калькулятор, калькулятор обрабатывает следующие операции: +, -, *, /
    if (operation === '+') {
        return a + b;
    } else if (operation === '-') {
        return a - b;
    } else if (operation === '*') {
        return a * b;
    } else if (operation === '/') {
        if (b === 0) {
            return "Ошибка: деление на ноль";
        }
        return a / b;
    } else {
        return "Неизвестная операция";
    }
}

function calculateArea(figure, ...params) {
    // 2.4 Напишите функцию для определения площади фигур 'circle', 'rectangle', 'triangle'
    // Используйте switch.
    switch (figure) {
        case 'circle':
            let radius = params[0];
            return Math.PI * radius * radius;
        case 'rectangle':
            let width = params[0];
            let height = params[1];
            return width * height;
        case 'triangle':
            let base = params[0];
            let triangleHeight = params[1];
            return 0.5 * base * triangleHeight;
        default:
            return "Неизвестная фигура";
    }
}

// 2.5 Стрелочные функции
const reverseString = (str) => {
    // Функция возвращает перевернутую строку
    let reversed = "";
    for (let i = str.length - 1; i >= 0; i--) {
        reversed += str[i];
    }
    return reversed;
};

const getRandomNumber = (min, max) => {
    // Функция возвращает случайное число между min и max
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// ===== ЗАДАНИЕ 3: Объекты =====
const book = {
    // 3.1 Создайте объект "книга" с полями для хранения заголовка, автора, 
    // года выпуска, количества страниц, и доступности
    title: "JavaScript для начинающих",
    author: "Иван Иванов",
    year: 2023,
    pages: 300,
    isAvailable: true,

    // объект должен иметь два метода getInfo возвращает одной строкой информацию о названии книги, аторе, годе выпуска, количестве страниц
    getInfo: function () {
        return `Книга: "${this.title}", Автор: ${this.author}, Год: ${this.year}, Страниц: ${this.pages}`;
    },

    // метод toggleAvailability - который меняет значение доступности и возвращает его
    toggleAvailability: function () {
        this.isAvailable = !this.isAvailable;
        return this.isAvailable;
    }
};

const student = {
    // 3.2 Реализуйте методы объекта "студент" 
    name: "Анна Петрова",
    age: 20,
    course: 2,
    grades: {
        math: 90,
        programming: 95,
        history: 85
    },

    // Метод для расчета среднего балла
    getAverageGrade() {
        // Ваш код здесь
        let sum = 0;
        let count = 0;

        for (let subject in this.grades) {
            sum += this.grades[subject];
            count++;
        }

        return sum / count;
    },

    // Метод для добавления новой оценки
    addGrade(subject, grade) {
        // Ваш код здесь
        this.grades[subject] = grade;
    }
};

// ===== ЗАДАНИЕ 4: Массивы =====
function processArrays() {
    const numbers = [12, 45, 23, 67, 34, 89, 56, 91, 27, 14];
    const words = ["JavaScript", "программирование", "массив", "функция", "объект"];
    const users = [
        { id: 1, name: "Анна", age: 25, isActive: true },
        { id: 2, name: "Борис", age: 30, isActive: false },
        { id: 3, name: "Виктория", age: 22, isActive: true },
        { id: 4, name: "Григорий", age: 35, isActive: true },
        { id: 5, name: "Дарья", age: 28, isActive: false }
    ];

    // 1. Используйте forEach для вывода всех чисел больше 50
    console.log("Числа больше 50:");
    numbers.forEach(function (number) {
        if (number > 50) {
            console.log(number);
        }
    });

    // 2. Используйте map для создания массива квадратов чисел
    const squares = numbers.map(function (number) {
        return number * number;
    });
    console.log("Квадраты чисел:", squares);

    // 3. Используйте filter для получения активных пользователей
    const activeUsers = users.filter(function (user) {
        return user.isActive === true;
    });
    console.log("Активные пользователи:", activeUsers);

    // 4. Используйте find для поиска пользователя с именем "Виктория"
    const victoria = users.find(function (user) {
        return user.name === "Виктория";
    });
    console.log("Пользователь Виктория:", victoria);

    // 5. Используйте reduce для подсчета суммы всех чисел
    const sum = numbers.reduce(function (total, number) {
        return total + number;
    }, 0);
    console.log("Сумма всех чисел:", sum);

    // 6. Используйте sort для сортировки пользователей по возрасту (по убыванию)
    const sortedByAge = users.slice().sort(function (a, b) {
        return b.age - a.age;
    });
    console.log("Пользователи отсортированные по возрасту (убывание):", sortedByAge);

    // 7. Используйте метод для проверки, все ли пользователи старше 18 лет
    const allAdults = users.every(function (user) {
        return user.age > 18;
    });
    console.log("Все пользователи старше 18 лет:", allAdults);

    // 8. Создайте цепочку методов: 
    //    - отфильтровать активных пользователей
    //    - преобразовать в массив имен
    //    - отсортировать по алфавиту
    const activeUserNames = users
        .filter(function (user) {
            return user.isActive === true;
        })
        .map(function (user) {
            return user.name;
        })
        .sort();
    console.log("Имена активных пользователей по алфавиту:", activeUserNames);
}

// ===== ЗАДАНИЕ 5: Менеджер задач =====
const taskManager = {
    tasks: [
        { id: 1, title: "Изучить JavaScript", completed: false, priority: "high" },
        { id: 2, title: "Сделать лабораторную работу", completed: true, priority: "high" },
        { id: 3, title: "Прочитать книгу", completed: false, priority: "medium" }
    ],

    addTask(title, priority = "medium") {
        // 5.1 Добавление задачи
        let newId = 1;
        if (this.tasks.length > 0) {
            newId = Math.max(...this.tasks.map(task => task.id)) + 1;
        }

        const newTask = {
            id: newId,
            title: title,
            completed: false,
            priority: priority
        };

        this.tasks.push(newTask);
        return newTask;
    },

    completeTask(taskId) {
        // 5.2 Отметка выполнения
        let task = this.tasks.find(function (task) {
            return task.id === taskId;
        });

        if (task) {
            task.completed = true;
            return true;
        }
        return false;
    },

    // Удаление задачи
    deleteTask(taskId) {
        // 5.3 Ваш код здесь
        let index = this.tasks.findIndex(function (task) {
            return task.id === taskId;
        });

        if (index !== -1) {
            this.tasks.splice(index, 1);
            return true;
        }
        return false;
    },

    // Получение списка задач по статусу
    getTasksByStatus(completed) {
        // 5.4 Ваш код здесь
        return this.tasks.filter(function (task) {
            return task.completed === completed;
        });
    },

    getStats() {
        /* 5.5 Статистика возвращает объект:        
        total,
        completed,
        pending,
        completionRate
        */
        let total = this.tasks.length;
        let completed = this.tasks.filter(function (task) {
            return task.completed === true;
        }).length;
        let pending = total - completed;
        let completionRate = total > 0 ? (completed / total) * 100 : 0;

        return {
            total: total,
            completed: completed,
            pending: pending,
            completionRate: completionRate.toFixed(2)
        };
    }
};

// ===== ЗАДАНИЕ 6: Регулярные выражения =====
// ВАРИАНТ 3: Валидация номера телефона (российский формат)

/**
 * Вариант 3: Валидация номера телефона (российский формат)
 * Поддерживает форматы:
 * - +7 (999) 123-45-67
 * - 8 (999) 123-45-67  
 * - 89991234567
 * - +7(999)123-45-67
 */
function validatePhone(phone) {
    const phoneRegex = /^(\+7|8)[\s(-]?\d{3}[\s)-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;
    return phoneRegex.test(phone);
}

// Тесты для валидации номера телефона
function testPhoneValidation() {
    console.log("=== ТЕСТИРОВАНИЕ ВАЛИДАЦИИ ТЕЛЕФОНА ===");

    // Правильные форматы
    console.log("+7 (999) 123-45-67:", validatePhone("+7 (999) 123-45-67")); // true
    console.log("8 (999) 123-45-67:", validatePhone("8 (999) 123-45-67"));   // true
    console.log("89991234567:", validatePhone("89991234567"));               // true
    console.log("+7(999)123-45-67:", validatePhone("+7(999)123-45-67"));     // true
    console.log("8-999-123-45-67:", validatePhone("8-999-123-45-67"));       // true

    // Неправильные форматы
    console.log("+7999123456:", validatePhone("+7999123456"));               // false (мало цифр)
    console.log("+799912345678:", validatePhone("+799912345678"));           // false (много цифр)
    console.log("9 (999) 123-45-67:", validatePhone("9 (999) 123-45-67"));   // false (начинается не с 7 или 8)
    console.log("+7 (abc) 123-45-67:", validatePhone("+7 (abc) 123-45-67")); // false (буквы вместо цифр)
    console.log("телефон:", validatePhone("телефон"));                       // false (только буквы)
    console.log("1234567890:", validatePhone("1234567890"));                 // false (начинается не с 7 или 8)
}

// ===== ТЕСТИРОВАНИЕ =====
function runTests() {
    console.log("=== ТЕСТИРОВАНИЕ ===");

    // Тест 1: getReviewerNumber
    console.assert(getReviewerNumber(5, 1) === 6, "Тест получения ревьюера провален");
    console.log("Тест getReviewerNumber: пройден");

    // Тест 2: calculate
    console.assert(calculate(10, 5, '+') === 15, "Тест сложения провален");
    console.assert(calculate(10, 5, '-') === 5, "Тест вычитания провален");
    console.assert(calculate(10, 5, '*') === 50, "Тест умножения провален");
    console.assert(calculate(10, 5, '/') === 2, "Тест деления провален");
    console.log("Тест calculate: пройден");

    // Тест 3: reverseString
    console.assert(reverseString("hello") === "olleh", "Тест переворота строки провален");
    console.log("Тест reverseString: пройден");

    // Тест 4: book object
    console.assert(book.getInfo().includes("JavaScript"), "Тест книги провален");
    console.log("Тест book: пройден");

    // Тест 5: student object
    console.assert(student.getAverageGrade() > 0, "Тест студента провален");
    console.log("Тест student: пройден");

    // Тест 6: taskManager
    let initialCount = taskManager.tasks.length;
    taskManager.addTask("Новая задача");
    console.assert(taskManager.tasks.length === initialCount + 1, "Тест добавления задачи провален");
    console.log("Тест taskManager: пройден");

    console.log("Все тесты пройдены! ✅");
}

// Запуск всех функций для демонстрации
console.log("=== ДЕМОНСТРАЦИЯ РАБОТЫ ФУНКЦИЙ ===");

// Задание 1
console.log("--- Задание 1: Базовые операции ---");
simpleTask();

// Задание 2
console.log("\n--- Задание 2: Функции ---");
console.log("Номер ревьюера для студента 5, лаба 1:", getReviewerNumber(5, 1));
console.log("Вариант для студента 7 из 3 вариантов:", getVariant(7, 3));
console.log("10 + 5 =", calculate(10, 5, '+'));
console.log("Площадь круга радиусом 5:", calculateArea('circle', 5));
console.log("Перевернутая строка 'hello':", reverseString("hello"));
console.log("Случайное число от 1 до 10:", getRandomNumber(1, 10));

// Задание 3
console.log("\n--- Задание 3: Объекты ---");
console.log("Информация о книге:", book.getInfo());
console.log("Доступность книги после переключения:", book.toggleAvailability());
console.log("Средний балл студента:", student.getAverageGrade());
student.addGrade("physics", 88);
console.log("После добавления физики, средний балл:", student.getAverageGrade());

// Задание 4
console.log("\n--- Задание 4: Массивы ---");
processArrays();

// Задание 5
console.log("\n--- Задание 5: Менеджер задач ---");
taskManager.addTask("Выучить регулярные выражения", "high");
taskManager.completeTask(3);
console.log("Все задачи:", taskManager.tasks);
console.log("Незавершенные задачи:", taskManager.getTasksByStatus(false));
console.log("Статистика:", taskManager.getStats());

// Задание 6
console.log("\n--- Задание 6: Регулярные выражения (Вариант 3) ---");
testPhoneValidation();

// Запуск тестов
console.log("\n");
runTests();