(async function () {
    try {
        const chain = "rinkeby"
        const apiKey = "B6GD33RGX4ZMJEGRDYXCBK1GDDTKR3XC2S"
        const contract = "0x3E5a5088a9c78e7D4019dDF6Fe2EE40Bd99Fa0b1"
        const methodId = '0xa0712d68' // mint

        const provider = new ethers.providers.EtherscanProvider(chain, apiKey)
        const history = await provider.getHistory(contract)

        //const account = "0x6622fc4e762cb40df85aa40e40344cdb820b20db"
        //const account = '0xc114d3109a8cc85b40ba231cda11c1d815654c7d'
        const account = '0xce44c100d396ca082b1ee704981779814c278f8f'

        const transactions = []

        await (async function next(i) {
            if (i < 0) return

            const { from, data, hash, timestamp } = history[i]

            if (data.slice(0, 10) === methodId && from.toLowerCase() === account) {
                const { status } = await provider.getTransactionReceipt(hash)

                transactions.push({ hash, date: new Date(timestamp * 1000), status })
            }

            return next(i - 1)
        })(history.length - 1)

        console.log(transactions)
    } catch (error) {
        console.error(error)
    }
})()
