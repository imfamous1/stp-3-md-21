let fileStructure = {};
let bySemester = {};

const SECTION_NAMES = {
  lessons: 'Уроки',
  assignments: 'Задания',
  exam: 'Экзамен',
};

const SEMESTER_NAMES = {
  semester1: 'Семестр 1 — Верстка',
  semester2: 'Семестр 2 — JavaScript',
};

const RUTUBE_LINKS = {
  semester1: 'https://rutube.ru/plst/877516/',
  semester2: 'https://rutube.ru/plst/1225064/',
};

async function loadFileIndex() {
  try {
    const response = await fetch('index.json');
    if (!response.ok) throw new Error(`Ошибка загрузки: ${response.status}`);
    fileStructure = await response.json();

    // Группируем по семестрам
    bySemester = {};
    for (const [key, data] of Object.entries(fileStructure)) {
      const [semester, section] = key.split('-');
      if (!bySemester[semester]) {
        bySemester[semester] = {
          name: SEMESTER_NAMES[semester] || semester,
          sections: {},
        };
      }
      const sectionKey = section === 'lessons' ? 'lessons' : section === 'assignments' ? 'assignments' : 'exam';
      bySemester[semester].sections[sectionKey] = {
        name: data.name,
        items: data.items || [],
      };
    }
  } catch (error) {
    console.error('Ошибка загрузки индекса:', error);
    bySemester = {};
  }
}

const semesterScreen = document.getElementById('semesterScreen');
const sectionScreen = document.getElementById('sectionScreen');
const fileListScreen = document.getElementById('fileListScreen');
const contentScreen = document.getElementById('contentScreen');

const semesterButtons = document.getElementById('semesterButtons');
const sectionButtons = document.getElementById('sectionButtons');
const sectionScreenTitle = document.getElementById('sectionScreenTitle');
const fileItems = document.getElementById('fileItems');
const fileListTitle = document.getElementById('fileListTitle');
const contentTitle = document.getElementById('contentTitle');
const contentBody = document.getElementById('contentBody');
const practicumDownload = document.getElementById('practicumDownload');

let currentSemester = null;
let currentSection = null;

function showScreen(screen) {
  [semesterScreen, sectionScreen, fileListScreen, contentScreen].forEach((s) => {
    s.style.display = s === screen ? 'block' : 'none';
  });
}

function showSemesters() {
  currentSemester = null;
  currentSection = null;
  semesterButtons.innerHTML = '';

  for (const [id, data] of Object.entries(bySemester)) {
    const btn = document.createElement('button');
    btn.className = 'category-btn';
    btn.textContent = data.name;
    btn.addEventListener('click', () => showSections(id));
    semesterButtons.appendChild(btn);
  }
  showScreen(semesterScreen);
}

function showSections(semesterId) {
  currentSemester = semesterId;
  const data = bySemester[semesterId];
  if (!data) return;

  sectionScreenTitle.textContent = data.name;
  sectionButtons.innerHTML = '';

  const rutubeLink = document.getElementById('rutubeLink');
  if (rutubeLink && RUTUBE_LINKS[semesterId]) {
    rutubeLink.href = RUTUBE_LINKS[semesterId];
    rutubeLink.style.display = 'flex';
  } else if (rutubeLink) {
    rutubeLink.style.display = 'none';
  }

  for (const [sectionKey, sectionData] of Object.entries(data.sections)) {
    const btn = document.createElement('button');
    btn.className = 'category-btn';
    btn.textContent = SECTION_NAMES[sectionKey] || sectionData.name;
    btn.addEventListener('click', () => showFileList(sectionKey));
    sectionButtons.appendChild(btn);
  }
  showScreen(sectionScreen);
}

function showFileList(sectionKey) {
  currentSection = sectionKey;
  const data = bySemester[currentSemester]?.sections[sectionKey];
  if (!data) return;

  fileListTitle.textContent = `${bySemester[currentSemester].name} → ${SECTION_NAMES[sectionKey] || sectionKey}`;
  fileItems.innerHTML = '';

  const items = data.items || [];
  if (items.length === 0) {
    fileItems.innerHTML = '<li><p class="empty-message">Файлы не найдены. Запустите <code>node generate-index.js</code></p></li>';
  } else {
    for (const item of items) {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.className = 'file-item-btn';
      btn.textContent = item.name;
      btn.addEventListener('click', () => loadFile(item.path, item.name));
      li.appendChild(btn);
      fileItems.appendChild(li);
    }
  }

  // Практикум для семестра 2 (JavaScript) — внизу уроков
  if (currentSemester === 'semester2' && sectionKey === 'lessons' && practicumDownload) {
    practicumDownload.style.display = 'block';
    practicumDownload.innerHTML = `
      <a href="assets/documents/Кокорин_Практикум_Web_design_Язык_JavaScript.docx" 
         class="practicum-link" 
         download="Кокорин_Практикум_Web_design_Язык_JavaScript.docx">
        📥 Скачать практикум по JavaScript
      </a>
    `;
  } else if (practicumDownload) {
    practicumDownload.style.display = 'none';
    practicumDownload.innerHTML = '';
  }

  showScreen(fileListScreen);
}

async function loadFile(filePath, displayName) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
    const markdown = await response.text();
    contentTitle.textContent = displayName;
    contentBody.innerHTML = marked.parse(markdown);
    showScreen(contentScreen);
  } catch (error) {
    console.error(error);
    contentBody.innerHTML = `<p class="error">Ошибка загрузки: ${error.message}</p>`;
    showScreen(contentScreen);
  }
}

document.getElementById('backToSemestersBtn').addEventListener('click', showSemesters);

// Поделиться
document.getElementById('shareBtn')?.addEventListener('click', async () => {
  const url = window.location.href;
  const title = 'Учебные материалы по дисциплине «Современные технологии разработки»';
  try {
    if (navigator.share) {
      await navigator.share({ title, url });
    } else {
      await navigator.clipboard.writeText(url);
      const btn = document.getElementById('shareBtn');
      const orig = btn?.innerHTML;
      if (btn) {
        btn.innerHTML = '<span class="share-icon">✓</span> Скопировано!';
        setTimeout(() => { btn.innerHTML = orig; }, 2000);
      }
    }
  } catch (err) {
    if (err.name !== 'AbortError') {
      navigator.clipboard?.writeText(url);
      const btn = document.getElementById('shareBtn');
      const orig = btn?.innerHTML;
      if (btn) {
        btn.innerHTML = '<span class="share-icon">✓</span> Скопировано!';
        setTimeout(() => { btn.innerHTML = orig; }, 2000);
      }
    }
  }
});
document.getElementById('backToSectionsBtn').addEventListener('click', () => currentSemester && showSections(currentSemester));
document.getElementById('backToFilesBtn').addEventListener('click', () => currentSection && showFileList(currentSection));

// Тема
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeColor(savedTheme);
updateThemeLabel(savedTheme);

document.getElementById('themeToggle')?.addEventListener('click', () => {
  const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  updateThemeColor(theme);
  updateThemeLabel(theme);
});

function updateThemeLabel(theme) {
  const label = document.getElementById('themeLabel');
  if (label) label.textContent = theme === 'dark' ? '🌙 Тёмная' : '☀️ Светлая';
}

function updateThemeColor(theme) {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = theme === 'dark' ? '#000000' : '#ffffff';
}

async function init() {
  await loadFileIndex();
  showSemesters();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
