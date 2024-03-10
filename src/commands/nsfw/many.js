const { default: axios } = require("axios");
const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("nsfw")
        .setDescription("Pack de Imagens"),

    async execute(interaction) {
        if (!interaction.channel.nsfw) {
            return interaction.reply("Este comando só pode ser usado em canais NSFW.")
        }

        const waifu = new ButtonBuilder()
            .setCustomId('waifu')
            .setLabel("Waifu")
            .setEmoji("💮")
            .setStyle(ButtonStyle.Primary)

        const neko = new ButtonBuilder()
            .setCustomId('neko')
            .setLabel("CatGirl")
            .setEmoji("😽")
            .setStyle(ButtonStyle.Primary)

        const trap = new ButtonBuilder()
            .setCustomId('trap')
            .setLabel("TrapGirl")
            .setEmoji("🤨")
            .setStyle(ButtonStyle.Primary)

        const blowjob = new ButtonBuilder()
            .setCustomId('blowjob')
            .setLabel("Boquete")
            .setEmoji("🔦")
            .setStyle(ButtonStyle.Primary)

        const row = new ActionRowBuilder()
            .addComponents(waifu, neko, trap, blowjob)

        const response = await interaction.reply({
            content: `Escolha uma categoria:`,
            components: [row]
        })

        const collectorFilter = i => i.user.id === interaction.user.id;

        try {
            const confirmResponse = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 })

            if (confirmResponse.customId === 'waifu' || confirmResponse.customId === 'neko' || confirmResponse.customId === 'trap' || confirmResponse.customId === 'blowjob') {

                const json = {}
                const { data } = await axios.post(`https://api.waifu.pics/many/nsfw/${confirmResponse.customId}`, json);

                if (data.files && data.files.length > 0) {
                    const chunkSize = 2;
                    const chunkedUrls = chunkArray(data.files, chunkSize);

                    for (const chunk of chunkedUrls) {
                        const spacedUrls = chunk.join('\n\n');
                        await interaction.followUp(spacedUrls);
                    }

                } else {
                    await interaction.followUp("Nenhuma imagem disponível para a categoria fornecida.");
                }

                function chunkArray(array, chunkSize) {
                    const result = [];
                    for (let i = 0; i < array.length; i += chunkSize) {
                        result.push(array.slice(i, i + chunkSize));
                    }
                    return result;
                }

            } else {
                // Handle other cases if needed
            }

        } catch (err) {
            console.error(err);
            await interaction.followUp("Tempo expirado ou ocorreu um erro.");
        }
    }
};
