/*
	После завершения работы функции создаётся папка files-copy 
	содержимое которой является точной копией исходной папки files.

	При добавлении/удалении/изменении файлов в папке files и 
	повторном запуске node 04-copy-directory содержимое папки 
	files-copy актуализируется.
	
	Запрещается использование fsPromises.cp()
*/

// Подключаем модули

const fs = require('fs');
const path = require('path');

// Путь к папкам
const main = path.join(path.dirname(__filename), 'files');
const dublicate = path.join(path.dirname(__filename), 'files-copy');

// Удаляем папку files-copy
fs.rm(dublicate, { recursive: true, force: true }, (error) => {
  if (error) console.error(error.message);
  fs.mkdir(dublicate, () => { // Создаем папку files-copy
    copyDir(main, dublicate); // Копируес папку files в files-copy
  });
});


function copyDir(original, copy) {
  fs.readdir(original, { withFileTypes: true }, (err, files) => {
    if (err) console.error(err.message);
    files.forEach((file) => {
      let origin = path.join(original, file.name);
      let dupl = path.join(copy, file.name);

      if (file.isFile()) {
        fs.copyFile(origin, dupl, () => {});
      } else if (file.isDirectory()) {
        fs.mkdir(dupl, () => {});
        copyDir(origin, dupl);
      }
    });
    return;
  });
}
