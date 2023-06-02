import logo from "./logo.svg";
import "./App.css";
import React, {
  useState,
  createContext,
  useReducer,
  useCallback,
  useMemo,
} from "react";
import ReactDOM from "react-dom";
import MyContext from "./components/myContext";
import MyReducer from "./components/myReducer";
import { MyCallback } from "./components/myCallback";
import useForm from './components/useForm'

export const ThemeContext = createContext(null);
function App() {
  const [count, setCount] = useState(0);
  const [theme, setTheme] = useState("light");
  const [state, dispatch] = useReducer(MyReducer, { name: "qingyi", age: 12 });
  const [text, setText] = useState("");
  const [data, setData] = useState([
    { id: 1, name: "test1111" },
    { id: 2, name: "test222" },
    { id: 3, name: "test334" },
    { id: 4, name: "test444" },
  ]);
  let username = useForm("");

  const handleChange = (e) => {
    setText(e.target.value);
  };

  //useMemo类似于vue计算属性
  const getList = useMemo(() => {
    return data.filter((item) => {
      if (item.name.includes(text)) {
        return item;
      }
    });
  }, [text]);

  function handleInputChange(e) {
    dispatch({
      type: "NAME",
      nextName: e.target.value,
    });
  }

  const handClickBack = useCallback(() => {
    console.log("子组件渲染了没");
  }, [count]);

  const { name, age } = state;
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <p onClick={() => setCount(count + 1)}>点击</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          {count}
        </a>
        <ThemeContext.Provider value={count}>
          <MyContext title="666">888</MyContext>
        </ThemeContext.Provider>
        <input onChange={handleInputChange} />
        <p>
          Hello,{name}, your age is {age}
        </p>
        <MyCallback handClick={handClickBack}></MyCallback>
        <input type="text" onChange={(e) => handleChange(e)} />
        {getList.map((item) => (
          <div key={item.id}>{item.name}</div>
        ))}
           <input type="text" {...username}></input>
      </header>
    </div>
  );
}

export default App;
