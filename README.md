

# Comment System

A comment system built with Express and GraphQL, designed for easy integration into web applications. This application allows users to create, retrieve, flag, like, and unlike comments with a structured comment hierarchy.

## Features

- **Create Comments**: Users can create new comments with optional parent comments for nesting.
- **Get Comments**: Retrieve comments by parent ID with pagination support.
- **Flag Comments**: Flag inappropriate comments which can hide them after multiple flags.
- **Like/Unlike Comments**: Users can like or unlike comments to show their support.

## Technologies Used

- **Node.js**: JavaScript runtime for building the backend.
- **Express**: Web framework for building APIs.
- **GraphQL**: For flexible querying of comment data.
- **MongoDB**: NoSQL database for storing comments.
- **TypeScript**: For type-safe development.
- **Mongoose**: ODM for MongoDB.
- **ESLint**: For maintaining code quality.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or a cloud instance)

### Installation
npm i comment-system