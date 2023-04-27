from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, MessageEntity
from telegram.ext import ContextTypes, CommandHandler, CallbackQueryHandler
from configuration.response import BACKUP, UNEXISTANT
from katewallet.katewallet import KateWalletService

async def backup(update : Update, context : ContextTypes.DEFAULT_TYPE):
    print(update)
    database = KateWalletService()
    exist_wallet = await database.check_exist(update.effective_chat.id)
    if (exist_wallet):
        backup = await database.backup(update.effective_chat.id)
        text = BACKUP['en'].format(backup['mnemonic'], backup['privatekey'])
    else: 
        text = UNEXISTANT['en']

    await context.bot.send_message(chat_id= update.effective_chat.id,
        text=text,
        parse_mode= 'Markdown'
        )