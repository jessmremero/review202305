//这个案例用来自定义hook
import React,{useState} from 'react';
export default function useForm (initStart=''){
    let [value,setValue] = useState(initStart)
    return {value,onChange:e=>setValue(e.target.value.trim())}
}