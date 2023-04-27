from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, MessageEntity
from telegram.ext import ContextTypes, CommandHandler, CallbackQueryHandler
from configuration.response import BALANCE, UNEXISTANT
from katewallet.katewallet import KateWalletService


async def setting(update : Update, context : ContextTypes.DEFAULT_TYPE):
    database = KateWalletService()
    #exist_wallet = await database.check_exist(update.effective_chat.id)
    muted = "🔇"
    active = "🔊"
    price_icon = muted
    vote_icon = muted
    proposal_icon = muted
    
    priceAlert = await database.get_price_alert(update.effective_chat.id)
    if priceAlert :
        price_icon = active

    vote_alert = await database.get_vote_alert(update.effective_chat.id)
    proposal_alert = await database.get_proposal_alert(update.effective_chat.id)

    if vote_alert :
        vote_icon = active
    if proposal_alert: 
        proposal_icon = active


    text = "Here is your setting"

    try:
        keyboard = [
            [
                InlineKeyboardButton(f"{price_icon} Price Alert", callback_data="price"),
                InlineKeyboardButton(f"{vote_icon} New Vote Alert", callback_data="vote"),
            ],
            [
                InlineKeyboardButton(f"{proposal_icon} New Proposal Alert", callback_data="proposal"),
                    
            ]
                
        ]

        reply_markup = InlineKeyboardMarkup(keyboard)
            
        await context.bot.send_message(chat_id= update.effective_chat.id,
            text=text,
            parse_mode= 'Markdown',
            reply_markup=reply_markup
            )
    except:
        pass
    

    