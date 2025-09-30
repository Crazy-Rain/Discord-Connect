require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

/**
 * Discord bot that bridges Discord messages to SillyTavern
 */
class DiscordConnectBot {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        });

        this.channelId = process.env.DISCORD_CHANNEL_ID;
        this.messageHandlers = [];
        this.isReady = false;

        this.setupEventHandlers();
    }

    /**
     * Set up Discord client event handlers
     */
    setupEventHandlers() {
        this.client.once('ready', () => {
            console.log(`Discord bot logged in as ${this.client.user.tag}`);
            this.isReady = true;
        });

        this.client.on('messageCreate', async (message) => {
            // Ignore bot messages to prevent loops
            if (message.author.bot) return;

            // Only process messages from the configured channel
            if (message.channel.id !== this.channelId) return;

            console.log(`Discord message received: ${message.content}`);

            // Call all registered message handlers
            for (const handler of this.messageHandlers) {
                try {
                    await handler(message.content, message.author.username);
                } catch (error) {
                    console.error('Error in message handler:', error);
                }
            }
        });

        this.client.on('error', (error) => {
            console.error('Discord client error:', error);
        });
    }

    /**
     * Register a callback to handle incoming Discord messages
     * @param {Function} handler - Callback function (message, username) => void
     */
    onMessage(handler) {
        this.messageHandlers.push(handler);
    }

    /**
     * Send a message to the configured Discord channel
     * @param {string} content - Message content to send
     * @returns {Promise<void>}
     */
    async sendMessage(content) {
        if (!this.isReady) {
            console.warn('Discord bot not ready yet');
            return;
        }

        try {
            const channel = await this.client.channels.fetch(this.channelId);
            if (channel && channel.isTextBased()) {
                await channel.send(content);
                console.log('Message sent to Discord:', content);
            } else {
                console.error('Channel not found or not text-based');
            }
        } catch (error) {
            console.error('Error sending message to Discord:', error);
        }
    }

    /**
     * Start the Discord bot
     * @returns {Promise<void>}
     */
    async start() {
        const token = process.env.DISCORD_BOT_TOKEN;
        
        if (!token) {
            throw new Error('DISCORD_BOT_TOKEN not set in environment variables');
        }

        if (!this.channelId) {
            throw new Error('DISCORD_CHANNEL_ID not set in environment variables');
        }

        try {
            await this.client.login(token);
            console.log('Discord bot started successfully');
        } catch (error) {
            console.error('Failed to start Discord bot:', error);
            throw error;
        }
    }

    /**
     * Stop the Discord bot
     */
    async stop() {
        if (this.client) {
            await this.client.destroy();
            this.isReady = false;
            console.log('Discord bot stopped');
        }
    }
}

module.exports = DiscordConnectBot;
