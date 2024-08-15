## Library Management System

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

This project is a web-based Library Management System that allows users to manage a collection of books, borrow and return books, and view the status of borrowed and returned books. The application is built with Next.js for the frontend and backend, and MongoDB for the database.

## Table of Contents

Project Setup Instructions
API Endpoints
Frontend Design
Project Setup Instructions
Prerequisites
Before setting up the project, ensure that you have the following installed:

Node.js (v14 or later)
npm (v6 or later)
MongoDB (running locally or via a cloud service like MongoDB Atlas)


## Installation

### Clone the repository:

```bash
git clone https://github.com/your-username/library-management-system.git
cd library-management-system
```

### Install dependencies:
```bash
npm install
```
### Set up environment variables:

Create a .env.local file in the root directory of your project and add the following:

`env`
```bash
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
# Replace <username>, <password>, and myFirstDatabase with your MongoDB credentials and database name.
```
Start the development server:

```bash
npm run dev
# Your application should now be running on http://localhost:3000.
```

Deployment

To deploy the project, build the application and serve it:

Build the application:

```bash
npm run build
# Start the production server:
```
```bash
npm start
# Your application will be running on the specified port (default is http://localhost:3000).
```

## API Endpoints

- `GET /api/books`

Description: Fetches all available books in the library.

Response:

-200 OK: Returns an array of books.

-500 Internal Server Error: If there's an issue fetching the books.

- `POST /api/books`

Description: Adds a new book to the library.

Request Body:
```json
{
  "title": "Book Title",
  "author": "Author Name",
  "ISBN": "9781234567890"
}
```
Response:

-201 Created: Returns the newly created book.

-400 Bad Request: If any required fields are missing.

-500 Internal Server Error: If there's an issue adding the book.

- `PUT /api/books?id=<bookID>`

Description: Updates an existing book's details.

Request Body:
```json
{
  "title": "Updated Title",
  "author": "Updated Author",
  "ISBN": "9780987654321"
}
```

Response:

-200 OK: Returns the updated book.

-404 Not Found: If the book with the specified ID doesn't exist.

-400 Bad Request: If the ID is not provided.

-500 Internal Server Error: If there's an issue updating the book.

- `DELETE /api/books?id=<bookID>`

Description: Deletes a book from the library.

Response:

-200 OK: Confirms the book has been deleted.

-404 Not Found: If the book with the specified ID doesn't exist.

-500 Internal Server Error: If there's an issue deleting the book.

- `POST /api/transactions`

Description: Handles borrowing and returning books.

Request Body for Borrow:
```json
{
  "action": "borrow",
  "title": "Book Title",
  "ISBN": "9781234567890"
}
```

Request Body for Return:

```json
{
  "action": "return",
  "title": "Book Title",
  "ISBN": "9781234567890"
}
```
Response:

200 OK: Confirms the action (borrow or return) was successful.

400 Bad Request: If any required fields are missing or the action is invalid.

404 Not Found: If the book is not found or if there is no active borrow record when returning.

500 Internal Server Error: If there's an issue processing the transaction.

- `GET /api/transactions`

Description: Fetches all active borrow transactions.

Response:

`200 OK: Returns an array of active borrow transactions.

`500 Internal Server Error: If there's an issue fetching the transactions.

## Frontend Design

### Overview
- The frontend of the Library Management System is built using React components within the Next.js framework. It features a modern and responsive UI, designed to be intuitive and user-friendly.

### Design Highlights

- Header: The header features a bold title, centered on the screen, with a toggle button to switch between light and dark modes. The design is simple yet effective, with a gradient background and a professional font.

- Book Management: The book list is presented in a card layout, with each card displaying the book's title, author, ISBN, and available copies. Each card also includes "Edit" and "Delete" buttons for managing the book. The edit form is built directly into the card for easy access.

- Borrow and Return: Below the book cards, users can borrow or return books by entering the title and ISBN. The borrowed books and returned books are displayed dynamically, updating in real-time as actions are performed.

- Responsive Design: The layout is fully responsive, ensuring that it looks good on devices of all sizes. The use of flexbox and grid systems allows the content to adjust gracefully to different screen widths.

- Theme Toggle
The application includes a dark mode toggle, allowing users to switch between light and dark themes. The toggle is implemented using SVG icons from Heroicons and changes the entire application's color scheme.

