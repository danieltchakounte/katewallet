
BALANCE = {
    'en':"""
    Wallet Value : ${0}\n\n*INJ* : {1}\n*Staked* : {2}\n*Staking Reward* : {3}
    """
}

DEPOSIT = {
    'en':"""
    *Your Injective deposit wallet is :*\n\n`{0}`\n\nNote that you can backup your seed phrase & private key with /backup command
    """
}

UNEXISTANT = {
    "en":"""
    You don't have any active wallet now\n\n*To create your walllet* please type /start
    """
}

UNEXISTANT_TIP = {
    'en':"""
    [{0}](tg://user?id={1}) don't have any active wallet now\n\n*To create your walllet* please type /start
    """
}

EXISTANT = {
    "en":"""
    Your wallet has been created successfully\n\nYou will receive you balance now
    """
}

DEPOSIT_RECEIVED = {
    'en':"""
    *DEPOSIT RECEIVED*\n{0} {1} was sent to you\n\n*Transaction hash ⛓️ :* `{2}`
    """
}

ALREADY = {
    'en':"""
    Hello, you already have a wallet. Please check your balance with /balance command.
    """
}

WITHDRAW = {
    'en':"""
    *WITHDRAWAL SUCCESSFUL*\nYou transferred out *{0} {1}* successfully\n\n*Transaction hash ⛓️ :* `{2}`
    """
}

BACKUP = {
    'en':"""
    These 12 words  and privatekey are for your wallet.\nDo not share it with anyone. Anyone with these information can gain full control of your funds\n\n\n*SEED PHRASE 📝*\n\n`{0}`\n\n*PRIVATE KEY 🔑*\n\n`{1}`\n\n\nPlease write them down in the correct order and store it in a safe place.
    """
}

STAKE_MESSAGE = {
    'en':"""
    Your request has been submitted and *{0}*\nTransaction Hash ⛓️\n`{1}`
    """
}

STAKE_STATUS = {
'en':{False:"🔴 Failed", True:"🟢 Worked"}
}

STAKE_VALID_COMMAND = {
    'en':"""
    *Here is the valid command to stake your INJ in the Injective Chain*\n\n`/stake amount validator_address`\n\nExample : /stake 1 injvaloper16nd8yqxe9p6ggnrz58qr7dxn5y2834yeytmczf\n\n*DETAILS* :\n\n*amount* : amount of INJ you want to stake\n\n*validator_address* : The validator address you want to delegate.
    """
}

UNSTAKE_VALID_COMMAND = {
    'en':"""
    *Here is the valid command to unstake your INJ in the Injective Chain*\n\n`/unstake amount validator_address`\n\nExample : /unstake 1 injvaloper16nd8yqxe9p6ggnrz58qr7dxn5y2834yeytmczf\n\n*DETAILS* :\n\n*amount* : amount of INJ you want to unstake\n\n*validator_address* : The validator address you delegated your INJ.
    """
}

CLAIM_VALID_COMMAND = {
    'en':"""
    *Here is the valid command to claim your reward in Injective Chain*\n\n`/claim validator_address`\n\nExample : /claim injvaloper16nd8yqxe9p6ggnrz58qr7dxn5y2834yeytmczf\n\n*DETAILS* :\n\n*validator_address* : The validator address you delegated your INJ.
    """
}

WITHDRAW_VALID_COMMAND = {
    'en':"""
    *Here is the valid command to withdraw your coin from your wallet*\n\n`/withdraw amount coin injective_address`\n\nExample : /withdraw 1 inj injtdjhd....tttrw\n\n*DETAILS* :\n\n*amount* : amount of coin you want to withdraw\n\n*coin* : The specific coin you want to withdraw (all coin taking in charge by KateWallet are in your balance summary. You can manage other one by importing you private key in other app wallet, to get you seed and private key type /backup comand)\n\n*injective_address* : The address you want to send funds to.
    """
}

TIP_VALID_COMMAND = {
    'en':"""
    *Here is the valid command to tip your coin to anyone*\n\n`/tip amount coin`\n\nExample : /tip 1 inj\n\n*DETAILS* :\n\n*amount* : amount of coin you want to tip\n\n*coin* : The specific coin you want to tip (all coin taking in charge by KateWallet are in your balance summary.)\n\nPLEASE NOTE THAT : all tip command are made in chain, you need to pay on chain fee for that.
    """
}

PROPOSAL_NOTIF = {
    'en':"""
    *NEW PROPOSAL ON INJECTIVE CHAIN*\n\n*TITLE :* {0}\n\n*DESCRIPTION*\n{1}\n\n*HASH :* `{2}`
    """
}

PRICE_NOTIF = {
    'en':"""
    New {0} daily {1} : ${2}
    """
}

VOTE_NOTIF = {
    'en':"""
    *NEW VOTE ON INJECTIVE CHAIN*\n\n*PROPOSAL ID :* {0}\n*VOTE OPTION :* {1}\n*VOTER ADDRESS :* `{2}`\n*HASH :* {3}
    """
}