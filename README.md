# User Dashboard Web Application

A secure, role-based web application built with Next.js, Firebase Authentication, and Firestore. This application provides a comprehensive dashboard for managing user data with advanced analytics, real-time updates, and a modern, professional UI.

## ✨ Features

### 🔐 Dynamic Authentication & Authorization

- **Dynamic admin system** with Firestore-based email management
- **Role-based access control** with real-time admin email validation
- **Secure session management** with token-based authentication
- **Email/password authentication** with Firebase Auth
- **Intelligent caching** (5-minute cache for admin emails)
- **Automatic redirects** based on authentication status

### 📊 Advanced Dashboard Features

- **Real-time data table** with live Firestore synchronization
- **Professional user profile dialogs** with detailed information
- **Comprehensive statistics** with demographic breakdowns
- **Advanced search and filtering** capabilities
- **CSV data export** functionality
- **Responsive design** with mobile-first approach
- **Theme toggle** (light/dark mode) with system preference detection

### 🎨 Modern UI/UX

- **shadcn/ui components** with Tailwind CSS styling
- **Professional, minimalistic design** with attention to detail
- **Consistent color theming** using CSS variables
- **Responsive navigation** with mobile-friendly menu
- **Accessible components** with proper ARIA labels
- **Smooth animations** and transitions

### 📱 Data Management

- **Firestore integration** for real-time data synchronization
- **Type-safe data models** with TypeScript interfaces
- **Advanced aggregation queries** for statistics calculation
- **Document tracking** with unique IDs and copy functionality
- **File download support** for user documents

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: shadcn/ui with Tailwind CSS
- **Authentication**: Firebase Authentication
- **Database**: Cloud Firestore
- **Icons**: Lucide React
- **Theming**: next-themes for dark/light mode
- **Package Manager**: Bun
- **Styling**: Tailwind CSS with CSS variables

## 📋 Prerequisites

Before running this application, ensure you have:

1. **Node.js** (v18 or higher)
2. **Bun** package manager
3. **Firebase project** with Authentication and Firestore enabled
4. **Firebase configuration** credentials
5. **Modern browser** with JavaScript enabled

## 🚀 Installation

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

   system_variables/
   └── access/
       ├── admin: ["admin1@example.com", "admin2@example.com"]
       ├── createdAt: Timestamp
       └── updatedAt: Timestamp
   ```

6. **Set up Dynamic Admin System**

   Run the setup script to configure admin emails:

   ```bash
   bun run setup-admin-emails
   ```

   Or manually create the `system_variables/access` document in Firestore with an `admin` array field containing your admin email addresses.

7. **Test the system**

   ```bash
   bun run test-admin-system
   ```

## 🏃‍♂️ Running the Application

1. **Start the development server**

   ```bash
   bun run dev
   ```

2. **Open your browser**

   Navigate to `http://localhost:3000`

3. **Sign in**

   Use one of the admin email addresses configured in the `system_variables/access` document to sign in.

## 📁 Project Structure

```
src/
├── app/
│   ├── auth/
│   │   └── login/
│   │       └── page.tsx              # Login page
│   ├── dashboard/
│   │   └── page.tsx                  # Main dashboard
│   ├── layout.tsx                    # Root layout with providers
│   ├── globals.css                   # Global styles and theme variables
│   └── page.tsx                      # Landing page
├── components/
│   ├── auth/
│   │   └── LoginForm.tsx             # Login form component
│   ├── dashboard/
│   │   ├── DataTable.tsx             # Data table with user profiles
│   │   └── StatisticsCards.tsx       # Statistics cards component
│   ├── navigation/
│   │   └── Navbar.tsx                # Responsive navigation component
│   ├── theme/
│   │   ├── ThemeProvider.tsx         # Theme context provider
│   │   └── ThemeToggle.tsx           # Theme toggle component
│   └── ui/                           # shadcn/ui components
├── contexts/
│   └── AuthContext.tsx               # Authentication context
├── lib/
│   ├── auth.ts                       # Dynamic authentication service
│   ├── firebase.ts                   # Firebase configuration
│   └── firestore.ts                  # Firestore service with admin management
├── types/
│   └── user.ts                       # TypeScript interfaces
├── middleware.ts                     # Route protection middleware
└── scripts/                          # Utility scripts
    ├── setup-admin-emails.ts         # Admin system setup
    ├── test-admin-system.ts          # System testing
    └── seed.ts                       # Database seeding
```

## 🔑 Key Features Explained

### 🔐 Dynamic Authentication System

The application uses a sophisticated authentication service that:

- **Fetches admin emails dynamically** from Firestore `system_variables/access` document
- **Intelligent caching** with 5-minute cache duration to optimize performance
- **Real-time validation** of admin emails on every login attempt
- **Secure session management** with token-based authentication
- **Automatic cache refresh** when admin emails are updated
- **Fallback mechanisms** for network errors and offline scenarios

### 📊 Advanced Data Management

The Firestore data model follows a comprehensive schema:

- **Personal Information**: name, surname, ID document, phone, gender, birth date
- **Location Data**: department and city of residence
- **Document Management**: URL to identity document with download functionality
- **Consent Tracking**: terms acceptance and data policy agreements with visual indicators
- **Metadata**: creation and update timestamps with real-time synchronization

### 📈 Real-time Statistics & Analytics

The application provides comprehensive real-time statistics:

- **Demographic breakdowns** by gender, department, and city
- **Acceptance rates** for terms and policies with visual indicators
- **Age group distribution** based on birth dates
- **Total user counts** and aggregations with live updates
- **Real-time data synchronization** using Firestore listeners

### 🎨 Modern UI/UX Features

- **Professional user profile dialogs** with detailed information display
- **Theme toggle** with light/dark mode support and system preference detection
- **Responsive navigation** with mobile-friendly hamburger menu
- **Advanced data table** with search, filtering, and export capabilities
- **Copy-to-clipboard** functionality for user IDs
- **Professional styling** with consistent color theming using CSS variables

### 🔒 Security & Performance

- **Dynamic admin management** without code changes or redeployment
- **Session token validation** with 24-hour expiration
- **Middleware protection** for sensitive routes
- **Input validation** and comprehensive error handling
- **Secure Firebase configuration** with environment variables
- **Optimized caching** to reduce Firestore read operations

## 📚 API Reference

### 🔐 Authentication Service

```typescript
// Sign in with email and password (validates against dynamic admin list)
await authService.signIn(email: string, password: string)

// Sign out
await authService.signOut()

// Get current user with role
await authService.getCurrentUser()

// Check if email is allowed (async)
await authService.isEmailAllowed(email: string)

// Get user role (async)
await authService.getUserRole(email: string)

// Clear admin emails cache
authService.clearAdminEmailsCache()

// Force refresh admin emails from Firestore
await authService.refreshAdminEmails()
```

### 🗄️ Firestore Service

```typescript
// User Management
await firestoreService.getAllUsers()
await firestoreService.getUserById(userId: string)
await firestoreService.addUser(userData: UserData)
await firestoreService.updateUser(userId: string, data: Partial<UserData>)
await firestoreService.deleteUser(userId: string)

// Statistics
await firestoreService.getUserStatistics()

// Real-time Listeners
firestoreService.subscribeToUsers(onUpdate, onError)
firestoreService.subscribeToUserStatistics(onUpdate, onError)

// Admin Management (NEW)
await firestoreService.getAdminEmails()
await firestoreService.updateAdminEmails(emails: string[])
await firestoreService.addAdminEmail(email: string)
await firestoreService.removeAdminEmail(email: string)
```

## 🛠️ Available Scripts

```bash
# Development
bun run dev                    # Start development server
bun run build                  # Build for production
bun run start                  # Start production server
bun run lint                   # Run ESLint

# Database Management
bun run seed                   # Seed database with sample data
bun run clear-db               # Clear all user data
bun run reset-db               # Reset database (clear + seed)
bun run add-test-user          # Add a single test user

# Admin System
bun run setup-admin-emails     # Set up admin emails in Firestore
bun run test-admin-system      # Test the admin system functionality
```

## 🚀 Deployment

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

4. **Environment Variables**

   Make sure to set all required environment variables in your deployment platform.

## 🔧 Dynamic Admin System

The application features a sophisticated dynamic admin system that allows you to manage admin access without code changes or redeployment.

### Key Benefits:

- **No redeployment required** when adding/removing admins
- **Real-time validation** of admin emails
- **Intelligent caching** for optimal performance
- **Easy management** through Firebase Console or programmatically

### Managing Admin Emails:

#### Via Firebase Console:

1. Go to Firestore Database
2. Navigate to `system_variables/access`
3. Edit the `admin` array field
4. Add/remove email addresses as needed

#### Via Scripts:

```bash
# Set up initial admin emails
bun run setup-admin-emails

# Test the admin system
bun run test-admin-system
```

#### Programmatically:

```typescript
import { firestoreService } from "@/lib/firestore";

// Add admin email
await firestoreService.addAdminEmail("newadmin@example.com");

// Remove admin email
await firestoreService.removeAdminEmail("oldadmin@example.com");

// Update entire list
await firestoreService.updateAdminEmails([
  "admin1@example.com",
  "admin2@example.com",
]);
```

For detailed documentation, see [docs/ADMIN_SYSTEM.md](docs/ADMIN_SYSTEM.md).

## 📋 Environment Variables

| Variable                                   | Description                  |
| ------------------------------------------ | ---------------------------- |
| `NEXT_PUBLIC_FIREBASE_API_KEY`             | Firebase API key             |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`         | Firebase auth domain         |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID`          | Firebase project ID          |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`      | Firebase storage bucket      |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID`              | Firebase app ID              |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- **Documentation**: Check the [docs/](docs/) folder for detailed guides
- **Issues**: Create an issue in the repository
- **Admin System**: See [docs/ADMIN_SYSTEM.md](docs/ADMIN_SYSTEM.md) for admin management
- **Contact**: Reach out to the development team

## 🎯 Roadmap

- [ ] User role management (beyond admin)
- [ ] Advanced filtering and search
- [ ] Data visualization charts
- [ ] Bulk operations for user management
- [ ] Email notifications
- [ ] Audit logging
- [ ] API endpoints for external integrations
