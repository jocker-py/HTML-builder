/*
 Внутри папки 01-read-file находятся 2 файла index.js и text.txt
 При выполнении команды node 01-read-file в корневом каталоге репозитория в консоль выводится содержимое файла text.txt.
 В коде не должны быть использованы синхронные методы чтения файла.
 Чтение файла должно происходить с помощью ReadStream
 */

const fs = require('fs');
const path = require('path');
const txt = path.join(path.dirname(__filename), 'text.txt'); 
const readStream = fs.createReadStream(txt, 'utf-8');

readStream.on('data', (chunk) => console.log(chunk));
readStream.on('end', ()=> console.log(''));

