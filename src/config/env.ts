/**
 * Environment configuration
 * Validates and provides typed access to environment variables
 */

const requiredEnvVars = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'GITHUB_CLIENT_ID',
  'GITHUB_CLIENT_SECRET',
] as const;

// Validate required environment variables
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const env = {
  // Database
  database: {
    url: process.env.DATABASE_URL!,
  },

  // Authentication
  auth: {
    nextAuthSecret: process.env.NEXTAUTH_SECRET!,
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },

  // App
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    env: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development',
  },

  // External APIs
  apis: {
    github: {
      accessToken: process.env.GITHUB_ACCESS_TOKEN,
    },
  },
} as const;
