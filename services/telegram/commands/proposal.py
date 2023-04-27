from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, MessageEntity
from telegram.ext import ContextTypes, CommandHandler, CallbackQueryHandler
from configuration.response import DEPOSIT, UNEXISTANT
from configuration.config import ASSET, FEEDID
from katewallet.katewallet import KateWalletService

async def proposal(update : Update, context : ContextTypes.DEFAULT_TYPE):
    try:
        command = update.message.text.split()[0]
        msg = update.message.text[len(command):].strip()
        if len(msg) <=0 :
            text = 'Try with `/proposal on`\n or \n`/proposal off` to get alert on new proposal on the Injective Chain .'
        else:
            try:
                action = str(update.message.text.split()[1])
                database = KateWalletService()
                if action == "on":
                    
                    set_alert = await database.set_proposal_alert(update.effective_chat.id)
                    text = f'You will receive alert on new proposal in the Injective Chain'
                      

                elif action == "off":
                    
                    price = await database.remove_proposal_alert(update.effective_chat.id)
                        
                    text = f'You will no longer receive alert on new proposal in the Injective Chain'

                else:
                    text = f'Sorry {action} in not taking in charge yet'
            except:
                text = '*Action missing*\nTry with `/proposal on`\n or \n`/proposal off` to get alert on new Proposal on the Injective Chain .'
                
            
    except :
        text=  'Try with `/proposal on`\n or \n`/proposal off` to get alert on new proposal on the Injective Chain .'

    
    await context.bot.send_message(chat_id= update.effective_chat.id,
            text=text,
            parse_mode= 'Markdown'
            )