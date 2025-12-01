// Mandoo.jsx
// 만두 이미지 출력 컴포넌트
// width 값을 props로 받아 사용

import MandooImg from "./assets/mandoo.png";

export default function Mandoo({ width }) {
  return (
    <img
      src={MandooImg}
      alt="mandooimg"
      style={{ width: `${width}px` }}
    />
  );
}
