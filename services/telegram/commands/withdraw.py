from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, MessageEntity
from telegram.ext import ContextTypes, CommandHandler, CallbackQueryHandler
from configuration.response import STAKE_MESSAGE, UNEXISTANT, STAKE_STATUS, WITHDRAW_VALID_COMMAND
from configuration.config import DENOM
from katewallet.katewallet import KateWalletService

async def withdraw(update : Update, context : ContextTypes.DEFAULT_TYPE):
    
    try:
        command = update.message.text.split()[0]
        msg = update.message.text[len(command):].strip()
        if len(msg) <=0 :
            text = WITHDRAW_VALID_COMMAND['en']
        else:
            try:
                amount = int(update.message.text.split()[1])
                try:
                    denom = str(update.message.text.split()[2])
                    if denom.lower() in DENOM.keys():
                        try:
                            to_address = str(update.message.text.split()[3])
                            if to_address.startswith('inj'):
                                database = KateWalletService()
                                exist_wallet = await database.check_exist(update.effective_chat.id)
                                if (exist_wallet):
                                    await context.bot.send_message(update.effective_chat.id, text ="Please wait while we're submitting your request....")
                                    withdraw = await database.withdraw(update.effective_chat.id, amount, denom, to_address)
                                    text = STAKE_MESSAGE['en'].format(STAKE_STATUS['en'][withdraw['worked']], withdraw['hash'])
                                else: 
                                    text = UNEXISTANT['en']
                            else:
                                text = 'Invalid Injective address. Please review it and try again'
                        except:
                            text = '*Destination address missing*'
                    else:
                        text = 'Please enter a valid coin taking in charge by KateWallet.'
                except:
                    text = '*Coin to withdraw is missing*\nTry with `/withdraw amount coin injective_address`'
                
            except:
                text = '*Amount to withdraw is not a valid number*. Please review it and try again'
    except:
        text = WITHDRAW_VALID_COMMAND['en']

    
    await context.bot.send_message(chat_id= update.effective_chat.id,
            text=text,
            parse_mode= 'Markdown'
            )