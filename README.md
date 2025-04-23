# Ticket Management System (TMS) Backend powered by Inngest

This is the backend for the Ticket Management System (TMS) application with Ticket Triage AI which processes tickets and assists users in resolving them.

## Quickstart

```bash
# Install dependencies
npm install

# Start the server
npm run dev

# Start the Inngest dev server
npm run inngest-dev # up on http://localhost:8288
```

## 📌 Project Overview

This project is a backend service built with **Express.js** and **MongoDB** designed for a smart ticketing system. Users can raise support tickets, and the system automatically categorizes them, assigns priority, and routes them to the most relevant **moderator** based on their skills using **Inngest background jobs**. Admins can manage users, assign roles and skills, and oversee the whole system.

---

## 🧠 Key Features

- 👤 **Authentication** with JWT for secure login/signup.
- 🎫 **Ticket creation** with fields like title, description, and auto-generated helpful notes.
- 🧑‍🔧 **Auto-assignment of moderators** using **Inngest** event-based functions.
- 📬 **Welcome emails** using **Inngest**, **Mailtrap** and **Nodemailer** on signup.
- 🔐 Role-based access: `user`, `moderator`, and `admin`.
- ⚙️ Admin controls: manage user roles and skills.

---

## ⚙️ Setup Instructions

1. **Clone the repo**:

   ```bash
   git clone https://github.com/wajeshubham/ai-ticket-assistant.git
   cd ai-ticket-assistant
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Create `.env` file**:

   ```env
    MONGO_URI=__MONGO_URI__
    JWT_SECRET=__JWT_SECRET__

    MAILTRAP_SMTP_HOST=__MAILTRAP_SMTP_HOST__
    MAILTRAP_SMTP_PORT=__MAILTRAP_SMTP_PORT__
    MAILTRAP_SMTP_USER=__MAILTRAP_SMTP_USER__
    MAILTRAP_SMTP_PASS=__MAILTRAP_SMTP_PASS__

    GEMINI_API_KEY=__GEMINI_API_KEY__
    APP_URL=http://localhost:3000 # Frontend URL
   ```

4. **Run the server**:

   ```bash
   npm run dev
   ```

5. **Run the Inngest dev server**:

   ```bash
   npm run inngest-dev # up on http://localhost:8288
   ```

---

## 🔐 Authentication Routes

| Route              | Method | Description         | Access |
| ------------------ | ------ | ------------------- | ------ |
| `/api/auth/signup` | POST   | Register a new user | Public |
| `/api/auth/login`  | POST   | Login and get token | Public |

---

## 🧾 Ticket Routes

| Route              | Method | Description                            | Access        |
| ------------------ | ------ | -------------------------------------- | ------------- |
| `/api/tickets`     | POST   | Create a new ticket                    | Authenticated |
| `/api/tickets`     | GET    | Get all tickets for logged-in user     | Authenticated |
| `/api/tickets/:id` | GET    | Get ticket details (role based access) | Authenticated |

---

## 🛠️ Admin/User Routes

| Route                   | Method | Description               | Access |
| ----------------------- | ------ | ------------------------- | ------ |
| `/api/auth/users`       | GET    | Get all users             | Admin  |
| `/api/auth/update-user` | POST   | Update user role & skills | Admin  |

---

## ⚙️ Inngest Functions

| Function            | Trigger           | Description                                                 |
| ------------------- | ----------------- | ----------------------------------------------------------- |
| `on-user-signup`    | User signup event | Sends a welcome email                                       |
| `on-ticket-created` | Ticket creation   | Tags ticket, detects skills, assigns moderator, sends email |

---

## 🧠 Auto Assignment Logic

When a ticket is created:

1. Inngest triggers `on-ticket-created`.
2. LLM generates:
   - Skills required
   - Ticket type
   - Priority
   - Helpful notes that a moderator can use to solve this issue.
3. The backend searches for the first available moderator with matching skills:
   ```js
   const moderator = await User.findOne({
     role: "moderator",
     skills: { $in: requiredSkills },
   });
   ```
4. If found, the ticket is assigned to that moderator else it is assigned to the admin.

---

## 📨 Mailtrap Integration

Emails are sent using **Nodemailer** configured with Mailtrap for development/testing:

```js
const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_SMTP_HOST,
  port: process.env.MAILTRAP_SMTP_PORT,
  auth: {
    user: process.env.MAILTRAP_SMTP_USER,
    pass: process.env.MAILTRAP_SMTP_PASS,
  },
});
```

---

## 📦 API URL

Set this in your frontend `.env` file:

```env
VITE_SERVER_URL=http://localhost:3000/api
```

---

## 🔗 Related Links

- Inngest Docs: [https://www.inngest.com/docs](https://www.inngest.com/docs)
- DaisyUI: [https://daisyui.com/](https://daisyui.com/)
- Mailtrap: [https://mailtrap.io/](https://mailtrap.io/)
- MongoDB: [https://www.mongodb.com/](https://www.mongodb.com/)
- Frontend repo (WIP): `link-to-frontend-repo`

---

Let me know if you want me to generate the **frontend docs**, a visual architecture diagram, or a deployment guide (e.g., with Render, Railway, or Vercel + MongoDB Atlas)!
