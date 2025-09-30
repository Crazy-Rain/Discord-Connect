# Discord Connect - Example Use Cases

## Use Case 1: Community Chat with AI Character

### Scenario
You have a Discord server for a game community and want an AI character to interact with members.

### Setup
1. Create a character in SillyTavern (e.g., a game guide NPC)
2. Connect the bot to your #general channel
3. Enable auto-reply

### Example Interaction
```
Discord User (Alice): Hey bot, what's the best strategy for level 5?
AI Character: For level 5, I recommend focusing on stealth approaches. 
              The guards are quite alert, so taking your time and using 
              the environment to your advantage will serve you well!

Discord User (Bob): Thanks! Any tips on weapons?
AI Character: Absolutely! At level 5, you'll want to prioritize ranged 
              weapons. The crossbow is particularly effective for silent 
              takedowns from a distance.
```

## Use Case 2: Roleplay Character Bridge

### Scenario
Bring a SillyTavern roleplay character to your Discord server for group roleplay sessions.

### Setup
1. Load your roleplay character in SillyTavern
2. Connect to your #roleplay channel
3. Enable auto-reply

### Example Interaction
```
Discord User (GM): The party approaches the mysterious tavern...
AI Character: *I adjust my hood and peer through the foggy windows* 
              "This place gives me an uneasy feeling. Perhaps we should 
              proceed with caution?"

Discord User (Player1): I agree. Should we knock or just enter?
AI Character: *I draw my dagger subtly* "Let's announce ourselves. 
              Barging in unannounced rarely ends well in my experience."
```

## Use Case 3: AI Assistant for Team Server

### Scenario
Have an AI assistant available in your team's Discord server to answer questions.

### Setup
1. Create a helpful assistant character in SillyTavern
2. Connect to your #support or #questions channel
3. Enable auto-reply

### Example Interaction
```
Discord User: How do I configure the build system?
AI Character: To configure the build system, you'll need to:
              1. Copy the .env.example file to .env
              2. Set your environment variables
              3. Run npm install to install dependencies
              4. Execute npm run build
              Would you like more details on any of these steps?

Discord User: Yes, step 2 please
AI Character: For step 2, you'll need to set these variables in your .env file:
              - API_KEY: Your application API key
              - DATABASE_URL: Your database connection string
              - PORT: The port number (default is 3000)
              Make sure not to commit the .env file to version control!
```

## Use Case 4: Story Writing Companion

### Scenario
Collaborate with your writing group using an AI character as a creative partner.

### Setup
1. Load a creative writing assistant in SillyTavern
2. Connect to your #writing-workshop channel
3. Selectively enable/disable auto-reply as needed

### Example Interaction
```
Discord User (Writer): I'm stuck on this scene where my protagonist 
                       meets the antagonist for the first time.

AI Character: A first meeting between protagonist and antagonist is crucial! 
              What if they don't initially realize who the other is? 
              Perhaps they meet in a neutral setting - a coffee shop, 
              a library, or even a busy street - and have a seemingly 
              innocent conversation that's laced with dramatic irony for 
              the reader?

Discord User (Writer): That's brilliant! I like the coffee shop idea.
AI Character: Great choice! You could use the setting to create tension - 
              perhaps they're both waiting for their orders, forced into 
              close proximity. Small details like them reaching for the 
              same sugar packet or accidentally grabbing each other's 
              drinks could create moments of connection that will feel 
              significant later...
```

## Use Case 5: Educational Bot

### Scenario
Create an educational assistant for a learning Discord server.

### Setup
1. Create an educational character in SillyTavern with appropriate knowledge
2. Connect to your #homework-help channel
3. Enable auto-reply

### Example Interaction
```
Discord Student: Can you explain photosynthesis?
AI Character: Of course! Photosynthesis is the process plants use to 
              convert light energy into chemical energy. Here's how it works:

              1. Plants absorb sunlight through chlorophyll (the green pigment)
              2. They take in carbon dioxide from the air
              3. They absorb water from their roots
              4. Using the light energy, they convert CO₂ and H₂O into glucose and oxygen
              
              The simplified equation is: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂
              
              Would you like me to explain any part in more detail?
```

## Tips for Different Use Cases

### For High-Traffic Channels
- Consider disabling auto-reply
- Manually trigger responses for specific questions
- Use message filtering if available

### For Roleplay/Creative Writing
- Use detailed character cards in SillyTavern
- Adjust response length in SillyTavern settings
- Consider using different characters for different channels

### For Support/Educational
- Create a knowledge base in the character description
- Use clear, structured responses
- Include references or sources when appropriate

### For Community/Social
- Give the character personality
- Allow for casual conversation
- Set appropriate tone in character settings

## Advanced Configuration

### Multiple Characters
You can run multiple instances with different characters:
1. Create separate folders for each instance
2. Configure each with a different channel ID
3. Load different SillyTavern characters for each

### Message Filtering
Modify the bot to respond only to specific patterns:
```javascript
// In bot.js, modify the messageCreate handler
if (message.content.startsWith('!ai ')) {
    // Only respond to messages starting with !ai
}
```

### Custom Response Format
Customize how messages appear in Discord:
```javascript
// In server.js, modify the send endpoint
const formattedContent = `**${characterName}**: ${content}`;
await this.bot.sendMessage(formattedContent);
```
