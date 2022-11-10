const keys = document.querySelectorAll(".key");
const result = document.querySelector(".result");

let str = "";

const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const opers = ["+", "-", "/", "*", "(", ")", "."];

keys.forEach((key) => {
    key.addEventListener("click", (event) => {
        const value = event.target.textContent;

        if (value == "C") {
            result.innerHTML = 0;
            str = "";
        }

        if (value == "=") {
            getResult();
        }

        if (digits.indexOf(value) != -1 || opers.indexOf(value) != -1) {
            str += value;
            result.innerHTML = str;
        }
        event.target.classList.add("touched");
        setTimeout(() => event.target.classList.remove("touched"), 100);
    })
})


function getResult() {
    result.innerHTML = evaluate(str);
    str = evaluate(str);
}

function evaluate(str) {
    let stack = [];
    let lastNumber = ''
    for (char of compile(str)) {
        if (isDigit(char) || char == '.') {
            lastNumber += char;
        } else {
            if (lastNumber.length > 0) {
                stack.push(lastNumber);
                lastNumber = '';
            }
        }
        if (isOperation(char)) {
            if (char == '+') {
                let num2 = stack.pop();
                let num1 = stack.pop();
                let sum = parseFloat(num1) + parseFloat(num2);
                stack.push(sum)
            }
            if (char == '-') {
                let num2 = stack.pop();
                let num1 = stack.pop();
                let rus = parseFloat(num1) - parseFloat(num2);
                stack.push(rus)
            }
            if (char == '*') {
                let num2 = stack.pop();
                let num1 = stack.pop();
                let pr = parseFloat(num1) * parseFloat(num2);
                stack.push(pr)
            }
            if (char == '/') {
                let num2 = stack.pop();
                let num1 = stack.pop();
                let del = parseFloat(num1) / parseFloat(num2);
                stack.push(del)
            }
        }
    }
    return stack.pop();
}


// Функция priority позволяет получить 
// значение приоритета для оператора.
// Возможные операторы: +, -, *, /.

function priority(operation) {
    if (operation == '+' || operation == '-') {
        return 1;
    } else {
        return 2;
    }
}

// Проверка, является ли строка str числом.
function isNumeric(str) {
    return /^\d+(.\d+){0,1}$/.test(str);
}

// Проверка, является ли строка str цифрой.
function isDigit(str) {
    return /^\d{1}$/.test(str);
}

// Проверка, является ли строка str оператором.
function isOperation(str) {
    return /^[\+\-\*\/]{1}$/.test(str);
}

// Функция tokenize принимает один аргумент -- строку
// с арифметическим выражением и делит его на токены 
// (числа, операторы, скобки). Возвращаемое значение --
// массив токенов.

function tokenize(str) {
    let tokens = [];
    let lastNumber = '';
    for (char of str) {
        if (isDigit(char) || char == '.') {
            lastNumber += char;
        } else {
            if (lastNumber.length > 0) {
                tokens.push(lastNumber);
                lastNumber = '';
            }
        }
        if (isOperation(char) || char == '(' || char == ')') {
            tokens.push(char);
        }
    }
    if (lastNumber.length > 0) {
        tokens.push(lastNumber);
    }
    return tokens;
}

// Функция compile принимает один аргумент -- строку
// с арифметическим выражением, записанным в инфиксной 
// нотации, и преобразует это выражение в обратную 
// польскую нотацию (ОПН). Возвращаемое значение -- 
// результат преобразования в виде строки, в которой 
// операторы и операнды отделены друг от друга пробелами. 
// Выражение может включать действительные числа, операторы 
// +, -, *, /, а также скобки. Все операторы бинарны и левоассоциативны.
// Функция реализует алгоритм сортировочной станции 
// (https://ru.wikipedia.org/wiki/Алгоритм_сортировочной_станции).

function compile(str) {
    let out = [];
    let stack = [];
    for (token of tokenize(str)) {
        if (isNumeric(token)) {
            out.push(token);
        } else if (isOperation(token)) {
            while (stack.length > 0 && isOperation(stack[stack.length - 1]) && priority(stack[stack.length - 1]) >= priority(token)) {
                out.push(stack.pop());
            }
            stack.push(token);
        } else if (token == '(') {
            stack.push(token);
        } else if (token == ')') {
            while (stack.length > 0 && stack[stack.length - 1] != '(') {
                out.push(stack.pop());
            }
            stack.pop();
        }
    }
    while (stack.length > 0) {
        out.push(stack.pop());
    }
    return out.join(' ');
}
