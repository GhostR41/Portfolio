# Security Documentation

## Security Model

This portfolio application uses a **Firestore Rules-First** security model. All authorization is enforced server-side through Firebase Firestore security rules.

### Key Principles

1. **Single Source of Truth**: Firestore rules are the ONLY security enforcement mechanism
2. **Client-Side UI Only**: Authentication state in React is for UI/UX purposes only
3. **Public Read Access**: Portfolio content is publicly readable for visitors
4. **Owner-Only Write Access**: Only the authenticated owner can modify content

---

## Authentication Layers

### Layer 1: Firebase Authentication (Identity)
- Google OAuth provides user identity
- Verifies user owns the Google account
- Issues ID tokens for authenticated requests

### Layer 2: Firestore Rules (Authorization)
- Checks user UID against hardcoded owner UID
- Enforces read (public) and write (owner-only) permissions
- **This is the ONLY security enforcement layer**

### Layer 3: Client UI (User Experience)
- Shows/hides edit controls based on auth state
- Provides viewer mode for non-authenticated users
- **Has NO security value** - only improves UX

---

## Viewer Mode

**IMPORTANT**: Viewer mode is a UX feature, NOT a security feature.

- Stored in `localStorage` as `viewer_session` flag
- Can be manipulated via browser console
- Does NOT grant any permissions
- Firestore rules prevent unauthorized writes regardless of client state

---

## Input Validation

All user-editable content is validated using Zod schemas before syncing to Firestore.

### Validation Rules

| Content Type | Max Length | Restrictions |
|-------------|------------|--------------|
| Text Content | 5000 chars | No `<script>` tags |
| Short Text | 500 chars | No `<script>` tags |
| URLs | N/A | Only HTTP/HTTPS protocols |
| Email | 255 chars | Valid email format |
| Chart Numbers | N/A | 0-10000 range, integers only |

### Protected Against
- ✅ XSS attacks (script tag injection)
- ✅ Data corruption (invalid formats)
- ✅ Excessive data (length limits)
- ✅ Protocol injection (`javascript:` URLs)

---

## Environment Variables

### Required Variables

```bash
# CRITICAL: Your Firebase User UID (find in Firebase Console -> Authentication -> Users)
VITE_OWNER_UID=your_actual_firebase_uid_here

# OPTIONAL: Backend URL (must use HTTPS in production)
VITE_BACKEND_URL=https://your-backend.vercel.app

# OPTIONAL: Viewer mode flag (UX only)
VITE_VIEWER_IS_AUTHENTICATED=false
```

### Security Validations

1. **Owner UID Check**
   - Must be set and not contain placeholder values
   - Minimum 10 characters
   - Fails fast on startup if misconfigured

2. **Backend URL Check**
   - Must use HTTPS in production
   - Must be valid URL format
   - Can be omitted if not using backend

---

## Firestore Rules

### Current Implementation

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /portfolio/content {
      // Public read access
      allow read: if true;
      
      // Owner-only write access
      allow write: if request.auth != null && 
                      request.auth.uid == 'YOUR_ACTUAL_UID_HERE';
    }
    
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Setup Instructions

1. Get your Firebase User UID:
   - Go to Firebase Console
   - Navigate to Authentication → Users
   - Copy your UID (long alphanumeric string)

2. Update `firestore.rules`:
   - Replace `'YOUR_ACTUAL_UID_HERE'` with your UID
   - Deploy: `firebase deploy --only firestore:rules`

3. Test:
   - Try to edit content as owner → ✅ Should work
   - Try to edit content as different user → ❌ Should fail
   - Try to edit content as viewer → ❌ Should fail

---

## Logging and Monitoring

### Development Mode
- All errors logged to console
- Sensitive data redacted (emails, tokens, SSN patterns)
- Validation errors shown to user via toast

### Production Mode
- Only critical errors logged
- No sensitive data in logs
- User-friendly error messages only

---

## Security Testing Checklist

### Before Deployment

- [ ] Update `firestore.rules` with your actual UID
- [ ] Deploy Firestore rules
- [ ] Set `VITE_OWNER_UID` environment variable
- [ ] Set `VITE_BACKEND_URL` with HTTPS (if using backend)
- [ ] Update contact info in `TerminalChat.tsx`
- [ ] Clear browser storage (localStorage, sessionStorage)

### After Deployment

- [ ] Test admin login with Google
- [ ] Verify admin can edit and save content
- [ ] Test viewer mode access
- [ ] Verify viewer **cannot** edit content
- [ ] Try to inject `<script>alert('XSS')</script>` → Should be rejected
- [ ] Try to enter 10000-character text → Should be rejected
- [ ] Try to enter invalid URL → Should be rejected
- [ ] Try to log in with different Google account → Should fail to save
- [ ] Check browser console for errors → Should be clean
- [ ] Monitor Firestore usage for excessive writes

---

## Threat Model

### Protected Against

1. **Unauthorized Content Modification**
   - Firestore rules enforce owner-only writes
   - All write attempts validated server-side

2. **XSS Attacks**
   - Input validation rejects script tags
   - Content sanitized before storage

3. **Data Corruption**
   - Type validation on all inputs
   - Length limits on all text fields
   - Range limits on numeric values

4. **Man-in-the-Middle Attacks**
   - HTTPS enforced in production
   - Firebase uses secure WebSocket connections

5. **Information Disclosure**
   - Sensitive data redacted from logs
   - No PII in Firestore rules
   - Error messages don't leak system info

### NOT Protected Against

1. **DDoS Attacks**
   - No rate limiting implemented
   - Consider Firebase App Check for production

2. **Brute Force Attacks**
   - Firebase has built-in rate limiting
   - Consider App Check for enhanced protection

3. **Social Engineering**
   - User must protect their Google account
   - Enable 2FA on owner's Google account

---

## Incident Response

### If Unauthorized Access Detected

1. **Immediate Actions**
   - Change Google account password
   - Revoke all active sessions in Google account
   - Deploy updated Firestore rules with new UID if needed

2. **Investigation**
   - Check Firestore audit logs in Firebase Console
   - Review recent content changes
   - Verify environment variables are correct

3. **Recovery**
   - Restore content from localStorage backup if needed
   - Update security documentation
   - Consider implementing user roles table for audit trail

---

## Future Enhancements

### Optional Improvements

1. **User Roles Table**
   - Scalable for multiple admins
   - Better audit trail
   - See commented section in `firestore.rules`

2. **Content Security Policy**
   - Additional XSS protection layer
   - Requires configuration in hosting platform

3. **Firebase App Check**
   - Bot protection
   - Abuse prevention
   - Requires App Check SDK setup

4. **Rate Limiting**
   - Debounced Firestore writes
   - Client-side throttling
   - Consider Firebase Extensions

---

## Questions?

**Where do I find my UID?**
- Firebase Console → Authentication → Users tab

**Do I need the backend?**
- No, it's optional. Remove if not using.

**Can I have multiple admins?**
- Yes, use user_roles table pattern (see `firestore.rules` comments)

**Why UID instead of email?**
- UIDs are immutable, secure, and don't expose PII
- Emails can change and are visible in rules

**Is viewer mode secure?**
- No, it's UX-only. Security is enforced by Firestore rules only.

**What if I forget my UID?**
- Find it in Firebase Console → Authentication → Users
- It's also in your ID token (decode at jwt.io)

---

## Support

For security issues or questions:
1. Review this documentation
2. Check `SECURITY_FIXES.md` for recent changes
3. Review Firestore rules in Firebase Console
4. Test with the security checklist above
