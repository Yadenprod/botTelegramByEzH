const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, gameAgain} =require(`./options`)
const token = '7884513002:AAG3TPqP7YXUY8_GFzRByQHmVgMpjtrXSwQ'

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, ты должен ее угадать');
            const randomNumber = Math.floor( Math.random() * 10)
            chats[chatId] = randomNumber;
            await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}

const start = () => {
    bot.setMyCommands( [
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Информация об проекте'},
        {command: '/game', description: 'Играть угадай число'},
    ])


    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        if (text === '/start') {
            await bot.sendMessage(chatId, `Добро пожаловать, ${msg.chat.first_name}! Это телеграм бот азартных игр. (БОТ НА СТАДИИ РАЗРАБОТКИ)`);
            return bot.sendAnimation(chatId, 'https://assets-webflow.ngcdn.ru/cdn.prod/599873abab717100012c91ea/60225ffdae3f7f670129ae2b_5c403facc55710f7f5f03383_ezgif.com-optimize%20(1).gif');
        } else if (text === '/info') {
            return bot.sendMessage(chatId, `${msg.chat.first_name}, здесь будет информация об проекте`);
        } else if (text === '/game') {
            return startGame(chatId);
        }
         else {
            return bot.sendMessage(chatId, `Несуществующая команда! ` + `Ты написал мне: "${text}". Прости, не могу обработать этот текст/команду, мой хозяин творит мою сущность, по всем вопросам обращайтесь к нему @RunGolang`)
        }
    })

    bot.on('callback_query', msg =>  {
            const data = msg.data;
            const chatId =msg.message.chat.id;
            if (data === `/again`) {
               return startGame(chatId);
            }
            if (data == chats[chatId]) {
                return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, gameAgain)
            } else {
                return bot.sendMessage(chatId, `К сожалению ты не отгадал, бот загадал цифру ${chats[chatId]}`, gameAgain)
            }
    })
}
start()