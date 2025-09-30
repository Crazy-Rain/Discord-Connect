# Discord Connect - Architecture

## System Overview

```
┌──────────────────┐
│  Discord Server  │
│   (Channel)      │
└────────┬─────────┘
         │
         │ Discord API
         │
    ┌────▼──────────────┐
    │   Discord Bot     │
    │   (bot.js)        │
    │                   │
    │  - Reads messages │
    │  - Sends messages │
    └────┬──────────────┘
         │
         │ Event Handlers
         │
    ┌────▼──────────────┐
    │  Express Server   │
    │  (server.js)      │
    │                   │
    │  - API Endpoints  │
    │  - Message Queue  │
    └────┬──────────────┘
         │
         │ REST API
         │
    ┌────▼──────────────┐
    │  ST Extension     │
    │  (index.js)       │
    │                   │
    │  - UI Controls    │
    │  - Message Poll   │
    └────┬──────────────┘
         │
         │ Extension API
         │
    ┌────▼──────────────┐
    │   SillyTavern     │
    │                   │
    │  - Chat Display   │
    │  - AI Generation  │
    └───────────────────┘
```

## Component Details

### 1. Discord Bot (`bot.js`)
**Purpose**: Interface with Discord API

**Responsibilities**:
- Authenticate with Discord using bot token
- Listen for messages in configured channel
- Send messages to Discord channel
- Ignore bot's own messages (prevent loops)

**Key Methods**:
- `onMessage(handler)` - Register message callback
- `sendMessage(content)` - Send to Discord
- `start()` - Initialize connection
- `stop()` - Disconnect

### 2. Express Server (`server.js`)
**Purpose**: Bridge between Discord bot and SillyTavern

**Responsibilities**:
- Manage Discord bot lifecycle
- Queue incoming Discord messages
- Provide REST API for extension
- Handle CORS for cross-origin requests

**API Endpoints**:
- `POST /api/discord-connect/start` - Start bot
- `POST /api/discord-connect/stop` - Stop bot
- `GET /api/discord-connect/messages` - Get queued messages
- `POST /api/discord-connect/send` - Send to Discord
- `GET /health` - Health check

### 3. SillyTavern Extension (`index.js`)
**Purpose**: UI and integration with SillyTavern

**Responsibilities**:
- Provide configuration interface
- Poll for new Discord messages
- Insert messages into chat
- Send AI responses to Discord
- Manage connection state

**Key Functions**:
- `loadSettings()` - Load saved config
- `connectDiscord()` - Start connection
- `handleDiscordMessage()` - Process incoming
- `sendToDiscord()` - Send outgoing

### 4. UI Components (`style.css`)
**Purpose**: Visual styling

**Elements**:
- Settings panel
- Connection status indicator
- Configuration inputs
- Connect/Disconnect button

## Data Flow

### Incoming (Discord → SillyTavern)

```
1. User sends message in Discord channel
   ↓
2. Discord API delivers to bot via WebSocket
   ↓
3. bot.js processes messageCreate event
   ↓
4. Message added to server.js queue
   ↓
5. Extension polls /messages endpoint
   ↓
6. Message inserted into ST chat
   ↓
7. AI generates response (if auto-reply enabled)
```

### Outgoing (SillyTavern → Discord)

```
1. AI generates response in SillyTavern
   ↓
2. Extension catches message_sent event
   ↓
3. POST to /api/discord-connect/send
   ↓
4. server.js calls bot.sendMessage()
   ↓
5. bot.js sends via Discord API
   ↓
6. Message appears in Discord channel
```

## Configuration Flow

```
┌─────────────────────┐
│  User enters config │
│  in ST UI           │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Settings saved     │
│  via ST API         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  User clicks        │
│  "Connect"          │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  POST /start with   │
│  token & channel ID │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Server sets env    │
│  vars and starts    │
│  Discord bot        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Bot connects to    │
│  Discord API        │
└─────────────────────┘
```

## Security Model

### Token Storage
- Tokens stored in SillyTavern settings database
- Never logged or exposed in responses
- .env used for standalone server mode

### Message Validation
- Bot ignores its own messages
- Only processes messages from configured channel
- User authentication via Discord API

### CORS Policy
- Server accepts all origins (for local dev)
- Should be restricted in production
- SillyTavern runs on localhost by default

## Deployment Models

### Model 1: Extension in SillyTavern (Recommended)
```
SillyTavern/
└── public/
    └── scripts/
        └── extensions/
            └── discord-connect/
                ├── bot.js
                ├── server.js
                ├── index.js
                └── ...
```

**Usage**: Start server separately, load extension in ST

### Model 2: Standalone Server
```
/opt/discord-connect/
├── bot.js
├── server.js
└── .env
```

**Usage**: Run as background service, configure ST to connect

## Performance Considerations

### Message Polling
- Default: 1 second interval
- Adjustable based on traffic
- Trade-off: responsiveness vs. API calls

### Queue Management
- Messages cleared after retrieval
- Prevents memory buildup
- Lost if server crashes (not persistent)

### Connection Pooling
- Single bot instance per server
- Reuses Discord WebSocket connection
- Reconnects on disconnect

## Error Handling

### Connection Failures
- Bot login failures logged
- Extension shows error toast
- Status updated to disconnected

### Message Send Failures
- Logged to console
- Don't block chat flow
- User not notified (silent fail)

### API Errors
- HTTP status codes returned
- Extension handles gracefully
- Retry logic not implemented

## Future Enhancements

Potential improvements:
- [ ] Persistent message queue (database)
- [ ] Multiple channel support
- [ ] Message filtering/commands
- [ ] Rich embeds support
- [ ] Attachment handling
- [ ] WebSocket instead of polling
- [ ] Multi-server support
- [ ] Rate limiting
- [ ] Message history sync
