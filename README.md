# 🌱 LeafLensAI

**AI-powered crop disease detection and agricultural assistance application.**

LeafLensAI helps farmers identify crop diseases using AI and provides useful agricultural guidance through an easy-to-use mobile application.

---

## 🚀 Project Demo

### Live / Deployed Application

**Backend link:** `https://crop-doctor-backend-sl9n.onrender.com/`
**Application download Link:** `https://expo.dev/accounts/chandu-1112/projects/mobile/builds/09df50cf-f00f-49bf-bba9-298999a7c5e1`

## 📱 Screenshots

Screenshots of the application will be added here.

### Home Screen

![Home Screen](screenshots/home.png)

### Crop Disease Diagnosis

![Diagnosis Screen](screenshots/diagnosis.png)

### Diagnosis Result

![Result Screen](screenshots/result.png)

### AI Assistant

![AI Assistant](screenshots/assistant.png)

---

## ✨ Key Features

* 🌿 AI-powered crop disease detection
* 📷 Crop/leaf image-based diagnosis
* 🤖 AI agricultural assistant
* 📋 Disease diagnosis and recommendations
* 📜 Diagnosis/history tracking
* 👤 User profile
* 📱 Mobile application interface
* ⚡ FastAPI-based backend
* 🗄️ Database-backed application

---

## 🛠️ Tech Stack

### Backend

* Python
* FastAPI
* SQLAlchemy
* MySQL / PostgreSQL
* REST APIs
* AI/ML services

### Mobile

* React Native
* Expo
* TypeScript

### Tools

* Git
* GitHub
* REST API
* JSON

---

# 📂 Project Structure

```text
LeafLensAI/
│
├── crop-doctor-backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── services/
│   │   └── ...
│   ├── requirements.txt
│   └── ...
│
├── crop-doctor-mobile/
│   ├── app/
│   ├── components/
│   ├── assets/
│   ├── package.json
│   └── ...
│
├── screenshots/
│   ├── home.png
│   ├── diagnosis.png
│   ├── result.png
│   └── assistant.png
│
├── .gitignore
└── README.md
```

---

# ⚙️ How to Run the Project

## 1. Clone the Repository

```bash
git clone https://github.com/Chandu-1112/LeafLensAI.git
cd LeafLensAI
```

---

# 🔹 Backend Setup

Go to the backend directory:

```bash
cd crop-doctor-backend
```

### Create a Virtual Environment

Windows:

```powershell
python -m venv venv
```

Activate it:

```powershell
venv\Scripts\activate
```

### Install Dependencies

```powershell
pip install -r requirements.txt
```

### Environment Variables

Create a `.env` file inside:

```text
crop-doctor-backend/
```

Example:

```env
GOOGLE_API_KEY=your_api_key_here
DATABASE_URL=your_database_url_here
```

> Do not commit your `.env` file to GitHub.

### Start the Backend

```powershell
uvicorn app.main:app --reload
```

The backend will normally be available at:

```text
http://127.0.0.1:8000
```

### API Documentation

FastAPI automatically provides interactive API documentation:

```text
http://127.0.0.1:8000/docs
```

---

# 🔹 Mobile App Setup

Open a new terminal and go to:

```powershell
cd crop-doctor-mobile
```

### Install Dependencies

```powershell
npm install
```

### Start the Application

```powershell
npx expo start
```

Then use the Expo development options to run the application on a physical device, emulator, or supported platform.

---

# 🔐 Environment Variables

The project requires environment-specific configuration.

Example:

```env
GOOGLE_API_KEY=your_api_key_here


**Never share real API keys publicly.**

---

# 🧩 Application Flow

```text
User
  │
  ▼
Mobile Application
  │
  ▼
FastAPI Backend
  │
  ├──► AI / Disease Detection Service
  │
  └──► Database
  │
  ▼
Diagnosis / Recommendation
  │
  ▼
Mobile Application
```

---

# 🎯 Hackathon Highlights

LeafLensAI focuses on using AI technology to make crop disease identification and agricultural assistance more accessible through a mobile-first application.

The system combines:

* AI-powered analysis
* REST APIs
* Mobile application development
* Database integration
* Agricultural assistance

into a single application.

---

# 👥 Team

**Team Name:** `LeafLens AI`

| Member               |     Role      |
| -------------------- | ------------  |
| `Chandu Kumar Reddy` | `Team leader` |
| `Dhanavardhan Reddy` | `Team member` |
| `Ajay Kumar`         | `Team member` |
| `Swarna Kumar`       | `Team member` |

---

# 📄 License

This project was developed for hackathon/educational purposes.
