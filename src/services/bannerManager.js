const fs = require('fs');

const bannerFile = './src/db/user/banners.json';

function loadbioData() {
    try {
        if (!fs.existsSync(bannerFile)) {
            fs.writeFileSync(bannerFile, '{}');
            console.log('Arquivo criado com sucesso:', bannerFile);
        }
        
        const rawdata = fs.readFileSync(bannerFile, 'utf-8');
        if (rawdata.trim() === '') {
            console.log('Arquivo banner.json vazio. Conteúdo inicial adicionado.');
            return {};
        }
        
        return JSON.parse(rawdata);
    } catch (error) {
        console.error('Erro ao carregar dados de banner:', error);
        return {};
    }
}

function saveBanner(bioData) {
    try {
        console.log('Salvando dados de banner no arquivo:', bannerFile);
        fs.writeFileSync(bannerFile, JSON.stringify(bioData, null, 2));
        console.log('Dados salvos com sucesso:', bannerFile);
    } catch (error) {
        console.error(`Erro ao salvar dados no arquivo ${bannerFile}:`, error);
    }
}

function addBio(userId, value) {
    const bioData = loadbioData();
    bioData[userId] = bioData[userId] || {};
    bioData[userId].bio = value;
    saveBanner(bioData);
    console.log(`bio adicionada para o usuário ${userId}`);
}


function getBio(userId) {
    const bioData = loadbioData();
    return bioData[userId]?.bio || '';
}
module.exports = {
    saveBanner,
    addBio,
    getBio
};
