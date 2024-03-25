const { ButtonBuilder, ActionRowBuilder, EmbedBuilder, ButtonStyle, SlashCommandBuilder } = require("discord.js");
const storeManager = require("../../services/storeManager");
const bannerManager = require('../../services/bannerManager');
const moraManager = require('../../services/moraManager')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loja')
        .setDescription('Loja diária'),

    async execute(interaction) {
        let responseSent = true
        let bannerCount = 1
        let actualBannerNumber = bannerManager.getBannerNumber()
        let bannerName = storeManager.getBannerName(bannerCount)
        let bannerLink = storeManager.getBannerLink(bannerCount)
        let bannerValue = storeManager.getBannerValue(bannerCount)
        const userMora = moraManager.getMora(interaction.user.id)

        const next = new ButtonBuilder()
            .setCustomId('nextBanner')
            .setLabel('Próximo')
            .setStyle(ButtonStyle.Primary);

        const back = new ButtonBuilder()
            .setCustomId('backBanner')
            .setLabel('Voltar')
            .setStyle(ButtonStyle.Primary);

        const buy = new ButtonBuilder()
            .setCustomId('buyBanner')
            .setLabel("Comprar banner")
            .setStyle(ButtonStyle.Success);

        const buyBanner = new ActionRowBuilder()
            .addComponents(next, back, buy);

        const buyBannerEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Bem vindo a loja <:HuTaoPNGImageFile:1218340383105351770>')
            .setDescription(`<a:hutaomusic:1221603689639186503> Banner: **${bannerName}** \n <:huzinha:1218041595266338856>  Valor: **${bannerValue} mora**`)
            .setImage(bannerLink)
            .setTimestamp();

        await interaction.reply({ components: [buyBanner], embeds: [buyBannerEmbed] });

        const collector = interaction.channel.createMessageComponentCollector({ time: 15000 });

        collector.on('collect', async i => {
            i.deferUpdate();
            if (i.customId === 'nextBanner') {
                nextBanner()
            } else if (i.customId === 'backBanner') {
                backBanner()
            } else if (i.customId === 'buyBanner') {
                buyBannerFc()
            } return
        });

        collector.on('end', (collected, reason) => {
            if (collected.size === 0 && !responseSent) {
                interaction.followUp({
                    content: `Tempo esgotado <:perdeu:1217634795576623245>`,
                    components: [],
                });
            }
        });

        async function nextBanner() {
            bannerCount++;
            bannerLink = storeManager.getBannerLink(bannerCount)
            buyBannerEmbed.setImage(bannerLink);
            bannerName = storeManager.getBannerName(bannerCount)
            bannerValue = storeManager.getBannerValue(bannerCount)

            buyBannerEmbed.setDescription(`<a:hutaomusic:1221603689639186503> Banner: **${bannerName}** \n <:huzinha:1218041595266338856>  Valor: **${bannerValue} mora**`)

            await interaction.editReply({ components: [buyBanner], embeds: [buyBannerEmbed] });
        }

        async function backBanner() {
            bannerCount--;
            if (bannerCount < 1) bannerCount = 1;
            bannerLink = storeManager.getBannerLink(bannerCount)
            buyBannerEmbed.setImage(bannerLink);
            await interaction.editReply({ components: [buyBanner], embeds: [buyBannerEmbed] });
        }
        async function buyBannerFc() {
            if (userMora < bannerValue) {
                interaction.followUp("Você não possui mora suficiente <:perdeu:1217634795576623245>")
            } else {
                moraManager.removeMora(interaction.user.id, bannerValue)
                console.log(bannerValue)
                bannerManager.writeBanner(interaction.user.id, bannerLink)
                const newBannerCount = actualBannerNumber++
                bannerManager.writeBannerNumber(interaction.user.id, newBannerCount)
                interaction.followUp("Novo banner adquirido <a:genshinimpacthutao:1221614065441308713>");
            }


        }

    }
};
