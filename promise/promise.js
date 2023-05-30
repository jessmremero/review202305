class MyPromise {
    constructor(callback) {
      this.status = 'pending';
      this.value = null;
      this.error = null;
  
      const resolve = value => {
        if (this.status === 'pending') {
          this.status = 'resolved';
          this.value = value;
        }
      };
  
      const reject = error => {
        if (this.status === 'pending') {
          this.status = 'rejected';
          this.error = error;
        }
      };
  
      try {
        callback(resolve, reject);
      } catch (error) {
        reject(error);
      }
    }
  
    then(onResolved, onRejected) {
      if (this.status === 'resolved') {
        return new MyPromise(resolve => {
          try {
            const result = onResolved(this.value);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
      } else if (this.status === 'rejected') {
        return new MyPromise((resolve, reject) => {
          try {
            const result = onRejected(this.error);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
      }
    }
  
    catch(onRejected) {
      if (this.status === 'rejected') {
        return new MyPromise(resolve => {
          try {
            const result = onRejected(this.error);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
      }
    }
  }


