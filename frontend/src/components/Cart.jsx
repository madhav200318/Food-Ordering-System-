import React, { useState } from "react";
import { api } from "../api.js";

export default function Cart({ items, setQty, onOrderPlaced, goMenu }) {
  const [form, setForm] = useState({ customerName: "", phone: "", address: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const total = items.reduce((s, l) => s + l.food.price * l.quantity, 0);
  const change = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const place = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api.placeOrder({
        ...form,
        items: items.map((l) => ({ foodId: l.food._id, quantity: l.quantity })),
      });
      localStorage.setItem("customerName", form.customerName);
      onOrderPlaced();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="panel">
        <p>Your cart is empty.</p>
        <button className="primary" onClick={goMenu}>Browse menu</button>
      </div>
    );
  }

  return (
    <div className="panel">
      <h2>Your Cart</h2>
      <table>
        <thead><tr><th>Item</th><th>Price</th><th>Qty</th><th>Subtotal</th></tr></thead>
        <tbody>
          {items.map(({ food, quantity }) => (
            <tr key={food._id}>
              <td>{food.name}</td>
              <td>₹{food.price}</td>
              <td>
                <div className="stepper">
                  <button onClick={() => setQty(food._id, quantity - 1)}>−</button>
                  <span>{quantity}</span>
                  <button onClick={() => setQty(food._id, quantity + 1)}>+</button>
                </div>
              </td>
              <td>₹{food.price * quantity}</td>
            </tr>
          ))}
        </tbody>
        <tfoot><tr><td colSpan="3"><strong>Total Amount</strong></td><td><strong>₹{total}</strong></td></tr></tfoot>
      </table>

      <form onSubmit={place} className="form">
        <input required placeholder="Your name" value={form.customerName} onChange={change("customerName")} />
        <input placeholder="Phone" value={form.phone} onChange={change("phone")} />
        <input placeholder="Delivery address" value={form.address} onChange={change("address")} />
        {error && <div className="error">{error}</div>}
        <button className="primary" disabled={busy}>{busy ? "Placing..." : `Place Order · ₹${total}`}</button>
      </form>
    </div>
  );
}
