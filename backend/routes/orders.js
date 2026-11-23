const router = require("express").Router();
const Food = require("../models/Food");
const Order = require("../models/Order");

// CREATE: place an order. Prices are looked up server-side (never trust client totals).
router.post("/", async (req, res, next) => {
  try {
    const { customerName, phone, address, items } = req.body;
    if (!customerName || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "customerName and at least one item are required" });
    }

    const ids = items.map((i) => i.foodId);
    const foods = await Food.find({ _id: { $in: ids }, available: true });
    const byId = new Map(foods.map((f) => [String(f._id), f]));

    const lines = [];
    for (const it of items) {
      const food = byId.get(String(it.foodId));
      const qty = Number(it.quantity);
      if (!food) return res.status(400).json({ error: `Item ${it.foodId} unavailable` });
      if (!Number.isInteger(qty) || qty < 1) {
        return res.status(400).json({ error: "Quantity must be a positive integer" });
      }
      lines.push({ food: food._id, name: food.name, price: food.price, quantity: qty });
    }

    const totalAmount = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
    const order = await Order.create({ customerName, phone, address, items: lines, totalAmount });
    res.status(201).json(order);
  } catch (e) { next(e); }
});

// READ: order history (newest first). Optional ?customerName= filter.
router.get("/", async (req, res, next) => {
  try {
    const filter = req.query.customerName
      ? { customerName: new RegExp(`^${req.query.customerName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") }
      : {};
    res.json(await Order.find(filter).sort({ createdAt: -1 }));
  } catch (e) { next(e); }
});

router.get("/:id", async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (e) { next(e); }
});

// UPDATE: status / delivery details
router.put("/:id", async (req, res, next) => {
  try {
    const allowed = {};
    for (const k of ["status", "phone", "address"]) {
      if (req.body[k] !== undefined) allowed[k] = req.body[k];
    }
    const order = await Order.findByIdAndUpdate(req.params.id, allowed, {
      new: true,
      runValidators: true,
    });
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (e) { next(e); }
});

// DELETE
router.delete("/:id", async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json({ message: "Deleted", id: req.params.id });
  } catch (e) { next(e); }
});

module.exports = router;
