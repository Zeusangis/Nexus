# Profile Edit Server Function Implementation

## Overview

Created a complete server-side solution for updating user profiles, including basic information, athlete profile data, and password changes.

## Files Created

### 1. Schema Definition

**File:** `/src/schema/account-settings/profile-edit.ts`

Defines Zod validation schemas for:

- `profileEditSchema` - Basic profile information (name, email)
- `passwordUpdateSchema` - Password change with validation
- `athleteProfileEditSchema` - Athlete-specific data (age, gender, height, weight)
- `fullProfileEditSchema` - Combined schema with cross-field validation

**Key Features:**

- Password confirmation matching
- Minimum password length (6 characters)
- Required fields validation
- Age, height, weight range validation
- TypeScript type exports for type safety

### 2. API Utility Function

**File:** `/src/utils/updateProfile.ts`

Implements the `useUpdateProfile` React hook using TanStack Query.

**Key Features:**

- Separates payload into different categories (basic info, athlete profile, password)
- Makes parallel API requests when needed
- Supports multiple endpoints:
  - `PATCH /users/{userId}/` - Updates basic info and athlete profile
  - `PATCH /users/{userId}/change-password/` - Updates password separately
- Automatic cache invalidation for `getUser` and `fetchAthletes` queries
- Toast notifications for success/error states
- TypeScript-safe error handling

**API Payload Structure:**

```typescript
{
  fullName?: string;
  email?: string;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  currentPassword?: string;
  newPassword?: string;
}
```

### 3. Updated Edit Page

**File:** `/src/app/(protected)/dashboard/profile/[id]/edit/page.tsx`

**Changes Made:**

- Imported `useUpdateProfile` hook
- Replaced mock API call with real mutation
- Removed local `isSubmitting` state (now uses `updateProfileMutation.isPending`)
- Added proper payload construction with type conversion
- Automatic navigation back to profile page on success
- Integrated with existing toast notification system

**Form Validation:**

- Client-side password matching validation
- Required current password when changing password
- Number conversion for age, height, weight fields

## Usage Example

```typescript
// In your component
import { useUpdateProfile } from "@/utils/updateProfile";

const updateProfileMutation = useUpdateProfile();

// To update profile
updateProfileMutation.mutate({
  userId: "user-id-here",
  profileData: {
    fullName: "John Doe",
    email: "john@example.com",
    age: 25,
    gender: "Male",
    height: 180,
    weight: 75,
    // Optional: include to change password
    currentPassword: "oldpass",
    newPassword: "newpass123",
  },
});

// Check loading state
const isLoading = updateProfileMutation.isPending;

// Handle success/error in callbacks
updateProfileMutation.mutate(
  { userId, profileData },
  {
    onSuccess: () => {
      // Navigate or show success message
    },
    onError: (error) => {
      // Handle error
    },
  }
);
```

## API Integration Notes

**Expected Backend Endpoints:**

1. **Update Profile & Athlete Data:**

   ```
   PATCH /users/{userId}/
   Body: {
     fullName?: string,
     email?: string,
     age?: number,
     gender?: string,
     height?: number,
     weight?: number
   }
   ```

2. **Change Password:**
   ```
   PATCH /users/{userId}/change-password/
   Body: {
     currentPassword: string,
     newPassword: string
   }
   ```

**Response Format:**
The function expects the standard API response format used throughout the app.

**Error Handling:**
Errors are caught and displayed via toast notifications. The error message is extracted from `error.response.data.message` if available.

## Benefits

1. **Type Safety:** Full TypeScript support with Zod schemas
2. **Reusability:** Hook can be used in multiple components
3. **Automatic Cache Management:** TanStack Query handles cache invalidation
4. **User Feedback:** Built-in success/error notifications
5. **Loading States:** Easy access to pending/loading states
6. **Validation:** Client-side validation before API call
7. **Separation of Concerns:** API logic separate from UI components

## Testing Checklist

- [ ] Update basic information (name, email)
- [ ] Update athlete profile (age, gender, height, weight)
- [ ] Change password with correct current password
- [ ] Verify password mismatch validation
- [ ] Verify required current password validation
- [ ] Test with partial updates (only some fields)
- [ ] Verify cache invalidation (data refreshes after update)
- [ ] Test error handling with invalid data
- [ ] Verify loading states during submission
- [ ] Test navigation after successful update

## Future Enhancements

1. Add profile picture upload functionality
2. Add real-time validation feedback
3. Implement optimistic updates
4. Add undo functionality
5. Support for additional profile fields
6. Batch update optimization
7. Rate limiting for password changes
