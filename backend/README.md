# HomeTasker Backend 

## A Gamified Task Management API for Families  
This backend is built using *Node.js + Express.js* and provides RESTful APIs for managing household tasks. Users can add tasks, assign points, and track completion**.

---

## Backend Setup
```
backend/
│── config/            # Configuration files (e.g., database connection)
│   ├── db.js          # MongoDB connection setup
│── models/            # Database models (Mongoose schemas)
│   ├── Task.js        # Task schema
│── routes/            # API routes
│   ├── tasks.js       # Task management API
│── controllers/       # Business logic (optional, for cleaner code)
│   ├── taskController.js # Handles task logic (optional)
│── middleware/        # Middleware functions (e.g., authentication, logging)
│   ├── auth.js        # Authentication middleware (JWT, Firebase)
│── utils/             # Helper functions (optional)
│   ├── logger.js      # Logs API requests (example)
│── kubernetes/        # Kubernetes deployment configurations
│   ├── deployment.yaml # Kubernetes Deployment file
│── terraform/         # Terraform infrastructure as code
│   ├── main.tf        # Defines AWS infrastructure (EC2, S3, RDS, IAM)
│   ├── variables.tf   # Stores Terraform variables
│   ├── outputs.tf     # Defines Terraform output values
│   ├── provider.tf    # Configures Terraform provider (AWS)
│   ├── backend.tf     # Defines Terraform backend for state management
│── node_modules/      # Dependencies (auto-generated)
│── .env               # Environment variables (MongoDB URL, secrets)
│── .gitignore         # Ignore node_modules, .env, and logs
│── Dockerfile         # Defines backend container for deployment
│── package.json       # Project metadata & dependencies
│── README.md          # Backend documentation
│── server.js          # Main server file (Express app entry point)
```



## Hometasker - Tasks Gamified

Household Chores + points
- Take out the trash	3
Wash the dishes	7
- Vacuum the living room	7
- Water the plants	10
- Cook a meal	10

Learning & Productivity + points
- Read a book for 30 min	20
- Complete homework	25
- Practice a hobby	15

Health & Fitness + points
- Go for a 30 min walk	20
- Do a home workout	25

Family & Social + points
- Help a sibling with homework	15
- Play a board game together	10