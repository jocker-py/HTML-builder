/*
 Внутри папки 02-write-file находится 1 файл index.js
 При выполнении команды node 02-write-file в папке 02-write-file создаётся текстовый файл, а в консоль выводится приглашение на ввод текста(На ваш выбор)
 После ввода текста в каталоге 02-write-file введённый текст должен быть записан в созданный ранее файл. Процесс не завершается и ждёт нового ввода.
 После следующего ввода созданный изначально текстовый файл дополняется новым текстом, процесс продолжает ждать ввод.
 При нажатии сочетания клавиш ctrl + c или вводе exit в консоль выводится прощальная фраза и процесс завершается.
*/

const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = process;

const txt = path.join(path.dirname(__filename), 'text.txt');
const output = fs.createWriteStream(txt);


// Приглашение на ввод текста
stdout.write('Пожалуйста введите текст: \n');

// Ввод текста
stdin.on('data', data => {
  if (data.toString() === 'exit\n') exit();
  
  //Запись
  output.write(data, error => error ? console.error(error.message) : null);
});


// Выход
process.on('SIGINT', () => exit());
process.on('exit', () => console.log('\nВаш мемуар успешно окончен!'));

