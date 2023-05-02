from telegram.ext import Application, ContextTypes
from configuration.response import DEPOSIT_RECEIVED, WITHDRAW, PROPOSAL_NOTIF, PRICE_NOTIF, VOTE_NOTIF
from configuration.config import FEEDID

#class Manager:
#    def __init__(self, application : Application):
#        self.application = application

async def transaction(context : ContextTypes.DEFAULT_TYPE):
    print('New Transaction to notify')
    data = context.job.data
    print(data)
    
    text = ''
    for id in data.keys():
        if data[id]['deposit']:
            text = DEPOSIT_RECEIVED['en'].format(round(int(data[id]['amount']) / 10e17, 3), data[id]['denom'], data[id]['hash'])
        else:
            text = WITHDRAW['en'].format(round(int(data[id]['amount']) / 10e17, 3), data[id]['denom'], data[id]['hash'])
            
        await context.bot.send_message(int(id), 
                                            text=text, 
                                            parse_mode= 'Markdown')
        
async def proposal(context : ContextTypes.DEFAULT_TYPE):

    data = context.job.data
    print(data)
    text = PROPOSAL_NOTIF['en'].format(data['title'], data['description'], data['hash'])
    for id in data['id']:
        print(id)
        await context.bot.send_message(int(id), text=text, parse_mode='Markdown')

async def price(context : ContextTypes.DEFAULT_TYPE):
    data = context.job.data
    print(data)
    #for feedid in data.keys():
    text = PRICE_NOTIF['en'].format(list(FEEDID.keys())[list(FEEDID.values()).index(data['feedId'])], data['direction'], data['price'])
    for id in data['id']:
        print(id)
        await context.bot.send_message(int(id), text=text, parse_mode='Markdown')


async def vote(context: ContextTypes.DEFAULT_TYPE):
    data = context.job.data
    print(data)
    text = VOTE_NOTIF['en'].format(data['proposalId'], data['option'], data['voter'], data['hash'])
    for id in data['id']:
        await context.bot.send_message(int(id), text=text, parse_mode='Markdown')

    
