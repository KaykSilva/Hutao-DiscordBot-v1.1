const { Events, AttachmentBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const channel_id = '1216572060344647755';
        const channel = member.guild.channels.cache.get(channel_id);
        
        //channels config
        const title1 = 'Registro'
        const title2 = 'a'
        const title3 = ''

        const channel1 = '<#1216824085237989546>'
        const channel2 = '<#1216824085237989546>'
        const channel3 = ''



        if (!channel) return;

        // Obtenha a URL do avatar do usuário
        const userAvatarUrl = member.user.displayAvatarURL({ format: 'png', size: 512 });

        const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`Bem-vindo a ${member.guild.name} `)
            .setURL('https://discord.gg/dAXKWdPnnh')
            .setAuthor({ name: member.user.username, iconURL: userAvatarUrl, url: 'https://discord.js.org' })
            .setDescription(`Hey ${member.user.tag}, se perdeu por aqui \n\n ${title1} ${channel1} \n\n  ${title2} ${channel2} \n\n  ${title3} ${channel3} \n\n   ` )
            .setThumbnail(userAvatarUrl)
            
        
            
            .setImage('https://i.pinimg.com/originals/f1/ac/04/f1ac043d7cabf6224a3cde8b34734d81.gif') // Define a imagem do embed como o avatar do usuário
            .setTimestamp()
            .setFooter({ text: 'Entrou:', iconURL: userAvatarUrl });

        channel.send({ embeds: [exampleEmbed] });
    }
};
