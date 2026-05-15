# FoodOptim Mobile App

A React Native mobile application built with Expo for the FoodOptim food supply chain optimization platform.

## Features

- **Authentication**: Clerk-based sign-in/sign-up with secure session management
- **Dashboard**: View vendor statistics and quick actions
- **Marketplace**: Browse and filter marketplace listings in real-time
- **Shelf-Life Predictions**: Upload product images to get AI-powered shelf-life predictions
- **Profile Management**: Manage user account and preferences

## Project Structure

```
mobile/
├── app/
│   ├── (auth)/              # Authentication screens
│   │   ├── sign-in.tsx
│   │   ├── sign-up.tsx
│   │   └── _layout.tsx
│   ├── (app)/               # App screens (authenticated)
│   │   ├── dashboard.tsx
│   │   ├── marketplace.tsx
│   │   ├── predictions.tsx
│   │   ├── profile.tsx
│   │   └── _layout.tsx
│   └── _layout.tsx          # Root layout with Clerk setup
├── app.json                 # Expo configuration
├── package.json             # Dependencies
└── README.md               # This file
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd mobile
npm install
# or
yarn install
# or
pnpm install
```

### 2. Environment Variables

Create a `.env.local` file in the mobile directory with:

```
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
```

Get your Clerk key from: https://dashboard.clerk.com

### 3. Run the App

#### iOS (on Mac)
```bash
npm run ios
```

#### Android
```bash
npm run android
```

#### Web
```bash
npm run web
```

#### Development Server
```bash
npm start
```

## Dependencies

### Core
- **expo**: React Native framework with Expo
- **react-native**: Mobile development framework
- **expo-router**: File-based routing for React Native
- **expo-image-picker**: Image picking from device gallery
- **expo-camera**: Camera access for taking photos

### Authentication & API
- **@clerk/clerk-react-native**: Clerk authentication
- **@tanstack/react-query**: Data fetching and caching
- **axios**: HTTP client

### UI & Styling
- **nativewind**: Tailwind CSS for React Native
- **react-native-safe-area-context**: Safe area handling

## API Integration

The mobile app connects to the shared backend API:

```
API Base URL: https://your-domain.com/api
```

### Key Endpoints
- `GET /api/vendors` - Get vendor profile
- `GET /api/products` - List vendor products
- `GET /api/listings` - Browse marketplace listings
- `GET /api/predictions` - Get shelf-life predictions
- `POST /api/predictions` - Upload image for prediction

## Authentication Flow

1. User opens app → Check if authenticated
2. If not → Redirect to sign-in/sign-up
3. Sign in with Clerk (email/password)
4. Token stored securely in device storage
5. App makes authenticated API calls with token
6. Sign out clears token and returns to login

## Building for Production

### iOS
```bash
eas build --platform ios
```

### Android
```bash
eas build --platform android
```

### Web
```bash
npm run build
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 8081
lsof -ti:8081 | xargs kill -9
```

### Module Not Found
```bash
npm install
npx expo prebuild --clean
```

### Clerk Authentication Issues
- Check `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` is set correctly
- Ensure Clerk app is configured in dashboard
- Check network connectivity

## Development

### Adding New Screens
1. Create new file in `app/(app)/` or `app/(auth)/`
2. Use `useRouter()` for navigation
3. Screens automatically registered via Expo Router

### State Management
- Use `@tanstack/react-query` for server state
- Use React `useState` for local state
- Use Clerk's `useUser()` hook for auth state

### Styling
- Use NativeWind with Tailwind class names
- Common classes: `flex`, `p-4`, `bg-white`, `rounded-lg`, etc.
- Reference: https://www.nativewind.dev/

## Next Steps

- [ ] Implement image upload to Vercel Blob
- [ ] Add real API integration (remove mock data)
- [ ] Implement push notifications
- [ ] Add product search with filters
- [ ] Implement in-app messaging
- [ ] Add offline support with local caching
- [ ] Implement analytics tracking

## License

MIT
