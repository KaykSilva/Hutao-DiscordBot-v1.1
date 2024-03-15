const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const moraManager = require('../../services/moraManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pagar')
        .setDescription('(Economia) Transfira mora para um jogador.')
        .addUserOption(option =>
            option
                .setName('mencionar')
                .setDescription('Mencione alguém!')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('mora')
                .setDescription('Insira a quantidade de mora que deseja pagar.')
                .setRequired(true)),

    async execute(interaction) {
        const moraFile = './src/db/money/mora.json';
        const target = interaction.options.getUser('mencionar');
        const user = interaction.user;
        const mora = parseInt(interaction.options.getString('mora'));
        const mentionTag = target ? `<@${target.id}>` : 'UnknownUser';
        const userTag = user ? `<@${user.id}>` : 'UnknownUser';


        const confirm = new ButtonBuilder()
            .setCustomId('confirm')
            .setLabel('Aceitar')
            .setStyle(ButtonStyle.Success);

        const cancel = new ButtonBuilder()
            .setCustomId('cancel')
            .setLabel('Recusar')
            .setStyle(ButtonStyle.Danger);


        const row = new ActionRowBuilder()
            .addComponents(cancel, confirm);


        const userMora = getMora(interaction.user.id);
        const mentionMora = target ? getMora(target.id) : 0;
        let responseSent = false;

        if (userMora < mora) {
            await interaction.reply({
                content: `${userTag} Você não possui mora suficiente para realizar a transação<:perdeu:1217634795576623245>`,
                components: [],
            });
            responseSent = true
            return

        } else {
            await interaction.reply({
                content: `${userTag} quer transferir <:mora:1217594423941005393>**${mora}** mora para ${mentionTag}`,
                components: [row],
            });
        }

        // filter dos botoes
        const filter = i => {
            i.deferUpdate();
            return i.customId === 'confirm' || i.customId === 'cancel';
        };

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 300000 });
        collector.on('collect', i => {
            if (i.customId === 'confirm') {
                interaction.followUp(`${mentionTag} recebeu <:mora:1217594423941005393>**${mora}** de ${userTag}`);
                moraManager.addMoraFlip(target.id, mora, moraFile);
                moraManager.removeMora(interaction.user.id, mora, moraFile);
                collector.stop()
            } else {
                interaction.followUp(`${mentionTag} não aceitou a transferencia <:perdeu:1217634795576623245>`);
                collector.stop()
            }


        });
        // coletor dos botoes
        collector.on('end', (collected, reason) => {
            if (collected.size === 0 && !responseSent) {
                interaction.editReply({
                    content: `${mentionTag} Não respondeu <:perdeu:1217634795576623245>`,
                    components: [],
                });
            }
            return
        });


        function getMora(userId) {
            const moraData = moraManager.loadMoraData();
            return moraData[userId]?.moraBalance || 0;
        }

    }


}