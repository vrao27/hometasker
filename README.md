# HomeTasker – Gamified Family Task Management App

HomeTasker - is a full-stack project designed to help families manage and gamify everyday household tasks. Built as a collaborative learning project, it highlights backend API development, DevOps fundamentals, and integration with a modern frontend stack.

This project consists of:

- Frontend – developed using a React framework and Bootstrap.
- Backend – REST API with Node.js, MongoDB, JWT auth, and Swagger documentation
- DevOps & Cloud Integration\*\* – WIP: CI/CD pipelines, Terraform IaC, Kubernetes deployment

# Technologies Used

Backend

- Node.js, Express, MongoDB, Mongoose
- JWT Authentication, bcrypt, express-validator
- Swagger UI for interactive API documentation
- Docker (fully functional)
- GitHub Actions, Terraform, Kubernetes (in progress)

Frontend

- React
- React Router DOM
- Bootstrap

# Project Evolution

The basic logic for task management and gamification is implemented, with working backend routes and a connected UI. This project will continue to evolve with further UI/UX development, CI/CD integration, and infrastructure automation — reflecting a real-world product lifecycle and DevOps mindset.

This is an evolving project aimed at demonstrating:

- Hands-on backend engineering skills
- Real-world DevOps practices (Docker, CI/CD, IaC)
- Continuous learning and practical implementation of cloud-native development

##Get Started

prerequisites

- Node.js
- Docker
- Docker compose

1. Clone repo

- git clone https://github.com/<your-org>/hometasker.git
- cd hometasker

#(edit your .env file and set your MongoDB URI, JWT secret, etc.)

- cp .env.example .env

- docker-compose up --build -d

Frontend

- http://localhost:3000

Backend

- http://localhost:5000

MongoDB

- localhost:27017

..
