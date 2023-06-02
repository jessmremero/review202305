import { createContext, useContext, useState } from "react";
import React from "react";
//注意这里必须用React.memo和usecallback配合使用，callback就是缓存函数防止父组件更新引起子组件更新
export const MyCallback = React.memo((props) => {
  console.log("handClick", props.handClick);
  return (
    <>
      <h1>子组件测试callback</h1>
    </>
  );
});
