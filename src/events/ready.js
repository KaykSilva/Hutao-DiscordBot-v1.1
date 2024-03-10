const { Events,ActivityType  } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Tudo pronto, estou conectada ${client.user.tag}`);
		client.user.setPresence({
			activities: [{ name: `Discord: @KShzZ`, type: ActivityType.Watching }],
			status: 'dnd',
		  });
	},
}