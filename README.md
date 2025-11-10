# Construction Material Shop 🏗️

A modern, full-stack e-commerce platform for construction materials built with Next.js 15, React 19, and Prisma. Features a complete product catalog, shopping cart, user authentication, order management, and PDF receipt generation.

![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-6.18.0-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.18-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.0-blue)

## ✨ Features

### 🛒 E-commerce Core

- **Product Catalog**: Browse construction materials with categories, search, and filtering
- **Shopping Cart**: Add/remove items, quantity management, persistent cart
- **Checkout Process**: Complete order flow with shipping information
- **Order Management**: View order history, track status, and download PDF receipts
- **User Authentication**: GitHub OAuth integration for secure login
- **Account Management**: User profile management and order history

### 🔧 Technical Features

- **Full-text Search**: Search products by name, description, and brand
- **Advanced Filtering**: Filter by category, price range, rating, and availability
- **Pagination**: Efficient loading of large product catalogs
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Type Safety**: Full TypeScript implementation with strict typing
- **Database Optimization**: Prisma ORM with PostgreSQL
- **API Routes**: RESTful API with proper error handling
- **PDF Generation**: Professional receipt generation with jsPDF
- **Performance Monitoring**: Built-in performance tracking and optimization
- **SEO Optimization**: Meta tags, structured data, and sitemap generation

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** - JavaScript runtime
- **PostgreSQL 15+** - Database server
- **GitHub OAuth App** - For user authentication
- **Git** - Version control system

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Dy-Rongrath/construction-material-shop.git
   cd construction-material-shop
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

   This will also automatically generate the Prisma client due to the `postinstall` script.

3. **Set up environment variables**

   Copy the example environment file:

   ```bash
   cp .env.example .env.local
   ```

   Fill in your environment variables:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/construction_shop"

   # GitHub OAuth
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret

   # NextAuth
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000

   # Optional: For production deployment
   VERCEL_URL=your_vercel_url
   ```

4. **Set up PostgreSQL database**

   Create a PostgreSQL database named `construction_shop` or update the `DATABASE_URL` accordingly.

5. **Initialize the database**

   ```bash
   # Generate Prisma client (usually done automatically)
   npm run db:generate

   # Run database migrations
   npm run db:migrate

   # Seed the database with sample data
   npm run db:seed
   ```

6. **Start the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
construction-material-shop/
├── prisma/
│   ├── schema.prisma          # Database schema and models
│   └── seed.ts               # Database seeding script
├── public/
│   ├── images/               # Static images and assets
│   │   ├── categories/       # Category icons
│   │   └── logo/            # Logo assets
│   └── ...                   # Other static assets
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (auth)/          # Authentication pages (login/register)
│   │   ├── (store)/         # Store pages (cart, checkout, account)
│   │   ├── api/             # API routes
│   │   │   ├── auth/        # Authentication endpoints
│   │   │   ├── cart/        # Shopping cart API
│   │   │   ├── orders/      # Order management API
│   │   │   ├── products/    # Product catalog API
│   │   │   └── webhooks/    # Webhook handlers
│   │   ├── about/           # About page
│   │   ├── contact/         # Contact page
│   │   ├── faq/             # FAQ page
│   │   ├── search/          # Search page
│   │   ├── sitemap/         # Sitemap generation
│   │   ├── globals.css      # Global styles
│   │   └── layout.tsx       # Root layout
│   ├── components/          # Reusable components
│   │   ├── ui/             # UI components (Button, Card, etc.)
│   │   ├── layout/         # Layout components (Navbar, Footer)
│   │   └── ...             # Other components
│   ├── features/           # Feature-specific modules
│   │   └── products/       # Product-related components and logic
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries and configurations
│   ├── services/           # API service functions
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── constants/          # Application constants
├── .env.example            # Environment variables template
├── jest.config.js          # Jest testing configuration
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── eslint.config.mjs       # ESLint configuration
```

## 🛠️ Tech Stack

### Frontend

- **Next.js 15.5.4** - React framework with App Router and Turbopack
- **React 19.1.0** - UI library with modern hooks and concurrent features
- **TypeScript 5.0** - Type-safe JavaScript with advanced type features
- **Tailwind CSS 3.4.18** - Utility-first CSS framework
- **TanStack Query 5.90.5** - Data fetching and caching library
- **React Hook Form 7.65.0** - Performant forms with easy validation
- **Lucide React 0.545.0** - Beautiful icon library
- **React Hot Toast 2.6.0** - Toast notifications

### Backend

- **Next.js API Routes** - Serverless API endpoints with middleware
- **Prisma 6.18.0** - Modern database ORM with type safety
- **PostgreSQL 15+** - Robust relational database
- **NextAuth.js** - Complete authentication solution
- **GitHub OAuth** - Social authentication provider
- **Zod 4.1.12** - TypeScript-first schema validation
- **jsPDF 3.0.3** - PDF document generation
- **html2canvas 1.4.1** - HTML to canvas conversion

### Development Tools

- **Jest 30.2.0** - Testing framework with jsdom environment
- **React Testing Library 16.3.0** - Component testing utilities
- **ESLint 9** - Code linting with security plugins
- **Prettier 3.6.2** - Code formatting
- **TypeScript 5.0** - Type checking and compilation
- **Husky** - Git hooks for quality assurance
- **tsx 4.20.6** - TypeScript execution for scripts

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run security-related tests
npm run test:security
```

### Test Coverage

The project includes comprehensive testing with:

- **Unit tests** for utility functions and hooks
- **Component tests** using React Testing Library
- **Integration tests** for API routes
- **Security tests** for authentication and authorization

## 📦 Available Scripts

### Development

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm run build:analyze` - Build with bundle analyzer
- `npm run start` - Start production server
- `npm run preview` - Build and start production server

### Code Quality

- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking

### Database

- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio
- `npm run db:reset` - Reset database and migrations

### Testing

- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:security` - Run security-related tests

### Security & Performance

- `npm run security:audit` - Run security audit
- `npm run security:headers` - Check security headers
- `npm run performance:analyze` - Analyze bundle performance
- `npm run clean` - Clean build artifacts and caches

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository**
   - Sign up/login to [Vercel](https://vercel.com)
   - Connect your GitHub repository
   - Import the project

2. **Configure environment variables**
   - Add all environment variables from `.env.local` in the Vercel dashboard
   - Set up PostgreSQL database (Vercel Postgres or external provider)

3. **Deploy**
   - Vercel will automatically deploy on every push to main branch
   - Custom domain can be configured in Vercel dashboard

### Railway

1. **Set up database**
   - Create a PostgreSQL database on Railway
   - Copy the database URL

2. **Deploy application**
   - Connect GitHub repository to Railway
   - Add environment variables
   - Deploy automatically

### Manual Deployment

1. **Build the application**:

   ```bash
   npm run build
   ```

2. **Start the production server**:

   ```bash
   npm start
   ```

3. **Set up reverse proxy** (nginx example):

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Environment Setup

For production, ensure you have:

- **Production database** (not development)
- **Secure environment variables**
- **HTTPS certificate** (Let's Encrypt recommended)
- **Monitoring and logging** setup

## 🔧 Configuration

### Database Schema

The application uses Prisma with PostgreSQL. Key models include:

- **User**: User accounts with GitHub OAuth integration
- **Product**: Construction materials with categories, pricing, and specifications
- **Category**: Product categories with hierarchical structure
- **Order**: Customer orders with status tracking
- **OrderItem**: Individual order line items
- **Cart**: Shopping cart persistence for logged-in users

### Environment Variables

Complete list of required environment variables (see `.env.example`):

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Authentication
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Optional: Production
VERCEL_URL="your-production-url"
```

### GitHub OAuth Setup

1. **Create OAuth App**:
   - Go to GitHub Settings → Developer settings → OAuth Apps
   - Click "New OAuth App"

2. **Configure OAuth App**:
   - **Application name**: Construction Material Shop
   - **Homepage URL**: `http://localhost:3000` (or your production URL)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/github`

3. **Get credentials**:
   - Copy Client ID and Client Secret
   - Add to your `.env.local` file

### Security Features

- **Rate limiting** on API endpoints
- **Helmet.js** security headers
- **Input validation** with Zod schemas
- **SQL injection protection** via Prisma ORM
- **XSS protection** with proper sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [Prisma](https://prisma.io/) - Next-generation database toolkit
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Vercel](https://vercel.com/) - The platform for frontend developers
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [TypeScript](https://typescriptlang.org/) - JavaScript with syntax for types
- [PostgreSQL](https://postgresql.org/) - Advanced open source relational database
- [jsPDF](https://github.com/parallax/jsPDF) - Client-side PDF generation
- [TanStack Query](https://tanstack.com/query) - Powerful data synchronization for React

## 📞 Support

If you have any questions or need help, please:

- Open an issue on [GitHub](https://github.com/Dy-Rongrath/construction-material-shop/issues)
- Check the [FAQ](./faq) page
- Contact the maintainers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Last updated**: October 26, 2025  
Built with ❤️ using Next.js, React, and modern web technologies.

## Payments, Email, and Telegram

- Stripe Checkout
  - Set `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and `NEXT_PUBLIC_APP_URL` in `.env`.
  - Expose the webhook endpoint at `/api/payments/stripe/webhook` in your Stripe dashboard.
  - On successful payment, the order status updates to `CONFIRMED`, an email is sent to the customer, and a Telegram message is sent to the owner.

- Email
  - Configure `EMAIL_SMTP_HOST`, `EMAIL_SMTP_PORT`, `EMAIL_SMTP_USER`, `EMAIL_SMTP_PASS`, and `EMAIL_FROM`.

- Telegram
  - Configure `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` for owner notifications.

- KHQR / ABA / AC
  - Demo endpoints are available at `/api/payments/khqr`, `/api/payments/aba`, and `/api/payments/ac`.
  - KHQR returns a QR code data URL for the order amount. ABA/AC return placeholder URLs until live credentials are provided.
