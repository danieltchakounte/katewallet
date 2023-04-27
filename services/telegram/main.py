from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, MessageEntity
from telegram.ext import ApplicationBuilder, CommandHandler, CallbackQueryHandler, Application
import logging
import threading
from configuration.config import TOKEN
from commands.balance import balance
from commands.start import start
from commands.deposit import deposit
from commands.backup import backup
from commands.stake import stake
from commands.withdraw import withdraw
from commands.profile import profile
from commands.claim import claim
from commands.unstake import unstake
from commands.setting import setting
from commands.price import price
from commands.vote import vote
from commands.proposal import proposal
from commands.tip import tip
from notification.server import NotificationCenter

#pip install python-telegram-bot[job-queue]

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

class KateWalletTelegram:
    def __init__(self):
        async def post_init(application : Application):
            await application.bot.set_my_commands([
            ('start', 'create your wallet'), 
            ('balance', 'check your wallet balance'),
            ('deposit', 'Get your deposit address'),
            ('withdraw', 'Withraw your funds from KateWallet'),
            ('tip', 'Tip coin to a message author'),
            ('backup', 'backup your seed phrase & private key'),
            ('stake', 'stake your INJ'),
            ('setting', 'Set your alert'),
            ('price', 'get price on asset')
        ])
        app_builder = ApplicationBuilder().get_updates_pool_timeout(10)
        kate_wallet = app_builder.token(TOKEN).post_init(post_init).build()
        job_queue = kate_wallet.job_queue
        
        print('threading server')
        threading.Thread(target=NotificationCenter, args=[kate_wallet, job_queue]).start()
        print('now we continue')

        balance_handler = CommandHandler('balance', balance)
        stake_handler = CommandHandler('stake', stake)
        withdraw_handler = CommandHandler('withdraw', withdraw)
        backup_handler = CommandHandler('backup', backup)
        deposit_handler = CommandHandler('deposit', deposit)
        start_handler = CommandHandler('start', start)
        profile_handler = CommandHandler('profile', profile)
        claim_handler = CommandHandler('claim', claim)
        unstake_handler = CommandHandler('unstake', unstake)
        setting_handler = CommandHandler('setting', setting)
        vote_handler = CommandHandler('vote', vote)
        price_handler = CommandHandler('price', price)
        proposal_handler = CommandHandler('proposal', proposal)
        tip_handler = CommandHandler('tip', tip)
        
        kate_wallet.add_handler(CallbackQueryHandler(deposit, pattern="^" + 'deposit' + "$"))
        kate_wallet.add_handler(CallbackQueryHandler(stake, pattern="^" + 'stake' + "$"))
        kate_wallet.add_handler(CallbackQueryHandler(withdraw, pattern="^" + 'withdraw' + "$"))
        kate_wallet.add_handler(CallbackQueryHandler(profile, pattern="^" + 'profile' + "$"))
        kate_wallet.add_handler(CallbackQueryHandler(claim, pattern="^" + 'claim' + "$"))
        kate_wallet.add_handler(CallbackQueryHandler(unstake, pattern="^" + 'unstake' + "$"))
        kate_wallet.add_handler(CallbackQueryHandler(setting, pattern="^" + 'setting' + "$"))
        kate_wallet.add_handler(CallbackQueryHandler(vote, pattern="^" + 'vote' + "$"))
        kate_wallet.add_handler(CallbackQueryHandler(proposal, pattern="^" + 'proposal' + "$"))
        kate_wallet.add_handler(CallbackQueryHandler(price, pattern="^" + 'price' + "$"))                                                     
        
        kate_wallet.add_handler(start_handler)
        kate_wallet.add_handler(balance_handler)
        kate_wallet.add_handler(backup_handler)
        kate_wallet.add_handler(deposit_handler)
        kate_wallet.add_handler(stake_handler)
        kate_wallet.add_handler(withdraw_handler)
        kate_wallet.add_handler(profile_handler)
        kate_wallet.add_handler(claim_handler)
        kate_wallet.add_handler(unstake_handler)
        kate_wallet.add_handler(setting_handler)
        kate_wallet.add_handler(vote_handler)
        kate_wallet.add_handler(proposal_handler)
        kate_wallet.add_handler(price_handler)
        kate_wallet.add_handler(tip_handler)
        
        kate_wallet.run_polling()
        

if __name__ == '__main__':
    KateWalletTelegram()