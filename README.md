# 🤖 Gemini Cowork Center

A high-fidelity agent orchestration dashboard designed to bridge local development environments with Gemini's specialized skills. This center allows for seamless project management, automated database seeding, and real-time activity tracking.

![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![Tech](https://img.shields.io/badge/Tech-React_|_TS_|_Express_|_SQLite_|_Docker-blue?style=for-the-badge)

## 🚀 Key Features

- **Project Command Center**: Manage multiple engineering projects with real-time progress tracking.
- **SQLite Bridge**: Local database integration via an Express API to persist project data and task states.
- **Gemini Cowork Integration**: Specialized "Sync Context" feature to generate intelligent prompts for multi-agent collaboration.
- **Automated DB Workflows**: Integrated with the `db-schema-seeder` skill for automated migration, seeding, and testing.
- **Live Activity Feed**: Real-time audit log tracking agent actions and system events.
- **Dockerized Environment**: One-command setup for both frontend (Vite/React) and backend (Express).

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Vite
- **Backend**: Node.js, Express
- **Database**: SQLite 3
- **Containerization**: Docker & Docker Compose
- **Orchestration**: Gemini CLI Agent

## 📦 Getting Started

### Prerequisites
- Docker & Docker Desktop
- Node.js (for local package management)

### Installation & Run

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Teeraphat2104/gemini-cowork-center.git
   cd gemini-cowork-center
   ```

2. **Start the Environment**:
   ```bash
   docker-compose up -d --build
   ```

3. **Access the Dashboard**:
   - **Frontend**: [http://localhost:5173](http://localhost:5173)
   - **API**: [http://localhost:3001/api/projects](http://localhost:3001/api/projects)

## 🧩 Gemini Skill Integration

This project is optimized for use with the `db-schema-seeder` skill. 
To install the skill:
```bash
gemini skills install db-schema-seeder.skill --scope user
/skills reload
```

## 🤝 Contribution

This project was built in collaboration between **Teeraphat** and **Gemini CLI**. It serves as a blueprint for AI-driven engineering workspaces.

---
Built with ⚡ by Gemini CLI
