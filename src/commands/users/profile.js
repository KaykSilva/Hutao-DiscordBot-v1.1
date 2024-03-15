const { createCanvas, loadImage, registerFont } = require('canvas');
const { SlashCommandBuilder } = require("discord.js");
const moraManager = require('../../services/moraManager')
const bannerManager = require("../../services/bannerManager");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ver_perfil")
        .setDescription("(Diversão) Veja seu perfil no bot"),

    async execute(interaction) {
        const moraFile = './src/db/money/mora.json';

        const canvas = createCanvas(700, 400);
        const ctx = canvas.getContext('2d');

        let backgroundLink = 'https://i.pinimg.com/564x/6e/be/d2/6ebed2de9b292cea782c89932382a874.jpg'

        // Carregar a imagem de fundo
        const background = await loadImage(backgroundLink);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        const fita = await loadImage('https://i.pinimg.com/564x/93/e1/7d/93e17df5abb3c5de7f89d8edd026bc5c.jpg');

        const progressBarWidth = 700;
        const progressBarHeight = 110;
        const progressBarX = 0;
        const progressBarY = 300;

        let color = '#2c2f33'
        ctx.fillStyle = color; // Cor verde para a barra de progresso
        ctx.globalAlpha = 0.9;
        ctx.fillRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);
        ctx.globalAlpha = 1;

        // Criar um círculo de recorte para o avatar
        ctx.save();
        ctx.beginPath();
        ctx.arc(100, 310, 50, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        // Carregar e desenhar a imagem de avatar do usuário
        const userAvatar = await loadImage(interaction.user.displayAvatarURL({ extension: 'jpg', size: 512 }));
        ctx.drawImage(userAvatar, 50, 260, 100, 100); // Posição (50, 50) e tamanho 100x100
        ctx.restore();

        // Adicionar contorno ao perfil
        ctx.strokeStyle = color; // Cor do contorno
        ctx.lineWidth = 7; // Largura do contorno
        ctx.beginPath();
        ctx.arc(100, 310, 50, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.stroke();

        // Adicionar texto
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 30px Angkor", serif';
        ctx.fillText(interaction.user.username, 60, 390);
        // Adicionar bio

        let bio = 'Nenhuma bio'
        bio = bannerManager.getBio(interaction.user.id)
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px Angkor", serif';
        ctx.fillText(`📝 Bio: ${bio}`, 250, 330);
        // Adicionar texto

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px Angkor", serif';
        const userMora = moraManager.getMora(interaction.user.id);
        ctx.fillText(`Mora: ${userMora}`, 280, 360);

        const moraEmoji = await loadImage('https://cdn.discordapp.com/emojis/1217594423941005393.png');
        ctx.drawImage(moraEmoji, 250, 338, 30, 30);
        // Converter o canvas em um buffer de imagem
        const buffer = canvas.toBuffer();

        // Responder com o buffer de imagem como um anexo
        await interaction.reply({ files: [buffer], content: "Aqui está sua imagem de perfil!" });

    }
};
