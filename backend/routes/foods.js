const router = require("express").Router();
const Food = require("../models/Food");

// READ all (optional ?category=)
router.get("/", async (req, res, next) => {
  try {
    const filter = req.query.category ? { category: req.query.category } : {};
    res.json(await Food.find(filter).sort({ category: 1, name: 1 }));
  } catch (e) { next(e); }
});

// READ one
router.get("/:id", async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ error: "Food not found" });
    res.json(food);
  } catch (e) { next(e); }
});

// CREATE
router.post("/", async (req, res, next) => {
  try {
    res.status(201).json(await Food.create(req.body));
  } catch (e) { next(e); }
});

// UPDATE
router.put("/:id", async (req, res, next) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!food) return res.status(404).json({ error: "Food not found" });
    res.json(food);
  } catch (e) { next(e); }
});

// DELETE
router.delete("/:id", async (req, res, next) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) return res.status(404).json({ error: "Food not found" });
    res.json({ message: "Deleted", id: req.params.id });
  } catch (e) { next(e); }
});

module.exports = router;
