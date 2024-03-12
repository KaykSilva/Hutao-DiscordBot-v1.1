const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("welcome")
        .setDescription('Customização para mensagem de boas-vindas'),
    async execute(interaction) {
        const guildId = interaction.guild.id; // Obtenha a ID da guilda

        const select = new StringSelectMenuBuilder()
            .setCustomId('starter')
            .setPlaceholder('Selecione o campo para customizar.')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Chat')
                    .setDescription('Selecione o chat para exibir a mensagem.')
                    .setValue('id_channel'),

                new StringSelectMenuOptionBuilder()
                    .setLabel('Descrição')
                    .setDescription('Mude a frase de recepção')
                    .setValue('description'),

                new StringSelectMenuOptionBuilder()
                    .setLabel('Banner')
                    .setDescription('Mude o banner de exibição')
                    .setValue('banner'),

                    new StringSelectMenuOptionBuilder()
                    .setLabel('Titulo 1')
                    .setDescription('Destaque um chat na mensagem')
                    .setValue('title1'),

                new StringSelectMenuOptionBuilder()
                    .setLabel('Titulo 2')
                    .setDescription('Destaque um chat na mensage')
                    .setValue('title2'),
                    
                new StringSelectMenuOptionBuilder()
                    .setLabel('Titulo 3')
                    .setDescription('Destaque um chat na mensage')
                    .setValue('title3'),

                new StringSelectMenuOptionBuilder()
                    .setLabel('Canal 1')
                    .setDescription('Selecione o canal para o título 1')
                    .setValue('channel1'),

                new StringSelectMenuOptionBuilder()
                    .setLabel('Canal 2')
                    .setDescription('Selecione o canal para o título 2')
                    .setValue('channel2'),

                new StringSelectMenuOptionBuilder()
                    .setLabel('Canal 3')
                    .setDescription('Selecione o canal para o título 3')
                    .setValue('channel3'),

            );

        const row = new ActionRowBuilder()
            .addComponents(select);

        await interaction.reply({
            content: 'Configuração do comando welcome',
            components: [row],
        });

        const filter = (i) => i.customId === 'starter' && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            time: 15000, // Tempo em milissegundos para aguardar interações
        });

        const settings = {}; // Objeto para armazenar as configurações temporariamente

        collector.on('collect', async (i) => {
            const selectedValue = i.values[0];


            if (selectedValue === 'id_channel') {
                await interaction.followUp(`Por favor, mencione o canal que deseja exibir as mensagens`);

            } else if (selectedValue === 'description') {
                await interaction.followUp(`Envie sua recepção calorosa!`);

            } else if (selectedValue === 'title1') {
                await interaction.followUp(`De um nome ao chat ex: "Regras"`);

            } else if (selectedValue === 'title2') {
                await interaction.followUp(`De um nome ao chat ex: "Regras"`);

            } else if (selectedValue === 'title3') {
                await interaction.followUp(`De um nome ao chat ex: "Regras"`);
                
            } else if (selectedValue === 'channel1') {
                await interaction.followUp(`Mencione o canal correspondente ao chat1`);
                
            } else if (selectedValue === 'channel2') {
                await interaction.followUp(`Mencione o canal correspondente ao chat2`);
                
            } else if (selectedValue === 'channel3') {
                await interaction.followUp(`Mencione o canal correspondente ao chat3`);
                
            } else if (selectedValue === 'banner') {
                await interaction.followUp(`Envie o link da imagem ou gif`);
                
            }
    
            // Aguarde a resposta do usuário
            const responseCollectorFilter = (msg) => msg.author.id === interaction.user.id;

            const responseCollector = interaction.channel.createMessageCollector({
                filter: responseCollectorFilter,
                time: 15000,
            });



            responseCollector.on('collect', (msg) => {
                const response = msg.content.trim();

                // Salve as configurações temporariamente
                settings[selectedValue] = response;

                // Finalize o coletor de resposta
                responseCollector.stop();
            });

            responseCollector.on('end', () => {
                // Finalize o coletor principal
                collector.stop();
            });
        });

        collector.on('end', async (collected, reason) => {
            if (reason === 'time') {
                // Usuário não respondeu a tempo
                await interaction.followUp('Tempo expirado. A configuração não foi concluída.');
            } else {
                
                // Atualize o arquivo JSON com as configurações coletadas
                const filePath = `./src/db/welcome/welcome_${guildId}.json`; // Use a ID da guilda no nome do arquivo
                let existingSettings = {};

                try {
                    const data = fs.readFileSync(filePath, 'utf-8');
                    existingSettings = JSON.parse(data);
                  await  interaction.followUp('Configurações salvas com sucesso!');
                } catch (error) {
                    console.error('Erro ao ler o arquivo JSON:', error);
                }

                const updatedSettings = { ...existingSettings, ...settings };

                fs.writeFileSync(filePath, JSON.stringify(updatedSettings, null, 2), 'utf-8');


            }
        });
    },
};
