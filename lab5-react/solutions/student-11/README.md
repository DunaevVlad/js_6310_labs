# Решение (student-11)

В этой папке находятся два проекта:

- `ui-library` — небольшая библиотека UI-компонентов на TypeScript. Экспортирует компоненты `ProductCard` и `Cart`.
- `frontend` — демонстрационное React-приложение (Vite + TypeScript), показывающее применение компонентов из `ui-library`.

Описание компонентов:

- `ProductCard` — карточка товара с изображением, названием, описанием, ценой и кнопкой «Добавить в корзину». Все значения передаются через `props`.
- `Cart` — корзина с перечнем добавленных товаров (мини-карточки с изображениями, названием, количеством и ценой), итоговой суммой и кнопкой «К оформлению». Параметры передаются через `props`.

Инструкции по запуску (PowerShell):

1) Установка зависимостей (выполните в каждой подпапке):

```powershell
cd '...\solutions\student-11\ui-library'
npm install

cd '..\frontend'
npm install
```

2) Линтинг (ESLint):

```powershell
# В ui-library
cd '...\solutions\student-11\ui-library'
npm run lint

# В frontend
cd '..\frontend'
npm run lint
```

3) Тесты и покрытие (в `ui-library` есть тесты):

```powershell
cd '...\solutions\student-11\ui-library'
npm test
npm run test:coverage

# В frontend тестов нет (команда настроена с --passWithNoTests)
cd '..\frontend'
npm test
```

4) Локальная разработка (dev):

```powershell
cd '...\solutions\student-11\frontend'
npm run dev
Start-Process 'http://localhost:3000'
```

5) Production-сборка и просмотр собранного приложения:

```powershell
# Сборка библиотеки (формирует папку dist)
cd '...\solutions\student-11\ui-library'
npm run build

# Сборка frontend
cd '..\frontend'
npm run build

# Предпросмотр production-сборки
npm run preview
Start-Process 'http://localhost:5173'
```

6) Просмотр отчёта покрытия (html):

```powershell
Invoke-Item '...\solutions\student-11\ui-library\coverage\lcov-report\index.html'
```

![](\images\1.png)
![](\images\2.png)
