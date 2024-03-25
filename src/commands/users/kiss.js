const { default: axios } = require("axios");
const { SlashCommandBuilder,EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("beijar")
        .setDescription("(Diversão) Beije alguém UwU")
        .addUserOption(option =>
            option
                .setName('mencionar')
                .setDescription('Mencione quem merece seu beijo!')
                .setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser('mencionar');
        const user = interaction.user;
        const mentionTag = target ? `<@${target.id}>` : 'UnknownUser';
        const userTag = user ? `<@${user.id}>` : 'UnknownUser';
        

        const response = await axios.get("https://api.waifu.pics/sfw/kiss")
        const hugGif = response.data.url
        const hugEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setImage(hugGif)
            .setTimestamp()

        interaction.reply({
            content:`${userTag} beijou ${mentionTag} <a:hutaopat:1221841449017016462>`,
            embeds:[hugEmbed]
        })
    }
}