/*
    При выполнении команды node 03-files-in-folder в корневом каталоге репозитория в консоль
    выводится информация о файлах содержащихся внутри 03-files-in-folder/secret-folder. 
    
    Данные должны быть выведены в формате <имя файла>-<расширение файла>-<вес файла>. 
    Пример: example - txt - 128.369kb (округлять не нужно, конвертация в кб по желанию!)
    
    Информация должна выводиться только для файлов. Наличие информации о директориях считается ошибкой.
*/

// Подгружаем модули
const fs = require('fs');
const path = require('path');

// Путь к директории secret-folder
const secret = path.join(path.dirname(__filename), 'secret-folder');

// Представление файлов в виде обьекта
const option = { withFileTypes: true };

// Чтение директории
fs.readdir(secret, option, (error, files) => {
  error ? console.error(error.message) :
    files.forEach( file => {
      if(file.isFile()){
        const ext = path.extname(file.name); 
        const base = path.basename(file.name, ext); 
        const way = path.join(secret, file.name);  

        fs.stat(way, (error, stats) => {
          error ? console.error(error.message) :
            console.log(`${base} - ${ext.slice(1)} - ${stats.size/1024}kb`);
        });
      }
    });
});