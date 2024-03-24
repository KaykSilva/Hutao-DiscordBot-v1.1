const { SlashCommandBuilder } = require("discord.js");
const fs = require('node:fs');
const moraManager = require('../../services/moraManager')
module.exports = {
    data: new SlashCommandBuilder()
        .setName("mora")
        .setDescription("(Economia) Veja seu saldo de mora"),

    async execute(interaction) {

        const userMora = moraManager.getMora(interaction.user.id);
        if (userMora < 50) {
            interaction.reply(`<:perdeu:1217634795576623245> Paimon gastou toda sua mora com comida, você possui um total de <:mora:1217594423941005393>**${userMora} mora**`);
        } else if (userMora <= 5000) {  
            interaction.reply(`<:hi:1217643119315521670> Childe passou por aqui.. você possui um total de <:mora:1217594423941005393>**${userMora} mora**`);
        } else {
            interaction.reply(`<:hi:1217643119315521670> Um comerciante de liyue?, você possui um total de <:mora:1217594423941005393>**${userMora} mora**`);
        }
        

        
    }
};
