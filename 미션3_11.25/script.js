// mock.json에서 상품 목록로드 및 ul 렌더
fetch('./mock.json')
  .then(res => res.json())
  .then(data => {
    products = data;
    
    const ul = document.querySelector('ul');
    if (!ul) return;

    data.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `
        <h3>${item.productName}</h3>
        <img class="images" src="${item.productImgFileName}" alt="${item.productName}">
        <span class="price">${item.productPrice}</span>
        <button data-id="${item.id}" class="addCartBtn">add cart</button>
      `;
      ul.appendChild(li);
    });

    // 이벤트 위임: ul 내부의 addCartBtn 클릭 처리
    ul.addEventListener('click', (e) => {
      const btn = e.target.closest('.addCartBtn');
      if (!btn) return;
      const id = btn.dataset.id;
      const ok = addToCartById(id, 1);
      if (ok) {
        const prod = products.find(p => String(p.id) === String(id));
        const name = prod ? (prod.productName || prod.title || '상품') : '상품';
        alert(`상품 "${name}" 장바구니에 추가되었습니다.`);
      }
    });

    // 초기 장바구니 렌더
    renderDropBox();
    // 모달 생성
    createModal();
  })
  .catch(err => console.error('mock.json 로드 실패', err));

// dropBox 내부 삭제 버튼 처리 (이벤트 위임)
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.removeCart');
  if (!btn) return;
  const id = String(btn.dataset.id);
  cart = cart.filter(i => String(i.id) !== id);
  saveCart();
  renderDropBox();
});


let products = [];
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function renderDropBox() {
  const drop = document.querySelector('.dropBox');
  if (!drop) return;
  drop.innerHTML = '';
  if (cart.length === 0) {
    drop.innerHTML = '<div class="empty">장바구니가 비어 있습니다.</div>';
    return;
  }


  cart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.dataset.id = item.id;
    div.innerHTML = `
      <img src="${item.productImgFileName || item.productImg || ''}" alt="${item.productName || item.title}" style="width:100px;height:80px;">
      <div class="info">
        <div class="title">${item.productName || item.title}</div>
        <div class="price">${item.productPrice || item.price}원</div>
        <div class="count">수량: ${item.count}</div>
        <button class="removeCart" data-id="${item.id}">삭제</button>
      </div>
    `;
    drop.appendChild(div);
  });
}


function addToCartById(id, qty = 1) {
  const productId = String(id);
  const idx = cart.findIndex(i => String(i.id) === productId);

  if (idx === -1) {
    const now = products.find(p => String(p.id) === productId);
    if (!now) {
      console.warn('상품을 찾을 수 없습니다:', id);
      return false;
    }
    const item = { ...now, count: qty };
    cart.push(item);
  } else {
    cart[idx].count += qty;
  }

  saveCart();
  renderDropBox();
  return true;
}


// 콘솔에서 바로 호출 가능
window.addToCartById = addToCartById;


//모달
function createModal() {
  if (sessionStorage.getItem("closeModal")) return;

  const modal = document.createElement("div");
  const modalInner = document.createElement("div");
  const modalText = document.createElement("span");
  const modalBtnClose = document.createElement("button");
  const modalBtnOk = document.createElement("button");
  
  modalBtnClose.innerText = "오늘 그만보기";
  modalBtnOk.innerText = "확인";
  modalText.innerText = "방문해 주셔서 감사합니다!\n즐거운 쇼핑 되세요!";

  modalBtnClose.addEventListener("click", () => {
    sessionStorage.setItem("closeModal", true);
    document.body.removeChild(modal);
  });

  modalBtnOk.addEventListener("click", () => {
    // 단순히 모달만 닫음(오늘 그만보기는 설정하지 않음)
    document.body.removeChild(modal);
  });

  modal.className = "modal";
  modalInner.className = "modalInner";

  document.body.appendChild(modal);
  modalInner.appendChild(modalText);
  modalInner.appendChild(modalBtnOk);
  modalInner.appendChild(modalBtnClose);
  modal.appendChild(modalInner);
}

