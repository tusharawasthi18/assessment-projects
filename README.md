# Assessment Projects
This is the base repository for assessment projects, candidates can create a fork and submit their solutions via a pull-request. 
Candidate can choose a project from the list below.

## DO's
- Document your code
- Follow best practices

## Dont's 
- 

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

**Reference Links (Read Before Starting):**
1. [What is a Password Manager? - TechTarget](https://www.techtarget.com/searchsecurity/definition/password-manager)
2. [What is a Password Manager? - McAfee](https://www.mcafee.com/learn/what-is-a-password-manager/)
3. [How Do Password Managers Work? - Rippling](https://www.rippling.com/blog/how-do-password-managers-work)

**Core Features to Implement:**
- **Master Password Protection**: Secure the entire password vault with a master password
- **Password Storage**: Store website URLs, usernames, and encrypted passwords
- **Strong Password Generation**: Generate cryptographically secure passwords with customizable length and character sets
- **Password Rotation**: Allow users to update/rotate existing passwords
- **Search & Retrieve**: Find and display stored credentials
- **Terminal Interface**: Command-line based interface for all operations
- **Encryption**: All stored passwords must be encrypted (AES-256 recommended)
- **Import/Export**: Basic functionality to backup and restore password data

**Technical Requirements:**
- Language: Any (Python, Node.js, Go, Rust, etc.)
- Storage: File-based (JSON, SQLite, or encrypted files)
- CLI Interface: Interactive command-line menu system
- Security: Implement proper encryption and secure password handling

---
## CRUD API
**Description**
Using any of below databases build an API to perform CURD operation. 
- API's should support multiple formats of output & input
- At least one endpoint should support streaming.
- One endpoint should combine results for 3 different services/ data sets and implemennts async/parallel processing.
- [netflixdb](https://github.com/lerocha/netflixdb)
- [sakila-sqlite3](https://github.com/bradleygrant/sakila-sqlite3)
