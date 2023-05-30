//手写promise
class MyPromise {
  constructor(callback) {
    //定义初始化状态
    this.status = "pendding";
    this.value = "";
    this.error = "";
    const resolve = (value) => {
      if (this.status == "pendding") {
        this.status = "success";
        this.value = value;
      }
    };
    const reject = (error) => {
      if (this.status == "pendding") {
        this.status = "fail";
        this.error = error;
      }
    };
    try {
      callback(resolve, reject);
    } catch {
      reject(error);
    }
  }

  then(resolveSuccess, rejectFail) {
    if (this.status == "success") {
      return new MyPromise((resolve, reject) => {
        try {
          let x = resolveSuccess(this.value);
          resolve(x);
        } catch(error) {
          reject(error);
        }
      });
    } else if (this.status == "fail") {
        return new MyPromise((resolve, reject) => {
            try {
              let x = rejectFail(this.error);
              resolve(x);
            } catch {
              reject(error);
            }
          });
    }
  }
}

function promiseAll(promises){
  let arr = []
  let count = 0
  return new Promise((resolve,reject)=>{
    promises.forEach(p => {
      Promise.resolve(p).then(v=>{
        arr[i] = v
        count++
        if(count==arr.length) {
          resolve(arr)
         }
      }).catch(reject)
    });

  })
}
