## ['1','2','3'].map(parseInt) what & why?
在实际的场景中，可能有些时候需要将一个字符串数组转化成一个数字数组，这个时候可能就会想到使用map+parseInt来解决，看起来这是一个很简单快捷的方法，但是实际使用起来却不是那么回事儿。

### 先看看返回值
```js
['1','2','3'].map(parseInt) 
//预期结果：[1,2,3]
//真实结果：[1, NaN, NaN]
```  

### why
为什么会出现这种结果呢？接下来对map和parseInt展开分析
#### map方法
```js
var new_array = arr.map(function callback(currentValue[, index[, array]]) {
 // Return element for new_array 
}[, thisArg])
```  
上面是map方法的完整语法，可以看到map内部会给callback方法**传递三个参数**，只不过我们平时使用的时候很少同时使用到这个三个参数。

#### parseInt方法
```js
parseInt(string, radix);
//string:要被解析的值。如果参数不是一个字符串，则将其转换为字符串(使用  ToString 抽象操作)。字符串开头的空白符将会被忽略

//radix:一个介于2和36之间的整数(数学系统的基础)，表示上述字符串的基数(表示字符串的进制)
```  
parseInt 函数将其第一个参数转换为字符串，解析它，并**返回一个整数或NaN**。如果不是NaN，返回的值将是作为指定基数（基数）中的数字的第一个参数的整数

在基数为 undefined，或者基数为 0 或者没有指定的情况下，JavaScript 作如下处理：
- 如果字符串 string 以"0x"或者"0X"开头, 则基数是16 (16进制).
- 如果字符串 string 以"0"开头, 基数是8（八进制）或者10（十进制），那么具体是哪个基数由实现环境决定。**ECMAScript 5 规定使用10**，但是并不是所有的浏览器都遵循这个规定。因此，永远都要明确给出radix参数的值。
- 如果字符串 string 以其它任何值开头，则基数是10 (十进制)。

#### 出现错误的原因
1. 对于map和parseInt方法本身不够熟悉，不知道parseInt方法会有两个参数，不知道map会给callback传递三个参数
2. 对于parseInt中的radix参数解析规则不熟悉。

#### 回到问题本身
```js
['1','2','3'].map(parseInt) 

//等同于下面的步骤
parseInt('1',0); // 1
parseInt('2',1); // NaN 1不在[2,36]中
parseInt('3',2); // NaN 2进制中每个位置的有效数字是0和1，3在2进制中是不合法的

// 所以最终返回[1,NaN,NaN]
```  

### 改良方案
```js
//使用Number来替代parseInt
['1','2','3'].map(Number) //[1,2,3]

//包装parseInt
const unary = fn => val => fn(val);
const parse = unary(parseInt);
['1','2','3'].map(parse) //[1,2,3]
```  

### 参考资料
[['1', '2', '3'].map(parseInt) what & why ?](https://muyiy.cn/question/js/2.html)














