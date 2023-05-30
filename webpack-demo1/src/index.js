require('./index.css')
import icon from './assets/icon.jpg'
const iconImg = document.createElement('img')
iconImg.style.cssText = 'width: 200px;'
iconImg.src = icon
document.body.appendChild(iconImg)
console.log('4757')
//防抖函数
function(fn,delay){
    let timer 
    return function(){
        let argus = arguments
        clearTimeout(timer)
        timer = setTimeout(()=>{
          fn.apply(this,argus)
        },delay)
    }
}