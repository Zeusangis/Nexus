# 🏋️ Nexus - Athlete Performance Management System

A comprehensive full-stack platform for athlete performance tracking, injury risk assessment, and coach-athlete management. Built with modern technologies including Next.js, Node.js/TypeScript, Flask, and AI-powered video analysis.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📑 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [ACL Risk Analysis](#acl-risk-analysis)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

Nexus is an all-in-one athlete management platform designed to help coaches track, analyze, and improve athlete performance while monitoring injury risks through advanced video analysis and data-driven insights.

### Key Capabilities

- **Athlete Profile Management** - Comprehensive athlete information tracking
- **Performance Analytics** - Real-time performance metrics and visualizations
- **ACL Injury Risk Assessment** - AI-powered video analysis using MediaPipe
- **Coach-Athlete Relationships** - Seamless collaboration between coaches and athletes
- **Daily Activity Logging** - Track daily training, nutrition, and wellness
- **Real-time Chat** - Built-in messaging system for team communication

## ✨ Features

### 🏃 Athlete Management

- Create and manage athlete profiles with detailed information
- Track physical metrics (height, weight, BMI, body fat percentage)
- Monitor injury history and rehabilitation progress
- Assign athletes to coaches and sports categories
- View comprehensive athlete analytics dashboard

### 👨‍🏫 Coach Features

- Manage multiple athletes from a centralized dashboard
- Review athlete performance trends and statistics
- Access detailed reports and analytics
- Monitor training compliance and progress
- Communication tools for athlete engagement

### 📊 Performance Tracking

- Daily activity and training logs
- Performance metrics visualization with charts
- BMI and body composition tracking
- Training intensity and volume monitoring
- Historical data analysis and trends

### 🤖 AI-Powered ACL Risk Analysis

- **Video-based movement analysis** using MediaPipe Pose Detection
- **Real-time biomechanical assessment** of:
  - Knee flexion angles (left/right)
  - Knee valgus (inward collapse)
  - Trunk forward lean
  - Trunk lateral lean
- **Risk scoring system** with severity levels:
  - ✅ Low Risk (Score: 0-1)
  - ⚠️ Moderate Risk (Score: 2-3)
  - 🚨 High Risk (Score: 4+)
- Detailed feedback with corrective recommendations

### 💬 Communication

- Built-in chat system for coach-athlete communication
- Real-time messaging capabilities
- Message history and notifications

### 🔐 Authentication & Authorization

- JWT-based authentication
- Role-based access control (Coach/Athlete)
- Secure password hashing with bcrypt
- Token refresh mechanism
- Protected routes and API endpoints

## 🛠 Tech Stack

### Frontend

- **Framework:** Next.js 15+ (React 19)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **UI Components:** Radix UI, shadcn/ui
- **State Management:** Zustand, TanStack Query
- **Form Handling:** React Hook Form + Zod validation
- **Charts:** Recharts
- **HTTP Client:** Axios

### Backend

- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** SQLite with Prisma ORM
- **Authentication:** JWT (jsonwebtoken)
- **Email:** Nodemailer
- **Security:** bcryptjs, cors, express-rate-limit
- **API Documentation:** RESTful architecture

### AI/ML Service (ACL Analysis)

- **Framework:** Flask (Python)
- **Computer Vision:** MediaPipe (Google)
- **Video Processing:** OpenCV (cv2)
- **Numerical Computing:** NumPy
- **CORS:** Flask-CORS

### DevOps & Tools

- **Version Control:** Git & GitHub
- **Package Manager:** npm
- **Linting:** ESLint
- **Git Hooks:** Husky
- **API Testing:** REST Client

## 📁 Project Structure

```
Nexus/
├── athletex-frontend-new/          # Next.js Frontend Application
│   ├── src/
│   │   ├── app/                    # Next.js App Router
│   │   │   ├── (auth-layout)/      # Authentication pages
│   │   │   ├── (protected)/        # Protected dashboard routes
│   │   │   │   └── dashboard/
│   │   │   │       ├── athletes/   # Athlete management
│   │   │   │       ├── daily/      # Daily logs
│   │   │   │       ├── profile/    # Profile pages
│   │   │   │       └── chats/      # Messaging
│   │   │   └── (public)/           # Public pages
│   │   ├── components/             # Reusable UI components
│   │   │   ├── atoms/              # Basic components
│   │   │   ├── molecules/          # Composite components
│   │   │   ├── organisms/          # Complex components
│   │   │   ├── templates/          # Page templates
│   │   │   └── ui/                 # shadcn/ui components
│   │   ├── utils/                  # Utility functions
│   │   ├── schema/                 # Zod validation schemas
│   │   ├── store/                  # Zustand stores
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── constants/              # App constants
│   │   └── axios/                  # API client configuration
│   ├── public/                     # Static assets
│   └── package.json
│
├── node-ts-project-backend/        # Node.js/TypeScript Backend
│   ├── src/
│   │   ├── controller/             # Route controllers
│   │   │   ├── user.controller.ts
│   │   │   ├── athlete.controller.ts
│   │   │   ├── sport.controller.ts
│   │   │   ├── coach-athlete.controller.ts
│   │   │   └── daily-log.controller.ts
│   │   ├── routes/                 # Express routes
│   │   ├── middleware/             # Custom middleware
│   │   │   ├── auth.middleware.ts
│   │   │   ├── permission.middleware.ts
│   │   │   ├── limiter.middleware.ts
│   │   │   └── errorHandler.ts
│   │   ├── schema/                 # Request validation schemas
│   │   ├── utils/                  # Utility functions
│   │   │   ├── token.ts
│   │   │   ├── password.ts
│   │   │   ├── mailer.ts
│   │   │   └── api-error.ts
│   │   ├── config/                 # Configuration files
│   │   ├── db/                     # Database client
│   │   ├── app.ts                  # Express app setup
│   │   └── server.ts               # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma           # Database schema
│   │   └── dev.db                  # SQLite database
│   └── package.json
│
├── main.py                         # Flask ACL Risk Analysis API
├── chat.py                         # Chat functionality (Python)
├── .gitignore                      # Git ignore rules
└── README.md                       # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- Git

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/Zeusangis/Nexus.git
cd Nexus
```

#### 2. Setup Frontend

```bash
cd athletex-frontend-new
npm install
cp .env.example .env.local  # Create and configure environment variables
npm run dev
```

Frontend will run on `http://localhost:3001`

**Environment Variables (.env.local):**

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### 3. Setup Backend

```bash
cd node-ts-project-backend
npm install
cp .env.example .env  # Create and configure environment variables
npx prisma generate
npx prisma db push
npm run dev
```

Backend will run on `http://localhost:8000`

**Environment Variables (.env):**

```env
DATABASE_URL="file:./dev.db"
PORT=8000
JWT_SECRET=your-secret-key-here
FRONTEND_URL="http://localhost:3001"
NODE_ENV="development"
BACKEND_URL="http://localhost:8000"
GOOGLE_EMAIL=your-email@gmail.com
GOOGLE_PASSWORD=your-app-password
```

#### 4. Setup ACL Analysis Service

```bash
# From Nexus root directory
python3 -m venv venv1
source venv1/bin/activate  # On Windows: venv1\Scripts\activate

pip install flask flask-cors opencv-python mediapipe numpy

python main.py
```

ACL Analysis API will run on `http://localhost:1010`

### 🎮 Usage

1. **Register an Account**

   - Navigate to `http://localhost:3001/register`
   - Choose role: Coach or Athlete
   - Complete registration

2. **Login**

   - Go to `http://localhost:3001/login`
   - Enter credentials

3. **Dashboard**

   - Access the dashboard after login
   - Explore features based on your role

4. **Add Athletes** (Coach only)

   - Navigate to Athletes section
   - Click "Add Athlete"
   - Fill in athlete details

5. **ACL Risk Analysis**
   - Upload athlete movement video
   - Get AI-powered biomechanical analysis
   - Review risk assessment and recommendations

## 📡 API Documentation

### Base URLs

- **Backend API:** `http://localhost:8000/api/v1`
- **ACL Analysis:** `http://localhost:1010`

### Authentication Endpoints

#### Register User

```http
POST /api/v1/users/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "COACH" | "ATHELETE"
}
```

#### Login

```http
POST /api/v1/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

Response:

```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "clx123",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "COACH"
  }
}
```

### Athlete Endpoints

#### Get All Athletes

```http
GET /api/v1/athlete
Authorization: Bearer {token}
```

#### Get Athlete by ID

```http
GET /api/v1/athlete/:id
Authorization: Bearer {token}
```

#### Create Athlete Profile

```http
POST /api/v1/athlete
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "user-id",
  "dateOfBirth": "2000-01-15",
  "gender": "MALE",
  "height": 180,
  "weight": 75,
  "sportId": "sport-id"
}
```

#### Update Athlete

```http
PUT /api/v1/athlete/:id
Authorization: Bearer {token}
Content-Type: application/json
```

#### Delete Athlete

```http
DELETE /api/v1/athlete/:id
Authorization: Bearer {token}
```

### Daily Log Endpoints

#### Create Daily Log

```http
POST /api/v1/daily-logs
Authorization: Bearer {token}
Content-Type: application/json

{
  "athleteId": "athlete-id",
  "date": "2024-11-03",
  "trainingIntensity": 8,
  "hoursSlept": 7.5,
  "stressLevel": 4,
  "notes": "Great training session"
}
```

#### Get Athlete Logs

```http
GET /api/v1/daily-logs/athlete/:athleteId
Authorization: Bearer {token}
```

### ACL Risk Analysis Endpoint

#### Analyze Movement Video

```http
POST http://localhost:1010/analyze-acl
Content-Type: multipart/form-data

file: [video file]
```

Response:

```json
{
  "success": true,
  "risk_score": 2,
  "risk_level": "Moderate Risk",
  "details": {
    "left_knee_flexion": 25.3,
    "right_knee_flexion": 28.7,
    "left_knee_valgus": 12.5,
    "right_knee_valgus": 11.2,
    "trunk_forward": 35.8,
    "trunk_lateral": 8.3
  },
  "recommendations": [
    "Increase knee flexion angle during landing",
    "Work on controlling knee valgus"
  ]
}
```

## 🏥 ACL Risk Analysis

### How It Works

The ACL Risk Analysis system uses MediaPipe Pose Detection to analyze athlete movement patterns from video uploads:

1. **Video Processing**

   - Upload video of athlete performing jump/landing movements
   - System extracts key frames and detects pose landmarks

2. **Biomechanical Analysis**

   - Calculates joint angles and body alignment
   - Measures knee flexion, valgus, and trunk positioning

3. **Risk Assessment**
   - Compares measurements against established thresholds
   - Generates risk score (0-6+)
   - Provides detailed feedback

### Risk Factors Analyzed

| Metric        | Low Risk | Moderate | High Risk |
| ------------- | -------- | -------- | --------- |
| Knee Flexion  | >30°     | 15-30°   | <15°      |
| Knee Valgus   | <10°     | 10-20°   | >20°      |
| Trunk Forward | <30°     | 30-45°   | >45°      |
| Trunk Lateral | <10°     | 10-20°   | >20°      |

### Risk Levels

- **✅ Low Risk (0-1):** Good movement patterns, minimal injury risk
- **⚠️ Moderate Risk (2-3):** Some biomechanical concerns, preventive training recommended
- **🚨 High Risk (4+):** Significant risk factors present, immediate intervention needed

### Recommendations

Based on the analysis, the system provides:

- Specific movement corrections
- Strengthening exercises
- Neuromuscular training recommendations
- Professional consultation advice when needed

## 🗄️ Database Schema

### User Model

```prisma
model User {
  id           String   @id @default(cuid())
  fullName     String
  email        String   @unique
  password     String
  role         Role     @default(ATHELETE)
  isActive     Boolean  @default(true)
  profileImage String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

### AthleteProfile Model

```prisma
model AthleteProfile {
  id                String    @id @default(cuid())
  userId            String    @unique
  dateOfBirth       DateTime
  gender            Gender
  height            Float
  weight            Float
  bodyFatPercentage Float?
  injuryHistory     String?
  sportId           String
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}
```

### DailyLog Model

```prisma
model DailyLog {
  id                String   @id @default(cuid())
  athleteId         String
  date              DateTime
  trainingIntensity Int
  hoursSlept        Float
  stressLevel       Int
  notes             String?
  createdAt         DateTime @default(now())
}
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt with salt rounds
- **CORS Protection** - Configured allowed origins
- **Rate Limiting** - API request throttling
- **Input Validation** - Zod schemas for type safety
- **SQL Injection Prevention** - Prisma ORM parameterized queries
- **XSS Protection** - React's built-in XSS prevention
- **Environment Variables** - Sensitive data protection

## 🎨 UI/UX Features

- **Responsive Design** - Mobile, tablet, and desktop optimized
- **Dark Mode Support** - Theme switching capability
- **Accessible Components** - WCAG compliant UI elements
- **Loading States** - Skeleton loaders and progress indicators
- **Error Handling** - User-friendly error messages
- **Form Validation** - Real-time validation feedback
- **Data Visualization** - Interactive charts and graphs
- **Smooth Animations** - Tailwind animations

## 🧪 Testing

```bash
# Frontend tests
cd athletex-frontend-new
npm run test

# Backend tests
cd node-ts-project-backend
npm run test

# Linting
npm run lint
```

## 📈 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Advanced analytics and ML predictions
- [ ] Video streaming and playback
- [ ] Wearable device integration
- [ ] Nutrition tracking
- [ ] Training plan generator
- [ ] Social features and athlete community
- [ ] Multi-language support
- [ ] Export reports to PDF
- [ ] Integration with fitness trackers

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Unish Khadka**

- GitHub: [@Zeusangis](https://github.com/Zeusangis)

## 🙏 Acknowledgments

- MediaPipe by Google for pose detection
- shadcn/ui for beautiful UI components
- Prisma for excellent database tooling
- Next.js team for the amazing framework
- All open-source contributors

## 📞 Support

For support, email unishkhadka@example.com or open an issue on GitHub.

---

⭐ Star this repo if you find it helpful!

Made with ❤️ by Unish Khadka
