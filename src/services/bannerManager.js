const fs = require('fs');

const bannerFile = './src/db/user/banners.json';

function loadbannerData() {
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

function saveBanner(bannerData) {
    try {
        console.log('Salvando dados de banner no arquivo:', bannerFile);
        fs.writeFileSync(bannerFile, JSON.stringify(bannerData, null, 2));
        console.log('Dados salvos com sucesso:', bannerFile);
    } catch (error) {
        console.error(`Erro ao salvar dados no arquivo ${bannerFile}:`, error);
    }
}

function addBio(userId, value) {
    const bannerData = loadbannerData();
    bannerData[userId] = bannerData[userId] || {};
    bannerData[userId].bio = value;
    saveBanner(bannerData);
    console.log(`bio adicionada para o usuário ${userId}`);
}
function writeBannerNumber(userId, bannerNumber) {
    const bannerData = loadbannerData();
    bannerData[userId] = bannerData[userId] || {};
    bannerData[userId].bannerConfig.bannerNumber = bannerNumber;
    saveBanner(bannerData);
    console.log(`banner adicionado para o usuário ${userId}`);
}

function getBannerConfig(userId) {
    const bannerData = loadbannerData();
    return bannerData[userId]?.bannerConfig || {};
}

function getBio(userId) {
    const bannerConfig = getBannerConfig(userId);
    return bannerConfig.bio || '';
}

function getBannerLink(userId, linkNumber) {
    const bannerConfig = getBannerConfig(userId);
    return bannerConfig[`bannerLink${linkNumber}`] || '';
}
function getBannerNumber(userId) {
    const bannerConfig = getBannerConfig(userId);
    return bannerConfig[`bannerNumber`] || '';
}


module.exports = {
    saveBanner,
    getBannerLink,
    addBio,
    getBio,
    writeBannerNumber,
    getBannerNumber
};
