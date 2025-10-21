// SECURITY: Environment variable validator - fails fast on misconfiguration
export function validateEnvironment() {
  const ownerUid = import.meta.env.VITE_OWNER_UID;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Check if owner UID is set and not a placeholder
  if (!ownerUid || ownerUid === 'YOUR_OWNER_UID_HERE' || ownerUid === 'YOUR_FIREBASE_USER_UID_HERE' || ownerUid.length < 10) {
    throw new Error(
      'CRITICAL SECURITY ERROR: VITE_OWNER_UID is not configured properly.\n\n' +
      'Please set your Firebase User UID in environment variables.\n' +
      'Find it in Firebase Console -> Authentication -> Users.\n\n' +
      'Without this, admin authentication will not work correctly.'
    );
  }

  // Check backend URL format if provided
  if (backendUrl) {
    // In production, enforce HTTPS
    if (import.meta.env.PROD && !backendUrl.startsWith('https://')) {
      throw new Error(
        'CRITICAL SECURITY ERROR: VITE_BACKEND_URL must use HTTPS in production.\n' +
        `Current value: ${backendUrl}\n\n` +
        'HTTP connections are insecure and can expose authentication tokens.'
      );
    }

    // Validate URL format
    try {
      new URL(backendUrl.startsWith('http') ? backendUrl : `https://${backendUrl}`);
    } catch {
      throw new Error(
        'CRITICAL SECURITY ERROR: VITE_BACKEND_URL is not a valid URL.\n' +
        `Current value: ${backendUrl}`
      );
    }
  }

  console.log('✅ Environment variables validated successfully');
}
