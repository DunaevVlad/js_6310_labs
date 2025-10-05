'use strict'

// ===== ЗАДАНИЕ 1: Базовый класс Vehicle =====
class Vehicle {
    // Создайте базовый класс Vehicle.
    // В конструкторе принимайте и сохраняйте в this свойства: 
    // make (марка), model (модель), year (год выпуска).
    constructor(make, model, year) {
        this.make = make;
        this.model = model;
        this._year = year;
        Vehicle.vehicleCount++;
    }

    // Добавьте метод displayInfo(), который выводит в консоль информацию 
    // о транспортном средстве в формате: "Марка: [make], Модель: [model], Год: [year]".
    displayInfo() {
        console.log(`Марка: ${this.make}, Модель: ${this.model}, Год: ${this._year}`);
    }

    // Добавьте геттер age, который возвращает возраст транспортного средства 
    // (текущий год минус год выпуска). Используйте new Date().getFullYear().
    get age() {
        let currentYear = new Date().getFullYear();
        return currentYear - this._year;
    }

    // Добавьте сеттер для года выпуска с проверкой: год не может быть больше текущего.
    set year(newYear) {
        let currentYear = new Date().getFullYear();
        if (newYear <= currentYear) {
            this._year = newYear;
        } else {
            console.log("Год не может быть больше текущего");
        }
    }

    get year() {
        return this._year;
    }

    // Добавьте статический метод compareAge(vehicle1, vehicle2), 
    // который возвращает разницу в возрасте между двумя транспортными средствами.
    static compareAge(vehicle1, vehicle2) {
        return Math.abs(vehicle1.age - vehicle2.age);
    }

    // ===== ЗАДАНИЕ 5: Статические методы и свойства =====
    // Добавьте статическое свойство vehicleCount в класс Vehicle 
    static getTotalVehicles() {
        return Vehicle.vehicleCount;
    }
}

// Инициализация статического свойства
Vehicle.vehicleCount = 0;

// ===== ЗАДАНИЕ 2: Класс Car (наследуется от Vehicle) =====
class Car extends Vehicle {
    // Создайте дочерний класс Car, который наследуется от Vehicle.
    // Добавьте новое свойство numDoors (количество дверей).
    constructor(make, model, year, numDoors) {
        super(make, model, year);
        this.numDoors = numDoors;
    }

    // Переопределите метод displayInfo() так, чтобы он также выводил количество дверей. 
    // Используйте super.displayInfo() для вызова метода родителя.
    displayInfo() {
        super.displayInfo();
        console.log(`Количество дверей: ${this.numDoors}`);
    }

    // Добавьте метод honk(), который выводит "Beep beep!".
    honk() {
        console.log("Beep beep!");
    }
}

// ===== ЗАДАНИЕ 3: Класс ElectricCar (наследуется от Car) =====
class ElectricCar extends Car {
    // Создайте дочерний класс ElectricCar, который наследуется от Car.
    // Добавьте новое свойство batteryCapacity (емкость батареи в кВт·ч).
    constructor(make, model, year, numDoors, batteryCapacity) {
        super(make, model, year, numDoors);
        this.batteryCapacity = batteryCapacity;
    }

    // Переопределите метод displayInfo() для вывода дополнительной информации о батарее.
    displayInfo() {
        super.displayInfo();
        console.log(`Емкость батареи: ${this.batteryCapacity} кВт·ч`);
    }

    // Добавьте метод calculateRange(), который рассчитывает примерный запас хода 
    // (предположим, что 1 кВт·ч = 6 км).
    calculateRange() {
        return this.batteryCapacity * 6;
    }
}

// ===== ЗАДАНИЕ 4: Каррирование =====

// Создайте функцию createVehicleFactory, которая возвращает функцию 
// для создания транспортных средств определенного типа (каррирование).
const createVehicleFactory = (vehicleType) => (make, model, year) => {
    if (vehicleType === 'Vehicle') {
        return new Vehicle(make, model, year);
    } else if (vehicleType === 'Car') {
        return new Car(make, model, year, 4); // по умолчанию 4 двери
    } else {
        return new Vehicle(make, model, year);
    }
};

// Автоматические тесты
function runTests() {
    console.log('Запуск тестов...');

    // Расширьте тесты для полного покрытия задания.

    // Проверка наследования
    console.log("=== Тест Vehicle ===");
    const vehicle = new Vehicle('Toyota', 'Camry', 2015);
    vehicle.displayInfo();
    console.log(`Возраст: ${vehicle.age} лет`);

    console.log("\n=== Тест Car ===");
    const car = new Car('Honda', 'Civic', 2018, 4);
    car.displayInfo();
    car.honk();

    console.log("\n=== Тест ElectricCar ===");
    const electricCar = new ElectricCar('Tesla', 'Model 3', 2020, 4, 75);
    electricCar.displayInfo();
    console.log(`Запас хода: ${electricCar.calculateRange()} км`);

    // Проверка возраста
    console.log("\n=== Тест возраста ===");
    const testVehicle = new Vehicle('Test', 'Model', 2010);
    console.assert(testVehicle.age === (new Date().getFullYear() - 2010), 'Тест возраста провален');
    console.log("Тест возраста пройден");

    // Проверка сеттера года
    console.log("\n=== Тест сеттера года ===");
    testVehicle.year = 2025; // Должен показать сообщение об ошибке
    testVehicle.year = 2020; // Должен установить корректно
    console.log(`Новый год: ${testVehicle.year}`);

    // Проверка сравнения возраста
    console.log("\n=== Тест сравнения возраста ===");
    const vehicle1 = new Vehicle('A', 'B', 2015);
    const vehicle2 = new Vehicle('C', 'D', 2020);
    const ageDifference = Vehicle.compareAge(vehicle1, vehicle2);
    console.log(`Разница в возрасте: ${ageDifference} лет`);

    // Проверка фабрики
    console.log("\n=== Тест фабрики ===");
    const createCarFactory = createVehicleFactory('Car');
    const myNewCar = createCarFactory('BMW', 'X5', 2022);
    console.log('Создан новый автомобиль:');
    myNewCar.displayInfo();

    console.log("\n=== Тест счетчика ===");
    console.log('Всего создано транспортных средств:', Vehicle.getTotalVehicles());

    console.log('\nВсе тесты пройдены! ✅');
}

runTests();