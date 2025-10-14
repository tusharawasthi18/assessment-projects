# Assessment Projects
This is the base repository for assessment projects. Candidates should follow these steps:

**Getting Started:**
1. **Fork this repository** to your own GitHub account
2. **Wait for project assignment** - The interview manager will assign you a specific project from the list below
3. **Develop your solution** in your forked repository
4. During the **technical discussion**, we will review your code directly from your forked repository

**Note:** Make sure your forked repository is public so we can access it during the technical review session.

## DO's
- Document your code
- Follow best practices
**Technical Requirements:**
- Language: Any (Python, Node.js, Go, Rust, etc.)
- Storage: File-based (JSON, SQLite, or encrypted files)
- Security: Implement proper encryption and secure password handling

## Dont's 
- Don't copy code directly from online sources or tutorials
- Don't commit sensitive information (API keys, passwords, personal data)
- Don't ignore error handling and edge cases
- Don't skip code comments and documentation
- Don't use deprecated libraries or outdated practices
- Don't hardcode configuration values
- Don't submit incomplete or non-functional code
- Don't violate security best practices
- Don't plagiarize from other candidates' solutions
- Don't create pull requests on this repository - work only in your forked repository

---

# Projects 
## Authentication System
**Description**
Create an authentication system that handles at least 2 different types of authentication mechanisms.
- Authentication server that supports atleast 2 different types of user authentication mechanism.

--- 
## Password Manager
**Description**
Create a terminal-based password manager application that helps users securely store, generate, and manage their passwords. This project will help you understand cryptography, secure storage, and command-line interface development.

**What is a Password Manager?**
A password manager is a software application that stores and manages online credentials in an encrypted database. It helps users generate strong, unique passwords for different accounts and remembers them so users don't have to.

**Core Features to Implement:**
- **Master Password Protection**: Secure the entire password vault with a master password
- **Password Storage**: Store website URLs, usernames, and encrypted passwords
- **Strong Password Generation**: Generate cryptographically secure passwords with customizable length and character sets
- **Password Rotation**: Allow users to update/rotate existing passwords
- **Search & Retrieve**: Find and display stored credentials
- **Terminal Interface**: Command-line based interface for all operations
- **Encryption**: All stored passwords must be encrypted (AES-256 recommended)
- **Import/Export**: Basic functionality to backup and restore password data

---
## CRUD API
**Description**
Using any of below databases build an API to perform CURD operation. 
- API's should support multiple formats of output & input
- At least one endpoint should support streaming.
- One endpoint should combine results for 3 different services/ data sets and implemennts async/parallel processing.
- [netflixdb](https://github.com/lerocha/netflixdb)
- [sakila-sqlite3](https://github.com/bradleygrant/sakila-sqlite3)

---
## On-Demand Processor
**Description**
Develop a system that accepts jobs, and process them.
- A job can have mnultiple tasks in it.
- Live status of tasks and job, % completion should be available.
- Configurable settings for number of parallel execution.
- 
