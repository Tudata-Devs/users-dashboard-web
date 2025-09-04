# 🔐 Dynamic Admin System

This document explains how the dynamic admin system works and how to manage admin emails through Firestore.

## 📋 Overview

The authentication system now dynamically fetches admin emails from a Firestore collection called `system_variables`. This allows you to manage admin access without redeploying the application.

## 🏗️ Firestore Structure

### Collection: `system_variables`

- **Document ID**: `access`
- **Field**: `admin` (array of email strings)
- **Additional Fields**: `createdAt`, `updatedAt` (timestamps)

### Example Document Structure:

```json
{
  "admin": [
    "admin1@example.com",
    "admin2@example.com",
    "fitosegrera@gmail.com"
  ],
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

## 🚀 Setup Instructions

### 1. Initial Setup

Run the setup script to create the initial admin emails configuration:

```bash
bun run setup-admin-emails
```

This will create the `system_variables/access` document with your current admin email.

### 2. Manual Setup (Alternative)

You can also create the document manually in the Firestore Console:

1. Go to your Firebase Console
2. Navigate to Firestore Database
3. Create a new collection called `system_variables`
4. Create a document with ID `access`
5. Add a field called `admin` with type `array`
6. Add your admin email addresses as string elements

## 🔧 How It Works

### Authentication Flow

1. User attempts to login with email/password
2. System fetches admin emails from `system_variables/access` document
3. Validates if the email exists in the admin array
4. If valid, grants admin access; if not, denies access

### Caching System

- Admin emails are cached for 5 minutes to reduce Firestore reads
- Cache is automatically refreshed when expired
- You can manually clear cache using `authService.clearAdminEmailsCache()`

## 📚 API Methods

### AuthService Methods

#### `isEmailAllowed(email: string): Promise<boolean>`

Checks if an email is in the admin list.

#### `getUserRole(email: string): Promise<"admin" | "user" | null>`

Returns the role of a user based on their email.

#### `refreshAdminEmails(): Promise<string[]>`

Forces a refresh of admin emails from Firestore.

#### `clearAdminEmailsCache(): void`

Clears the admin emails cache.

### FirestoreService Methods

#### `getAdminEmails(): Promise<string[]>`

Fetches admin emails from Firestore.

#### `updateAdminEmails(emails: string[]): Promise<void>`

Updates the admin emails array in Firestore.

#### `addAdminEmail(email: string): Promise<void>`

Adds a new admin email to the list.

#### `removeAdminEmail(email: string): Promise<void>`

Removes an admin email from the list.

## 🛠️ Managing Admin Emails

### Adding New Admin Emails

#### Method 1: Firestore Console

1. Go to Firebase Console → Firestore Database
2. Navigate to `system_variables/access`
3. Edit the `admin` array field
4. Add new email addresses

#### Method 2: Programmatically

```typescript
import { firestoreService } from "@/lib/firestore";

// Add a single admin email
await firestoreService.addAdminEmail("newadmin@example.com");

// Or update the entire list
const adminEmails = [
  "admin1@example.com",
  "admin2@example.com",
  "admin3@example.com",
];
await firestoreService.updateAdminEmails(adminEmails);
```

### Removing Admin Emails

#### Method 1: Firestore Console

1. Go to Firebase Console → Firestore Database
2. Navigate to `system_variables/access`
3. Edit the `admin` array field
4. Remove unwanted email addresses

#### Method 2: Programmatically

```typescript
import { firestoreService } from "@/lib/firestore";

// Remove a specific admin email
await firestoreService.removeAdminEmail("oldadmin@example.com");
```

## 🔄 Cache Management

### Automatic Cache Refresh

- Cache expires after 5 minutes
- System automatically fetches fresh data when cache expires
- No manual intervention required

### Manual Cache Management

```typescript
import { authService } from "@/lib/auth";

// Clear cache manually
authService.clearAdminEmailsCache();

// Force refresh from Firestore
const freshEmails = await authService.refreshAdminEmails();
```

## 🚨 Error Handling

### Common Scenarios

#### 1. Firestore Document Not Found

- System logs a warning
- Returns empty admin list
- Authentication will be denied for all users

#### 2. Network Errors

- System uses cached data if available
- Falls back to empty list if no cache
- Logs error for debugging

#### 3. Invalid Email Format

- System validates email format before adding
- Throws error for invalid emails
- Existing valid emails remain unaffected

## 🔒 Security Considerations

### Access Control

- Only users with admin emails can access the dashboard
- Email validation is performed on every login attempt
- No hardcoded admin emails in the codebase

### Firestore Security Rules

Make sure your Firestore security rules allow read access to the `system_variables` collection:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to system_variables for authenticated users
    match /system_variables/{document} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        request.auth.token.email in resource.data.admin;
    }

    // Your other rules...
  }
}
```

## 🧪 Testing

### Test Admin Email Setup

```bash
# Run the setup script
bun run setup-admin-emails

# Test with a specific email
bun run scripts/test-admin-login.ts admin@example.com
```

### Verify Admin Access

1. Add your email to the admin list
2. Try logging in with that email
3. Verify you can access the dashboard
4. Try with a non-admin email to ensure access is denied

## 📝 Troubleshooting

### Issue: "Access denied" for valid admin email

**Solution**:

1. Check if email exists in `system_variables/access` document
2. Verify email spelling and case sensitivity
3. Clear cache: `authService.clearAdminEmailsCache()`
4. Check Firestore security rules

### Issue: Admin emails not updating

**Solution**:

1. Verify Firestore document structure
2. Check network connectivity
3. Force refresh: `await authService.refreshAdminEmails()`
4. Check browser console for errors

### Issue: Cache not refreshing

**Solution**:

1. Wait 5 minutes for automatic refresh
2. Manually clear cache
3. Restart the application
4. Check system clock synchronization

## 🎯 Best Practices

1. **Regular Backups**: Export your admin emails list regularly
2. **Email Validation**: Always validate email format before adding
3. **Access Logging**: Monitor admin access in your application logs
4. **Security Rules**: Implement proper Firestore security rules
5. **Error Monitoring**: Set up alerts for authentication failures
6. **Documentation**: Keep track of admin email changes

## 🔄 Migration from Static System

If you're migrating from the old static `ALLOWED_USERS` array:

1. Run `bun run setup-admin-emails` to create the Firestore document
2. Add all your existing admin emails to the `admin` array
3. The system will automatically start using the dynamic system
4. Remove the old static array from `auth.ts` (already done)

## 📞 Support

If you encounter any issues with the admin system:

1. Check the browser console for error messages
2. Verify Firestore document structure
3. Test with the setup script
4. Review this documentation
5. Check Firebase Console for any service issues
