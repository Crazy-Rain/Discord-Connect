/**
 * Basic Test Suite for Discord Connect
 * Run with: node test.js
 */

const assert = require('assert');

console.log('Running Discord Connect Tests...\n');

// Test 1: Bot module loads correctly
try {
    const DiscordConnectBot = require('./bot');
    assert(typeof DiscordConnectBot === 'function', 'Bot should export a class');
    console.log('✓ Bot module loads correctly');
} catch (error) {
    console.error('✗ Bot module failed to load:', error.message);
    process.exit(1);
}

// Test 2: Server module loads correctly
try {
    const DiscordConnectServer = require('./server');
    assert(typeof DiscordConnectServer === 'function', 'Server should export a class');
    console.log('✓ Server module loads correctly');
} catch (error) {
    console.error('✗ Server module failed to load:', error.message);
    process.exit(1);
}

// Test 3: Bot instance can be created
try {
    // Set dummy env vars to prevent errors
    process.env.DISCORD_BOT_TOKEN = 'test_token';
    process.env.DISCORD_CHANNEL_ID = 'test_channel_id';
    
    const DiscordConnectBot = require('./bot');
    const bot = new DiscordConnectBot();
    
    assert(bot.client !== null, 'Bot should have a client');
    assert(Array.isArray(bot.messageHandlers), 'Bot should have message handlers array');
    assert(bot.isReady === false, 'Bot should not be ready initially');
    
    console.log('✓ Bot instance can be created');
} catch (error) {
    console.error('✗ Bot instance creation failed:', error.message);
    process.exit(1);
}

// Test 4: Server instance can be created
try {
    const DiscordConnectServer = require('./server');
    const server = new DiscordConnectServer(3002); // Use different port
    
    assert(server.app !== null, 'Server should have an express app');
    assert(server.port === 3002, 'Server should have correct port');
    assert(Array.isArray(server.messageQueue), 'Server should have message queue');
    
    console.log('✓ Server instance can be created');
} catch (error) {
    console.error('✗ Server instance creation failed:', error.message);
    process.exit(1);
}

// Test 5: Manifest.json is valid
try {
    const manifest = require('./manifest.json');
    assert(manifest.display_name === 'Discord Connect', 'Manifest should have correct display name');
    assert(manifest.js === 'index.js', 'Manifest should reference index.js');
    assert(manifest.css === 'style.css', 'Manifest should reference style.css');
    console.log('✓ Manifest.json is valid');
} catch (error) {
    console.error('✗ Manifest.json validation failed:', error.message);
    process.exit(1);
}

// Test 6: Package.json is valid
try {
    const pkg = require('./package.json');
    assert(pkg.name === 'discord-connect', 'Package should have correct name');
    assert(pkg.dependencies['discord.js'] !== undefined, 'Package should include discord.js');
    assert(pkg.dependencies['express'] !== undefined, 'Package should include express');
    assert(pkg.dependencies['dotenv'] !== undefined, 'Package should include dotenv');
    console.log('✓ Package.json is valid');
} catch (error) {
    console.error('✗ Package.json validation failed:', error.message);
    process.exit(1);
}

console.log('\n✓ All tests passed!');
console.log('\nNote: These are basic structural tests.');
console.log('For full testing, you need a valid Discord bot token and channel ID.');
