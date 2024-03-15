const { SlashCommandBuilder } = require("discord.js");
const bannerManager = require("../../services/bannerManager");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bio')
        .setDescription('(Diversão) Mude sua bio do perfil.'),

    async execute(interaction) {
        await interaction.reply("Escreva sua nova bio.");

        const collectorFilter = (msg) => msg.author.id === interaction.user.id;
        const collector = interaction.channel.createMessageCollector({
            filter: collectorFilter,
            time: 15000,
        });

        let responseSent = false;

        collector.on('collect', async (msg) => {
            let bioContent = msg.content;
            bannerManager.addBio(interaction.user.id, bioContent);
            responseSent = true; // Marcando que uma resposta foi recebida
            await interaction.editReply(`Nova bio salva com sucesso <:huzinha:1218041595266338856>` );
            collector.stop(); 
        });

        collector.on('end', (collected, reason) => {
            if (!responseSent) {
                interaction.editReply({
                    content: `${interaction.user}, você não respondeu a tempo <:perdeu:1217634795576623245>`,
                    components: [],
                });
            }
        });
    }
}
