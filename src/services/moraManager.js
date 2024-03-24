const fs = require('fs');

const moraFile = './src/db/money/mora.json';

function loadMoraData() {
    try {
        if (!fs.existsSync(moraFile)) {
            fs.writeFileSync(moraFile, '{}');
            console.log('Arquivo criado com sucesso:', moraFile);
        }
        
        const rawdata = fs.readFileSync(moraFile, 'utf-8');
        if (rawdata.trim() === '') {
            console.log('Arquivo mora.json vazio. Conteúdo inicial adicionado.');
            return {};
        }
        
        return JSON.parse(rawdata);
    } catch (error) {
        console.error('Erro ao carregar dados de mora:', error);
        return {};
    }
}

function saveMoraData(moraData) {
    try {
        console.log('Salvando dados de mora no arquivo:', moraFile);
        fs.writeFileSync(moraFile, JSON.stringify(moraData, null, 2));
        console.log('Dados salvos com sucesso:', moraFile);
    } catch (error) {
        console.error(`Erro ao salvar dados no arquivo ${moraFile}:`, error);
    }
}

function getLastDailyTimestamp(userId) {
    const moraData = loadMoraData();
    return moraData[userId]?.lastDailyTimestamp || 0;
}

function addMora(userId, value, timestamp) {
    const moraData = loadMoraData();
    moraData[userId] = moraData[userId] || {};
    moraData[userId].lastDailyTimestamp = timestamp;
    moraData[userId].moraBalance = (moraData[userId].moraBalance || 0) + value;
    saveMoraData(moraData);
    console.log(`Mora adicionada para o usuário ${userId}`);
}

function addMoraFlip(userId, value) {
    const moraData = loadMoraData();
    moraData[userId] = moraData[userId] || {};
    moraData[userId].moraBalance = (moraData[userId].moraBalance || 0) + value;
    saveMoraData(moraData);
    console.log(`Mora adicionada para o usuário ${userId}`);
}

function removeMora(userId, amount) {
    const moraData = loadMoraData();
    if (moraData[userId]) {
        moraData[userId].moraBalance -= amount;
        saveMoraData(moraData);
    }
}
function getMora(userId) {
    const moraData = loadMoraData();
    const moraBalance = moraData[userId]?.moraBalance || 0;

    if (moraBalance >= 1000000) {
        return `${(moraBalance / 1000000).toFixed(1)}m`;
    } else if (moraBalance >= 1000) {
        return `${(moraBalance / 1000).toFixed(1)}k`;
    } else {
        return moraBalance.toString();
    }
}


module.exports = {
    getLastDailyTimestamp,
    addMora,
    loadMoraData,
    saveMoraData,
    addMoraFlip,
    removeMora,
    getMora
};
