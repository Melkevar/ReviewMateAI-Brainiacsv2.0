# API Contract – Review Mate AI

This document defines the API endpoints for communication between the frontend and backend.  
All responses are returned in JSON format.


## Data Models

### User
| Field       | Type   | Description                  |
|-------------|--------|------------------------------|
| id          | string | Unique identifier for user   |
| name        | string | Full name of the user        |
| email       | string | Email address of the user    |
| password    | string | Hashed password              |
| createdAt   | date   | Timestamp of account creation |

---

### Contract
| Field        | Type   | Description                                     |
|--------------|--------|-------------------------------------------------|
| contractId   | string | Unique identifier for the contract              |
| userId       | string | ID of the user who uploaded the contract        |
| fileName     | string | Original filename of the uploaded contract      |
| filePath     | string | Storage path of the contract file               |
| uploadedAt   | date   | Timestamp when the file was uploaded            |
| status       | string | Status of the contract (`Pending`, `Analyzed`)  |

---

### AnalysisResult
| Field          | Type   | Description                                         |
|----------------|--------|-----------------------------------------------------|
| clause         | string | Text of the clause being analyzed                   |
| riskLevel      | string | Risk category (`Low`, `Medium`, `High`)              |
| recommendation | string | AI-generated suggestion or action item              |

---

## **1. Authentication & User Management**

### 1.1 User Registration
- Feature: Register a new user  
- Method: POST  
- Endpoint: `/api/auth/register`  
- Description: Creates a new account for a user.  
- Request Body:
```json
{
  "name": "John D'Silva",
  "email": "john@example.com",
  "password": "securepassword123"
}
