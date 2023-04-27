from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, MessageEntity
from telegram.ext import ContextTypes, CommandHandler, CallbackQueryHandler
from configuration.response import TIP_VALID_COMMAND, UNEXISTANT, STAKE_MESSAGE, STAKE_STATUS, UNEXISTANT_TIP
from configuration.config import DENOM
from katewallet.katewallet import KateWalletService

async def tip(update : Update, context : ContextTypes.DEFAULT_TYPE):
  
    reply_message = update.message.reply_to_message

    if reply_message:
        try:
            command = update.message.text.split()[0]
            msg = update.message.text[len(command):].strip()
            if len(msg) <=0 :
                text = TIP_VALID_COMMAND['en']
            else:
                try:
                    amount = int(update.message.text.split()[1])
                    try:
                        denom = str(update.message.text.split()[2])
                        if denom.lower() in DENOM.keys():
                            database = KateWalletService()
                            exist_wallet = await database.check_exist(update.effective_chat.id)
                            if (exist_wallet):
                                receiver_wallet = await database.check_exist(reply_message.from_user.id)
                                if receiver_wallet:
                                    to_address = await database.deposit(reply_message.from_user.id)
                                    await context.bot.send_message(update.effective_chat.id, text ="Please wait while we're submitting your request in the chain....")
                                    withdraw = await database.withdraw(update.effective_chat.id, amount, denom, to_address)
                                    text = STAKE_MESSAGE['en'].format(STAKE_STATUS['en'][withdraw['worked']], withdraw['hash'])
                                else:
                                    text = UNEXISTANT_TIP['en'].format(reply_message.from_user.first_name, reply_message.from_user.id)
                            else:
                                text = UNEXISTANT['en']
                        else:
                            text = 'Please enter a valid coin taking in charge by KateWallet.'
                    except:
                        text = '*Coin to tip is missing*\nTry with `/tip amount coin`'
                
                except:
                    text = '*Amount to tip is not a valid number*. Please review it and try again'
        except:
            text = TIP_VALID_COMMAND['en']
    else:
        text = 'Please you need to reply to a message to tip your coin to the message author'

    await context.bot.send_message(chat_id= update.effective_chat.id,
            text=text,
            parse_mode= 'Markdown'
            )

    
        