const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, 'assets');

const categories = [
  {
    id: 'semester1-lessons',
    name: 'Уроки — Верстка (Семестр 1)',
    dir: path.join(ASSETS_DIR, 'semester-1', 'lessons'),
    customNames: {
      'lesson_1.md': 'Урок 1 — Введение в HTML',
      'lesson_2.md': 'Урок 2 — Заголовки',
      'lesson_3.md': 'Урок 3 — Семантическая верстка',
      'lesson_4.md': 'Урок 4 — Мультимедиа и ссылки',
      'lesson_5.md': 'Урок 5 — Введение в CSS',
      'lesson_6.md': 'Урок 6 — Типография',
      'lesson_7.md': 'Урок 7 — Блоковая модель',
      'lesson_8.md': 'Урок 8 — Позиционирование',
      'lesson_9.md': 'Урок 9 — Flexbox',
      'lesson_10.md': 'Урок 10 — Grid',
      'lesson_11.md': 'Урок 11 — Адаптивность',
      'lesson_12.md': 'Урок 12 — Формы',
      'lesson_13.md': 'Урок 13 — Трансформации и переходы',
      'lesson_14.md': 'Урок 14 — Git',
    },
  },
  {
    id: 'semester1-assignments',
    name: 'Задания — Верстка (Семестр 1)',
    dir: path.join(ASSETS_DIR, 'semester-1', 'assignments'),
    customNames: {
      'assignment_1.md': 'Задание 1 — Сайт-визитка',
      'assignment_2.md': 'Задание 2 — Сайт для малого бизнеса',
      'assignment_3.md': 'Задание 3 — Лендинг по референсу',
    },
  },
  {
    id: 'semester1-exam',
    name: 'Экзамен — Верстка (Семестр 1)',
    dir: path.join(ASSETS_DIR, 'semester-1', 'exam'),
    customNames: { 'tickets.md': 'Экзаменационные билеты' },
    sortOrder: ['tickets.md'],
  },
  {
    id: 'semester2-lessons',
    name: 'Уроки — JavaScript (Семестр 2)',
    dir: path.join(ASSETS_DIR, 'semester-2', 'lessons'),
    customNames: {
      'lesson_1.md': 'Урок 1 — Основы JavaScript',
      'lesson_2.md': 'Урок 2 — Функции',
      'lesson_3.md': 'Урок 3 — DOM',
      'lesson_4.md': 'Урок 4 — ООП',
      'lesson_5.md': 'Урок 5 — Модули',
      'lesson_6.md': 'Урок 6 — JSON, API и асинхронность',
      'lesson_7.md': 'Урок 7 — Формы и хранилища',
    },
  },
  {
    id: 'semester2-assignments',
    name: 'Задания — JavaScript (Семестр 2)',
    dir: path.join(ASSETS_DIR, 'semester-2', 'assignments'),
    customNames: {
      'assignment_1.md': 'Задание 1 — Портфолио-резюме',
      'assignment_2.md': 'Задание 2 — Дашборд с виджетами',
      'assignment_3.md': 'Задание 3 — Игра-платформер',
    },
  },
  {
    id: 'semester2-exam',
    name: 'Экзамен — JavaScript (Семестр 2)',
    dir: path.join(ASSETS_DIR, 'semester-2', 'exam'),
    customNames: {
      'tickets.md': 'Экзаменационные билеты',
      'final_project.md': 'Финальный проект',
    },
    sortOrder: ['tickets.md', 'final_project.md'],
  },
];

function scanCategory(config) {
  if (!fs.existsSync(config.dir)) {
    console.warn(`Папка не найдена: ${config.dir}`);
    return [];
  }

  let files = fs.readdirSync(config.dir).filter((file) => file.endsWith('.md'));

  if (config.sortOrder) {
    files.sort((a, b) => {
      const iA = config.sortOrder.indexOf(a);
      const iB = config.sortOrder.indexOf(b);
      if (iA >= 0 && iB >= 0) return iA - iB;
      if (iA >= 0) return -1;
      if (iB >= 0) return 1;
      return a.localeCompare(b);
    });
  } else {
    files.sort((a, b) => {
      const numA = a.match(/\d+/)?.[0] || '0';
      const numB = b.match(/\d+/)?.[0] || '0';
      return parseInt(numA, 10) - parseInt(numB, 10);
    });
  }
  files = files.map((file) => {
      let name;
      if (config.customNames && config.customNames[file]) {
        name = config.customNames[file];
      } else if (config.displayFormat) {
        const match = file.match(new RegExp(`${config.prefix}[_\\s]*(\\d+)`, 'i'));
        name = match ? config.displayFormat(match[1]) : file.replace(/\.md$/, '');
      } else {
        name = file.replace(/\.md$/, '');
      }

      const relativePath = path.relative(__dirname, path.join(config.dir, file))
        .split(path.sep).join('/');

      return { name, file, path: relativePath };
    });

  return files;
}

const indexes = {};

for (const category of categories) {
  const items = scanCategory(category);
  indexes[category.id] = {
    name: category.name,
    items,
  };
  console.log(`✓ ${category.name}: ${items.length} файлов`);
}

const indexPath = path.join(__dirname, 'index.json');
fs.writeFileSync(indexPath, JSON.stringify(indexes, null, 2), 'utf8');

console.log(`\n✓ Индекс сохранен в ${indexPath}`);
