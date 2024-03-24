const { createCanvas, loadImage, registerFont } = require('canvas');
const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const moraManager = require('../../services/moraManager');
const bannerManager = require("../../services/bannerManager");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ver_perfil")
        .setDescription("(Diversão) Veja seu perfil no bot"),

    async execute(interaction) {
        const canvas = createCanvas(550, 300);
        const ctx = canvas.getContext('2d');

        // Definições de estilo padrão
        const color = '#2c2f33'; // cor padrão
        const opacity = 1; // opacidade padrão
        const textColor = '#99aab5'; // cor de texto padrão
        const userTextColor = '#FFF'; // cor de nome de usuário padrão
        // Carregar a imagem de fundo padrão
        const defaultBanner = 'https://i.pinimg.com/564x/6e/be/d2/6ebed2de9b292cea782c89932382a874.jpg'

        let bannerCount = bannerManager.getBannerNumber(interaction.user.id)
        console.log(`banner atual ${bannerCount}` )
        let bannerLink = bannerManager.getBannerLink(interaction.user.id, bannerCount) || defaultBanner


        //buutons
        const confirm = new ButtonBuilder()
            .setCustomId('changeBanner')
            .setLabel('Mudar banner')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('<:HuTaoPNGImageFile:1218340383105351770>');

        const next = new ButtonBuilder()
            .setCustomId('nextBanner')
            .setLabel('Próximo')
            .setStyle(ButtonStyle.Primary)


        const back = new ButtonBuilder()
            .setCustomId('backBanner')
            .setLabel('Voltar')
            .setStyle(ButtonStyle.Primary)


        const set = new ButtonBuilder()
            .setCustomId('setBanner')
            .setLabel('Definir banner')
            .setStyle(ButtonStyle.Success)


        const row = new ActionRowBuilder()
            .addComponents(confirm);

        const editBanner = new ActionRowBuilder()
            .addComponents(next, back, set);

        //embed
        const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Sua galeria de bannners')
            .setDescription(`Banner ${bannerCount}`)
            .setImage(bannerLink)
            .setTimestamp()




        let responseSent = false;

        const collector = interaction.channel.createMessageComponentCollector({ time: 15000 });

        collector.on('collect', async i => {
            i.deferUpdate();
            if (i.customId === 'changeBanner') {
                if (bannerLink !== defaultBanner) {
                    await interaction.editReply({ components: [editBanner], embeds: [exampleEmbed] });
                } else {
                    await interaction.editReply({ content: `**<@${interaction.user.id}> <:perdeu:1217634795576623245> Você não possui banners, visite /loja para obter.**`, components: [] });
                }
            } else if (i.customId === 'nextBanner') {
                await nextBanner();
            } else if (i.customId === 'backBanner') {
                await backBanner(); // Chama a função backBanner passando o contador de banners
            } else if (i.customId === 'setBanner') {
                await setBanner()
            }
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
            bannerManager.writeBannerNumber(interaction.user.id, bannerCount)
            console.log(bannerCount)
            bannerLink = bannerManager.getBannerLink(interaction.user.id, bannerCount) || defaultBanner;
            exampleEmbed.setImage(bannerLink);
            exampleEmbed.setDescription(`Banner ${bannerCount}`)
            await interaction.editReply({ components: [editBanner], embeds: [exampleEmbed] });
        }

        async function backBanner() {
            bannerCount--;
            bannerManager.writeBannerNumber(interaction.user.id, bannerCount)
            if (bannerCount < 1) bannerCount = 1;
            bannerLink = bannerManager.getBannerLink(interaction.user.id, bannerCount) || defaultBanner;
            exampleEmbed.setImage(bannerLink);
            exampleEmbed.setDescription(`Banner ${bannerCount}`)
            await interaction.editReply({ components: [editBanner], embeds: [exampleEmbed] });
        }
        async function setBanner() {
            interaction.followUp("Banner setado com sucesso <:huzinha:1218041595266338856>");
            
        }
        
        const background = await loadImage(bannerLink);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        // Desenhar a barra de progresso
        const progressBarWidth = 700;
        const progressBarHeight = 300;
        const progressBarX = 0;
        const progressBarY = 130;
        ctx.fillStyle = color;
        ctx.globalAlpha = opacity;
        ctx.fillRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);
        ctx.globalAlpha = 1;

        // Criar um círculo de recorte para o avatar
        ctx.save();
        ctx.beginPath();
        ctx.arc(80, 130, 50, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        // Carregar e desenhar a imagem de avatar do usuário
        const userAvatar = await loadImage(interaction.user.displayAvatarURL({ extension: 'jpg', size: 512 }));
        ctx.drawImage(userAvatar, 30, 80, 100, 100);
        ctx.restore();

        // Adicionar contorno ao perfil
        ctx.strokeStyle = color;
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.arc(80, 130, 50, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.stroke();

        // Adicionar nome de usuário
        ctx.fillStyle = userTextColor;
        ctx.font = 'bold 30px Angkor", serif';
        ctx.fillText(interaction.user.username, 140, 160);

        // Adicionar bio
        let bio = bannerManager.getBio(interaction.user.id) || 'Nenhuma bio';
        ctx.fillStyle = textColor;
        ctx.font = 'normal 17px Angkor", serif';
        ctx.fillText(`Sobre mim: ${bio}`, 45, 270);

        // Adicionar Mora
        const userMora = moraManager.getMora(interaction.user.id);
        ctx.fillText(`Mora: ${userMora}`, 45, 230);


        // Carregar emojis
        const moraEmoji = await loadImage('https://images.gamebanana.com/img/ico/sprays/61a81999c66e9.gif');
        const bookEmoji = await loadImage('https://cdn.discordapp.com/emojis/853624482894577684.png');
        const devBadge = await loadImage('https://cdn.discordapp.com/emojis/1042188338888704060.png');

        // Desenhar emojis
        ctx.drawImage(moraEmoji, 10, 210, 30, 30);
        ctx.drawImage(bookEmoji, 10, 250, 30, 30);
        ctx.drawImage(devBadge, 450, 140, 25, 25);


        // Converter o canvas em um buffer de imagem
        const buffer = canvas.toBuffer();

        // Responder com o buffer de imagem como um anexo
        await interaction.reply({ files: [buffer], content: `Seu perfil`, components: [row] });
    }
};
