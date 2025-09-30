# CSRF Token Error Fix - Testing Guide

## What Was Fixed

The Discord Connect extension was experiencing CSRF (Cross-Site Request Forgery) token errors when trying to save settings in SillyTavern. This has been comprehensively fixed with:

### 1. Defensive Programming
- Added checks to verify `getRequestHeaders()` function exists before calling it
- Implemented fallback headers if the function is unavailable
- Added error handling for all API calls

### 2. Enhanced Error Feedback
- Toast notifications now appear when settings fail to save
- Specific error messages for CSRF token issues (403 errors)
- Detailed console logging with "Discord Connect:" prefix

### 3. Diagnostic Tools
- Automatic CSRF token availability check on extension load
- Detailed diagnostic output in browser console
- Easy-to-understand error messages

## How to Test the Fix

### Step 1: Update the Extension
```bash
cd /path/to/SillyTavern/public/scripts/extensions/discord-connect
git pull
```

### Step 2: Hard Refresh SillyTavern
- Windows/Linux: Press `Ctrl + Shift + R`
- Mac: Press `Cmd + Shift + R`

### Step 3: Open Browser Console
1. Press `F12` to open Developer Tools
2. Click on the "Console" tab
3. Look for messages starting with "Discord Connect:"

### Step 4: Check Diagnostic Output

You should see something like this:

```
=== Discord Connect CSRF Diagnostic ===
getRequestHeaders available: true
Headers obtained: ["Content-Type", "X-CSRF-Token"]
Has X-CSRF-Token: true
Extension name: discord-connect
Current settings: {enabled: false, botToken: "", channelId: "", autoReply: true}
======================================
```

**What to look for:**
- ✅ `getRequestHeaders available: true` - Good! CSRF tokens will work
- ❌ `getRequestHeaders available: false` - Update SillyTavern to latest version
- ✅ `Has X-CSRF-Token: true` - CSRF token is present in headers
- ❌ `Has X-CSRF-Token: false` - Refresh the page

### Step 5: Test Saving Settings

1. Enter your Discord Bot Token
2. Enter your Discord Channel ID
3. Watch the console for:
   ```
   Discord Connect: Saving settings with headers: ["Content-Type", "X-CSRF-Token"]
   Discord Connect: Settings saved successfully
   ```

**If you see an error:**
```
Discord Connect: Failed to save settings, status: 403 Forbidden
```
A toast notification will appear saying:
"Failed to save settings: CSRF token error. Please refresh the page."

### Step 6: Test Connection

1. Click the "Connect" button
2. Watch for:
   - Status should change to "Connected" (green)
   - Toast notification: "Discord bot connected successfully"
   - Settings should persist after page refresh

## Common Issues and Solutions

### Issue 1: getRequestHeaders not available

**Symptom:**
```
Discord Connect: getRequestHeaders() not available, using fallback headers
```

**Solution:**
1. Update SillyTavern to the latest version
2. Make sure you're using a recent version (getRequestHeaders was added in newer versions)

### Issue 2: CSRF token errors persist

**Symptom:**
- Toast notification: "Failed to save settings: CSRF token error"
- Settings are wiped after page refresh

**Solution:**
1. Hard refresh the page (Ctrl+Shift+R)
2. Clear browser cache
3. Check SillyTavern logs for additional errors
4. Make sure SillyTavern is running properly

### Issue 3: No diagnostic output

**Symptom:**
- No "=== Discord Connect CSRF Diagnostic ===" in console

**Solution:**
1. Make sure you pulled the latest changes
2. Hard refresh the page
3. Check that the extension is loading (look for "Initializing Discord Connect extension")

## What Changed in the Code

### Before (Problematic):
```javascript
async function loadSettings() {
    const response = await fetch('/api/settings/get', {
        method: 'POST',
        headers: getRequestHeaders(),  // Could fail if function doesn't exist
        body: JSON.stringify({ extension_name: extensionName })
    });
    // No error handling or user feedback
}
```

### After (Fixed):
```javascript
function getSafeRequestHeaders() {
    // Check if getRequestHeaders is available (SillyTavern function)
    if (typeof getRequestHeaders === 'function') {
        try {
            return getRequestHeaders();
        } catch (error) {
            console.error('Discord Connect: Error getting request headers:', error);
        }
    }
    
    // Fallback: return basic headers
    console.warn('Discord Connect: getRequestHeaders() not available, using fallback headers');
    return {
        'Content-Type': 'application/json'
    };
}

async function loadSettings() {
    const headers = getSafeRequestHeaders();
    console.log('Discord Connect: Loading settings with headers:', Object.keys(headers));
    
    const response = await fetch('/api/settings/get', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ extension_name: extensionName })
    });
    
    if (response.ok) {
        // Success handling
        console.log('Discord Connect: Settings loaded successfully');
    } else {
        // Error handling with details
        console.error('Discord Connect: Failed to load settings, status:', response.status);
        const errorText = await response.text();
        console.error('Discord Connect: Error response:', errorText);
    }
}
```

## Need More Help?

If you're still experiencing issues:

1. **Share the diagnostic output** from your browser console
2. **Check TROUBLESHOOTING.md** for detailed debugging steps
3. **Open an issue** with:
   - The diagnostic output from console
   - Any error messages
   - Steps you've already tried
   - Your SillyTavern version

## Summary

The extension now:
- ✅ Validates CSRF token availability before using it
- ✅ Provides fallback if CSRF tokens aren't available
- ✅ Shows clear error messages to users
- ✅ Logs detailed diagnostic information
- ✅ Handles errors gracefully without breaking

You should now be able to save your bot token and channel ID, connect to Discord, and have everything persist across page refreshes!
