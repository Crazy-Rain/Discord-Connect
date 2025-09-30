# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] - 2025-01-XX

### Added
- **Manual Controls**: Added manual buttons for better control over Discord integration
  - "Send Last AI Response" button - Manually send the most recent AI response to Discord
  - "Fetch Last Discord Message" button - Manually retrieve and display the latest message from the Discord channel
  - Both buttons provide user feedback via toast notifications
- Last message tracking to enable manual operations
  - `lastAIResponse` variable stores the most recent AI-generated message
  - `lastDiscordMessage` variable stores the most recent Discord channel message

### Changed
- Enhanced UI with a "Manual Controls" section in the settings panel
- AI responses are now tracked even when auto-reply is disabled
- Improved user experience with informative toast messages for manual actions

## [1.0.1] - 2025-01-XX

### Fixed
- **Critical**: Fixed CSRF token error that prevented settings from being saved
  - Extension now properly uses `getRequestHeaders()` for all SillyTavern API calls
  - Settings (bot token and channel ID) now persist correctly after page refresh
  - Resolves "ForbiddenError: Invalid CSRF token" error in SillyTavern console
- Connection state (enabled/disabled) now properly saved and restored
  - `connectDiscord()` sets and saves enabled state
  - `disconnectDiscord()` sets and saves disabled state

### Changed
- Updated `loadSettings()` to include CSRF token headers
- Updated `saveSettings()` to include CSRF token headers
- Enhanced troubleshooting documentation with CSRF error resolution

## [1.0.0] - 2025-09-30

### Added
- Initial release of Discord Connect extension for SillyTavern
- Discord bot integration using discord.js v14
- SillyTavern extension with UI for configuration
- Bidirectional message flow between Discord and SillyTavern
- Auto-reply functionality for AI responses
- Express server API for managing Discord bot
- Configuration via environment variables and UI
- Comprehensive documentation including:
  - README with full setup instructions
  - QUICKSTART guide for easy onboarding
  - EXAMPLES with multiple use cases
  - API endpoint documentation
- Basic test suite for validation
- Security features:
  - Bot message loop prevention
  - Token security with .env support
  - .gitignore for sensitive files

### Features
- Read messages from Discord channel
- Forward Discord messages to SillyTavern chat
- Send AI responses back to Discord
- Configurable auto-reply mode
- Support for multiple users in Discord channel
- Username tracking in messages
- Health check endpoint for monitoring
- Message queue system for reliable delivery

### Technical Details
- Node.js backend with Express
- Discord.js v14 for Discord API
- SillyTavern extension system integration
- RESTful API design
- Real-time message polling
- Error handling and logging
