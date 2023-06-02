import { createContext, useContext, useState } from "react";
import {ThemeContext} from '../App.js'

export default function MyContext({ title, children }) {
  const theme = useContext(ThemeContext);
  return (
    <>
  <h1>{theme}</h1>
  <div>{children}</div>
  </>
  );
}
