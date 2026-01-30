// Simplified env - no validation for quick build
export const env = {
  NEYNAR_API_KEY: process.env.NEYNAR_API_KEY || '',
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret',
  REDIS_URL: process.env.REDIS_URL || '',
  REDIS_TOKEN: process.env.REDIS_TOKEN || '',
  NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
  NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || 'development',
  NEXT_PUBLIC_MINIKIT_PROJECT_ID: process.env.NEXT_PUBLIC_MINIKIT_PROJECT_ID || '',
  NEXT_PUBLIC_FARCASTER_HEADER: process.env.NEXT_PUBLIC_FARCASTER_HEADER || '',
  NEXT_PUBLIC_FARCASTER_PAYLOAD: process.env.NEXT_PUBLIC_FARCASTER_PAYLOAD || '',
  NEXT_PUBLIC_FARCASTER_SIGNATURE: process.env.NEXT_PUBLIC_FARCASTER_SIGNATURE || '',
};
