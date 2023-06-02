import { createContext, useReducer, useState } from "react";

export default function MyReducer(state, action) {
  const { type, nextName } = action;
  switch (type) {
    case "ADD":
      return {
        ...state,
        age: state.age + 1,
      };
    case "NAME":
      return {
        ...state,
        name: nextName,
      };
  }
  throw Error("Unknown action: " + action.type);
}
