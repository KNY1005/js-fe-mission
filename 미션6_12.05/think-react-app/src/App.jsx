import { useState } from "react";

const INITIAL_PRODUCTS = [
  { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
  { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
  { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
  { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
  { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
  { category: "Vegetables", price: "$1", stocked: true, name: "Peas" },
];

export default function App() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);

  // 새 상품 추가 핸들러
  const handleAddProduct = (newProduct) => {
    setProducts((prev) => {
      // Fruits 먼저, Vegetables 다음! 카테고리별 마지막에 삽입
      const idx = (() => {
        if (newProduct.category === "Fruits") {
          let lastFruit = -1;
          for (let i = 0; i < prev.length; i++) {
            if (prev[i].category === "Fruits") lastFruit = i;
          }
          return lastFruit + 1;
        } else {
          return prev.length;
        }
      })();
      const updated = [...prev.slice(0, idx), newProduct, ...prev.slice(idx)];
      return updated;
    });
  };

  // 상품 삭제 핸들러
  const handleDeleteProduct = (category, name) => {
    setProducts(prev => prev.filter(
      p => !(p.category === category && p.name === name)
    ));
  };

  return (
    <div style={{ padding: "20px", maxWidth: 380, margin: "auto" }}>
      <h2>Product Manager</h2>
      <AddProductForm onAddProduct={handleAddProduct} />
      <FilterableProductTable products={products} onDeleteProduct={handleDeleteProduct} />
    </div>
  );
}

function AddProductForm({ onAddProduct }) {
  const [category, setCategory] = useState("Fruits");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("$1");
  const [stocked, setStocked] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddProduct({ category, name: name.trim(), price, stocked });
    setName("");
    setPrice("$1");
    setStocked(true);
    setCategory("Fruits");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20, padding: 12, border: "1px solid #ccc", borderRadius: 8 }}>
      <div style={{ marginBottom: 8 }}>
        <label>
          Category:
          <select value={category} onChange={e => setCategory(e.target.value)} style={{ marginLeft: 8 }}>
            <option value="Fruits">Fruits</option>
            <option value="Vegetables">Vegetables</option>
          </select>
        </label>
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>
          Name:
          <input value={name} onChange={e => setName(e.target.value)} style={{ marginLeft: 8 }} required />
        </label>
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>
          Price:
          <select value={price} onChange={e => setPrice(e.target.value)} style={{ marginLeft: 8 }}>
            <option>$1</option>
            <option>$2</option>
            <option>$3</option>
            <option>$4</option>
            <option>$5</option>
          </select>
        </label>
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>
          <input type="checkbox" checked={stocked} onChange={e => setStocked(e.target.checked)} style={{ marginRight: 4 }} /> In stock
        </label>
      </div>
      <button type="submit">Add</button>
    </form>
  );
}

function FilterableProductTable({ products, onDeleteProduct }) {
  // 정렬: Fruits가 항상 위, Vegetables 아래
  const sorted = [...products].sort((a, b) => {
    if (a.category === b.category) return 0;
    return a.category === "Fruits" ? -1 : 1;
  });
  const [filterText, setFilterText] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly}
      />
      <ProductTable
        products={sorted}
        filterText={filterText}
        inStockOnly={inStockOnly}
        onDeleteProduct={onDeleteProduct}
      />
    </div>
  );
}

function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange,
}) {
  return (
    <form>
      <input
        type="text"
        value={filterText}
        onChange={(e) => onFilterTextChange(e.target.value)}
        placeholder="Search..."
      />
      <br />
      <label>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => onInStockOnlyChange(e.target.checked)}
        />
        &nbsp;Only show products in stock
      </label>
    </form>
  );
}

function ProductTable({ products, filterText, inStockOnly, onDeleteProduct }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (product.name.toLowerCase().indexOf(filterText.toLowerCase()) === -1) {
      return;
    }

    if (inStockOnly && !product.stocked) {
      return;
    }

    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category}
        />
      );
    }
    rows.push(
      <ProductRow product={product} key={product.name} onDeleteProduct={onDeleteProduct} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th></th>{/* for delete btn */}
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan={2}>{category}</th>
    </tr>
  );
}

function ProductRow({ product, onDeleteProduct }) {
  const productName = product.stocked ? (
    product.name
  ) : (
    <span style={{ color: "red" }}>{product.name}</span>
  );
  return (
    <tr>
      <td>{productName}</td>
      <td>{product.price}</td>
      <td>
        <button onClick={() => onDeleteProduct(product.category, product.name)} style={{ background: '#e55', color: 'white', border: 'none', padding: '2px 8px', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}>
          Delete
        </button>
      </td>
    </tr>
  );
}
