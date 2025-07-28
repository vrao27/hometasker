# HomeTasker – Gamified Family Task Management App

HomeTasker - is a full-stack project designed to help families manage and gamify everyday household tasks. Built as a collaborative learning project, it highlights backend API development, DevOps fundamentals, and integration with a modern frontend stack.

This project consists of:

Frontend – React & Bootstrap
Backend – REST API (Node.js, MongoDB, JWT auth, Swagger docs)
DevOps & Cloud – IaC with Terraform, AWS Lightsail provisioning, Docker Compose, GitHub Actions CI/CD (Kubernetes planned)

# Technologies Used

Frontend: React, Bootstrap, React Router DOM

Backend: Node.js, Express, MongoDB, JWT, bcrypt, express-validator, Swagger UI

DevOps: Docker, Docker Compose, Terraform (AWS Lightsail), cloud-init, GitHub Actions (CI/CD)

Cloud: AWS Lightsail (instance, static IP, firewall, SSH, all via Terraform)

# Project Evolution

The basic logic for task management and gamification is implemented, with working backend routes and a connected UI. This project will continue to evolve with further UI/UX development, CI/CD integration, and infrastructure automation — reflecting a real-world product lifecycle and DevOps mindset.

This is an evolving project aimed at demonstrating:

- Hands-on backend engineering skills
- Real-world DevOps practices (Docker, CI/CD, IaC)
- Continuous learning and practical implementation of cloud-native development

##Get Started

Cloud-Native Demo
Spin up a production-like instance on AWS Lightsail with full automation:

No manual Docker/Node install
No copy-paste secrets or config
Just terraform apply and go

1. Clone repo

git clone https://github.com/vrao27/hometasker.git
cd hometasker/infra

2. NOTE: Edit or create a terraform.tfvars file if you use custom variables.

3. Deploy using Terraform

terraform init
terraform apply

Type yes when prompted.
Wait 2–4 minutes while AWS provisions the server and cloud-init auto-deploys your app.

4. Connect to the AWS Lighsail Instance
   IMPORTANT:
   Make sure you have created or imported your SSH key in your own AWS Lightsail account, and attached it to your new instance.

ssh -i ~/.ssh/<your-key>.pem ubuntu@hometasker.org
(Replace <your-key> with your actual private key filename.)

5. Visit the app

Frontend:
http://hometasker.org

Backend API docs:
http://hometasker.org:5000/api-docs

6. Cleanup

terraform destroy

Notes

- All provisioning, app deployment, and environment config are fully automated via IaC (Terraform + cloud-init).
- For local dev: You can also run with Docker Compose after editing .env files.
- Production secrets: For demonstration, placeholder/test secrets are used in automation. For real deployments, use secrets management (AWS SSM, etc.).

Questions / Issues?
Open an issue on GitHub or contact me at vrao8912@gmail.com
