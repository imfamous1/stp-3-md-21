# Интерактивность с JavaScript

## Работа с формами в JavaScript

Формы — это главный способ получить данные от пользователя (логины, отзывы, заказы). Наша задача — научиться обрабатывать эти данные.

### Как подключиться к форме из JavaScript?

#### 1. Получить элемент формы

Самый простой способ — по его `id`:

```html
<!-- HTML -->
<form id="myForm">
  <input type="text" id="userName" name="username">
  <button type="submit">Отправить</button>
</form>
```

```javascript
// JavaScript
const formElement = document.getElementById('myForm');
```

#### 2. Подписаться на событие submit

Это событие происходит, когда пользователь нажимает кнопку "Отправить" или клавишу Enter в поле формы.

```javascript
formElement.addEventListener('submit', function(event) {
  // Эта функция выполнится при отправке формы
});
```

**Что такое `event`?**

`event` — это объект, который автоматически передается в функцию-обработчик браузером при возникновении события (в данном случае — отправки формы).

### Как брать данные из формы?

#### Способ 1: Доступ через свойство формы по name

```javascript
console.log(myForm.username.value);
```

#### Способ 2: Через FormData (более современный способ)

```javascript
myForm.addEventListener('submit', function(event) {
  event.preventDefault();
  
  const formData = new FormData(myForm);
  console.log(formData.get('username'));
});
```

#### Способ 3: Прямой доступ к элементу по id

```javascript
formElement.addEventListener('submit', function(event) {
  event.preventDefault();
  
  const nameInput = document.getElementById('userName');
  const userName = nameInput.value;
  
  console.log('Пользователь ввел:', userName);
});
```

**Ключевой момент**: `event.preventDefault()` — предотвращает стандартное поведение браузера (перезагрузку страницы при отправке формы).

## Регулярные выражения (RegExp)

Регулярные выражения — это мощный инструмент для поиска и проверки текста по заданному шаблону.

### Пример: Проверка email (упрощенная)

```javascript
const emailRegex = /^\S+@\S+\.\S+$/;
const userEmail = "student@example.com";
const isValid = emailRegex.test(userEmail);
console.log(isValid); // true
```

### Часто используемые регулярные выражения

```javascript
// Только цифры
const digitsOnly = /^\d+$/;

// Только буквы (латиница)
const lettersOnly = /^[a-zA-Z]+$/;

// Телефон (упрощенный формат)
const phoneRegex = /^\+?[\d\s()-]+$/;

// Пароль (минимум 8 символов, хотя бы одна буква и цифра)
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
```

## Хранилища в браузере

### 1. LocalStorage (Локальное хранилище)

- **Объем**: ~5-10 МБ
- **Срок хранения**: Данные не удаляются после закрытия браузера
- **Формат**: Ключ-значение (строки)

#### Основные команды:

```javascript
// Сохранить данные
localStorage.setItem('ключ', 'значение');
localStorage.setItem('userTheme', 'dark');

// Прочитать данные
const theme = localStorage.getItem('userTheme');

// Удалить данные
localStorage.removeItem('userTheme');

// Очистить всё
localStorage.clear();
```

#### Пример с объектом:

```javascript
const userSettings = { theme: 'dark', language: 'ru' };

// Сохраняем (превращаем объект в строку)
localStorage.setItem('settings', JSON.stringify(userSettings));

// Читаем (превращаем строку обратно в объект)
const savedSettings = JSON.parse(localStorage.getItem('settings'));
```

### 2. Cookies (Куки)

Небольшие строки данных (до ~4 КБ), которые браузер автоматически отправляет на сервер с каждым запросом.

**Главное отличие от LocalStorage**: Сервер может читать и записывать куки. LocalStorage — только клиентский.

## Таймеры и интервалы

### setTimeout — выполнить действие один раз, через заданное время

```javascript
setTimeout(function() {
  console.log('Это сообщение появилось через 2 секунды!');
}, 2000);
```

### setInterval — выполнять действие повторно

```javascript
const timerId = setInterval(function() {
  console.log('Эта строка появляется каждую секунду!');
}, 1000);

// Остановить: clearInterval(timerId);
```

### Очистка таймеров

```javascript
// Отмена setTimeout
const timeoutId = setTimeout(() => {}, 5000);
clearTimeout(timeoutId);

// Остановка setInterval
const intervalId = setInterval(() => {}, 1000);
clearInterval(intervalId);
```
