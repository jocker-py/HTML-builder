/*
 После завершения работы скрипта в папке project-dist должен 
 находиться файл bundle.css содержащий стили из всех файлов 
 папки styles.

 При добавлении/удалении/изменении файлов стилей в папке 
 styles и повторном запуске скрипта файл bundle.css 
 перезаписывается и содержит актуальные стили.
 
 Любые файлы имеющие расширение отличное 
 от css или директории игнорируются.

 Стили находящиеся в файле bundle.css созданном 
 в процессе сборки не должны быть повреждены.
*/

// Подключаем модули
const fs = require('fs');
const path = require('path');
const { join } = require('path');

// Пути к папке styles и файлу bundle.css
const output = join(path.dirname(__filename), 'project-dist', 'bundle.css');
const input = join(path.dirname(__filename), 'styles');

const option = { withFileTypes: true };
const mergeStyles = [];

function merge(way) {
  const readStream = fs.createReadStream(way, 'utf-8');
  readStream.on('data', (chunk) => {
    mergeStyles.push(chunk);
  });
}

fs.readdir(input, option, (error, files) => {
  error
    ? console.error(error.message)
    : files.forEach((file) => {
      if (file.isFile() && path.extname(file.name) === '.css') {
        merge(join(input, file.name));
      }
    });
});

process.on('beforeExit', (error) => {
  error
    ? console.error(error.message)
    : fs.writeFile(output, mergeStyles.join('\n'), 'utf-8', () => {
      process.exit();
    });
});
