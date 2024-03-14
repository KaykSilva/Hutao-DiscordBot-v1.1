const { SlashCommandBuilder } = require("discord.js");
const fs = require('node:fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mora")
        .setDescription("(Economia) Veja seu saldo de mora"),

    async execute(interaction) {
        const moraFile = './src/db/money/mora.json';

        function loadMoraData() {
            if (!fs.existsSync(moraFile)) {
                fs.writeFileSync(moraFile, '{}');
                console.log('Arquivo criado com sucesso:', moraFile);
            }

            const rawdata = fs.readFileSync(moraFile, 'utf-8');
            try {
                return JSON.parse(rawdata);
            } catch (error) {
                console.error('Erro ao analisar dados JSON:', error);
                return {};
            }
        }
        
        const userMora = getMora(interaction.user.id);
        if (userMora < 50) {
            interaction.reply(`<:perdeu:1217634795576623245> Paimon gastou toda sua mora com comida, você poussui um total de <:mora:1217594423941005393>**${userMora} mora**`);
        } else if (userMora <= 5000) {  
            interaction.reply(`<:hi:1217643119315521670 Childe passou por aqui.. você poussui um total de <:mora:1217594423941005393>**${userMora} mora**`);
        } else {
            interaction.reply(`<:hi:1217643119315521670 Um comerciante de liyue?, você poussui um total de <:mora:1217594423941005393>**${userMora} mora**`);
        }
        

        function getMora(userId) {
            const moraData = loadMoraData();
            return moraData[userId]?.moraBalance || 0;
        }
    }
};
