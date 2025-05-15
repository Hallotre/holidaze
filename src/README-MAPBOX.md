# Setting up MapBox for Address Autocomplete

This project uses MapBox for address autocomplete functionality in the venue registration form. Follow these steps to set it up:

## 1. Create a MapBox Account

If you don't already have a MapBox account, you can create one for free at [mapbox.com](https://www.mapbox.com/).

## 2. Get Your Access Token

1. After signing up, navigate to your MapBox account dashboard
2. Find your Access Token (or create a new one with the appropriate permissions)
3. Copy the token for use in the next step

## 3. Add the Token to Your Environment

Create a `.env.local` file in the root of your project (if it doesn't already exist) and add the following line:

```
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here
```

Replace `your_mapbox_access_token_here` with your actual MapBox access token.

## 4. Restart Your Development Server

After adding the token, restart your development server for the changes to take effect:

```
npm run dev
```

## 5. Test the Functionality

The address autocomplete should now be working in the venue registration form. When you start typing an address in the "Address" field, suggestions should appear.

## Troubleshooting

### If the autocomplete functionality isn't working:

1. Check the browser console for errors
2. Verify that your token is correct and has the necessary permissions
3. Make sure the `.env.local` file is in the root directory of the project
4. Ensure you've restarted the development server after adding the token

### "document is not defined" error:

If you encounter a "document is not defined" error, this is likely because MapBox is attempting to access browser-only APIs during server-side rendering. The current implementation should handle this by:

1. Using dynamic imports to load MapBox components only on the client side
2. Adding a client-side check before rendering the MapBox component
3. Providing a fallback input component for server-side rendering

If you're still experiencing this error, try clearing your Next.js cache and restarting the development server:

```
# Clear Next.js cache
rm -rf .next

# Restart the development server
npm run dev
```

### Other fixes that may help if problems persist:

1. Make sure you're using the latest version of MapBox packages
2. Check if there are any conflicts with other packages in your project
3. Verify that the MapBox component is only being rendered on the client side
4. Try using a different browser to rule out browser-specific issues 