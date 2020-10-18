// 定义一个键盘类，里边有各种功能的按键和相关的操作
class Keys {
    // 运算符
    public opera: string[];
    // 单对象功能性按键，输入之后立即将结果显示到result中；
    public singleOpera: string[];
    // 双对象功能性按键，输入之后直接放到input中，待另一个对象完成再显示结果；
    public doubleOpera: string[];
    // 功能性符号，添加到这里边的元素点击时不会或间接显示到输入中；
    public tool: string[];
    // 数字和括号输入
    public nums: string[];
    // 构造函数
    constructor(o: string[], s: string[], d: string[], t: string[], n: string[]) {
        this.opera = o
        this.singleOpera = s
        this.doubleOpera = d
        this.tool = t
        this.nums = n
    }
    // 计算阶层n!：
    mul(n: number) {
        let res = 1;
        for (let i = 2; i <= n; i++) {
            res *= i
        }
        return (res)
    }
    // 计算以10为底的对数函数：
    log(n: number) {
        return Math.log(n) / Math.log(10)
    }
    // 格式化字普通符串
    replaceSymbol(str: string): string {
        // 判断左右括号的数目是否相等，不等则补上
        // let left:string[] = str.match(/\(/g)?str.match(/\(/g):[""]
        let lenLeft = !!str.match(/\(/g) ? (str.match(/\(/g) as string[]).length : 0;
        let lenRight = !!str.match(/\)/g) ? (str.match(/\)/g) as string[]).length : 0;
        if (lenLeft !== lenRight) {
            str = lenLeft < lenRight ? "(" + str : str + ")"
        }
        if (str.search(/[x|÷|Π|e]/) !== -1) {
            str = str.replace("x", "*");
            str = str.replace("÷", "/");
            str = str.replace("Π", "Math.PI");
        }
        return str;
    }
    // 将功能性符号替换为可以进行计算的符号或自己定义的函数，并格式化，如4√ => √(4)，str为要格式化的字符串，sym为计算符号，rep为要替代的符号，isSingle判断该符号为单对象符号还是双对象符号；
    format(str: string, sym: string, rep: string, isSingle: boolean = true): string {
        let re1: RegExp;
        let left: RegExpMatchArray | null;
        let right: RegExpMatchArray | null;
        let lenLeft: number;
        // 如果是双对象符号
        if (keys.doubleOpera.indexOf(sym) === -1) {
            re1 = new RegExp("(\\(+.*?\\)+" + sym + ")|(\\d+" + sym + ")", "g");
            left = str.match(re1)
            lenLeft = left ? left.length : 0
            for (let i = 0; i < lenLeft; i++) {
                if (left) {
                    str = str.replace(left[i], rep + "(" + left[i].replace(sym, ")"))
                }
            }
        }
        // 如果是单对象符号
        else {
            let re2: RegExp;
            re1 = new RegExp("(\\(+.*?\\)+" + "\\" + sym + ")|(\\d+" + "\\" + sym + ")", "g");
            re2 = new RegExp("(\\" + sym + "\\(+.*?\\)+)|(" + "\\" + sym + "\\d+)", "g");
            left = str.match(re1) ? str.match(re1) : [];
            right = str.match(re2) ? str.match(re2) : [];
            lenLeft = left ? left.length : 0
            for (let i = 0; i < lenLeft; i++) {
                if (left && right) {
                    str = str.replace(right[i], right[i] + ")")
                    str = str.replace(left[i], rep + "(" + left[i].replace(sym, ","))
                }
            }
        }
        return str;
    }
    // 获取单对象符号左边要参与的数,str为字符串，sym为字符串内要取出其计算对象的符号，index为sym的序号，防止取出字符串中多个该符号
    getSymLeft(str: string, sym: string, index = 0): string {
        let left: string = "";
        if (str.lastIndexOf(sym) === index || index === 0) {
            let re1 = new RegExp("(\\(+.*?\\)+" + sym + ")|(\\d+" + sym + ")", "g");
            let res = !!str.match(re1) ? str.match(re1) : [];
            let lenRes = res ? res.length : 0
            if (res) {
                left = lenRes !== 0 ? res[0].replace(sym, "") : "";

            }
        }
        return left
    }
    // 插入历史记录
    addHistory(text: string, ul: HTMLElement) {
        let li = document.createElement("li");
        li.innerText = text;
        ul.appendChild(li)
    }
    // 清除历史记录:
    clearHistory() {
        if (ul) {
            // 获取已经创建的子节点（记录）
            let liList = ul.children;
            let len = liList.length;
            let liArr = Array.prototype.slice.call(liList, 0, len)
            liArr.forEach(e => {
                ul.removeChild(e)
            });
        }
    }
}
// 运算符
const opera: string[] = ["+", "-", "x", "÷", "%", "="];
// 单对象功能性按键，输入之后立即将结果显示到result中；
const singleOpera: string[] = ["=", "n!", "√", "log", "ln"];
// 双对象功能性按键，输入之后直接放到input中，待另一个对象完成再显示结果；
const doubleOpera: string[] = ["nm", "^"];
// 功能性符号，添加到这里边的元素点击时不会或间接显示到输入中；
const tool: string[] = ["CE", "DEL", "Random"];
// 数字和括号输入
const nums: string[] = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "(", ")", "Π", "e", "."];
// 创建键盘实例
const keys = new Keys(opera, singleOpera, doubleOpera, tool, nums);
// 判断是否为新一轮计算，是则清空输入信息；
let isnew: number = 0
// 判断是否为连续的键盘按键输入；
let isContinue: number = 1;
// 存放输入
let input: string = "";
// 存放计算的结果；
let result: string = "";
// 获取操作和结果显示节点
const operaShow = document.getElementById('operaShow');
// 获取操作输入显示节点；
const showInput = operaShow!.children[0] as HTMLElement;
// 获取结果显示节点；
const showResult = operaShow!.children[1] as HTMLElement;
// 获取历史记录节点：
const ul = document.getElementById('record');
// 获取键盘和展示区域节点；
const keyboard = document.getElementById('keyboard');
keyboard!.addEventListener('click', (ev: any) => {
    // 获取新输入字符内容
    let key = ev.target ? ev.target.innerText : "";
    // 获取上一个字符内容
    let prekey = input[input.length - 1];
    // 获取已输入的字符长度-1，因为遍历是从0开始
    let length = input.length - 1;
    // 如果按下的键是数字：
    if (keys.nums.indexOf(key) !== -1) {
        // 如果输入是括号则中断输入连续
        if (["(", ")"].indexOf(key) !== -1) isContinue = 0;
        // 如果输入的是数字则判断是不是新一轮计算，是则新数字代替原来输入的内容
        if (isnew === 1) {
            input = "";
            showInput.innerText = "";
            isnew = 0;
        }
        // 判断是否为不合法输入:除数为0，右括号/Π/e临近为数字或括号，左括号的数量小于右括号的数量，Π出现两个或和数字放在一起,!后有数字；
        if ((input + key).match(/÷0|[1-9Π]\(|\)[1-9Π]|\(\)|\dΠ|Π\d|!\d|\.[\+\-x÷%=]|[\+\-x÷%=]\./)) return false;
        if (key === "\)") {
            let left = input.match(/\(/g);
            let right = input.match(/\)/g);
            let lenLeft = 0;
            let lenRight = 0;
            if (left) lenLeft = left.length;
            if (right) lenRight = right.length
            if (lenLeft <= lenRight) return false;
        }

        // input显示部分的值
        input += ev.target.innerText;
        showInput.innerText = input;
        // result显示部分：判断上次输入的数字和此次输入的数字是否要组成一个数
        if (isContinue === 1) {
            result += key;
            showResult.innerText = result;
        } else {
            result = key;
            showResult.innerText = result;
            isContinue = 1;
        }
        // 如果输入是括号则中断输入连续
        if (["(", ")"].indexOf(key) !== -1) isContinue = 0;
    }
    // 如果输入的键是运算符：
    else if (keys.opera.indexOf(key) !== -1) {
        // 如果没有任何输入或者只有“（ ”时，默认在输入前加 “0”；
        if (input === "" || input === "(") input += "0";
        // 判断前一个是否也输入了运算符号,是则用当前运算符代替上一个运算符；
        input = keys.opera.indexOf(prekey) === -1 ? input + key : input.slice(0, length) + key;
        showInput.innerText = input;
        // 计算已输入字符的计算结果显示到result中
        // 获取与要转换的字符匹配的字符的数组，并进行格式化：
        let syms = input.match(/√|ln|log|\^|!/g);
        let formated = keys.replaceSymbol(input.slice(0, input.length - 1));
        if (!!syms) {
            syms = [...new Set(syms)];
            syms.forEach(sym => {
                switch (sym) {
                    case "√":
                        formated = formated.replace(/√/g, "Math.sqrt");
                        break;
                    case "ln":
                        formated = formated.replace(/ln/g, "Math.log");
                        break;
                    case "log":
                        formated = formated.replace(/log/g, "Math.log10")
                        break;
                    case "^":
                        formated = keys.format(formated, sym, "Math.pow", false);
                        break;
                    case "!":
                        formated = keys.format(formated, sym, "keys.mul");
                        break;
                }
            })
        }
        // 最近一步运算的结果，然后输出到result
        result = eval(formated);
        showResult.innerText = result;
        // 如果输入的键是“=”：
        if (key === "=") {
            isnew = 1;
            if (ul)
                keys.addHistory(input + result, ul);
        }
        // 刷新isContinue
        isContinue = 0;
    }
    // 如果输入的键是功能按键（属于keys.singleOpera数组 或 tool数组）：
    else {
        if (tool.indexOf(key) !== -1 || keys.getSymLeft(input + key, key) !== "") {
            let symLeft: string;
            switch (key) {
                // 以下匹配tool数组中的符号
                case "CE":
                    input = "";
                    result = "";
                    break;
                case "DEL":
                    input = input.slice(0, length);
                    result = (result + "").slice(0, result.length - 1);
                    break;
                case "Random":
                    let num = parseInt(Math.random() * 10 + "", 10);
                    input += num;
                    result += num;
                    break;
                // 以下匹配keys.singleOpera数组中的符号,按下之后result会进行对应符号的运算
                case "√":
                    input += key
                    symLeft = keys.getSymLeft(input, "√", input.lastIndexOf("√"));
                    result = eval(symLeft) >= 0 ? Math.sqrt(eval(symLeft)) + "" : "根号内的数必须大于等于0";
                    input = keys.format(input, "√", "√")
                    isContinue = 0;
                    break;
                case "ln":
                    input += key;
                    symLeft = keys.getSymLeft(input, "ln", input.lastIndexOf(key))
                    result = eval(symLeft) > 0 ? Math.log(eval(symLeft)) + "" : "指数必须大于0";
                    input = keys.format(input, "ln", "ln");
                    isContinue = 0;
                    break;
                case "log":
                    input += key;
                    symLeft = keys.getSymLeft(input, "log", input.lastIndexOf(key));
                    result = eval(symLeft) > 0 ? keys.log(eval(symLeft)) + "" : "指数必须大于0";
                    input = keys.format(input, "log", "log");
                    isContinue = 0;
                    break;
                case "n!":
                    input += "!";
                    let left4 = keys.getSymLeft(input, "!", input.lastIndexOf("!"));
                    result = eval(left4) > 0 ? keys.mul(eval(left4)) + "" : "阶层对象必须大于1";
                    isContinue = 0;
                    break;
                // 以下匹配keys.doubleOpera数组中的符号
                case "nm":
                    input = prekey === "=" ? input.slice(0, input.length - 1) + "^" : input + "^";
                    isContinue = 0;
                    break;
            }
            // 将输入和结果输出：
            showResult.innerText = result !== "" ? result : "";
            // 如果输入为空则显示0；
            showInput.innerText = !!input ? input : "0";
        } else {
            return false;
        }
    }
});

