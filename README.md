# Food Ordering System (React + Node/Express + MongoDB)

Swiggy/Zomato-style app. Converted from a JSON Server setup: every `json-server` endpoint is replaced by an Express API backed by MongoDB (Mongoose).

## Project structure
```
food-ordering/
├── backend/
│   ├── server.js            # Express app + MongoDB connection
│   ├── seed.js              # Loads sample menu
│   ├── models/Food.js       # Menu schema
│   ├── models/Order.js      # Order schema (embedded line items)
│   └── routes/{foods,orders}.js
└── frontend/                # React (Vite); proxies /api -> :5000
    └── src/{App.jsx, api.js, components/{Menu,Cart,OrderHistory}.jsx}
```

## Run it
Prerequisite: Node 18+ and MongoDB running locally (or a MongoDB Atlas URI).

```bash
# Terminal 1 - backend
cd backend
cp .env.example .env        # edit MONGO_URI if using Atlas
npm install
npm run seed                # inserts 12 menu items
npm start                   # http://localhost:5000

# Terminal 2 - frontend
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

## Database schema
**foods**: `name, description, category, price, image, available, createdAt, updatedAt`

**orders**: `customerName, phone, address, items[{food(ref), name, price, quantity}], totalAmount, status, createdAt, updatedAt`
Line items snapshot name/price, so history stays correct if menu prices change. `totalAmount` is computed on the server.

## REST API (replaces JSON Server)
| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/foods | List menu (`?category=`) |
| GET | /api/foods/:id | One item |
| POST | /api/foods | Create item |
| PUT | /api/foods/:id | Update item |
| DELETE | /api/foods/:id | Delete item |
| POST | /api/orders | Place order `{customerName, phone, address, items:[{foodId, quantity}]}` |
| GET | /api/orders | Order history (`?customerName=`) |
| GET | /api/orders/:id | One order |
| PUT | /api/orders/:id | Update status/phone/address |
| DELETE | /api/orders/:id | Delete order |

## Demonstrating persistence
1. Place an order in the UI, then stop and restart both servers: the order is still in **Order History**.
2. Verify directly in MongoDB:
   ```bash
   mongosh food_ordering --eval "db.orders.find().pretty()"
   ```
3. Or via API: `curl http://localhost:5000/api/orders`
4. Try CRUD with curl:
   ```bash
   curl -X POST localhost:5000/api/foods -H "Content-Type: application/json" -d '{"name":"Pasta","price":199,"category":"Main Course"}'
   curl -X PUT  localhost:5000/api/orders/<id> -H "Content-Type: application/json" -d '{"status":"Delivered"}'
   curl -X DELETE localhost:5000/api/orders/<id>
   ```

## Team split (2 students)
- **Student A (backend):** schemas, Express routes, validation, seeding, persistence demo.
- **Student B (frontend):** React components, cart state, API integration (`api.js`), styling.
