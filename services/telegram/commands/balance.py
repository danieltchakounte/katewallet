from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, MessageEntity
from telegram.ext import ContextTypes, CommandHandler, CallbackQueryHandler
from configuration.response import BALANCE, UNEXISTANT
from configuration.config import FEEDID
from katewallet.katewallet import KateWalletService


async def balance(update : Update, context : ContextTypes.DEFAULT_TYPE):
    database = KateWalletService()
    exist_wallet = await database.check_exist(update.effective_chat.id)
    if (exist_wallet):

        balance = await database.get_balance(update.effective_chat.id)
        if 'inj' in balance['available'].keys():
            inj_value = await database.get_price(FEEDID['inj'])
            balance_value = (round((int(balance['available']['inj']) /10e17), 3) * inj_value) + (round((int(balance['delegation']['staked']) /10e17), 3) * inj_value)
            text = BALANCE['en'].format(balance_value, round((int(balance['available']['inj']) /10e17), 3), round(int(balance['delegation']['staked']) /10e17, 3), round(int(balance['delegation']['reward']) / 10e17, 3))
        else:
            text = BALANCE['en'].format(0, 0, balance['delegation']['staked'], balance['delegation']['reward'])

        try:
            keyboard = [
                [
                    InlineKeyboardButton("⬇️ deposit", callback_data="deposit"),
                    InlineKeyboardButton("⬆️ withdraw", callback_data="withdraw"),
                ],
                [
                    InlineKeyboardButton("📤 Stake", callback_data="stake"),
                    InlineKeyboardButton('📥 Unstake', callback_data='unstake')
                ],
                [
                    InlineKeyboardButton('👤 Profile', callback_data='profile'),
                    InlineKeyboardButton('⚙️ Setting', callback_data='setting')
                ]
            ]

            reply_markup = InlineKeyboardMarkup(keyboard)
            
            await context.bot.send_message(chat_id= update.effective_chat.id,
                text=text,
                parse_mode= 'Markdown',
                reply_markup=reply_markup
                )
        except:
            print('erro wen sending balance')
            await balance(update, context)
    else: 
        text = UNEXISTANT['en']

        try:
        
        
            await context.bot.send_message(chat_id= update.effective_chat.id,
                text=text,
                parse_mode= 'Markdown'
                )
        except:
            print('erro wen sending balance')
            await balance(update, context)

    