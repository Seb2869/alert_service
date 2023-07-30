import {
    messagebirdUrl,
    discordUrl,
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
        const messageWithId = message + `. <@${idMatvey}>, <@${idMaksim}`;
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

