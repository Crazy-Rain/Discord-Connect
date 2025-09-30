# Troubleshooting Guide

## Common Issues and Solutions

### 1. CSRF Token Error (ForbiddenError: Invalid CSRF token)

#### Symptom
- Error message in SillyTavern console: "ForbiddenError: Invalid CSRF token. Please refresh the page and try again."
- Settings (bot token and channel ID) are wiped when page is refreshed
- "Failed to connect to Discord" error despite correct configuration

#### Solution
This issue has been **fixed in the latest version** of the extension. The extension now properly includes CSRF tokens in all API requests to SillyTavern.

**If you're still experiencing this issue:**
1. Update to the latest version of the Discord Connect extension
2. Clear your browser cache
3. Refresh the SillyTavern page (Ctrl+Shift+R or Cmd+Shift+R)
4. Re-enter your bot token and channel ID

**Technical Details:**
The extension now uses SillyTavern's `getRequestHeaders()` function which automatically includes the required CSRF token for all API calls. This ensures settings are properly saved and persist across page refreshes.

### 2. Bot Won't Connect

#### Symptom
Clicking "Connect" shows error message or status stays "Disconnected"

#### Possible Causes & Solutions

**A. Invalid Bot Token**
- Check token was copied correctly (no extra spaces)
- Verify token hasn't been reset in Discord Developer Portal
- Try resetting token and using the new one

**B. Missing Message Content Intent**
- Go to Discord Developer Portal
- Select your application
- Go to "Bot" tab
- Scroll to "Privileged Gateway Intents"
- Enable "Message Content Intent"
- Save changes and reconnect

**C. Bot Not Invited to Server**
- Generate new invite URL from OAuth2 page
- Make sure `bot` scope is selected
- Select required permissions
- Open URL and invite to your server

**D. Server Not Running**
```bash
# Check if server is running
curl http://localhost:3001/health

# If not running, start it
cd /path/to/discord-connect
npm start
```

### 3. Messages Not Appearing in SillyTavern

#### Symptom
Messages sent in Discord don't show up in SillyTavern chat

#### Possible Causes & Solutions

**A. Wrong Channel ID**
- Enable Developer Mode in Discord (Settings > Advanced)
- Right-click the channel and copy ID
- Verify it matches the ID in settings
- Disconnect and reconnect with correct ID

**B. Bot Lacks Permissions**
- Check bot has "Read Messages" permission in channel
- Check bot has "View Channel" permission
- Right-click channel > Edit Channel > Permissions
- Check @everyone or bot role has proper permissions

**C. Messages Are From Bot**
- Bot ignores its own messages to prevent loops
- Test with a different user account

**D. Auto-Reply Disabled**
- If you want automatic responses, enable "Auto-reply" in settings

### 4. Responses Not Sent to Discord

#### Symptom
AI generates response in SillyTavern but doesn't appear in Discord

#### Possible Causes & Solutions

**A. Bot Lacks Send Permission**
- Right-click channel > Edit Channel > Permissions
- Ensure bot has "Send Messages" permission

**B. Auto-Reply Disabled**
- Check "Auto-reply to Discord messages" is enabled
- Or manually use the send function

**C. Connection Dropped**
- Check status indicator shows "Connected"
- If not, reconnect
- Check server console for errors

**D. Rate Limiting**
- Discord has rate limits on message sending
- Wait a few seconds between messages
- Check server console for rate limit warnings

### 5. Server Won't Start

#### Symptom
`npm start` fails or server crashes immediately

#### Possible Causes & Solutions

**A. Port Already in Use**
```bash
# Check what's using port 3001
lsof -i :3001
# or on Windows
netstat -ano | findstr :3001

# Kill the process or change port in server.js
```

**B. Missing Dependencies**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**C. Node.js Version**
```bash
# Check Node version (need 16+)
node --version

# Update if needed
```

### 6. Extension Not Loading in SillyTavern

#### Symptom
Discord Connect doesn't appear in extensions list

#### Possible Causes & Solutions

**A. Wrong Location**
- Extension must be in `SillyTavern/public/scripts/extensions/discord-connect/`
- Not in a subfolder
- Check folder name is exactly `discord-connect`

**B. Missing manifest.json**
- Verify `manifest.json` exists
- Check it's valid JSON
```bash
cat manifest.json | python3 -m json.tool
```

**C. SillyTavern Needs Restart**
- Stop SillyTavern
- Clear browser cache
- Restart SillyTavern
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### 7. Settings Not Saving

#### Symptom
Configuration values reset after reload

#### Possible Causes & Solutions

**A. CSRF Token Issue (Fixed in latest version)**
- This was a known issue where the extension didn't include CSRF tokens in API calls
- **Solution**: Update to the latest version of the extension
- The extension now properly uses `getRequestHeaders()` for all SillyTavern API calls

**B. SillyTavern Settings API Issue**
- Check SillyTavern console for errors
- Verify SillyTavern has write permissions in its directory

**C. Browser Blocking**
- Check browser console for errors
- Try different browser
- Disable browser extensions that might interfere

### 8. High CPU/Memory Usage

#### Symptom
Server or extension using excessive resources

#### Possible Causes & Solutions

**A. Polling Too Frequent**
- Edit `index.js`, find `setInterval(async () => {`
- Change interval from 1000ms to 2000ms or 3000ms

**B. Message Queue Buildup**
- Restart server to clear queue
- Fix underlying issue preventing message processing

**C. Memory Leak**
- Restart server periodically
- Report issue on GitHub

### 9. Messages Duplicated

#### Symptom
Same message appears multiple times

#### Possible Causes & Solutions

**A. Multiple Extension Instances**
- Check only one Discord Connect extension is installed
- Disable duplicates in extension manager

**B. Multiple Server Instances**
- Kill all server processes
- Start only one instance
```bash
# Find and kill
ps aux | grep "node server.js"
kill <pid>
```

### 10. Characters Not Responding

#### Symptom
Messages appear but AI doesn't generate response

#### Possible Causes & Solutions

**A. No Character Selected**
- Select a character in SillyTavern
- Start a chat before connecting Discord

**B. AI API Issue**
- Test AI response manually in SillyTavern
- Check AI API configuration (OpenAI, KoboldAI, etc.)
- Verify API keys and endpoints

**C. Auto-Reply Disabled**
- Enable auto-reply in Discord Connect settings

### 11. Connection Keeps Dropping

#### Symptom
Status changes from Connected to Disconnected randomly

#### Possible Causes & Solutions

**A. Network Issues**
- Check internet connection
- Try different network
- Check Discord API status

**B. Token Invalidated**
- Reset token in Discord Developer Portal
- Update token in settings
- Reconnect

**C. Server Timeout**
- Check server logs for errors
- Increase timeout values if applicable
- Check system resources

## Debug Mode

### Enable Detailed Logging

**In bot.js**, add after line 1:
```javascript
process.env.DEBUG = 'discord:*';
```

**In browser console**, check extension logs:
```javascript
// See all console messages
console.log = console.log;
```

**In server.js**, add detailed logging:
```javascript
// Add at top of each route
console.log('Request received:', req.method, req.path, req.body);
```

## Getting Help

If you can't resolve your issue:

1. **Check Logs**
   - Server console output
   - Browser developer console
   - SillyTavern console

2. **Gather Information**
   - What were you trying to do?
   - What happened instead?
   - Any error messages?
   - Steps to reproduce

3. **Test Basic Functionality**
   ```bash
   # Test server health
   curl http://localhost:3001/health
   
   # Test bot connection (with valid token)
   curl -X POST http://localhost:3001/api/discord-connect/start \
     -H "Content-Type: application/json" \
     -d '{"token":"YOUR_TOKEN","channelId":"YOUR_CHANNEL_ID"}'
   ```

4. **Open GitHub Issue**
   - Include error messages
   - Include relevant logs
   - Describe your setup (OS, Node version, etc.)
   - Remove sensitive info (tokens, IDs)

## Testing Checklist

Use this to verify everything works:

- [ ] Server starts without errors
- [ ] Health endpoint returns `{"status":"ok"}`
- [ ] Extension appears in SillyTavern
- [ ] Settings can be entered and saved
- [ ] Connect button changes status
- [ ] Test message in Discord appears in ST
- [ ] AI response appears in Discord
- [ ] Disconnect button works
- [ ] Reconnect works
- [ ] No errors in console

## Quick Fixes

### Reset Everything
```bash
# Stop server
# Kill all node processes related to this

# Clear settings in SillyTavern
# Extension settings > Discord Connect > Clear all fields

# Restart server
cd /path/to/discord-connect
npm start

# Reconfigure from scratch
```

### Fresh Install
```bash
# Remove extension
rm -rf /path/to/SillyTavern/public/scripts/extensions/discord-connect

# Clone again
cd /path/to/SillyTavern/public/scripts/extensions
git clone https://github.com/Crazy-Rain/Discord-Connect.git discord-connect

# Install dependencies
cd discord-connect
npm install

# Start server
npm start
```
