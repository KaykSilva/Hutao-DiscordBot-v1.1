const { default: axios } = require("axios");
const { SlashCommandBuilder,EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("abraço")
        .setDescription("(Diversão) Abrace um amigo")
        .addUserOption(option =>
            option
                .setName('mencionar')
                .setDescription('Mencione quem merece seu abraço!')
                .setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser('mencionar');
        const user = interaction.user;
        const mentionTag = target ? `<@${target.id}>` : 'UnknownUser';
        const userTag = user ? `<@${user.id}>` : 'UnknownUser';
        

        const response = await axios.get("https://api.waifu.pics/sfw/hug")
        const hugGif = response.data.url
        const hugEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setImage(hugGif)
            .setTimestamp()

        interaction.reply({
            content:`${userTag} acabou de abraçar ${mentionTag} <a:upHutao:1221811133510320298>`,
            embeds:[hugEmbed]
        })
    }
}