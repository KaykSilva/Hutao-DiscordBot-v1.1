const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const moraManager = require('./moraManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('(Economia) Aposte sua mora com outro jogador.')
        .addUserOption(option =>
            option
                .setName('mencionar')
                .setDescription('Mencione seu oponente!')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('mora')
                .setDescription('Insira a quantidade de mora que deseja apostar.')
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
            .setLabel('Apostar')
            .setStyle(ButtonStyle.Success);

        const cancel = new ButtonBuilder()
            .setCustomId('cancel')
            .setLabel('Cancelar')
            .setStyle(ButtonStyle.Danger);


        const row = new ActionRowBuilder()
            .addComponents(cancel, confirm);


        const userMora = getMora(interaction.user.id);
        const mentionMora = target ? getMora(target.id) : 0;
        let responseSent = false;

        if (userMora < mora) {
            await interaction.reply({
                content: `${userTag} Você não possui mora suficiente <:perdeu:1217634795576623245>`,
                components: [],
            });
            responseSent = true
            return

        } else if (mentionMora < mora) {
            await interaction.reply({
                content: `${mentionTag} não possui mora suficiente <:perdeu:1217634795576623245>`,
                components: [],
            });
            return

        } else {
            await interaction.reply({
                content: `${userTag} acabou de desafiar ${mentionTag} para uma partida de Cara ou Coroa. Valendo<:mora:1217594423941005393>${mora} mora.`,
                components: [row],
            });
        }
        // filtro de resposta dos botoes

        const filter = i => {
            i.deferUpdate();
            return i.customId === 'confirm' || i.customId === 'cancel';
        };

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 300000 });
        collector.on('collect', i => {
            if (i.customId === 'confirm') {
                interaction.followUp(`A aposta foi aceita! O desafiado escolhe primeiro ${mentionTag} Cara ou Coroa?`);
                collector.stop()
            } else {
                interaction.followUp(`A aposta foi cancelada <:perdeu:1217634795576623245>`);
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

            } else if (reason === 'time') {
                interaction.editReply({
                    content: `${mentionTag} Tempo acabou <:perdeu:1217634795576623245>`,
                    components: [],
                });
            }
        });

        // coletor do desafiado
        const mentionFilter = m => m.author.id === target.id;
        const mentionCollector = interaction.channel.createMessageCollector({ filter: mentionFilter, time: 20000 });

        mentionCollector.on('collect', async (msg) => {
            let choiceSide = msg.content.toLowerCase();
            let outerSide = ''

            if (choiceSide === 'coroa') {
                await interaction.followUp(`${mentionTag} escolheu ${choiceSide} e ${userTag} ficou com cara.`)
                outerSide = 'cara'
                responseSent = true

            } else if (choiceSide === 'cara') {
                await interaction.followUp(`${mentionTag} escolheu ${choiceSide} e ${userTag} ficou com coroa`)
                outerSide = 'coroa'
                responseSent = true

            } else {
                await interaction.followUp(`Resposta inválida, escolha novamente <:perdeu:1217634795576623245>`)
                return
            }
            const randomNumber = Math.random();
            let result = randomNumber < 0.5 ? 'cara' : 'coroa';
            
            if (result === choiceSide) {
                await interaction.followUp(`<:hi:1217643119315521670>${mentionTag} Ganhou <:mora:1217594423941005393>**${mora}** mora de ${userTag} Resultado: **${result}** `);
                moraManager.addMoraFlip(target.id, mora, moraFile); // Adicionar mora ao usuário desafiado
                moraManager.removeMora(interaction.user.id, mora, moraFile); // Remover mora do usuário que desafiou
            } else {
                await interaction.followUp(`<:perdeu:1217634795576623245>${userTag} Perdeu <:mora:1217594423941005393>**${mora}** mora para ${mentionTag} Resultado: **${result}** `);
                moraManager.addMoraFlip(interaction.user.id, mora, moraFile); // Adicionar mora ao usuário que desafiou
                moraManager.removeMora(target.id, mora, moraFile); // Remover mora do usuário desafiado
            }
            
            return;
            
        });


        mentionCollector.on('end', (collected, reason) => {
            if (collected.size === 0 && !responseSent) {
                interaction.editReply({
                    content: `${mentionTag} Não respondeu <:perdeu:1217634795576623245>`,
                    components: [],
                });

            } else if (reason === 'time') {
                interaction.editReply({
                    content: `${mentionTag} Tempo acabou <:perdeu:1217634795576623245>`,
                    components: [],
                });
            }
        });

        function getMora(userId) {
            const moraData = moraManager.loadMoraData();
            return moraData[userId]?.moraBalance || 0;
        }
    },
};
