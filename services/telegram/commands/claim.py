from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, MessageEntity
from telegram.ext import ContextTypes, CommandHandler, CallbackQueryHandler
from configuration.response import STAKE_MESSAGE, UNEXISTANT, STAKE_STATUS, CLAIM_VALID_COMMAND
from katewallet.katewallet import KateWalletService

async def claim(update : Update, context : ContextTypes.DEFAULT_TYPE):
    try:
        command = update.message.text.split()[0]
        msg = update.message.text[len(command):].strip()
        if len(msg) <=0 :
            text = CLAIM_VALID_COMMAND['en']
        else:
            try:
                validator = str(update.message.text.split()[1])
       
                if validator.startswith('injvaloper'):
                    database = KateWalletService()
                    exist_wallet = await database.check_exist(update.effective_chat.id)
                    if (exist_wallet):
                        stake = await database.claim_reward(update.effective_chat.id, validator)
                        text = STAKE_MESSAGE['en'].format(STAKE_STATUS['en'][stake['worked']], stake['hash'])
                    else: 
                        text = UNEXISTANT['en']
                else:
                    text = 'Please enter a valid validator address. It should start with *injvaloper*'
            except:
                text = '*Validator address missing*\nTry with `/stake amount validator_address`'
                
            
    except :
        text=  CLAIM_VALID_COMMAND['en']

    
    await context.bot.send_message(chat_id= update.effective_chat.id,
            text=text,
            parse_mode= 'Markdown'
            )