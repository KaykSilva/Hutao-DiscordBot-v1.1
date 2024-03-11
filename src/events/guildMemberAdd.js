const { Events, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {

        const filePath = `./src/db/welcome/welcome_${member.guild.id}.json`;
        let config;
        try {
            const data = fs.readFileSync(filePath, 'utf-8');
            config = JSON.parse(data);
            
        } catch (error) {
            console.error('Erro ao ler o arquivo JSON:', error);
            return;
        }

        try {
            config.id_channel = config.id_channel.replace(/[^\w\s]/gi, '');
        } catch (error) {
            console.error('Erro ao manipular o ID do canal:', error);
            return;
        }

        //channels config
        const description = config['description'] || '';
        const id_channel = config['id_channel'] || '';
        const banner = config['banner'] || 'https://i.pinimg.com/originals/f1/ac/04/f1ac043d7cabf6224a3cde8b34734d81.gif';
        const title1 = config['title1'] || '';
        const title2 = config['title2'] || '';
        const title3 = config['title3'] || '';
        const channel1 = `${config['channel1'] || ''}`;
        const channel2 = `${config['channel2'] || ''}`;
        const channel3 = `${config['channel3'] || ''}`;

        // Obtenha a URL do avatar do usuário
        const userAvatarUrl = member.user.displayAvatarURL({ format: 'png', size: 512 });

        const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`Bem-vindo a ${member.guild.name} `)
            .setURL('https://discord.gg/dAXKWdPnnh')
            .setAuthor({ name: member.user.username, iconURL: userAvatarUrl, url: 'https://discord.js.org' })

            .setDescription(`Hey ${member.user.tag}, ${description} \n\n ${title1} ${channel1} \n\n  ${title2} ${channel2} \n\n  ${title3} ${channel3} \n\n   `)
            .setThumbnail(userAvatarUrl)
            .setImage(banner) // Define a imagem do embed como o avatar do usuário
            .setTimestamp()
            .setFooter({ text: 'Entrou:', iconURL: userAvatarUrl });
            
            const channel_id = id_channel;
            const channel = member.guild.channels.cache.get(channel_id);

            if (!channel) {
                console.error('Canal não encontrado. Verifique se o ID do canal está correto.');
                member.followUp
                return;
            }

        channel.send({ embeds: [exampleEmbed] });
    }
};
