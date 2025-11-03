---
## 🧍‍♂️ User Routes
---

**Base URL:** `/api/v1/users`

| Method | Endpoint    | Auth Required       | Description                                          |
| ------ | ----------- | ------------------- | ---------------------------------------------------- |
| POST   | `/register` | ❌ No               | Register a new user                                  |
| POST   | `/login`    | ❌ No               | Log in a user and return a token                     |
| GET    | `/me`       | ✅ Yes              | Retrieve information of the currently logged-in user |
| GET    | `/`         | ✅ Yes              | Retrieve all users                                   |
| GET    | `/:id`      | ✅ Yes (Admin only) | Retrieve user by ID                                  |
| DELETE | `/:id`      | ✅ Yes (Admin only) | Delete user by ID                                    |

---

## 🏃 Athlete Routes

**Base URL:** `/api/v1/athlete`

| Method | Endpoint | Auth Required       | Description                   |
| ------ | -------- | ------------------- | ----------------------------- |
| GET    | `/`      | ✅ Yes              | Retrieve all athlete profiles |
| DELETE | `/:id`   | ✅ Yes (Admin only) | Delete athlete by ID          |

---

## 🧑‍🏫 Coach–Athlete Routes

**Base URL:** `/api/v1/coach-athlete`

| Method | Endpoint           | Auth Required       | Description                                        |
| ------ | ------------------ | ------------------- | -------------------------------------------------- |
| POST   | `/assign`          | ✅ Yes              | Assign an athlete to a coach                       |
| GET    | `/coach/athletes`  | ✅ Yes              | Retrieve athletes assigned to the logged-in coach  |
| GET    | `/athlete/coaches` | ✅ Yes              | Retrieve coaches assigned to the logged-in athlete |
| DELETE | `/:id`             | ✅ Yes              | Remove an athlete–coach relationship               |
| GET    | `/`                | ✅ Yes (Admin only) | Retrieve all coach–athlete relationships           |

---

## 🏅 Sport Routes

**Base URL:** `/api/v1/sport`

| Method | Endpoint | Auth Required       | Description              |
| ------ | -------- | ------------------- | ------------------------ |
| GET    | `/`      | ❌ No               | Retrieve all sports      |
| GET    | `/:id`   | ✅ Yes              | Retrieve sport by ID     |
| POST   | `/`      | ✅ Yes (Admin only) | Create a new sport       |
| PUT    | `/:id`   | ✅ Yes (Admin only) | Update an existing sport |
| DELETE | `/:id`   | ✅ Yes (Admin only) | Delete a sport           |

---

## 📘 Daily Log Routes

**Base URL:** `/api/v1/daily-logs`

| Method | Endpoint | Auth Required | Description                                    |
| ------ | -------- | ------------- | ---------------------------------------------- |
| POST   | `/`      | ✅ Yes        | Create a new daily log entry                   |
| GET    | `/`      | ✅ Yes        | Retrieve all daily logs for the logged-in user |
| GET    | `/:id`   | ✅ Yes        | Retrieve a specific daily log by ID            |
| PUT    | `/:id`   | ✅ Yes        | Update an existing daily log                   |
| DELETE | `/:id`   | ✅ Yes        | Delete a daily log                             |

---

✅ **Notes**

- All routes requiring authentication must include a valid JWT in the request header (e.g., `Authorization: Bearer <token>`).
- “Admin only” routes are protected with `permissionMiddleware`.

---
