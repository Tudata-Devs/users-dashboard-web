# User Dashboard Web Application

A secure, role-based web application built with Next.js, Firebase Authentication, and Firestore. This application provides a comprehensive dashboard for managing user data with advanced analytics and statistics.

## Features

### Authentication & Authorization

- **Role-based access control** with predefined email authorization
- **Secure session management** with token-based authentication
- **Email/password authentication** with Firebase Auth
- **Middleware protection** for secure routes
- **Automatic redirects** based on authentication status

### Dashboard Features

- **Comprehensive data table** displaying all user documents
- **Real-time statistics** with demographic breakdowns
- **Search and filtering** capabilities
- **Data export** to CSV format
- **Responsive design** with modern UI components

### Data Management

- **Firestore integration** for real-time data synchronization
- **Type-safe data models** with TypeScript interfaces
- **Aggregation queries** for statistics calculation
- **Document tracking** with unique IDs

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: shadcn/ui with Tailwind CSS
- **Authentication**: Firebase Authentication
- **Database**: Cloud Firestore
- **Icons**: Lucide React
- **Package Manager**: Bun

## Prerequisites

Before running this application, ensure you have:

1. **Node.js** (v18 or higher)
2. **Bun** package manager
3. **Firebase project** with Authentication and Firestore enabled
4. **Firebase configuration** credentials

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd users-dashboard-web
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Set up Firebase configuration**

   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

4. **Configure Firebase Authentication**

   In your Firebase Console:

   - Enable Email/Password authentication
   - Add your domain to authorized domains
   - Configure any additional security rules

5. **Set up Firestore Database**

   Create a Firestore database with the following collection structure:

   ```
   users/
   ├── {userId}/
   │   ├── nombre: string
   │   ├── apellidos: string
   │   ├── documentoDeIdentidad: { tipo: string, numero: string }
   │   ├── telefono: number
   │   ├── genero: string
   │   ├── fechaDeNacimiento: Timestamp
   │   ├── departmentOfResidency: string
   │   ├── cityOfResidence: string
   │   ├── urlDocumentoIdentidad: string
   │   ├── terminosYcondiciones: boolean
   │   ├── politicaTratamientoDatos: boolean
   │   ├── tratamientoDatosPersonales: boolean
   │   ├── createdAt: Timestamp
   │   └── updatedAt: Timestamp
   ```

6. **Configure authorized users**

   Update the `ALLOWED_USERS` array in `src/lib/auth.ts`:

   ```typescript
   const ALLOWED_USERS: AllowedUser[] = [
     { email: "admin@example.com", role: "admin", isActive: true },
     { email: "user1@example.com", role: "user", isActive: true },
     // Add more users as needed
   ];
   ```

## Running the Application

1. **Start the development server**

   ```bash
   bun run dev
   ```

2. **Open your browser**

   Navigate to `http://localhost:3000`

3. **Sign in**

   Use one of the authorized email addresses to sign in or create a new account.

## Project Structure

```
src/
├── app/
│   ├── auth/
│   │   └── login/
│   │       └── page.tsx          # Login/signup page
│   ├── dashboard/
│   │   └── page.tsx              # Main dashboard
│   ├── layout.tsx                # Root layout with auth provider
│   └── page.tsx                  # Landing page
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx         # Login form component
│   │   └── SignUpForm.tsx        # Signup form component
│   ├── dashboard/
│   │   ├── DataTable.tsx         # Data table component
│   │   └── StatisticsCards.tsx   # Statistics cards component
│   └── ui/                       # shadcn/ui components
├── contexts/
│   └── AuthContext.tsx           # Authentication context
├── lib/
│   ├── auth.ts                   # Authentication service
│   ├── firebase.ts               # Firebase configuration
│   └── firestore.ts              # Firestore service
├── types/
│   └── user.ts                   # TypeScript interfaces
└── middleware.ts                 # Route protection middleware
```

## Key Features Explained

### Authentication System

The application uses a custom authentication service that:

- Validates emails against a predefined list
- Assigns roles (admin/user) based on email
- Generates secure session tokens
- Implements middleware for route protection

### Data Model

The Firestore data model follows a specific schema:

- **Personal Information**: name, surname, ID document, phone, gender
- **Location Data**: department and city of residence
- **Document Management**: URL to identity document
- **Consent Tracking**: terms acceptance and data policy agreements
- **Metadata**: creation and update timestamps

### Statistics Generation

The application calculates comprehensive statistics:

- **Demographic breakdowns** by gender, department, and city
- **Acceptance rates** for terms and policies
- **Age group distribution** based on birth dates
- **Total user counts** and aggregations

### Security Features

- **Role-based access control** with predefined user authorization
- **Session token validation** with expiration
- **Middleware protection** for sensitive routes
- **Input validation** and error handling
- **Secure Firebase configuration** with environment variables

## API Reference

### Authentication Service

```typescript
// Sign in with email and password
await authService.signIn(email: string, password: string)

// Sign up with email and password
await authService.signUp(email: string, password: string)

// Sign out
await authService.signOut()

// Get current user with role
await authService.getCurrentUser()
```

### Firestore Service

```typescript
// Get all users
await firestoreService.getAllUsers()

// Get user by ID
await firestoreService.getUserById(userId: string)

// Add new user
await firestoreService.addUser(userData: UserData)

// Update user
await firestoreService.updateUser(userId: string, data: Partial<UserData>)

// Delete user
await firestoreService.deleteUser(userId: string)

// Get statistics
await firestoreService.getUserStatistics()
```

## Deployment

1. **Build the application**

   ```bash
   bun run build
   ```

2. **Start production server**

   ```bash
   bun run start
   ```

3. **Deploy to Vercel/Netlify**

   The application is ready for deployment to any platform that supports Next.js.

## Environment Variables

| Variable                                   | Description                  |
| ------------------------------------------ | ---------------------------- |
| `NEXT_PUBLIC_FIREBASE_API_KEY`             | Firebase API key             |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`         | Firebase auth domain         |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID`          | Firebase project ID          |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`      | Firebase storage bucket      |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID`              | Firebase app ID              |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
