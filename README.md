# Discord-Connect

A SillyTavern extension that connects Discord to SillyTavern, allowing you to:
- Read messages from a Discord channel and forward them to SillyTavern
- Send AI-generated responses back to Discord automatically
- Bridge conversations between Discord users and SillyTavern AI characters

## Features

- 🤖 **Discord Bot Integration**: Connect a Discord bot to read and send messages in a specific channel
- 💬 **Bidirectional Communication**: Messages flow from Discord to SillyTavern and AI responses go back to Discord
- ⚙️ **Auto-Reply**: Optionally enable automatic AI responses to Discord messages
- 🎛️ **Easy Configuration**: Simple UI in SillyTavern's extension settings
- 🔘 **Manual Controls**: Send last AI response or fetch last Discord message with dedicated buttons

## Architecture

This extension consists of two main components:

1. **SillyTavern Extension** (`index.js`, `manifest.json`, `style.css`) - The frontend extension that integrates with SillyTavern's UI
2. **Discord Connect Server** (`server.js`, `bot.js`) - A backend server that manages the Discord bot connection

## Prerequisites

- Node.js (v16 or higher)
- SillyTavern installed and running
- A Discord Bot Token (see setup instructions below)
- Discord Channel ID where the bot will operate

## Setup Instructions

### 1. Create a Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to the "Bot" tab and click "Add Bot"
4. Under "Privileged Gateway Intents", enable:
   - Message Content Intent
   - Server Members Intent (optional)
5. Click "Reset Token" and copy your bot token (save it securely)
6. Go to "OAuth2" > "URL Generator"
7. Select scopes: `bot`
8. Select bot permissions: `Send Messages`, `Read Messages/View Channels`, `Read Message History`
9. Copy the generated URL and open it in your browser to invite the bot to your server

### 2. Get Your Discord Channel ID

1. Enable Developer Mode in Discord (User Settings > Advanced > Developer Mode)
2. Right-click on the channel you want to use and select "Copy ID"

### 3. Install the Extension

#### Option A: Install in SillyTavern Extensions Folder

```bash
cd /path/to/SillyTavern/public/scripts/extensions
git clone https://github.com/Crazy-Rain/Discord-Connect.git discord-connect
cd discord-connect
npm install
```

#### Option B: Manual Installation

1. Download this repository
2. Copy the entire folder to `SillyTavern/public/scripts/extensions/discord-connect`
3. Run `npm install` in the extension folder

### 4. Start the Discord Connect Server

```bash
cd /path/to/SillyTavern/public/scripts/extensions/discord-connect
npm start
```

The server will start on port 3001 by default.

### 5. Configure in SillyTavern

1. Start SillyTavern
2. Go to Extensions (puzzle icon in the top bar)
3. Find "Discord Connect" in the extensions list
4. Enter your Discord Bot Token
5. Enter your Discord Channel ID
6. Enable "Auto-reply to Discord messages" if desired
7. Click "Connect"

## Usage

Once connected:

1. **Discord to SillyTavern**: Any message sent in the configured Discord channel (by non-bot users) will appear in your SillyTavern chat
2. **SillyTavern to Discord**: AI responses generated in SillyTavern will automatically be sent back to the Discord channel

### Auto-Reply Mode

When "Auto-reply to Discord messages" is enabled:
- Every message from Discord automatically triggers an AI response
- The AI response is automatically sent back to Discord

### Manual Controls

The extension provides manual buttons for fine-grained control:

1. **Send Last AI Response**
   - Manually send the most recent AI-generated message to Discord
   - Useful when auto-reply is disabled
   - Shows a confirmation toast when successful

2. **Fetch Last Discord Message**
   - Manually retrieve and display the latest message from the Discord channel
   - Adds the message to your SillyTavern chat
   - Useful for checking for new messages on demand

These manual controls are always available in the extension settings panel.

### Example Workflow

1. User sends message in Discord: "Hello, how are you?"
2. Message appears in SillyTavern chat as: "[Discord - Username]: Hello, how are you?"
3. SillyTavern AI generates a response
4. The response is automatically sent back to the Discord channel

## Configuration

### Environment Variables

You can also configure the bot using a `.env` file (copy from `.env.example`):

```env
DISCORD_BOT_TOKEN=your_discord_bot_token_here
DISCORD_CHANNEL_ID=your_discord_channel_id_here
SILLYTAVERN_API_URL=http://localhost:8000
```

### Server Port

To change the server port, modify the `server.js` file:

```javascript
const server = new DiscordConnectServer(3001); // Change port here
```

## API Endpoints

The Discord Connect Server provides the following endpoints:

- `POST /api/discord-connect/start` - Start the Discord bot
- `POST /api/discord-connect/stop` - Stop the Discord bot
- `GET /api/discord-connect/messages` - Get new messages from Discord
- `POST /api/discord-connect/send` - Send a message to Discord
- `GET /health` - Health check endpoint

## Troubleshooting

### Bot doesn't connect
- Verify your bot token is correct
- Ensure the bot has been invited to your Discord server
- Check that Message Content Intent is enabled in the Discord Developer Portal

### Messages not appearing in SillyTavern
- Verify the channel ID is correct
- Make sure the bot has permission to read messages in the channel
- Check the server console for errors

### Responses not sent to Discord
- Ensure the bot has permission to send messages in the channel
- Check that auto-reply is enabled in the extension settings
- Verify the Discord Connect Server is running

## Development

### Running in Development Mode

```bash
npm run dev
```

### File Structure

```
discord-connect/
├── bot.js              # Discord bot logic
├── server.js           # Express server for API
├── index.js            # SillyTavern extension frontend
├── manifest.json       # Extension metadata
├── style.css           # Extension styles
├── package.json        # Node.js dependencies
├── .env.example        # Environment variables template
└── README.md          # This file
```

## Security Notes

- Never commit your `.env` file or share your bot token
- The bot token provides full access to your Discord bot
- Consider using environment variables or secure storage for tokens in production

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Credits

Created by Crazy-Rain
