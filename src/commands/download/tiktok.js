const { default: axios } = require("axios");
const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { apiKey } = require('../../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("tiktok")
        .setDescription("(Download) Baixa mídia do Tiktok"),

    async execute(interaction) {

        const video = new ButtonBuilder()
            .setCustomId('video')
            .setLabel("Vídeo")
            .setEmoji("📽️")
            .setStyle(ButtonStyle.Danger);

        const audio = new ButtonBuilder()
            .setCustomId('Audio')
            .setLabel("Formato de áudio")
            .setEmoji("🎶")
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder()
            .addComponents(video, audio);

        const response = await interaction.reply({
            content: `Escolha em que formato deseja:`,
            components: [row],
        });

        const collectorFilter = i => i.user.id === interaction.user.id;

        try {
            const confirmResponse = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });

            let mediaType;
            if (confirmResponse.customId === 'video') {
                mediaType = 'vídeo';
            } else if (confirmResponse.customId === 'audio') {
                mediaType = 'áudio';
            }

            await interaction.followUp(`Por favor, envie o link do ${mediaType}.`);
            

            const linkCollectorFilter = m => m.author.id === interaction.user.id;
            const linkCollector = interaction.channel.createMessageCollector({ filter: linkCollectorFilter, time: 60000 });

            linkCollector.on('collect', async (msg) => {
                const videoLink = msg.content;

                try {
                    const getVideo = await axios.get(`https://api.bronxyshost.com.br/api-bronxys/tiktok?url=${videoLink}&apikey=${apiKey}`, {
                        responseType: 'arraybuffer',
                    });
                    
                    await interaction.followUp({
                        content: 'Download concluído ✅',
                        files: [{
                            attachment: getVideo.data,
                            name: `video.${mediaType === 'vídeo' ? 'mp4' : 'mp3'}`
                        }]
                    });

                } catch (err) {
                    await interaction.followUp('Erro ao fazer o download.', err);
                }

                linkCollector.stop();
            });

            linkCollector.on('end', (collected, reason) => {
                if (reason === 'time') {
                    interaction.followUp('Tempo expirado. Por favor, execute o comando novamente.');
                }
            });

        } catch (err) {
            console.error(err);
            await interaction.followUp("Tempo expirado ou ocorreu um erro.");
        }
    }
};
