from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, MessageEntity
from telegram.ext import ContextTypes, CommandHandler, CallbackQueryHandler
from configuration.response import ALREADY, EXISTANT
from katewallet.katewallet import KateWalletService
from .balance import balance

async def start(update : Update, context : ContextTypes.DEFAULT_TYPE):
    database = KateWalletService()
    wallet = await database.create_wallet(update.effective_chat.id)
    
    if wallet is False:
        text = ALREADY['en']
    else:
        if wallet['exist'] and not wallet['add_wallet']:
            await balance(update, context)
        else: 
            text = EXISTANT['en']

    await context.bot.send_message(chat_id= update.effective_chat.id,
        text=text,
        parse_mode= 'Markdown'
        )
    
    if wallet['add_wallet']:
        await balance(update, context)