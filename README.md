# 🛠️ CodeRush Backend — Scalable API & Code Execution Engine

This is the **backend service** for [CodeRush](https://github.com/HYDRO2070/coderush), a multi-language coding platform where users can solve randomized, topic-specific problems and track their coding progress. The backend is responsible for user authentication, question management, Docker-based code execution, and MongoDB data storage.

---

## 🚀 Features

- 🧑‍💻 **User Authentication (JWT)**
  - Sign up, log in, and manage secure sessions using JSON Web Tokens.

- 📚 **Topic-Based Question Generation**
  - Serve random coding questions based on selected topics and programming languages.

- 🐳 **Secure Code Execution**
  - Run submitted code inside **Docker containers** for C++, Python, JavaScript, and Java.
  - Each container is isolated for safety and consistency.

- 📊 **Progress & Submission Tracking**
  - Store solved problems, user history, and growth insights for later retrieval.

- 🧩 **REST API for Frontend Integration**
  - Clean and modular API routes that power the frontend application.

---

## 🧱 Tech Stack

| Layer        | Tech Used               |
|--------------|--------------------------|
| Server       | Node.js, Express.js      |
| Auth         | JWT (JSON Web Tokens)    |
| DB           | MongoDB + Mongoose       |
| Execution    | Docker (per-language images) |
| Utilities    | Dockerode, fs, child_process |

---

## 📦 Project Structure

```

/coderush-backend
├── controllers/
├── routes/
├── services/           # Code execution logic
├── models/             # User & Question schemas
├── utils/              # Docker helpers, validators
├── .env
├── server.js
└── package.json

````

---

## ⚙️ Setup & Installation

### 🔧 Prerequisites

- Node.js v18+
- Docker (installed and running)
- MongoDB (local or Atlas)

### 📥 Steps

```bash
# Clone the repo
git clone https://github.com/HYDRO2070/Code-Complier.git
cd Code-Complier

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start the server
npm run dev
````

Ensure Docker is running locally and that `.env` is properly configured.

---

## 🔐 Environment Variables

Create a `.env` file with the following:

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
DOCKER_SOCKET=/var/run/docker.sock
```

---

## 🔌 Available API Endpoints

> Base URL: `http://localhost:5000/api`

| Method | Endpoint            | Description                        |
| ------ | ------------------- | ---------------------------------- |
| POST   | `/auth/signup`      | Create a new user                  |
| POST   | `/auth/login`       | Authenticate user and return token |
| GET    | `/user/profile`     | Get logged-in user's profile       |
| POST   | `/questions/random` | Fetch a random question by topic   |
| POST   | `/code/execute`     | Run submitted code via Docker      |
| GET    | `/user/history`     | Get solved problems by user        |

---

## 🧪 Code Execution via Docker

* Each submission is sent to a language-specific Docker container.
* Output, errors, or runtime exceptions are captured and returned to the client.
* Prevents direct code execution on the host machine for **maximum security**.

Supported languages:

* ✅ C++
* ✅ Python
* ✅ JavaScript
* ✅ Java

---

## 🧼 Linting & Formatting

```bash
# Lint with ESLint
npm run lint

# Format with Prettier
npm run format
```

---

## 📈 Future Enhancements

* ✅ Execution timeout safeguards
* 🔜 Container reuse with lifecycle management
* 🔜 Rate limiting & abuse protection
* 🔜 Caching frequently used questions
* 🔜 Unit & integration testing with Jest

---

## 🤝 Contributing

We welcome contributions! Please open an issue or submit a pull request for improvements, bug fixes, or features.

