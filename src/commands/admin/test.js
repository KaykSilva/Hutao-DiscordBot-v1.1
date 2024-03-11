const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("test")
    .setDescription('a'),
    async execute(interaction) {
        const member = interaction.member
        interaction.client.emit("guildMemberAdd", member)
        await interaction.reply({content: `evento simulado ${member}`, ephemeral: true})
    }


}