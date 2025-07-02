# 🪙 Floosy — Your Friendly Finance Tracker

<p align="center">
  <img src="https://github.com/user-attachments/assets/6bcdae32-e4e2-4581-962e-9803975e8049" alt="Floosy Logo" width="200"/>
</p>

**Floosy** is a comprehensive personal finance web application designed to help individuals in Oman track their **income**, **expenses**, and calculate their **net monthly and yearly balance** — all while staying compliant with **Oman's Personal Income Tax Law (Royal Decree No. 56/2025)**.

## 🌟 Features

### 💼 Core Functionality
- **Monthly Income Tracking** - Track income from 11 different sources according to Omani tax law
- **Monthly Expense Management** - Record 4 types of tax-deductible expenses
- **Annual Tax Calculation** - Automatic tax calculation based on Omani tax law (5% on income above OMR 42,000)
- **Financial Dashboard** - Real-time insights and key financial metrics
- **Monthly Comparisons** - Track your financial progress over time
- **Tax Reports** - Generate annual reports for tax filing

### 👥 User Management
- **User Registration & Authentication** - Secure JWT-based authentication
- **Individual Users** - Personal finance and tax management
- **User Profile Management** - Manage personal information and tax residency status

### 🔒 Security Features
- **JWT Authentication** - Secure token-based authentication
- **Route Guards** - Protected routes requiring authentication
- **Input Validation** - Both client and server-side validation
- **CORS Configuration** - Secure cross-origin requests

## 🏗️ Technology Stack

### Frontend (Angular 20)
- **Framework**: Angular 20
- **Language**: TypeScript
- **Styling**: CSS3 with Custom Variables
- **HTTP Client**: Angular HTTP Client with Interceptors
- **Routing**: Angular Router with Guards
- **State Management**: RxJS Observables

### Backend (ASP.NET Core 8)
- **Framework**: ASP.NET Core 8
- **Language**: C#
- **API**: RESTful Web API
- **Authentication**: ASP.NET Core Identity + JWT
- **Architecture**: Repository Pattern with Generic Repository

### Database
- **Database**: SQL Server
- **ORM**: Entity Framework Core
- **Migration**: Code-First Approach
- **Identity**: ASP.NET Core Identity

## 🚀 Getting Started

### Prerequisites
- **.NET 8 SDK** or later
- **Node.js 20+** and npm
- **SQL Server** (LocalDB or full instance)
- **Visual Studio 2022** or VS Code
- **Angular CLI** (`npm install -g @angular/cli`)

### 📁 Project Structure
```
Floosy/
├── BackEnd/
│   └── Floosy_Platform/
│       ├── Floosy_Platform_API/         # Web API Controllers
│       ├── Floosy_Platform_BLL/         # Business Logic Layer
│       ├── Floosy_Platform_DAL/         # Data Access Layer
│       └── Floosy_Platform_Models/      # Data Models
└── FrontEnd/                            # Angular Application
    ├── src/
    │   ├── app/
    │   │   ├── components/              # Reusable Components
    │   │   ├── pages/                   # Page Components
    │   │   ├── services/                # HTTP Services
    │   │   ├── models/                  # TypeScript Interfaces
    │   │   ├── guards/                  # Route Guards
    │   │   └── interceptors/            # HTTP Interceptors
    │   └── environments/                # Environment Configuration
    └── public/                          # Static Assets
```

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/floosy.git
cd floosy
```

### 2. Backend Setup

#### Navigate to Backend Directory
```bash
cd BackEnd/Floosy_Platform
```

#### Update Connection String
Edit `Floosy_Platform_API/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=.;Initial Catalog=FloosyPlatformDB;Integrated Security=True;TrustServerCertificate=True;"
  }
}
```

#### Install Dependencies & Run Migrations
```bash
# Restore NuGet packages
dotnet restore

# Update database
dotnet ef database update --project Floosy_Platform_DAL --startup-project Floosy_Platform_API

# Run the API
dotnet run --project Floosy_Platform_API
```

The backend will run on `http://localhost:5004`

### 3. Frontend Setup

#### Navigate to Frontend Directory
```bash
cd ../../FrontEnd
```

#### Install Dependencies
```bash
npm install
```

#### Create Environment Files
Create `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5004',
  appName: 'Flossy',
  version: '1.0.0'
};
```

#### Run the Application
```bash
# Development server
npm start

# Or with Angular CLI
ng serve
```

The frontend will run on `http://localhost:4200`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Income Management
- `GET /api/incomes` - Get all incomes
- `GET /api/incomes/{userId}` - Get incomes by user
- `POST /api/incomes` - Create new income
- `PUT /api/incomes/{id}` - Update income
- `DELETE /api/incomes/{id}` - Delete income

### Expense Management
- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/{id}` - Get expense by ID
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/{id}` - Update expense
- `DELETE /api/expenses/{id}` - Delete expense

### Annual Calculations
- `GET /api/annualcalculations` - Get all calculations
- `GET /api/annualcalculations/{userId}` - Get calculations by user
- `POST /api/annualcalculations` - Create new calculation
- `PUT /api/annualcalculations/{id}` - Update calculation
- `DELETE /api/annualcalculations/{id}` - Delete calculation

## 🧮 Tax Calculation Logic

Based on **Royal Decree No. 56/2025**:

### Tax Rate
- **5%** on annual income exceeding **OMR 42,000**

### Income Sources (11 Categories)
1. Employment Income
2. Self-Employment Income
3. Rental Income
4. Royalty Income
5. Interest Income
6. Dividend/Sukuk Income
7. Real Estate Disposal Gains
8. Retirement/EOSB Income
9. Prize Income
10. Grants
11. Board Member Compensation

### Deductible Expenses (4 Categories)
1. Education Expenses
2. Healthcare Expenses
3. Interest (mortgage, etc.)
4. Zakat (religious obligations)

### Calculation Formula
```
Net Income = Total Income - Total Deductible Expenses
Taxable Income = Max(0, Net Income - 42,000)
Tax Due = Taxable Income × 0.05
```

## 🔐 Authentication Flow

1. **User Registration**: Create account with email and password
2. **JWT Token Generation**: Server generates JWT token on successful login
3. **Token Storage**: Frontend stores token in localStorage
4. **HTTP Interceptor**: Automatically adds Bearer token to API requests
5. **Route Guards**: Protect authenticated routes
6. **Token Validation**: Server validates JWT on protected endpoints

## 🎨 UI/UX Features

### Design Philosophy
- **Clean and Professional** - ISK-inspired design language
- **Mobile Responsive** - Works seamlessly across all devices
- **Accessibility** - WCAG compliant with proper contrast and semantics
- **User-Friendly** - Intuitive navigation and clear visual hierarchy

### Color Palette
- **Primary Dark**: `#1F2937`
- **Secondary Grey**: `#4B5563`
- **Accent Light**: `#F9FAFB`
- **Success Green**: `#10B981`
- **Warning Orange**: `#F59E0B`
- **Danger Red**: `#EF4444`

## 🧪 Testing

### Backend Testing
```bash
cd BackEnd/Floosy_Platform
dotnet test
```

### Frontend Testing
```bash
cd FrontEnd
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Update connection string for production
2. Set environment to Production
3. Publish to IIS or cloud platform

### Frontend Deployment
```bash
# Build for production
ng build --configuration production

# Deploy dist/ folder to web server
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Email**: info@flossy.om
- **Phone**: +968 2450 0000
- **Hours**: Sunday - Thursday: 8AM - 6PM

## 🙏 Acknowledgments

- **Royal Decree No. 56/2025** - Oman's Personal Income Tax Law
- **Angular Team** - For the amazing framework
- **Microsoft** - For ASP.NET Core and Entity Framework
- **Community** - For continuous support and feedback

---

**Built with ❤️ for Oman's financial future**
