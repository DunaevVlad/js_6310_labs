'use strict'

// ===== ЗАДАНИЕ 1: Базовый класс Vehicle =====
class Vehicle {
    static vehicleCount = 0;

    constructor(make, model, year) {
        this._validateMake(make);
        this._validateModel(model);
        this._validateYear(year);
        
        this.make = make;
        this.model = model;
        this._year = year;

        Vehicle.vehicleCount++;
    }

    _validateMake(make) {
        if (typeof make !== 'string' || make.trim().length === 0) {
            throw new Error('Некорректная марка');
        }
    }

    _validateModel(model) {
        if (typeof model !== 'string' || model.trim().length === 0) {
            throw new Error('Некорректная модель');
        }
    }

    _validateYear(year) {
        if (typeof year !== 'number' || isNaN(year) || !Number.isInteger(year)) {
            throw new Error('Год должен быть целым числом');
        }
        const currentYear = new Date().getFullYear();
        if (year > currentYear) {
            throw new Error(`Год не может быть больше текущего: ${currentYear}`);
        }
        if (year < 1500) {
            throw new Error('Год не может быть меньше 1500');
        }
    }

    displayInfo() {
        console.log(`Марка: ${this.make}, Модель: ${this.model}, Год: ${this._year}`);
    }

    get age() {
        return new Date().getFullYear() - this._year;
    }

    set year(newYear) {
        this._validateYear(newYear);
        this._year = newYear;
    }

    get year() {
        return this._year;
    }

    static compareAge(vehicle1, vehicle2) {
        return Math.abs(vehicle1.age - vehicle2.age);
    }

    static getTotalVehicles() {
        return Vehicle.vehicleCount;
    }
}

// ===== ЗАДАНИЕ 2: Класс Car (наследуется от Vehicle) =====
class Car extends Vehicle {
    constructor(make, model, year, numDoors) {
        Car._validateNumDoors(numDoors);
        super(make, model, year);
        this.numDoors = numDoors;
    }

    static _validateNumDoors(numDoors) {
        if (typeof numDoors !== 'number' || isNaN(numDoors) || !Number.isInteger(numDoors) || numDoors < 1) {
            throw new Error('Некорректное количество дверей');
        }
    }

    displayInfo() {
        super.displayInfo();
        console.log(`Количество дверей: ${this.numDoors}`);
    }

    honk() {
        console.log("Beep beep!");
    }
}

// ===== ЗАДАНИЕ 3: Класс ElectricCar (наследуется от Car) =====
class ElectricCar extends Car {
    constructor(make, model, year, numDoors, batteryCapacity) {
        ElectricCar._validateBatteryCapacity(batteryCapacity);
        super(make, model, year, numDoors);
        this.batteryCapacity = batteryCapacity;
    }

    static _validateBatteryCapacity(batteryCapacity) {
        if (typeof batteryCapacity !== 'number' || isNaN(batteryCapacity) || !Number.isInteger(batteryCapacity) || batteryCapacity < 1) {
            throw new Error('Некорректная емкость батареи');
        }
    }

    displayInfo() {
        super.displayInfo();
        console.log(`Емкость батареи: ${this.batteryCapacity} кВт·ч`);
    }

    calculateRange() {
        return this.batteryCapacity * 6;
    }
}

// ===== ЗАДАНИЕ 4: Каррирование =====
const createVehicleFactory = (vehicleType) => (make, model, year, ...args) => {
    return new vehicleType(make, model, year, ...args);
};

// ===== ПОЛНАЯ СИСТЕМА ТЕСТИРОВАНИЯ =====
function runTests() {
    console.log("=== Задание 1 ===");
    
    // тр. средство 1
    const vehicle_1 = new Vehicle('Toyota', 'Camry', 2015);
    vehicle_1.displayInfo();
    console.log(`Возраст: ${vehicle_1.age} лет`);
    
    // тр. средство 2
    const vehicle_2 = new Vehicle('Toyota', 'Camry', 2010);
    vehicle_2.displayInfo();
    console.log(`Возраст: ${vehicle_2.age} лет`);
    
    // для двух тр.средств
    console.log(`Разница возраста: ${Vehicle.compareAge(vehicle_1, vehicle_2)} лет`);
    console.log(`Общее количество созданных транспортных средств: ${Vehicle.getTotalVehicles()} шт`);
    
    // проверка ошибок Vehicle
    const errorTests = [
        () => new Vehicle(1, 'Camry', 2015),
        () => new Vehicle("", 'Camry', 2015),
        () => new Vehicle('Toyota', 1, 2015),
        () => new Vehicle('Toyota', "", 2015),
        () => new Vehicle('Toyota', 'Camry', "2015"),
        () => new Vehicle('Toyota', 'Camry'),
        () => new Vehicle('Toyota', 'Camry', 2015.5),
        () => new Vehicle('Toyota', 'Camry', 2030),
        () => new Vehicle('Toyota', 'Camry', 1),
        () => { vehicle_1.year = 2026; }
    ];

    errorTests.forEach((test, index) => {
        try {
            test();
            console.log(`Тест ${index + 1}: ошибка не сработала`);
        } catch (e) {
            console.log(`Правильно обработана ошибка ${index + 1}:`, e.message);
        }
    });

    // Проверки утверждений
    console.assert(vehicle_1.make === 'Toyota', 'не совпадает марка');
    console.assert(vehicle_1.model === 'Camry', 'не совпадает модель');
    console.assert(vehicle_1.year === 2015, 'не совпадает год');
    console.assert(vehicle_1.age === new Date().getFullYear() - 2015, 'не совпадает возраст тр.средства');
    console.assert(Vehicle.compareAge(vehicle_1, vehicle_2) === Math.abs(vehicle_1.age - vehicle_2.age), 'не совпадает разница возраста тр.средств');
    console.assert(Vehicle.getTotalVehicles() === 2, 'не совпадает кол-во тр.средства');
    
    vehicle_1.year = 2010;
    vehicle_1.displayInfo();
    console.assert(vehicle_1.year === 2010, 'не совпадает год');

    console.log();
    console.log("=== Задание 2 ===");
    
    // тр. средство 3
    const car = new Car('Honda', 'Civic', 2018, 4);
    car.displayInfo();
    console.log(`Возраст: ${car.age} лет`);
    
    console.log(`Разница возраста: ${Vehicle.compareAge(car, vehicle_2)} лет`);
    console.log(`Общее количество созданных транспортных средств: ${Vehicle.getTotalVehicles()} шт`);
    
    car.honk();
    
    // проверка ошибок Car
    const carErrorTests = [
        () => new Car(1, 'Civic', 2018, 4),
        () => new Car("", 'Civic', 2018, 4),
        () => new Car('Honda', 1, 2018, 4),
        () => new Car('Honda', "", 2018, 4),
        () => new Car('Honda', 'Civic', "2018", 4),
        () => new Car('Honda', 'Civic', 2018.5, 4),
        () => new Car('Honda', 'Civic', 2030, 4),
        () => new Car('Honda', 'Civic', 1, 4),
        () => new Car('Honda', 'Civic', 2018, "4"),
        () => new Car('Honda', 'Civic', 2018),
        () => new Car('Honda', 'Civic', 2018, 4.5),
        () => new Car('Honda', 'Civic', 2018, 0),
        () => { car.year = 2026; }
    ];

    carErrorTests.forEach((test, index) => {
        try {
            test();
            console.log(`Тест Car ${index + 1}: ошибка не сработала`);
        } catch (e) {
            console.log(`Правильно обработана ошибка Car ${index + 1}:`, e.message);
        }
    });

    console.assert(car.make === 'Honda', 'не совпадает марка');
    console.assert(car.model === 'Civic', 'не совпадает модель');
    console.assert(car.year === 2018, 'не совпадает год');
    console.assert(car.numDoors === 4, 'не совпадает кол-во дверей');
    console.assert(car.age === new Date().getFullYear() - 2018, 'не совпадает возраст тр.средства');
    console.assert(Vehicle.getTotalVehicles() === 3, 'не совпадает кол-во тр.средства');
    
    car.year = 2000;
    car.displayInfo();
    console.assert(car.year === 2000, 'не совпадает год');

    console.log();
    console.log("=== Задание 3 ===");
    
    // тр. средство 4
    const electricCar = new ElectricCar('Tesla', 'Model 3', 2020, 4, 75);
    electricCar.displayInfo();
    console.log(`Возраст: ${electricCar.age} лет`);
    
    console.log(`Разница возраста: ${Vehicle.compareAge(electricCar, vehicle_2)} лет`);
    console.log(`Общее количество созданных транспортных средств: ${Vehicle.getTotalVehicles()} шт`);
    
    console.log(`Запас хода: ${electricCar.calculateRange()} км`);
    
    // проверка ошибок ElectricCar
    const electricCarErrorTests = [
        () => new ElectricCar(1, 'Model 3', 2020, 4, 75),
        () => new ElectricCar("", 'Model 3', 2020, 4, 75),
        () => new ElectricCar('Tesla', 1, 2020, 4, 75),
        () => new ElectricCar('Tesla', "", 2020, 4, 75),
        () => new ElectricCar('Tesla', 'Model 3', "2020", 4, 75),
        () => new ElectricCar('Tesla', 'Model 3', 2020.5, 4, 75),
        () => new ElectricCar('Tesla', 'Model 3', 2030, 4, 75),
        () => new ElectricCar('Tesla', 'Model 3', 1, 4, 75),
        () => new ElectricCar('Tesla', 'Model 3', 2020, "4", 75),
        () => new ElectricCar('Tesla', 'Model 3', 2020, 4.5, 75),
        () => new ElectricCar('Tesla', 'Model 3', 2020, 0, 75),
        () => new ElectricCar('Tesla', 'Model 3', 2020, 4, "75"),
        () => new ElectricCar('Tesla', 'Model 3', 2020, 4, 75.5),
        () => new ElectricCar('Tesla', 'Model 3', 2020, 4, 0),
        () => new ElectricCar('Tesla', 'Model 3', 2020, 4),
        () => { electricCar.year = 2026; }
    ];

    electricCarErrorTests.forEach((test, index) => {
        try {
            test();
            console.log(`Тест ElectricCar ${index + 1}: ошибка не сработала`);
        } catch (e) {
            console.log(`Правильно обработана ошибка ElectricCar ${index + 1}:`, e.message);
        }
    });

    console.assert(electricCar.make === 'Tesla', 'не совпадает марка');
    console.assert(electricCar.model === 'Model 3', 'не совпадает модель');
    console.assert(electricCar.year === 2020, 'не совпадает год');
    console.assert(electricCar.numDoors === 4, 'не совпадает кол-во дверей');
    console.assert(electricCar.batteryCapacity === 75, 'не совпадает емкость батареи');
    console.assert(electricCar.age === new Date().getFullYear() - 2020, 'не совпадает возраст тр.средства');
    console.assert(electricCar.calculateRange() === electricCar.batteryCapacity * 6, 'не совпадает запас хода');
    console.assert(Vehicle.getTotalVehicles() === 4, 'не совпадает кол-во тр.средства');
    
    electricCar.year = 2005;
    electricCar.displayInfo();
    console.assert(electricCar.year === 2005, 'не совпадает год');

    console.log();
    console.log("=== Задание 4 ===");
    
    // проверка каррирования
    const createCarFactory_1 = createVehicleFactory(Vehicle);
    const myNewCar_1 = createCarFactory_1('BMW', 'X5', 2022);
    console.log('Создан новый автомобиль:');
    myNewCar_1.displayInfo();
    
    const createCarFactory_2 = createVehicleFactory(Car);
    const myNewCar_2 = createCarFactory_2('BMW', 'X5', 2022, 4);
    console.log('Создан новый автомобиль:');
    myNewCar_2.displayInfo();
    
    const createCarFactory_3 = createVehicleFactory(ElectricCar);
    const myNewCar_3 = createCarFactory_3('BMW', 'X5', 2022, 4, 60);
    console.log('Создан новый автомобиль:');
    myNewCar_3.displayInfo();

    // Проверка возраста
    const testVehicle = new Vehicle('Test', 'Model', 2010);
    console.assert(testVehicle.age === (new Date().getFullYear() - 2010), 'Тест возраста провален');

    console.log('Всего создано транспортных средств:', Vehicle.getTotalVehicles());
    console.log('Все тесты пройдены! ✅');
}

runTests();