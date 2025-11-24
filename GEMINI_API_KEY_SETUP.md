# Gemini API Key Setup

To set up the Gemini API key for the chat agent function:

## Step 1: Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key" or use an existing key
4. Copy the API key

## Step 2: Set the API Key in Firebase Functions Config

Run this command in your terminal:

```bash
firebase functions:config:set gemini.api_key="YOUR_GEMINI_API_KEY"
```

Replace `YOUR_GEMINI_API_KEY` with your actual API key from Step 1.

## Step 3: Verify the Configuration

After setting the key, you can verify it's set correctly:

```bash
firebase functions:config:get
```

You should see `gemini.api_key` in the output.

## Note

- The API key is stored securely in Firebase Functions configuration
- It will be available as `process.env.GEMINI_API_KEY` in your Cloud Functions
- Never commit API keys to version control
- The `config/api-keys.json` file is already in `.gitignore`

## Testing

After deploying your functions, the chat agent will use this API key to call the Gemini API.


