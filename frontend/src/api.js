// Thin wrapper over the Express API (replaces the old JSON Server calls).
async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export const api = {
  getFoods: () => request("/foods"),
  createFood: (food) => request("/foods", { method: "POST", body: JSON.stringify(food) }),
  updateFood: (id, food) => request(`/foods/${id}`, { method: "PUT", body: JSON.stringify(food) }),
  deleteFood: (id) => request(`/foods/${id}`, { method: "DELETE" }),

  placeOrder: (order) => request("/orders", { method: "POST", body: JSON.stringify(order) }),
  getOrders: (customerName) =>
    request(`/orders${customerName ? `?customerName=${encodeURIComponent(customerName)}` : ""}`),
  updateOrder: (id, patch) => request(`/orders/${id}`, { method: "PUT", body: JSON.stringify(patch) }),
  deleteOrder: (id) => request(`/orders/${id}`, { method: "DELETE" }),
};
