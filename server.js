const express = require('express');
const DiscordConnectBot = require('./bot');

/**
 * Discord Connect Server
 * Provides API endpoints for SillyTavern extension to communicate with Discord bot
 */
class DiscordConnectServer {
    constructor(port = 3001) {
        this.app = express();
        this.port = port;
        this.bot = null;
        this.messageQueue = [];
        
        this.setupMiddleware();
        this.setupRoutes();
    }

    setupMiddleware() {
        this.app.use(express.json());
        
        // CORS middleware
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            next();
        });
    }

    setupRoutes() {
        // Start Discord bot
        this.app.post('/api/discord-connect/start', async (req, res) => {
            try {
                const { token, channelId } = req.body;
                
                if (!token || !channelId) {
                    return res.status(400).send('Missing token or channelId');
                }

                // Set environment variables
                process.env.DISCORD_BOT_TOKEN = token;
                process.env.DISCORD_CHANNEL_ID = channelId;

                // Create and start bot if not already running
                if (!this.bot) {
                    this.bot = new DiscordConnectBot();
                    
                    // Register message handler
                    this.bot.onMessage((content, username) => {
                        this.messageQueue.push({ content, username, timestamp: Date.now() });
                    });

                    await this.bot.start();
                }

                res.json({ status: 'connected' });
            } catch (error) {
                console.error('Error starting Discord bot:', error);
                res.status(500).send(error.message);
            }
        });

        // Stop Discord bot
        this.app.post('/api/discord-connect/stop', async (req, res) => {
            try {
                if (this.bot) {
                    await this.bot.stop();
                    this.bot = null;
                    this.messageQueue = [];
                }
                res.json({ status: 'disconnected' });
            } catch (error) {
                console.error('Error stopping Discord bot:', error);
                res.status(500).send(error.message);
            }
        });

        // Get new messages from Discord
        this.app.get('/api/discord-connect/messages', (req, res) => {
            const messages = [...this.messageQueue];
            this.messageQueue = []; // Clear queue after retrieving
            res.json(messages);
        });

        // Send message to Discord
        this.app.post('/api/discord-connect/send', async (req, res) => {
            try {
                const { content } = req.body;
                
                if (!content) {
                    return res.status(400).send('Missing content');
                }

                if (!this.bot) {
                    return res.status(400).send('Bot not connected');
                }

                await this.bot.sendMessage(content);
                res.json({ status: 'sent' });
            } catch (error) {
                console.error('Error sending message to Discord:', error);
                res.status(500).send(error.message);
            }
        });

        // Health check
        this.app.get('/health', (req, res) => {
            res.json({ 
                status: 'ok', 
                botConnected: this.bot !== null && this.bot.isReady 
            });
        });
    }

    /**
     * Start the server
     */
    start() {
        this.app.listen(this.port, () => {
            console.log(`Discord Connect Server running on port ${this.port}`);
            console.log(`Health check: http://localhost:${this.port}/health`);
        });
    }
}

// Start server if run directly
if (require.main === module) {
    const server = new DiscordConnectServer();
    server.start();
}

module.exports = DiscordConnectServer;
