const fs = require('fs');

const storeFile = './src/db/user/store.json';

function loadStoreStorage() {
    try {
        if (!fs.existsSync(storeFile)) {
            fs.writeFileSync(storeFile, '{}');
            console.log('Arquivo criado com sucesso:', storeFile);
        }
        
        const rawdata = fs.readFileSync(storeFile, 'utf-8');
        if (rawdata.trim() === '') {
            console.log('Arquivo store.json vazio. Conteúdo inicial adicionado.');
            return {};
        }
        
        return JSON.parse(rawdata);
    } catch (error) {
        console.error('Erro ao carregar dados da loja:', error);
        return {};
    }
}

function saveBanner(store) {
    try {
        console.log('Salvando dados da loja no arquivo:', storeFile);
        fs.writeFileSync(storeFile, JSON.stringify(store, null, 2));
        console.log('Dados salvos com sucesso:', storeFile);
    } catch (error) {
        console.error(`Erro ao salvar dados no arquivo ${storeFile}:`, error);
    }
}

function getBanners() {
    const bannerData = loadStoreStorage();
    return bannerData.bannersStorage || {}; // Updated to directly return bannerStorage
}

function getBannerLink(bannerNumber) {
    const banners = getBanners();
    const banner = banners[`banner${bannerNumber}`];
    return banner ? banner.bannerUrl : '';
}
function getBannerName(bannerNumber) {
    const banners = getBanners();
    const bannerName = banners[`banner${bannerNumber}`];
    return bannerName ? bannerName.bannerName : '';
}
function getBannerValue(bannerNumber) {
    const banners = getBanners();
    const bannerValue = banners[`banner${bannerNumber}`];
    return bannerValue ? bannerValue.bannerValue : '';
}


module.exports = {
    getBannerLink,
    getBannerName,
    getBannerValue
};
