const { SlashCommandBuilder } = require("discord.js");
const fs = require('node:fs');
const moraManager = require('./moraManager');  // Correção: troque o asterisco por ponto e vírgula

module.exports = {
    data: new SlashCommandBuilder() 
        .setName("daily")
        .setDescription("Missão diária para ganhar mora"),
    async execute(interaction) {
        const moraFile = './src/db/money/mora.json';
        
        const lastDailyTimestamp = moraManager.getLastDailyTimestamp(interaction.user.id, moraFile);
        const currentTimestamp = Date.now();

        const dailyCooldown = 24 * 60 * 60 * 1000;

        if (currentTimestamp - lastDailyTimestamp < dailyCooldown) {
            // O usuário ainda está em cooldown
            const remainingTime = dailyCooldown - (currentTimestamp - lastDailyTimestamp);
            const remainingHours = Math.floor(remainingTime / (60 * 60 * 1000));
            const remainingMinutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
            interaction.reply(`Você já concluiu a missão diária. Espere mais ${remainingHours} horas e ${remainingMinutes} minutos.`);
            return;
        }

        const dailyMora = randomNumber(1000, 2000);
        moraManager.addMora(interaction.user.id, dailyMora, currentTimestamp, moraFile);
        interaction.reply(`Parabéns por completar sua missão diária, aqui está seu pagamento, **${dailyMora} mora**.`);
    
        function randomNumber(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }
    }
}
