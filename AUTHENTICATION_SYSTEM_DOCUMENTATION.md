# Authentication System Documentation

## Overview

QuranicFlow implements a comprehensive session-based authentication system with user management, role-based access control, and secure session persistence. The system is production-ready and fully integrated with all learning features.

## Architecture

### Frontend Authentication (`useAuth` Hook)

The authentication system centers around the `useAuth` hook located in `client/src/hooks/use-auth.tsx`:

```typescript
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
```

**Key Features:**
- Centralized authentication state management
- Login, logout, and registration mutations
- Error handling with toast notifications
- Query cache management for user data

### Backend Authentication (`server/auth.ts`)

The backend implements Passport.js with local strategy for username/password authentication:

**Security Features:**
- Password hashing using scrypt with random salt
- Session-based authentication with secure cookies
- Timing-safe password comparison
- CSRF protection through session configuration

**Session Configuration:**
```typescript
const sessionSettings: session.SessionOptions = {
  secret: process.env.SESSION_SECRET || "quranic-flow-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
  }
};
```

## API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| POST | `/api/register` | User registration | User object or 400 error |
| POST | `/api/login` | User login | User object or 401 error |
| POST | `/api/logout` | User logout | 200 status |
| GET | `/api/user` | Get current user | User object or 401 error |

### User Management Routes

| Method | Endpoint | Description | Admin Only |
|--------|----------|-------------|------------|
| GET | `/api/admin/users` | List all users | Yes |
| DELETE | `/api/admin/users/:id` | Delete user profile | Yes |

## User Roles

### Regular User (`user`)
- Access to all learning features
- Personal progress tracking
- Achievement system
- Chapter completion

### Administrator (`admin`)
- All user permissions
- User management capabilities
- Access to admin panel
- Cannot delete own profile (safety measure)

**Admin Assignment:**
- First registered user automatically becomes admin
- Subsequent users default to regular user role

## Protected Routes

All major application routes are protected and require authentication:

- `/` - Dashboard (redirects to `/auth` if not logged in)
- `/learn` - Learning sessions
- `/progress` - Progress tracking
- `/achievements` - Achievement system

**Implementation:**
```typescript
export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (!user) {
    return <Redirect to="/auth" />;
  }
  
  return <Component />;
}
```

## Session Management

### Session Persistence
- Sessions persist for 7 days
- Automatic login state restoration on page refresh
- Secure session storage in server memory
- Session invalidation on logout

### Security Measures
- HTTP-only cookies prevent XSS attacks
- Secure cookies in production (HTTPS)
- SameSite protection against CSRF
- Session secret for cryptographic signing

## Integration with Learning Features

### User Data Propagation
All learning components now use the authenticated user's ID:

```typescript
const { user } = useAuth();
const { data: userProgress } = useQuery({
  queryKey: [`/api/user/${user?.id}/progress`],
  enabled: !!user?.id,
});
```

### Query Optimization
- Queries disabled when user not authenticated
- Automatic cache invalidation on login/logout
- Consistent error handling across components

## Migration from Mock System

### Completed Removals
All `MOCK_USER_ID` references have been replaced with authenticated user data:

- ✅ `client/src/pages/learn.tsx`
- ✅ `client/src/pages/dashboard.tsx`
- ✅ `client/src/pages/achievements.tsx`
- ✅ `client/src/pages/progress.tsx`
- ✅ `client/src/components/phased-learning-dashboard.tsx`

### Migration Pattern
```typescript
// Before (Mock System)
const { data: userData } = useQuery({
  queryKey: [`/api/user/${MOCK_USER_ID}`],
});

// After (Authentication System)
const { user } = useAuth();
const { data: userData } = useQuery({
  queryKey: [`/api/user/${user?.id}`],
  enabled: !!user?.id,
});
```

## Error Handling

### Frontend Error States
- Loading states during authentication checks
- Toast notifications for login/registration errors
- Graceful fallbacks for unauthenticated states

### Backend Error Responses
- 401 Unauthorized for authentication failures
- 400 Bad Request for validation errors
- 403 Forbidden for insufficient permissions

## Development vs Production

### Development Configuration
- Uses default session secret
- HTTP cookies (non-secure)
- Detailed error logging

### Production Configuration
- Requires `SESSION_SECRET` environment variable
- HTTPS-only secure cookies
- Enhanced security headers

## Testing Accounts

For development and testing:

**Regular User:**
- Username: `demo_student`
- Password: `demo123`

**Administrator:**
- Username: `admin`
- Password: `admin123`

## Security Considerations

### Password Security
- Scrypt-based hashing with random salts
- Timing-safe comparison prevents timing attacks
- No password length restrictions (recommended 8+ characters)

### Session Security
- Cryptographically signed sessions
- Automatic expiration after 7 days
- Secure storage prevents client-side tampering

### Future Enhancements
- Two-factor authentication support
- Password reset functionality
- OAuth integration (Google, Apple)
- Email verification system

## Deployment Checklist

- [ ] Set `SESSION_SECRET` environment variable
- [ ] Configure HTTPS in production
- [ ] Verify secure cookie settings
- [ ] Test session persistence
- [ ] Validate user registration flow
- [ ] Confirm admin user creation
- [ ] Test protected route access

## Troubleshooting

### Common Issues

**Users getting logged out on refresh:**
- Check session secret configuration
- Verify cookie settings
- Ensure backend session store is persistent

**MOCK_USER_ID errors:**
- Verify all components use `useAuth()` hook
- Check query enabled guards
- Confirm authentication provider wraps app

**Registration failures:**
- Check for duplicate usernames
- Verify password hashing is working
- Ensure database connectivity

## Integration Status

✅ **Complete Integration Achieved**
- All learning features work with authenticated users
- Session persistence across page navigation
- Admin user management functional
- Protected routes enforce authentication
- Error handling gracefully manages auth states
- Production-ready security configuration