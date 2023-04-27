from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, MessageEntity
from telegram.ext import ContextTypes, CommandHandler, CallbackQueryHandler
from configuration.response import DEPOSIT, UNEXISTANT
from katewallet.katewallet import KateWalletService

async def deposit(update : Update, context : ContextTypes.DEFAULT_TYPE):
    database = KateWalletService()
    exist_wallet = await database.check_exist(update.effective_chat.id)
    if (exist_wallet):
        deposit = await database.deposit(update.effective_chat.id)
        text = DEPOSIT['en'].format(deposit)
    else: 
        text = UNEXISTANT['en']

    await context.bot.send_message(chat_id= update.effective_chat.id,
        text=text,
        parse_mode= 'Markdown'
        )