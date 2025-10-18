# Deployment Guide

## Prerequisites
1. Firebase project configured with Google OAuth
2. Vercel account
3. Your allowed Gmail address

## Step 1: Deploy Backend to Vercel

1. Navigate to backend folder:
```bash
cd backend
npm install
```

2. Deploy to Vercel:
```bash
npm i -g vercel
vercel
```

3. Add environment variables in Vercel Dashboard:
   - `ALLOWED_EMAIL`: your-email@gmail.com
   - `GOOGLE_CLIENT_ID`: your-google-client-id.apps.googleusercontent.com
   - `FRONTEND_URL`: (will update after frontend deployment)

4. Copy your backend URL (e.g., `https://your-backend.vercel.app`)

## Step 2: Deploy Frontend

1. Create `.env` file in root with your backend URL:
```env
VITE_BACKEND_URL=https://your-backend.vercel.app
```

2. Deploy frontend via works's "Publish" button

3. Copy your frontend URL (e.g., `https://your-app.vercel.app`)

## Step 3: Update Backend Environment

1. Go to Vercel backend project settings
2. Update `FRONTEND_URL` to your deployed frontend URL
3. Redeploy backend

## Step 4: Update Firebase Configuration

1. In Firebase Console, go to Authentication > Settings > Authorized domains
2. Add both:
   - Your backend domain
   - Your frontend domain

3. In Google Cloud Console OAuth settings, update:
   - Authorized JavaScript origins: Add your frontend URL
   - Authorized redirect URIs: Add `https://YOUR_PROJECT_ID.firebaseapp.com/__/auth/handler`

## Step 5: Test

1. Visit your deployed frontend
2. Try Google sign-in as admin
3. Try viewer access
4. Verify all editable components sync properly

## Security Checklist
- ✅ Backend environment variables set
- ✅ Frontend environment variable set
- ✅ Firebase authorized domains updated
- ✅ Google OAuth settings updated
- ✅ Only your email in ALLOWED_EMAIL
- ✅ CORS configured with actual frontend URL

## Troubleshooting

**Backend not responding:**
- Check Vercel logs
- Verify environment variables are set
- Test health endpoint: `https://your-backend.vercel.app/health`

**OAuth errors:**
- Verify authorized domains in Firebase
- Check Google Cloud Console OAuth settings
- Ensure redirect URIs match exactly

**Sync not working:**
- Check Firestore rules are properly configured
- Verify Firebase config in frontend is correct
