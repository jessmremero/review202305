* @Author: your name
* @Date: 2022-02-27 23:46:11
* @LastEditTime: 2022-02-28 21:37:51
* @LastEditors: Please set LastEditors
* @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
* @FilePath: /demo1/promise.js
*/
// promise 原理代码
const PENDING = 'pending'; // 等待
const FULFILLED = 'fulfilled'; // 成功
const REJECTED = 'rejected'; // 失败
class MyPromise {
   constructor(executor) { // 接收执行器
       try {
           executor(this.resolve, this.reject)
       } catch (e) {
           this.reject(e);
       }
   }
   
   status = PENDING; // promise的状态
   value = undefined; // 成功之后的值
   reason = undefined; // 失败之后的值
   successCallback = []; // 成功回调
   failCallback = []; // 失败回调

   // resolve和reject为什么要用箭头函数？
   // 如果直接调用的话，普通函数this指向的是window或者undefined
   // 用箭头函数就可以让this指向当前实例对象
   resolve = value => {
       // 如果状态不是等待 组织程序向下执行
       if (this.status !== PENDING) return
       // 将状态更改为成功
       this.status = FULFILLED;
       // 保存成功之后的值
       this.value = value;
       // 判断成功回调是否存在 如果存在 调用
       //this.successCallback && this.successCallback(this.value) //shift 取出数组的第一位，并且会改遍原数组
       while (this.successCallback.length) this.successCallback.shift()()
   }
   reject = reason => {
       // 如果状态不是等待 组织程序向下执行
       if (this.status !== PENDING) return
       // 将状态更改为失败
       this.status = REJECTED;
       // 保存失败后的原因
       this.reason = reason;
       // 判断失败回调是否存在 如果存在 调用
       // this.failCallback && this.failCallback(this.reason)
       while (this.failCallback.length) this.failCallback.shift()();
   }

   then(successCallback, failCallback) {
       successCallback = successCallback ? successCallback : value => value;
       failCallback = failCallback ? failCallback : reason => {
           throw reason
       }; // then链式调用参数变为可选参数 例：promise.then().then().then((value)=>{console.log(value)}) // value
       let promise2 = new MyPromise((resolve, reject) => {
           // 传递一个执行器 立马执行
           // 判断状态 成功
           if (this.status === FULFILLED) {
               setTimeout(() => { // 将下面的代码变成异步代码
                   try {
                       let x = successCallback(this.value)
                       // 判断 x 的值是普通值还是promise对象
                       // 如果是普通值 直接调用resolve
                       // 如果是promise对象 查看promise对象返回的结果
                       // 再根据promise对象返回的结果 界定调用resolve 还是reject
                       resolvePromise(x, resolve, reject);
                   } catch (e) { // 处理异常状态
                       reject(e)
                   }
               }, 0)
           } else if (this.status === REJECTED) {
               setTimeout(() => { // 将下面的代码变成异步代码
                   try {
                       let x = failCallback(this.reason)
                       resolvePromise(x, resolve, reject);
                   } catch (e) { // 处理异常状态
                       reject(e)
                   }
               }, 0)
           } else {
               // 当前状态是等待
               // 将成功回调和失败回调存储起来 - 多个then方法调用
               this.successCallback.push(() => {
                   setTimeout(() => { // 将下面的代码变成异步代码
                       try {
                           let x = successCallback(this.value);
                           resolvePromise(x, resolve, reject);
                       } catch (e) { // 处理异常状态
                           reject(e)
                       }
                   }, 0)
               });
               this.failCallback.push(() => {
                   setTimeout(() => { // 将下面的代码变成异步代码
                       try {
                           let x = failCallback(this.reason);
                           resolvePromise(x, resolve, reject);
                       } catch (e) { // 处理异常状态
                           reject(e)
                       }
                   }, 0)
               });

           }
       });
       return promise2;
   }

   finally(callback) {
       /**
        - 无论当前最终状态是成功还是失败，finally都会执行
        - 我们可以在finally方法之后调用then方法拿到结果
        - 这个函数是在原型对象上用的
        * **/
       return this.then(value => {
           return MyPromise.resolve(callback()).then(() => value)
       }, reason => {
           return MyPromise.resolve(callback()).then(() => {
               throw reason
           })
       })
   }

   catch(failCallback) {
       /**
        - catch方法是为了捕获promise对象的所有错误回调的
        - 直接调用then方法，然后成功的地方传递undefined，错误的地方传递reason
        - catch方法是作用在原型对象上的方法
        * **/
       return this.then(undefined, failCallback);
   }

   static all(array) {
       /**
        * 分析一下：
        - all方法接收一个数组，数组中可以是普通值也可以是promise对象
        - 数组中值得顺序一定是我们得到的结果的顺序
        - promise返回值也是一个promise对象，可以调用then方法
        - 如果数组中所有值是成功的，那么then里面就是成功回调，如果有一个值是失败的，那么then里面就是失败的
        - 使用all方法是用类直接调用，那么all一定是一个静态方法
        **/
       let result = [];
       let index = 0;
       return new MyPromise((resolve, reject) => {
           function addData(key, value) {
               // 保存每个传入参数执行完毕，并存储返回值
               result[key] = value;
               index++;
               if (index === array.length) {
                   resolve(result)
               }
           }

           for (let i = 0; i < array.length; i++) {
               let current = array[i];
               if (current instanceof MyPromise) {
                   // promise对象
                   current.then(value => addData(i, value), reason => reject(reason))
               } else {
                   // 普通值
                   addData(i, array[i])
               }
           }
       })
   }

   static resolve(value) {
       /**
        resolve方法的作用是将给定的值转换为promise对象 resolve的返回值的promise对象
        如果参数就是一个promise对象，直接返回，如果是一个值，那么需要生成一个promise对象，把值进行返回
        是Promise类的一个静态方法
        * **/
       if (value instanceof MyPromise) return value;
       return new MyPromise(resolve => resolve(value))
   }
}

function resolvePromise(x, resolve, reject) {
   if (x instanceof MyPromise) {
       // promise 对象
       // x.then( value => resolve(value),reason => reject(reason))
       x.then(resolve, reject)  // 简化
   } else {
       // 普通值
       resolve(x)
   }
}

module.exports = MyPromise;
