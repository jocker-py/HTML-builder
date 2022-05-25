/*
  После завершения работы скрипта должна быть создана папка project-dist

 В папке project-dist должны находиться файлы index.html и style.css

 В папке project-dist должна находиться папка assets 
 являющаяся точной копией папки assets находящейся в 06-build-page

 Запрещается использование fsPromises.cp()

 Файл index.html должен содержать разметку являющуюся результатом замены шаблонных тегов в файле template.html

 Файл style.css должен содержать стили собранные из файлов папки styles

 При добавлении компонента в папку и соответствующего тега в исходный файл template.html 
 повторное выполнение скрипта приведёт файл index.html в папке project-dist в актуальное 
 состояние перезаписав его. Файл style.css и папка assets так же должны поддерживать актуальное состояние

 Исходный файл template.html не должен быть изменён в ходе выполнения скрипта

 Запись в шаблон содержимого любых файлов кроме файлов с расширением .html является ошибкой
*/

// Импорт модулей

const fs = require('fs');
const path = require('path');
const { join } = path;

// Пути к папкам
const dist = join(path.dirname(__filename), 'project-dist');
const components = join(path.dirname(__filename), 'components');
const styles = join(path.dirname(__filename), 'styles');
const assetsOrigin = join(path.dirname(__filename), 'assets');
const assetsDist = join(dist, 'assets');

// Пути к файлам
const template = join(path.dirname(__filename), 'template.html');
const distHtml = join(dist, 'index.html');
const distCss = join(dist, 'style.css');

// Сборщик стилей
const mergeStyles = [];

// Опции
const option = { withFileTypes: true };

// Обновляем папку project-dist
fs.rm(dist, { recursive: true, force: true }, (error) => {
  if (error) console.error(error.message);
  fs.mkdir(dist, (error) => {
    if (error) console.error(error.message);

    // Stream
    const readStream = fs.createReadStream(template);
    const writeStream = fs.createWriteStream(distHtml);
    readStream.pipe(writeStream);

    // Копируем папку assets в project-dist
    fs.mkdir(assetsDist, (error) => {
      if (error) console.error(error.message);
      copyDir(assetsOrigin, assetsDist);
      getData();
    });
  });
});

// Копируем папку в глубину
function copyDir(original, copy) {
  fs.readdir(original, option, (err, files) => {
    if (err) console.error(err.message);
    files.forEach((file) => {
      let origin = path.join(original, file.name);
      let dupl = path.join(copy, file.name);

      if (file.isFile()) {
        fs.copyFile(origin, dupl, callback);
      } else if (file.isDirectory()) {
        fs.mkdir(dupl, callback);
        copyDir(origin, dupl);
      }
    });
    return;
  });
}

// Заменяем шаблон из файла в components и записываем в distHtml
async function addTemplate(way, file) {
  let result = await fs.promises.readFile(distHtml, 'utf-8', callback);
  const templateFile = await fs.promises.readFile(way, 'utf-8', callback);
  const pattern = new RegExp(`{{${file.split('.')[0]}}}`);
  result = result.replace(pattern, templateFile);
  await fs.writeFile(distHtml, result, callback);
}

// Считываем все шаблоны из директории components
async function getData() {
  const files = await fs.promises.readdir(components, option, callback);

  for (let file of files) {
    await addTemplate(join(components, file.name), file.name);
  }
}

function callback(error) {
  if (error) console.error(error.message);
}


function merge(way) {
  const readStream = fs.createReadStream(way, 'utf-8');
  readStream.on('data', (chunk) => {
    mergeStyles.push(chunk);
  });
}

fs.readdir(styles, option, (error, files) => {
  if (error) console.error(error.message);
  for (let file of files) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      merge(join(styles, file.name));
    }
  }
});

process.on('beforeExit', (error) => {
  if (error) console.error(error.message);

  fs.writeFile(distCss, mergeStyles.join('\n'), 'utf-8', () => {
    process.exit();
  });
});
