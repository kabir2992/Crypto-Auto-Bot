function getAngleOneConfig()
{
    return {
        apiKey: process.env.MCX_API_KEY,
        secretKey: process.env.MCX_SECRET_KEY,
        clientId: process.env.MCX_CLIENT_ID,
        password: process.env.MCX_PASSWORD
    };
}

module.exports = getAngleOneConfig;
