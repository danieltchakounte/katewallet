from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, MessageEntity
from telegram.ext import ContextTypes, CommandHandler, CallbackQueryHandler
from configuration.response import DEPOSIT, UNEXISTANT
from configuration.config import ASSET, FEEDID
from katewallet.katewallet import KateWalletService

async def price(update : Update, context : ContextTypes.DEFAULT_TYPE):
    try:
        command = update.message.text.split()[0]
        msg = update.message.text[len(command):].strip()
        if len(msg) <=0 :
            text = 'Try with `/price inj`\n or \n`/price alert asset` to get alert on the asset price  daily High & Low, ATH & ATL change.'
        else:
            try:
                action = str(update.message.text.split()[1])
                database = KateWalletService()
                if action == "alert":
                    try:
                        asset = str(update.message.text.split()[2])
                        if asset in ASSET:
                            set_alert = await database.set_price_alert(update.effective_chat.id,
                                                                           FEEDID[asset])
                            if not set_alert:
                                remove_alert = await database.remove_price_alert(update.effective_chat.id, FEEDID[asset])
                                text = f'You will no longer receive alert on *{asset}* change'
                            else:
                                text = f'You will receive alert on *{asset}* change'
                        else:
                            text = f'Sorry {action} in not taking in charge yet'
                    except:
                        text = 'Please provide which asset you want to receive alert for.'

                elif action.lower() in ASSET:
                    
                    price = await database.get_price(FEEDID[action.lower()])
                        
                    text = f'${price}'

                else:
                    text = f'Sorry {action} in not taking in charge yet'
            except:
                text = '*Action missing*\nTry with `/price inj`\n or \n`/price alert asset` to get alert on the asset price  daily High & Low, ATH & ATL change.'
                
            
    except :
        text=  'Try with `/price inj`\n or \n`/price alert asset` to get alert on the asset price  daily High & Low, ATH & ATL change.'

    
    await context.bot.send_message(chat_id= update.effective_chat.id,
            text=text,
            parse_mode= 'Markdown'
            )