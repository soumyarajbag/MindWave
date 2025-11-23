# Firebase Setup Guide

## Fixing "CONFIGURATION_NOT_FOUND" Error

This error occurs when Firebase Authentication is not enabled in your Firebase Console. Here's how to fix it:

## Option 1: Enable Firebase Authentication (Recommended for full features)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **mindwave-smallcase**
3. Click on **Authentication** in the left sidebar
4. Click **Get Started**
5. Enable at least one sign-in method (e.g., **Email/Password** or **Anonymous**)
6. Save the changes

After enabling, the error should disappear.

## Option 2: Use Privacy Mode (No Authentication Required)

The app now works without Firebase Authentication! You can:

1. Enable **Privacy Mode** in the app (toggle in the UI)
2. All data will be stored locally in your browser
3. No Firebase Authentication needed

## Current Status

Your Firebase configuration looks correct:

- ✅ API Key: Set
- ✅ Project ID: mindwave-smallcase
- ✅ Auth Domain: mindwave-smallcase.firebaseapp.com
- ✅ Storage Bucket: mindwave-smallcase.firebasestorage.app
- ✅ App ID: Set

**What's missing:**

- ❌ Firebase Authentication service not enabled

## Quick Fix

The code has been updated to handle missing Authentication gracefully. The app will:

- ✅ Still work without Authentication
- ✅ Use local storage when auth is unavailable
- ✅ Show a warning in console (but continue working)

## Enable Firestore (Required for cloud sync)

Even if you skip Authentication, you should enable Firestore for data storage:

1. Go to Firebase Console → **Firestore Database**
2. Click **Create Database**
3. Choose **Start in test mode** (for development)
4. Select a location
5. Click **Enable**

## Security Rules (After Enabling Firestore)

Update your Firestore rules to allow unauthenticated access (for development only):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all documents (DEVELOPMENT ONLY)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **Warning**: These rules allow anyone to read/write. For production, use proper authentication and rules.

## Production Security Rules

For production with authentication:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      match /moods/{moodId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }

      match /insights/{insightId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

## Testing

After setup:

1. Restart your dev server: `npm run dev`
2. The error should be gone
3. Check browser console - you might see a warning but the app should work
4. Try using Privacy Mode if you want to avoid Firebase entirely

## Need Help?

- Check Firebase Console for any service status
- Verify your project is active (not deleted/suspended)
- Check browser console for specific error messages
- The app will work in Privacy Mode even if Firebase is completely unavailable
