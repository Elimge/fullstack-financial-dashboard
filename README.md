# ExpertSoft - Financial Transaction Management System

A full-stack web application designed for ExpertSoft to manage financial information from Fintech platforms like Nequi and Daviplata. This project digitizes and structures disorganized data from Excel files into a robust, database-driven application with a dynamic web interface for managing invoices.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)

## Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Database Schema (ERD)](#database-schema-erd)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [File Structure](#file-structure)
- [API Endpoints](#api-endpoints)
- [Author](#author)

## Project Description

The primary goal of this project is to provide ExpertSoft with a system to normalize, store, and manage financial data. The application features a RESTful API backend to handle clients, invoices, and transactions, and an interactive frontend dashboard for managing invoices.

The project covers the entire development lifecycle, from data analysis and database normalization (1NF, 2NF, 3NF) to API development and frontend implementation.

## Features

### Backend (API)
-   Full CRUD (Create, Read, Update, Delete) functionality for **Invoices**.
-   RESTful architecture with clear, versioned endpoints.
-   Automated database seeder to perform a bulk load of data from CSV files.
-   **Advanced Query Endpoints:**
    -   Get the total amount paid by each client.
    -   List all pending invoices (where billed amount > paid amount) with client details.
    -   List all transactions filtered by a specific platform (e.g., Nequi, Daviplata).

### Frontend (UI Dashboard)
-   Dynamic and responsive single-page application for managing invoices.
-   **Create Invoices:** Form to add new invoices.
-   **Read Invoices:** Real-time table displaying all invoices from the database.
-   **Update Invoices:** Interactive "Edit" modal to update invoice details without a page reload.
-   **Delete Invoices:** Delete button on each row with a confirmation dialog.

## Database Schema (ERD)

The database was designed following normalization principles to ensure data integrity and eliminate redundancy.

![Entity-Relationship Diagram](/docs/uml-diagram.png)  

## Tech Stack

-   **Backend:** Node.js, Express.js, MySQL
-   **Frontend:** HTML5, JavaScript (ES6 Modules), Bootstrap 5
-   **Database:** MySQL
-   **Development:** Git, GitHub, npm, Postman, VS Code

## File Structure

The project is organized into two main directories: `backend` and `frontend`, clearly separating the server-side logic from the client-side application.

```bash
    public-library/
├── .gitignore # Specifies intentionally untracked files to ignore.
├── README.md # This documentation file.
│
├── docs/
│ ├── data.xlsx # The initial data on excel file type
│ ├── ExpertSoft API - Test.postman_collection.json # Postman Test Collection for the API 
│ └── uml-diagram.png # UML diagram illustrating the system architecture.
├── backend/
│ ├── .env # Stores environment variables (database credentials).
│ ├── package.json # Defines the Node.js project and its dependencies.
│ ├── package-lock.json # Records the exact versions of dependencies.
│ ├── node_modules/ # Contains all installed npm packages.
│ │
│ ├── src/ # Main source code for the API.
│ │ ├── config/
│ │ │ ├── database.js # Configures and exports the MySQL connection pool.
│ │ │ └── schema.sql # The SQL script to create the database and tables.
│ │ │
│ │ ├── controllers/ # Handles the logic for incoming requests and outgoing responses.
│ │ │ ├── client.controller.js
│ │ │ ├── invoice.controller.js
│ │ │ └── transaction.controller.js
│ │ │
│ │ ├── routes/ # Defines the API endpoints and maps them to controllers.
│ │ │ ├── client.routes.js
│ │ │ ├── invoice.routes.js
│ │ │ └── transaction.routes.js
│ │ │
│ │ ├── services/ # Contains the core business logic and database interactions.
│ │ │ ├── client.service.js
│ │ │ ├── invoice.service.js
│ │ │ └── transaction.service.js
│ │ │
│ │ └── server.js # The entry point of the backend application; creates and starts the Express server.
│ │
│ └── seeders/ # Scripts to populate the database with initial data.
│ ├── data/ # The source CSV files for seeding.
│ │ ├── clients.csv
│ │ ├── invoices.csv
│ │ ├── platforms.csv
│ │ └── transactions.csv
│ ├── load-clients.js # Script to load client data.
│ ├── load-invoices.js # Script to load invoice data.
│ ├── load-platforms.js # Script to load platform data.
│ ├── load-transactions.js # Script to load transaction data.
│ └── run-seeders.js # The main script that executes all seeders in order.
│
├── frontend/ # Contains the entire user interface (the client application).
│ └── js/ 
│ │ └── services/ 
│ │ │ └── api.js # Centralizes all 'fetch' requests to the backend.
│ │ └── ui/ 
│ │ │ └── ui.js # Module dedicated to handling all DOM manipulation.
│ └── app.js # The main entry point; orchestrates events, API calls, and UI updates.
└── index.html # The single HTML page for the entire application.

```

## Getting Started

### Prerequisites
-   Node.js (v18 or higher)
-   MySQL Server

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Elimge/fullstack-financial-dashboard.git
    cd fullstack-financial-dashboard
    ```

2.  **Setup the Backend:**
    ```bash
    cd backend
    npm install
    ```

3.  **Create the Environment File:**
    -   Create a `.env` file in the `backend` directory.
    -   Add your MySQL credentials:
        ```env
        DB_HOST=localhost
        DB_USER=root
        DB_PASSWORD=your_mysql_password
        DB_DATABASE=pd_miguel_canedo_manglar
        ```

4.  **Create and Populate the Database:**
    -   Log in to your MySQL console: `mysql -u root -p`
    -   Run the schema script (make sure you are in the `backend` folder):
        ```sql
        source src/config/schema.sql;
        ```
    -   Exit MySQL and run the seeder script:
        ```bash
        node seeders/run-seeders.js
        ```

5.  **Run the Backend Server:**
    ```bash
    npm run dev
    ```
    The API will be running at `http://localhost:3000`.

6.  **Run the Frontend:**
    -   Use the **Live Server** extension in VS Code.
    -   Right-click on `frontend/index.html` and select "Open with Live Server".

## API Endpoints

The API is versioned under `/api/v1/`.

| Method   | Endpoint                          | Description                               |
| :------- | :-------------------------------- | :---------------------------------------- |
| `GET`    | `/invoices`                       | Get a list of all invoices.               |
| `POST`   | `/invoices`                       | Create a new invoice.                     |
| `GET`    | `/invoices/:id`                   | Get a single invoice by its ID.           |
| `PUT`    | `/invoices/:id`                   | Update an existing invoice by its ID.     |
| `DELETE` | `/invoices/:id`                   | Delete an invoice by its ID.              |
| `GET`    | `/invoices/pending`               | **Advanced:** Get all pending invoices.   |
| `GET`    | `/clients/total-paid`             | **Advanced:** Get total paid by clients.  |
| `GET`    | `/transactions/platform/:name`    | **Advanced:** Get transactions by platform|

## Author

-   **Miguel Canedo**
-   **Clan:** Manglar
-   **Email:** elimge@outlook.com