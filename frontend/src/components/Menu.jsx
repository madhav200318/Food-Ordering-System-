import React, { useState } from "react";

export default function Menu({ foods, cart, setQty }) {
  const categories = ["All", ...new Set(foods.map((f) => f.category))];
  const [cat, setCat] = useState("All");
  const shown = cat === "All" ? foods : foods.filter((f) => f.category === cat);

  return (
    <>
      <div className="chips">
        {categories.map((c) => (
          <button key={c} className={c === cat ? "chip active" : "chip"} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>
      <div className="grid">
        {shown.map((f) => {
          const qty = cart[f._id] || 0;
          return (
            <div className="card" key={f._id}>
              <div className="card-cat">{f.category}</div>
              <h3>{f.name}</h3>
              <p className="muted">{f.description}</p>
              <div className="card-row">
                <strong>₹{f.price}</strong>
                {qty === 0 ? (
                  <button className="primary" onClick={() => setQty(f._id, 1)}>Add</button>
                ) : (
                  <div className="stepper">
                    <button onClick={() => setQty(f._id, qty - 1)}>−</button>
                    <span>{qty}</span>
                    <button onClick={() => setQty(f._id, qty + 1)}>+</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {shown.length === 0 && <p className="muted">No items yet. Run <code>npm run seed</code> in the backend.</p>}
      </div>
    </>
  );
}
