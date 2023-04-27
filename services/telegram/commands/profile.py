from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, MessageEntity
from telegram.ext import ContextTypes, CommandHandler, CallbackQueryHandler
from configuration.response import DEPOSIT, UNEXISTANT
from katewallet.katewallet import KateWalletService

async def profile(update : Update, context : ContextTypes.DEFAULT_TYPE):
    database = KateWalletService()
    exist_wallet = await database.check_exist(update.effective_chat.id)
    if (exist_wallet):
        profile = await database.profile(update.effective_chat.id)
        if len(profile) <= 0:
            text = "You don't have any delegation at the moment."
        else:
            text = ""
            for validator in profile:
                text = text + "--------------\nValidator Details :\nAddress : `{0}`\nStaked : {1}\nReward : {2}\n\n".format(validator, round(int(profile[validator]['stake'])/10e17, 3), round(int(profile[validator]['reward'])/10e17, 3))
            
    else: 
        text = UNEXISTANT['en']

    keyboard = [
                [    InlineKeyboardButton("Claim Reward", callback_data="claim"),
                    InlineKeyboardButton("Unstake", callback_data="unstake")
                ]
    ]
                    

    reply_markup = InlineKeyboardMarkup(keyboard)

    await context.bot.send_message(chat_id= update.effective_chat.id,
        text=text,
        parse_mode= 'Markdown',
        reply_markup=reply_markup
        )