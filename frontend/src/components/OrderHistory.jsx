import React, { useEffect, useState } from "react";
import { api } from "../api.js";

const STATUSES = ["Placed", "Preparing", "Out for delivery", "Delivered", "Cancelled"];

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [name, setName] = useState(localStorage.getItem("customerName") || "");
  const [error, setError] = useState("");

  const load = (n = name) =>
    api.getOrders(n.trim()).then(setOrders).catch((e) => setError(e.message));

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const changeStatus = async (id, status) => {
    try {
      const updated = await api.updateOrder(id, { status });
      setOrders((os) => os.map((o) => (o._id === id ? updated : o)));
    } catch (e) { setError(e.message); }
  };

  const remove = async (id) => {
    if (!confirm("Delete this order?")) return;
    try {
      await api.deleteOrder(id);
      setOrders((os) => os.filter((o) => o._id !== id));
    } catch (e) { setError(e.message); }
  };

  const grand = orders.reduce((s, o) => s + (o.status === "Cancelled" ? 0 : o.totalAmount), 0);

  return (
    <div className="panel">
      <h2>Order History</h2>
      <div className="filter">
        <input placeholder="Filter by customer name (blank = all)" value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={() => load()}>Search</button>
      </div>
      {error && <div className="error">{error}</div>}
      {orders.length === 0 && <p className="muted">No orders found.</p>}

      {orders.map((o) => (
        <div className="order" key={o._id}>
          <div className="order-head">
            <div>
              <strong>{o.customerName}</strong>
              <div className="muted">#{o._id.slice(-6)} · {new Date(o.createdAt).toLocaleString()}</div>
            </div>
            <strong>₹{o.totalAmount}</strong>
          </div>
          <ul>
            {o.items.map((i) => (
              <li key={i.food}>{i.name} × {i.quantity} <span className="muted">(₹{i.price * i.quantity})</span></li>
            ))}
          </ul>
          <div className="order-actions">
            <select value={o.status} onChange={(e) => changeStatus(o._id, e.target.value)}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <button className="danger" onClick={() => remove(o._id)}>Delete</button>
          </div>
        </div>
      ))}

      {orders.length > 0 && <div className="grand">Total spent (excl. cancelled): <strong>₹{grand}</strong></div>}
    </div>
  );
}
