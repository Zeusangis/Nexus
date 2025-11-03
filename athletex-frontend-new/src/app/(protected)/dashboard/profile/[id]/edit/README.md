# Edit Profile Page - Refactored Structure

## 📁 File Structure

```
/src/app/(protected)/dashboard/profile/[id]/edit/
├── page.tsx                           # Main page component (orchestrator)
├── _components/                       # UI components
│   ├── index.ts                      # Barrel export
│   ├── profile-picture-card.tsx      # Profile photo upload section
│   ├── basic-information-card.tsx    # Name & email fields
│   ├── security-card.tsx             # Password change section
│   ├── athlete-profile-card.tsx      # Athletic data fields
│   └── form-actions.tsx              # Submit/Cancel buttons
├── _hooks/                           # Custom hooks
│   └── use-profile-form.ts          # Form state management
├── _utils/                           # Utility functions
│   └── form-helpers.ts              # Validation & payload building
├── _types/                           # TypeScript definitions
│   └── index.ts                     # Interfaces & types
└── _constants/                       # Constants & mock data
    └── mock-data.ts                 # Mock user data
```

## 🎯 Architecture Benefits

### 1. **Separation of Concerns**
- **Components**: Pure UI presentation logic
- **Hooks**: Stateful logic and side effects
- **Utils**: Business logic and transformations
- **Types**: Type safety and contracts
- **Constants**: Configuration and mock data

### 2. **Reusability**
Each component is self-contained and can be:
- Reused in other pages
- Tested independently
- Modified without affecting others

### 3. **Maintainability**
- Easier to locate and fix bugs
- Clear responsibility for each file
- Reduced cognitive load

### 4. **Testability**
- Pure functions in utils are easy to test
- Components can be tested with mocked props
- Hooks can be tested in isolation

## 🔧 Component Breakdown

### **page.tsx** (Main Orchestrator)
- Handles routing and navigation
- Manages data fetching (current user vs athlete by ID)
- Coordinates form submission
- Determines access control (isViewingOtherUser)

**Key Features:**
- Smart data fetching based on viewer context
- Password section hidden for coaches editing athletes
- Conditional rendering based on user role

### **_components/**

#### **ProfilePictureCard**
- Displays avatar with user initials
- Upload button (placeholder)
- Props: `fullName`

#### **BasicInformationCard**
- Full name and email inputs
- Props: `formData`, `handleInputChange`

#### **SecurityCard**
- Current, new, and confirm password fields
- Only shown when editing own profile
- Props: `formData`, `handleInputChange`

#### **AthleteProfileCard**
- Age, gender, height, weight fields
- Risk score, training type, experience level
- Limitations textarea
- Only shown for athletes
- Props: `formData`, `handleInputChange`, `handleSelectChange`

#### **FormActions**
- Cancel and Submit buttons
- Loading state handling
- Props: `onCancel`, `isSubmitting`

### **_hooks/**

#### **useProfileForm**
- Manages all form state
- Handles input changes
- Syncs with user data updates
- Returns: `{ formData, handleInputChange, handleSelectChange }`

### **_utils/**

#### **form-helpers.ts**
**Functions:**
- `validatePasswordChange(formData)`: Validates password fields
- `buildUpdatePayload(formData, includePassword)`: Constructs API payload
  - Converts strings to numbers
  - Calculates BMI automatically
  - Conditionally includes password fields

### **_types/**

#### **Interfaces:**
- `ExtendedAthleteProfile`: Full athlete profile with all fields
- `ProfileFormData`: Form state shape
- `UpdateProfilePayload`: API request payload

### **_constants/**

#### **mock-data.ts**
- `MOCK_USER`: Fallback user data for development

## 🔄 Data Flow

```
1. User loads page
   ↓
2. Fetch data (useGetUser / useFetchAthleteById)
   ↓
3. Determine viewer context (isViewingOtherUser)
   ↓
4. Initialize form with useProfileForm hook
   ↓
5. Render conditional components
   ↓
6. User interacts with form
   ↓
7. Form state updates via hooks
   ↓
8. User submits form
   ↓
9. Validate data (form-helpers)
   ↓
10. Build payload (form-helpers)
    ↓
11. Submit to API (useUpdateProfile)
    ↓
12. Redirect on success
```

## 🚀 Usage Example

### Adding a New Field

1. **Update types** (`_types/index.ts`):
```typescript
export interface ProfileFormData {
  // ... existing fields
  phoneNumber: string;
}
```

2. **Update hook** (`_hooks/use-profile-form.ts`):
```typescript
const [formData, setFormData] = useState<ProfileFormData>({
  // ... existing fields
  phoneNumber: user.phoneNumber || "",
});
```

3. **Update component** (`_components/basic-information-card.tsx`):
```tsx
<Input
  id="phoneNumber"
  name="phoneNumber"
  value={formData.phoneNumber}
  onChange={handleInputChange}
/>
```

4. **Update payload builder** (`_utils/form-helpers.ts`):
```typescript
if (formData.phoneNumber) {
  payload.phoneNumber = formData.phoneNumber;
}
```

## 🔐 Security Features

- Password editing restricted to users editing their own profile
- Coaches cannot change athlete passwords
- Conditional payload building based on viewer context
- Automatic BMI calculation (prevents tampering)

## 📊 State Management

- **Local State**: Form inputs (managed by useProfileForm)
- **Server State**: User data (managed by TanStack Query)
- **Derived State**: isViewingOtherUser, isLoading

## 🎨 Styling

- Consistent card styling with `rounded-2xl border-2 shadow-lg`
- Responsive grid layouts (`md:grid-cols-2`)
- Framer Motion animations for smooth transitions
- Muted backgrounds for info messages

## 🧪 Testing Strategy

### Unit Tests
- Test `validatePasswordChange` with various inputs
- Test `buildUpdatePayload` output structure
- Test `useProfileForm` state updates

### Integration Tests
- Test form submission flow
- Test conditional rendering (coach vs athlete)
- Test navigation after successful save

### E2E Tests
- Test complete edit flow
- Test validation error messages
- Test cancel button behavior

## 📝 Notes

- Mock data is used as fallback during development
- BMI is auto-calculated from height and weight
- All numeric inputs are converted in payload builder
- Password fields are optional (empty = no change)
