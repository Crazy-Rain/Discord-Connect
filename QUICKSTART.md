# Discord Connect - Quick Start Guide

## Step-by-Step Setup

### 1. Create Your Discord Bot

1. Visit https://discord.com/developers/applications
2. Click "New Application"
3. Name it (e.g., "SillyTavern Bot")
4. Go to "Bot" tab → Click "Add Bot"
5. **Important**: Enable "Message Content Intent" under Privileged Gateway Intents
6. Click "Reset Token" and copy the token (you'll need this later)

### 2. Invite Bot to Your Server

1. Go to "OAuth2" → "URL Generator"
2. Select scopes:
   - `bot`
3. Select permissions:
   - `Send Messages`
   - `Read Messages/View Channels`
   - `Read Message History`
4. Copy the generated URL and paste it in your browser
5. Select your Discord server and authorize

### 3. Get Your Channel ID

1. Open Discord
2. Enable Developer Mode: User Settings → Advanced → Developer Mode
3. Right-click on the channel you want the bot to monitor
4. Click "Copy ID"

### 4. Install & Run

```bash
# Clone or download this repository to your SillyTavern extensions folder
cd /path/to/SillyTavern/public/scripts/extensions
git clone https://github.com/Crazy-Rain/Discord-Connect.git discord-connect

# Install dependencies
cd discord-connect
npm install

# Start the Discord Connect server
npm start
```

You should see:
```
Discord Connect Server running on port 3001
Health check: http://localhost:3001/health
```

### 5. Configure in SillyTavern

1. Open SillyTavern in your browser
2. Click the Extensions icon (puzzle piece) in the top bar
3. Find "Discord Connect" in the list
4. Fill in:
   - **Discord Bot Token**: Paste the token from step 1
   - **Discord Channel ID**: Paste the ID from step 3
   - Check "Auto-reply to Discord messages" if you want automatic responses
5. Click "Connect"

If successful, you'll see status change to "Connected" in green.

### 6. Test It Out!

1. Send a message in your Discord channel
2. The message should appear in SillyTavern's chat
3. The AI will generate a response
4. The response will be sent back to Discord

## Example Conversation Flow

**Discord User**: "Hey bot, what's the weather like?"

↓ *Message appears in SillyTavern as:*

**[Discord - Username]**: "Hey bot, what's the weather like?"

↓ *AI generates response:*

**AI Character**: "I don't have access to real-time weather data, but I'd be happy to discuss what you're planning to do today!"

↓ *Response sent back to Discord:*

**Your Bot**: "I don't have access to real-time weather data, but I'd be happy to discuss what you're planning to do today!"

## Troubleshooting

### "Bot not connecting"
- Double-check your bot token
- Verify Message Content Intent is enabled
- Make sure the bot is invited to your server

### "Messages not showing in SillyTavern"
- Verify the channel ID is correct
- Check that the Discord Connect server is running
- Look for errors in the server console

### "No responses sent to Discord"
- Make sure Auto-reply is enabled
- Check that the bot has Send Messages permission in the channel
- Verify SillyTavern is generating responses normally

## Tips

- You can disable auto-reply and manually send messages to Discord
- The bot will ignore its own messages to prevent loops
- Messages are prefixed with username to show who sent them
- Keep the Discord Connect server running while using the extension

## Security Reminder

⚠️ **Never share your Discord bot token publicly!** It gives full control over your bot.
