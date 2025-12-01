// App.jsx
import Mandoo from "./Mandoo"
import { useState } from "react";


// 아래 todos 리스트를 만두 이미지 아래에 뿌려주세요
const mandooTodoLists = {
  todos: ["간식 먹기", "화분 돌 다 꺼내기", "공유기 위에서 자기"],
};

export default function App() {
    const [number, setNumber] = useState(0); // 화면에 보여지는 숫자
  const [increaseNumber, setIncreaseNumber] = useState(0); // input에 입력되는 숫자

  // +1 증가
  const handlePlusOne = () => {
    setNumber(number + 1);
  };

  // input 입력값 처리
  const handleInputChange = (e) => {
    const value = e.target.value;

    // 숫자인 경우만 반영
    if (!isNaN(value) && value.trim() !== "") {
      setIncreaseNumber(Number(value));
    } else {
      setIncreaseNumber(0); // 일반 텍스트 입력 시 증가값 0 처리
    }
  };

  // increaseNumber 만큼 증가
  const handleIncrease = () => {
    setNumber(number + increaseNumber);
  };

  return (
    <main style={{ padding: "20px" }}>
      <h3>Mandoo Todo</h3>

      <Mandoo width={100} />

      <ul>
        {mandooTodoLists.todos.map((todo, index) => (
          <li key={index}>{todo}</li>
        ))}
      </ul>

            <h1>{number}</h1>

      <button onClick={handlePlusOne}>+1</button>
      <br />

      <input
        type="text"
        placeholder="숫자만 적으세요"
        onChange={handleInputChange}
      />
      <br />

      <button onClick={handleIncrease}>
        + {increaseNumber}
      </button>
    </main>
  );
}


