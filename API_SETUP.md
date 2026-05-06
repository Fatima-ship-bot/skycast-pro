# OpenWeather API Setup Guide

## Overview
SkyCast Pro supports both mock data (for development) and live OpenWeather API data (for production).

## Setup Steps

### 1. Get OpenWeather API Key

1. Visit [https://openweathermap.org/api](https://openweathermap.org/api)
2. Sign up for a free account
3. Go to "API keys" in your account settings
4. Copy your default API key (usually already generated)

### 2. Create Environment File

Create a `.env.local` file in the project root:

```env
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with your actual API key.

### 3. Restart Dev Server

```bash
npm run dev
```

The app will automatically detect the API key and switch to live mode.

## Environment Setup

### Development (.env.local)
```env
VITE_OPENWEATHER_API_KEY=<your-development-key>
```

### Production
Set the environment variable in your hosting platform:
- **Vercel**: Add to project settings → Environment Variables
- **Netlify**: Add to Site settings → Build & deploy → Environment
- **Docker**: Add to docker-compose.yml or Docker environment
- **GitHub Pages**: Use GitHub Secrets

## Verification

To verify the API is working:
1. Open the app in your browser
2. Navigate to the Dashboard
3. Check the browser console for any API errors
4. Weather data should come from OpenWeather instead of mock data

## API Endpoints Used

The following OpenWeather API endpoints are utilized:

- **Current Weather**: `/weather`
- **Hourly Forecast**: `/forecast` (5-day/3-hour forecast)
- **Air Quality**: `/air_pollution` (current air quality data)
- **Geocoding**: `/geo/1.0/direct` (city name to coordinates)

## Rate Limits

Free tier OpenWeather API has the following limits:
- 60 calls/minute
- 1,000,000 calls/month

For production with higher traffic, consider upgrading to a paid plan.

## Troubleshooting

### API Key Not Recognized
- Ensure the .env.local file is in the project root
- Verify the key name is exactly `VITE_OPENWEATHER_API_KEY`
- Restart the dev server after adding/changing the key

### 401 Unauthorized Error
- The API key might be invalid or expired
- Check your OpenWeather account status
- Verify the key hasn't exceeded rate limits

### CORS Errors
- The OpenWeather API should not have CORS issues for this frontend setup
- If you see CORS errors, check that requests are going to official endpoints

### Falling Back to Mock Data
If the API fails or is unavailable:
1. The app automatically falls back to mock data
2. A warning message will appear in the console
3. Features like city search will still work with known cities
4. Historical searches will show mock forecasts

## Live vs Mock Data Indicators

### When Using Live API
- Real-time weather data for any city worldwide
- Accurate hour-by-hour forecasts
- Current air quality measurements
- No artificial delays in loading

### When Using Mock Data
- Pre-populated data for 14 known cities
- Stable/reproducible forecasts for demos
- Instant loading (with artificial 450ms delay for UX)
- Perfect for development and testing

## Integration Code

The app determines live vs mock mode automatically:

```typescript
import { isLiveMode } from '@/services/weatherApi';

if (isLiveMode()) {
  // Use live API
} else {
  // Use mock data
}
```

To check if your setup is working:

```typescript
import { isLiveMode } from '@/services/weatherApi';
console.log('Live mode enabled:', isLiveMode());
```

## Next Steps

1. Get an API key from OpenWeather
2. Add it to `.env.local`
3. Restart the dev server
4. Test with a city search
5. Check browser console for any errors

## Support

For API-specific issues:
- Visit OpenWeather documentation: https://openweathermap.org/api
- Check your API quota: https://openweathermap.org/api/usage/free

For app-specific issues:
- Check browser console for error messages
- Verify the API key is correct
- Ensure the dev server has been restarted after env changes
