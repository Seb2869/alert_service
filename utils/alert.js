import {
    messagebirdUrl,
    discordUrl,
    discordPIUrl,
    depositUrl,
    withdrawUrl,
    idMaksim,
    idMatvey
} from "./utils.js";


export const sendMessageToMessageBird = async (message) => {
    const messagebird_data = {
        "call": message
    };

    try {
        const response = await fetch(messagebirdUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messagebird_data),
        });

        if (!(response.ok)) {
            console.error('MessageBird: Ошибка при отправке сообщения');
        }
    } catch (error) {
        console.error('MessageBird: Ошибка при отправке сообщения', error);
    }
}


export const sendMessageToDiscord = async (message) => {
    try {
        const messageWithId = message + `. <@${idMatvey}>, <@${idMaksim}>`;
        const response = await fetch(discordUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: messageWithId }),
        });

        if (!(response.ok)) {
            console.error('Discord: Ошибка при отправке сообщения');
        }
    } catch (error) {
        console.error('Discord: Ошибка при отправке сообщения', error);
    }
}

export const sendPIToDiscord = async (message) => {
    try {
        const response = await fetch(discordPIUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: message }),
        });

        if (!(response.ok)) {
            console.error('Discord: Ошибка при отправке сообщения');
        }
    } catch (error) {
        console.error('Discord: Ошибка при отправке сообщения', error);
    }
}


export const sendTxMessage = async (content, eventType) => {
    let webhookUrl;
    if (eventType === "Deposit") {
        webhookUrl = depositUrl;
    } else if (eventType === "Withdraw") {
        webhookUrl = withdrawUrl;
    } else {
        return;
    }
    const data = {
        "content": content
    };
    try {
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (response.status !== 204) {
            console.error(`Failed to send message to Discord. Status code: ${response.status}`);
        }
    } catch (error) {
        console.error("Failed to send message to Discord.", error);
    }
}
