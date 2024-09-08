# WillSmith: A LangSmith Open-Source Alternative 🚀

[![Docker Pulls](https://img.shields.io/docker/pulls/zsio/willsmith.svg)](https://hub.docker.com/r/zsio/willsmith)

**WillSmith** is an open-source alternative to LangSmith, designed to provide a more cost-effective and flexible solution for monitoring, debugging, and optimizing applications based on large language models (LLMs). It supports easy deployment via Docker and features a sleek user interface.


## Features ✨
- **Chain Call Monitoring**: Track and record every model call's input, output, errors, and performance metrics for easy optimization.
- **User-Friendly UI**: With a clean interface built using Shadcn UI, quickly browse and analyze stored data.
- **MongoDB Data Storage**: Efficiently store and query chain call and debugging data with MongoDB.
- **Docker Deployment**: Easily get started using the provided Docker setup.




## Getting Started ⚡

### 1. Start with Docker Compose 🐳

This project provides a `docker-compose.yaml` file that includes everything you need to run the app and MongoDB. Make sure you have Docker and Docker Compose installed.

First, set up your environment variables in a `.env` file:

```bash
# .env
MONGODB_URI=mongodb://your-mongo-uri:27017/willsmith
```

Then, simply run:

```bash
docker-compose up -d
```

Docker Compose will start both the WillSmith app and the MongoDB instance. The app will be available at `http://localhost:3000`.

### 2. Access the App 🌐

Once the app is running, open your browser and visit `http://localhost:3000` to access the UI and start managing your application data.

## LangChain Integration 🔗

To integrate WillSmith with your LangChain project for chain call monitoring, just add the following environment variables to your `.env` file:

```bash
# In your LangChain project's .env file
LANGCHAIN_ENDPOINT=http://localhost:3000  # The service URL after Docker starts
LANGCHAIN_TRACING_V2=True
LANGCHAIN_API_KEY=your_api_key  # Any value, no key validation yet
LANGCHAIN_PROJECT=project_name  # Your custom project name
```

With these settings, LangChain will automatically send chain call data to WillSmith, which will store it in MongoDB.

## Development Roadmap 🛠️

We have an exciting set of features in our development pipeline. Here’s what’s coming next:

- [x] **Project Querying** 🗂️ — Completed
- [x] **Root Record Querying** 📝 — Completed
- [ ] **Tree-Structured Detailed Record Querying** 🌲 — In progress
- [ ] **Enhanced Database Design** 📊 — Coming soon (refactor data into multiple collections)
- [ ] **Auto-Update for Record Queries** 🔄 — Coming soon (dynamic query updates for latest records)

---

Feel free to extend the project based on your needs. We welcome contributions from the community! 🙌