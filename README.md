# Construction Material Shop 🏗️

A modern, full-stack e-commerce platform for construction materials built with Next.js 15, React 19, and Prisma. Features a complete product catalog, shopping cart, user authentication, order management, and admin functionality.

![Next.js](https://img.shields.io/badge/Next.js-15.0-black)
![React](https://img.shields.io/badge/React-19.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.0-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.0-blue)

## ✨ Features

### 🛒 E-commerce Core

- **Product Catalog**: Browse construction materials with categories, search, and filtering
- **Shopping Cart**: Add/remove items, quantity management, persistent cart
- **Checkout Process**: Complete order flow with shipping information
- **Order Management**: View order history and track status
- **User Authentication**: GitHub OAuth integration for secure login

### 🔧 Technical Features

- **Full-text Search**: Search products by name, description, and brand
- **Advanced Filtering**: Filter by category, price range, rating, and availability
- **Pagination**: Efficient loading of large product catalogs
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Type Safety**: Full TypeScript implementation with strict typing
- **Database Optimization**: Prisma ORM with PostgreSQL
- **API Routes**: RESTful API with proper error handling

### 👨‍💼 Admin Features

- **Product Management**: Add, edit, and remove products
- **Order Management**: View and update order status
- **User Management**: Manage user accounts and permissions
- **Analytics Dashboard**: Sales and performance metrics

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- GitHub OAuth App (for authentication)

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

4. **Set up the database**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma migrate dev

   # Seed the database with sample data
   npx prisma db seed
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
construction-material-shop/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts               # Database seeding
├── public/
│   ├── images/               # Static images
│   └── ...                   # Other static assets
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (auth)/          # Authentication pages
│   │   ├── (store)/         # Store pages (cart, checkout, etc.)
│   │   ├── api/             # API routes
│   │   ├── about/           # About page
│   │   ├── contact/         # Contact page
│   │   ├── faq/             # FAQ page
│   │   ├── search/          # Search page
│   │   └── globals.css      # Global styles
│   ├── components/          # Reusable components
│   │   ├── ui/             # UI components (Button, Card, etc.)
│   │   ├── layout/         # Layout components
│   │   └── ...             # Other components
│   ├── features/           # Feature-specific components
│   │   └── products/       # Product-related components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   ├── services/           # API service functions
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── constants/          # Application constants
├── .env.example            # Environment variables template
├── jest.config.js          # Jest configuration
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - UI library with modern hooks
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Data fetching and caching
- **React Hook Form** - Form management
- **Lucide React** - Icon library

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **NextAuth.js** - Authentication
- **GitHub OAuth** - Social authentication

### Development Tools

- **Jest** - Testing framework
- **React Testing Library** - Component testing
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Commitlint** - Commit message linting

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests
- `npm run type-check` - Run TypeScript type checking

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Manual Deployment

1. Build the application:

   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## 🔧 Configuration

### Database Schema

The application uses Prisma with PostgreSQL. Key models include:

- **User**: User accounts with GitHub integration
- **Product**: Construction materials with categories
- **Category**: Product categories
- **Order**: Customer orders
- **OrderItem**: Individual order items
- **Cart**: Shopping cart items

### Environment Variables

See `.env.example` for all required environment variables.

### GitHub OAuth Setup

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL to: `http://localhost:3000/api/auth/github`
4. Copy Client ID and Client Secret to your `.env.local`

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

- [Next.js](https://nextjs.org/) - The React framework
- [Prisma](https://prisma.io/) - Database toolkit
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Vercel](https://vercel.com/) - Deployment platform

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the maintainers.

---

Built with ❤️ using Next.js and modern web technologies.
