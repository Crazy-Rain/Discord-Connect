/**
 * Discord Connect Extension for SillyTavern
 * Bridges Discord messages to SillyTavern and sends AI responses back to Discord
 */

(async function() {
    'use strict';

    const extensionName = 'discord-connect';
    const extensionFolderPath = `scripts/extensions/${extensionName}`;
    
    let discordBotProcess = null;
    let isConnected = false;
    let settings = {
        enabled: false,
        botToken: '',
        channelId: '',
        autoReply: true
    };

    /**
     * Load extension settings
     */
    async function loadSettings() {
        try {
            const response = await fetch('/api/settings/get', {
                method: 'POST',
                headers: getRequestHeaders(),
                body: JSON.stringify({ extension_name: extensionName })
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.settings) {
                    settings = { ...settings, ...data.settings };
                }
            }
        } catch (error) {
            console.error('Failed to load Discord Connect settings:', error);
        }
    }

    /**
     * Save extension settings
     */
    async function saveSettings() {
        try {
            await fetch('/api/settings/set', {
                method: 'POST',
                headers: getRequestHeaders(),
                body: JSON.stringify({
                    extension_name: extensionName,
                    settings: settings
                })
            });
        } catch (error) {
            console.error('Failed to save Discord Connect settings:', error);
        }
    }

    /**
     * Start Discord bot connection
     */
    async function connectDiscord() {
        if (isConnected) {
            console.log('Discord bot already connected');
            return;
        }

        if (!settings.botToken || !settings.channelId) {
            toastr.error('Please configure bot token and channel ID first', 'Discord Connect');
            return;
        }

        try {
            // Call backend to start Discord bot
            const response = await fetch('/api/discord-connect/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: settings.botToken,
                    channelId: settings.channelId
                })
            });

            if (response.ok) {
                isConnected = true;
                settings.enabled = true;
                await saveSettings();
                updateConnectionStatus();
                toastr.success('Discord bot connected successfully', 'Discord Connect');
                
                // Start polling for messages
                startMessagePolling();
            } else {
                const error = await response.text();
                throw new Error(error);
            }
        } catch (error) {
            console.error('Failed to connect Discord bot:', error);
            toastr.error('Failed to connect to Discord', 'Discord Connect');
        }
    }

    /**
     * Stop Discord bot connection
     */
    async function disconnectDiscord() {
        if (!isConnected) {
            return;
        }

        try {
            await fetch('/api/discord-connect/stop', {
                method: 'POST'
            });
            
            isConnected = false;
            settings.enabled = false;
            await saveSettings();
            updateConnectionStatus();
            toastr.info('Discord bot disconnected', 'Discord Connect');
        } catch (error) {
            console.error('Failed to disconnect Discord bot:', error);
        }
    }

    /**
     * Poll for new Discord messages
     */
    let pollingInterval = null;
    function startMessagePolling() {
        if (pollingInterval) {
            clearInterval(pollingInterval);
        }

        pollingInterval = setInterval(async () => {
            if (!isConnected) {
                clearInterval(pollingInterval);
                return;
            }

            try {
                const response = await fetch('/api/discord-connect/messages');
                if (response.ok) {
                    const messages = await response.json();
                    
                    for (const msg of messages) {
                        await handleDiscordMessage(msg);
                    }
                }
            } catch (error) {
                console.error('Error polling Discord messages:', error);
            }
        }, 1000);
    }

    /**
     * Handle incoming Discord message
     */
    async function handleDiscordMessage(message) {
        console.log('Received Discord message:', message);
        
        // Insert message into chat as user message
        const messageText = `[Discord - ${message.username}]: ${message.content}`;
        
        // Add to chat context
        if (typeof addOneMessage === 'function') {
            addOneMessage({
                name: message.username,
                is_user: true,
                mes: message.content,
                send_date: Date.now()
            });
        }

        // Trigger AI response if auto-reply is enabled
        if (settings.autoReply) {
            setTimeout(async () => {
                await generateReplyAndSendToDiscord();
            }, 500);
        }
    }

    /**
     * Generate AI reply and send to Discord
     */
    async function generateReplyAndSendToDiscord() {
        try {
            // Trigger SillyTavern's generate function
            if (typeof Generate === 'function') {
                const reply = await Generate('normal');
                
                if (reply) {
                    // Send reply to Discord
                    await sendToDiscord(reply);
                }
            }
        } catch (error) {
            console.error('Error generating and sending reply:', error);
        }
    }

    /**
     * Send a message to Discord channel
     */
    async function sendToDiscord(content) {
        if (!isConnected) {
            console.warn('Discord not connected');
            return;
        }

        try {
            await fetch('/api/discord-connect/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content })
            });
            
            console.log('Sent to Discord:', content);
        } catch (error) {
            console.error('Failed to send message to Discord:', error);
        }
    }

    /**
     * Update connection status in UI
     */
    function updateConnectionStatus() {
        const statusElement = $('#discord-connect-status');
        const connectBtn = $('#discord-connect-btn');
        
        if (isConnected) {
            statusElement.text('Connected').css('color', 'green');
            connectBtn.text('Disconnect');
        } else {
            statusElement.text('Disconnected').css('color', 'red');
            connectBtn.text('Connect');
        }
    }

    /**
     * Create extension UI
     */
    function createUI() {
        const settingsHtml = `
            <div id="discord-connect-settings" class="inline-drawer">
                <div class="inline-drawer-toggle inline-drawer-header">
                    <b>Discord Connect</b>
                    <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
                </div>
                <div class="inline-drawer-content">
                    <div class="margin-bot-10px">
                        <label for="discord-bot-token">Discord Bot Token:</label>
                        <input id="discord-bot-token" class="text_pole" type="password" placeholder="Enter bot token" />
                    </div>
                    <div class="margin-bot-10px">
                        <label for="discord-channel-id">Discord Channel ID:</label>
                        <input id="discord-channel-id" class="text_pole" type="text" placeholder="Enter channel ID" />
                    </div>
                    <div class="margin-bot-10px">
                        <label class="checkbox_label" for="discord-auto-reply">
                            <input id="discord-auto-reply" type="checkbox" />
                            <span>Auto-reply to Discord messages</span>
                        </label>
                    </div>
                    <div class="margin-bot-10px">
                        <span>Status: <span id="discord-connect-status">Disconnected</span></span>
                    </div>
                    <div>
                        <button id="discord-connect-btn" class="menu_button">Connect</button>
                    </div>
                </div>
            </div>
        `;

        $('#extensions_settings2').append(settingsHtml);

        // Bind event handlers
        $('#discord-bot-token').val(settings.botToken).on('input', function() {
            settings.botToken = $(this).val();
            saveSettings();
        });

        $('#discord-channel-id').val(settings.channelId).on('input', function() {
            settings.channelId = $(this).val();
            saveSettings();
        });

        $('#discord-auto-reply').prop('checked', settings.autoReply).on('change', function() {
            settings.autoReply = $(this).prop('checked');
            saveSettings();
        });

        $('#discord-connect-btn').on('click', async function() {
            if (isConnected) {
                await disconnectDiscord();
            } else {
                await connectDiscord();
            }
        });

        updateConnectionStatus();
    }

    /**
     * Initialize extension
     */
    async function init() {
        console.log('Initializing Discord Connect extension');
        await loadSettings();
        createUI();
        
        // Auto-connect if was previously connected
        if (settings.enabled && settings.botToken && settings.channelId) {
            await connectDiscord();
        }
    }

    // Start extension
    init();

    /**
     * Listen for AI responses to send to Discord
     */
    if (typeof eventSource !== 'undefined') {
        eventSource.on('message_sent', async (data) => {
            if (isConnected && settings.autoReply && data && data.mes) {
                // Only send character responses, not user messages
                if (!data.is_user) {
                    await sendToDiscord(data.mes);
                }
            }
        });
    }

})();
