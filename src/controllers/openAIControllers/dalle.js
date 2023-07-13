const axios = require('axios')

const headers = {
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
}

const axiosInstance = axios.create({
    baseURL: 'https://api.openai.com/',
    timeout: 120000,
    headers: headers
});

const getDalleResponse = async (clientText) => {
    const body = {
        prompt: clientText, // Descrição da imagem
        n: 1, // Número de imagens a serem geradas
        size: "256x256", // Tamanho da imagem
    }

    try {
        const { data } = await axiosInstance.post('v1/images/generations', body)
        return data.data[0].url
    } catch (e) {
        return `❌ OpenAI Response Error`
    }
}


module.exports = getDalleResponse