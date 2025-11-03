# Edit Profile - Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          page.tsx                               │
│                    (Main Orchestrator)                          │
│                                                                 │
│  • Fetch data (useGetUser / useFetchAthleteById)               │
│  • Determine access control (isViewingOtherUser)               │
│  • Form submission logic                                        │
│  • Navigation handling                                          │
└────────────┬────────────────────────────────────────────────────┘
             │
             ├─────────► Uses Hooks
             │           └── useProfileForm (form state)
             │
             ├─────────► Uses Utils
             │           ├── validatePasswordChange (validation)
             │           └── buildUpdatePayload (transform data)
             │
             └─────────► Renders Components
                         ├── ProfilePictureCard
                         ├── BasicInformationCard
                         ├── SecurityCard (conditional)
                         ├── AthleteProfileCard (conditional)
                         └── FormActions

┌──────────────────────────────────────────────────────────────────┐
│                        COMPONENT LAYER                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐  ┌──────────────────┐  ┌───────────────┐  │
│  │ ProfilePicture  │  │ BasicInformation │  │   Security    │  │
│  │     Card        │  │      Card        │  │     Card      │  │
│  │                 │  │                  │  │               │  │
│  │ • Avatar        │  │ • Full Name      │  │ • Current Pwd │  │
│  │ • Upload button │  │ • Email          │  │ • New Pwd     │  │
│  └─────────────────┘  └──────────────────┘  │ • Confirm Pwd │  │
│                                              │               │  │
│  ┌─────────────────┐  ┌──────────────────┐  │ Only shown    │  │
│  │ AthleteProfile  │  │   FormActions    │  │ for own       │  │
│  │     Card        │  │                  │  │ profile       │  │
│  │                 │  │ • Cancel button  │  └───────────────┘  │
│  │ • Age           │  │ • Submit button  │                     │
│  │ • Gender        │  │ • Loading state  │                     │
│  │ • Height/Weight │  └──────────────────┘                     │
│  │ • Risk Score    │                                           │
│  │ • Training Type │                                           │
│  │ • Experience    │                                           │
│  │ • Limitations   │                                           │
│  │                 │                                           │
│  │ Only for        │                                           │
│  │ ATHLETE role    │                                           │
│  └─────────────────┘                                           │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                          HOOKS LAYER                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  useProfileForm(user)                                           │
│  ├── Manages form state                                         │
│  ├── Syncs with user data                                       │
│  ├── Provides handleInputChange                                 │
│  └── Provides handleSelectChange                                │
│                                                                  │
│  Returns: { formData, handleInputChange, handleSelectChange }   │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                          UTILS LAYER                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  validatePasswordChange(formData): boolean                      │
│  ├── Check passwords match                                      │
│  ├── Check current password provided                            │
│  └── Show toast errors                                          │
│                                                                  │
│  buildUpdatePayload(formData, includePassword): Payload         │
│  ├── Convert strings to numbers                                 │
│  ├── Calculate BMI automatically                                │
│  ├── Conditionally include password                             │
│  └── Return clean payload object                                │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                         TYPES LAYER                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ExtendedAthleteProfile                                         │
│  ├── All athlete fields with extended properties                │
│  └── (riskScore, trainingType, experienceLevel, limitations)    │
│                                                                  │
│  ProfileFormData                                                │
│  ├── Form state shape                                           │
│  └── Includes all editable fields                               │
│                                                                  │
│  UpdateProfilePayload                                           │
│  ├── API request payload shape                                  │
│  └── Only includes fields that changed                          │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                       DATA FLOW DIAGRAM                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  User Action                                                    │
│      │                                                           │
│      ├─► Input Change                                           │
│      │   └─► handleInputChange (hook)                           │
│      │       └─► setFormData (update state)                     │
│      │           └─► Re-render components with new data         │
│      │                                                           │
│      └─► Form Submit                                            │
│          ├─► validatePasswordChange (util)                      │
│          │   ├─► ✓ Valid → Continue                            │
│          │   └─► ✗ Invalid → Show error, stop                  │
│          │                                                       │
│          ├─► buildUpdatePayload (util)                          │
│          │   └─► Clean, typed payload                           │
│          │                                                       │
│          ├─► updateProfileMutation.mutate()                     │
│          │   ├─► Send to API                                    │
│          │   └─► Wait for response                              │
│          │                                                       │
│          └─► onSuccess                                          │
│              └─► router.push (redirect to profile)              │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                   CONDITIONAL RENDERING LOGIC                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  isViewingOtherUser = params.id !== currentUser.id              │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ IF isViewingOtherUser === FALSE (Editing own profile) │    │
│  ├────────────────────────────────────────────────────────┤    │
│  │ ✓ Show ProfilePictureCard                              │    │
│  │ ✓ Show BasicInformationCard                            │    │
│  │ ✓ Show SecurityCard (password change)                  │    │
│  │ ✓ Show AthleteProfileCard (if ATHLETE role)            │    │
│  │ ✓ Include password in payload                          │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ IF isViewingOtherUser === TRUE (Coach editing athlete)│    │
│  ├────────────────────────────────────────────────────────┤    │
│  │ ✓ Show ProfilePictureCard                              │    │
│  │ ✓ Show BasicInformationCard                            │    │
│  │ ✗ HIDE SecurityCard (no password change)               │    │
│  │ ✓ Show AthleteProfileCard (if ATHLETE role)            │    │
│  │ ✗ EXCLUDE password from payload                        │    │
│  └────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────┘
```
