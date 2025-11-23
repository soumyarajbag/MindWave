# Gemini API Setup Guide

## Fixing "Model Not Found" Error

The error `models/gemini-pro is not found` occurs because Google has updated their Gemini API and deprecated the old `gemini-pro` model.

## Solution

The code has been updated to automatically try these models in order:

1. **`gemini-1.5-flash`** (Recommended - Fast and efficient)
2. **`gemini-1.5-pro`** (More capable but slower)
3. **`gemini-pro`** (Legacy - may not be available)

The app will automatically try each model until one works.

## Available Models

To check which models are available for your API key, you can run:

```bash
curl "https://generativelanguage.googleapis.com/v1/models?key=YOUR_API_KEY" | jq '.models[].name'
```

Replace `YOUR_API_KEY` with your actual Gemini API key.

## Manual Model Selection

You can also specify a model in your `.env.local` file:

```env
NEXT_PUBLIC_GEMINI_MODEL=gemini-1.5-flash
```

Available options:

- `gemini-1.5-flash` - Fast, efficient (recommended for most use cases)
- `gemini-1.5-pro` - More capable, better for complex tasks
- `gemini-1.5-pro-latest` - Latest version of 1.5-pro
- `gemini-pro` - Legacy (may not work)

## Current Status

✅ **Fixed**: The code now automatically tries multiple models
✅ **Fallback**: If all models fail, the app provides default responses
✅ **Error Handling**: Better error messages and graceful degradation

## Testing

1. Restart your dev server: `npm run dev`
2. Try chatting with the AI companion
3. Check browser console for any warnings (they're normal if a model isn't available)
4. The app should automatically use the first available model

## Troubleshooting

### Still Getting Errors?

1. **Check API Key**: Verify your `NEXT_PUBLIC_GEMINI_API_KEY` is correct
2. **Check Quota**: Make sure you haven't exceeded your API quota
3. **Check Region**: Some models may not be available in all regions
4. **Update SDK**: Run `npm install @google/generative-ai@latest`

### Model Not Available in Your Region?

If `gemini-1.5-flash` isn't available, the code will automatically try `gemini-1.5-pro`. If that also fails, it will try the legacy `gemini-pro` model.

### All Models Failing?

If all models fail:

- The AI companion will show an error message
- Other features (mood detection, recommendations) will still work
- Weekly insights will use default data instead of AI-generated insights

## Need Help?

- Check [Google AI Studio](https://makersuite.google.com/app/apikey) for API status
- Review [Gemini API Documentation](https://ai.google.dev/gemini-api/docs)
- Check your API key permissions in Google Cloud Console
