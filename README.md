# Chit Chat App

A real-time chat application built with React + Vite, and Firebase. This app supports user authentication, chat messaging, and image storage. The Firebase backend manages user authentication, real-time database operations, and image storage.

## Features

- **User Authentication**: Sign-up, login, and logout using Firebase Authentication.
- **Real-Time Chat**: Users can send and receive messages instantly.
- **User Profiles**: Upload and display user avatars.
- **Secure Storage**: Store and retrieve images via Firebase Storage.
- **Database Management**: Firebase Firestore for storing user information, chats, and messages.

## Project Structure

The architecture follows a clean, modular structure. Here’s a high-level overview:





## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/agrawalanshika7/Chit-Chat.git
   cd chit-chat-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Firebase Setup**:
   - Create a Firebase project and enable Firebase Authentication, Firestore Database, and Firebase Storage.
   - Add your Firebase config to a `.env` file:
     ```env
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```

4. **Run the app**:
   ```bash
   npm run dev
   ```

## Usage

1. Register or log in to start using the app.
2. Add contacts and start chatting.
3. Upload profile pictures and share images within chats.

## Technologies Used

- **Frontend**: React, Vite
- **Backend**: Firebase (Authentication, Firestore, Storage)
