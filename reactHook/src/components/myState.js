  //封装个useState
  let _state = []
  let index = 0
  function myState(initVal) {
    let currentIndex = index
    _state[currentIndex] = _state[currentIndex] === undefined ? initVal : _state[currentIndex];
    function setState(nVal) {
      _state[currentIndex] = nVal;
      //赋值，更新页面
      render();
    }
    index +=1
    return [_state, setState];
  }
  const render = () => {
    index=0 //重要的一步，必须在渲染前后将index值重置为0，不然index会一种增加1
    ReactDOM.render(<App />, document.getElementById("root"));
  };
