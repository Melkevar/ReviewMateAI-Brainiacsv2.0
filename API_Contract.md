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

1.1 User Registration
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
```
Success Response (201 Created):

```json
{
  "message": "User registered successfully",
  "userId": "64afae6b9c45e"
}

```

Error Responses:

```json
{
  "error": "Invalid email or password"
}
```

## **2. Contract Management

2.1 Upload Contract

Feature: Upload a contract for review

HTTP Method: POST

Endpoint: /api/contracts/upload

Description: Uploads a contract file (PDF/DOCX) for AI review.

Request Body: multipart/form-data


file: <uploaded_file>

Success Response (201 Created):
```json

{
  "message": "Contract uploaded successfully",
  "contractId": "c12345"
}
```
Error Responses:

```json
{
  "error": "Invalid file format"
}

```
---

2.2 Get All Contracts

Feature: Retrieve all uploaded contracts for a user

HTTP Method: GET

Endpoint: /api/contracts

Description: Returns a list of contracts uploaded by the logged-in user.

Success Response (200 OK):

```json
[
  {
    "contractId": "c12345",
    "fileName": "employment_agreement.pdf",
    "uploadDate": "2025-08-12"
  }
]


```

## **3. Contract Review & Analysis

3.1 Get AI Review of a Contract

Feature: Retrieve AI review results for a specific contract

HTTP Method: GET

Endpoint: /api/contracts/{id}/review

Description: Returns AI-detected risks and compliance results.

Success Response (200 OK):

```json
{
  "contractId": "c12345",
  "riskScore": 85,
  "issues": [
    {
      "clause": "Termination",
      "risk": "Unclear notice period",
      "recommendation": "Specify notice period of at least 30 days."
    }
  ]
}

```
---

3.2 Delete Contract

Feature: Delete a contract by ID

HTTP Method: DELETE

Endpoint: /api/contracts/{id}

Description: Removes the contract and associated review results.

Success Response (200 OK):

```json
{
  "message": "Contract deleted successfully"
}
```

---

## **4. Error Format

All error responses follow this format:
```json
{
  "error": "Error message here"
}

```

