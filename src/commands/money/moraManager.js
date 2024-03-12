// moraManager.js
const fs = require('node:fs');

function getLastDailyTimestamp(userId, moraFile) {
    const moraData = loadMoraData(moraFile);
    return moraData[userId]?.lastDailyTimestamp || 0;
}

function addMora(userId, value, timestamp, moraFile) {
    const moraData = loadMoraData(moraFile);
    moraData[userId] = moraData[userId] || {};
    moraData[userId].lastDailyTimestamp = timestamp;
    moraData[userId].moraBalance = (moraData[userId].moraBalance || 0) + value;
    saveMoraData(moraData, moraFile);
    console.log(`Mora adicionada para o usuário ${userId}. Novo saldo: ${moraData[userId].moraBalance}`);
}

function loadMoraData(moraFile) {
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

function saveMoraData(moraData, moraFile) {
    fs.writeFile(moraFile, JSON.stringify(moraData, null, 2), (err) => {
        if (err) {
            console.error('Erro ao salvar os dados no arquivo:', err);
        } else {
            console.log('Dados salvos com sucesso:', moraFile);
        }
    });
}

module.exports = {
    getLastDailyTimestamp,
    addMora,
    loadMoraData,
    saveMoraData,
};
