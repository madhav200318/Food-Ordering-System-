import React, { useEffect, useMemo, useState } from "react";
import { api } from "./api.js";
import Menu from "./components/Menu.jsx";
import Cart from "./components/Cart.jsx";
import OrderHistory from "./components/OrderHistory.jsx";

export default function App() {
  const [tab, setTab] = useState("menu");
  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState({}); // { foodId: quantity }
  const [error, setError] = useState("");
  const [historyKey, setHistoryKey] = useState(0);

  useEffect(() => {
    api.getFoods().then(setFoods).catch((e) => setError(e.message));
  }, []);

  const setQty = (id, qty) =>
    setCart((c) => {
      const next = { ...c };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });

  const cartItems = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, quantity]) => ({ food: foods.find((f) => f._id === id), quantity }))
        .filter((l) => l.food),
    [cart, foods]
  );
  const cartCount = cartItems.reduce((s, l) => s + l.quantity, 0);

  const onOrderPlaced = () => {
    setCart({});
    setHistoryKey((k) => k + 1);
    setTab("history");
  };

  return (
    <div className="app">
      <header className="topbar">
        <h1>🍔 Foodie</h1>
        <nav>
          <button className={tab === "menu" ? "active" : ""} onClick={() => setTab("menu")}>Menu</button>
          <button className={tab === "cart" ? "active" : ""} onClick={() => setTab("cart")}>
            Cart{cartCount > 0 && <span className="badge">{cartCount}</span>}
          </button>
          <button className={tab === "history" ? "active" : ""} onClick={() => setTab("history")}>Order History</button>
        </nav>
      </header>

      {error && <div className="error">{error} (is the backend running on port 5000?)</div>}

      <main>
        {tab === "menu" && <Menu foods={foods} cart={cart} setQty={setQty} />}
        {tab === "cart" && (
          <Cart items={cartItems} setQty={setQty} onOrderPlaced={onOrderPlaced} goMenu={() => setTab("menu")} />
        )}
        {tab === "history" && <OrderHistory key={historyKey} />}
      </main>
    </div>
  );
}
