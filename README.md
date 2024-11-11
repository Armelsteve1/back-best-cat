# Best Cat Backend

This project serves as the backend for the **Best Cat** application. It handles data for each cat, including managing votes and retrieving top-voted cats. The backend is built with Express.js and uses Firestore as the database.

## 🚀 Features

- Load cat information from an external source and store it in the database.
- Manage votes for each cat, allowing scores to be incremented.
- Retrieve a list of cats with their scores and sort them based on votes.

## 🛠️ Technologies Used

- **Node.js** and **Express.js** - Backend server.
- **Firebase Firestore** - Database for storing cat information.
- **TypeScript** - Static typing for improved maintainability.
- **Vercel** - Hosting for the API.

## 📂 Project Structure

```
back-best-cat/
├── src/
│   ├── config/                # Firebase configuration
│   ├── controllers/           # API route controllers
│   ├── models/                # Data models
│   └── routes/                # API route definitions
├── package.json               # Project dependencies
└── tsconfig.json              # TypeScript configuration
```

## 📦 Installation

1. **Clone the project**:

   ```bash
   git clone https://github.com/Armelsteve1/back-best-cat.git
   cd back-best-cat
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**: Create a `.env` file in the root directory and add the required Firebase variables:
   ```env
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_PRIVATE_KEY=your_private_key
   FIREBASE_CLIENT_EMAIL=your_client_email
   ```

## 🖥️ Run the Server in Development

- **Development Mode**:

  ```bash
  npm run dev
  ```

- **Build and Start**:
  ```bash
  npm run build
  npm start
  ```

The API will be accessible at `http://localhost:3000`.

## 🔗 API Endpoints

- `GET /api/cats` - Retrieve a list of all cats.
- `GET /api/voted-cats` - Retrieve only the cats that have received votes.
- `POST /api/cats/:id/vote` - Vote for a specific cat.
- `GET /api/cats/:id/votes` - Retrieve the vote count for a specific cat.

## 🚀 Deployment on Vercel

To deploy on Vercel, connect the GitHub repository and ensure that the Firebase environment variables are correctly set in your Vercel project settings.

## 📝 License

This project is licensed under the MIT License - see the [MIT](https://github.com/Armelsteve1/back-best-cat/blob/main/LICENSE) - file for details.
