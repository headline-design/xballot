import { INDEXER_URL, NODE_URL } from "@xballot/sdk";

const wizard = 'PPFMWPQEQOIKGUO5WST7X6VKQ65NCMT6R6AOY6QYZTRCREGVSLOKUB72UY'
//wizard hex = 0x7bcacb3e048390a351ddb4a7fbfaaa87bad1327e8f80ec7a18cce22890d592dc
//use node hexAddrGen.mjs to generate new hexes for teal contract

const MainNode = NODE_URL


const token = ''
const server = MainNode
const port = ''
const algodclient = new algosdk.Algodv2(token, server, port)

const indexer = INDEXER_URL

class customOrders {
    static thisAppId = 904805446

    static async deploy(
    ) {
        let val1 = document.getElementById("domain").value
        let val2 = document.getElementById("assetId").value

        let goodToGo = await checkDomain()

        if (goodToGo && (val2 !== "") && (val1 !== "")){

        let appId = await Pipeline.deployTeal(
            main,
            clear,
            [8, 8, 6, 8],
            ['create'],
            0
        )
        alert('created app: ' + appId)
        document.getElementById("appId").value = appId
        await alertBackend()
        }
        else{
            alert("domain name owned OR domain name or asset missing")
        }
    }

    static async getRound() {
        let data = await fetch("https://testnet-idx.algonode.cloud/health")
        let data2 = await data.json()
        return data2.round
    }

    static async salvage(nftId, assetId, appId, userInfo) {
        let appAddress = algosdk.getApplicationAddress(appId)
        let txid = await Pipeline.appCall(
            appId,
            ['salvage'],
            [appAddress],
            [parseInt(nftId), parseInt(assetId)]
        )
        console.log(txid)

        if (txid !== 'undefined') {
            return txid
        }
    }


    static async buy(nftId, creator, appId,tinyAddress, oracle, amount, price) {

       /*  if (oracle) {
            alert(
                'Price displayed is in Algos but will execute in an ASA equivalent value'
            )
            paymentInfo.price = await this.getOraclePrice(
                tinyAddress,
                paymentInfo.price,
                paymentInfo.paymentAsset
            )
        } */

        let appAddress = algosdk.getApplicationAddress(appId)

        let params = await algodclient.getTransactionParams().do()

        let opted = await nftFunctions.checkMyAsaOpt(
            parseInt(nftId),
            Pipeline.address
        )

        if (!opted) {
            const optInTransaction =
                algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                    amount: 0,
                    from: Pipeline.address, // Escrow address used by nft app
                    to: Pipeline.address,
                    suggestedParams: params,
                    assetIndex: +nftId,
                })

            const optinSign = await Pipeline.sign(optInTransaction)

            let response0 = undefined

            response0 = await algodclient.sendRawTransaction(optinSign).do()

            alert('Opted into asset with txn: ' + response0.txId)
        }

        let appCallTxn = algosdk.makeApplicationCallTxnFromObject({
            from: Pipeline.address,
            appIndex: parseInt(appId), // Assuming nft detail app id,
            suggestedParams: params,
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
            appArgs: [Uint8Array.from(Buffer.from('buy')),algosdk.encodeUint64(amount)],
            foreignAssets: [ parseInt(nftId)],
            accounts: [creator, appAddress, wizard, tinyAddress],
        })

        let buyTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            amount: parseInt(amount * price),
            from: Pipeline.address,
            to: creator,
            suggestedParams: params,
        })

        let feeTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            amount: parseInt((amount * price) / 33) + 10,
            from: Pipeline.address,
            to: wizard,
            suggestedParams: params,
        })

        let groupTransactionId = algosdk.computeGroupID([appCallTxn, buyTxn, feeTxn])

        appCallTxn.group = groupTransactionId
        buyTxn.group = groupTransactionId
        feeTxn.group = groupTransactionId

        let txnArray = [appCallTxn, buyTxn, feeTxn]

        let signers = [Pipeline.address, Pipeline.address, Pipeline.address]

        let signed = await Pipeline.sign(txnArray, true, signers)

        let response = await algodclient.sendRawTransaction(signed).do()
        let txid = response.txId

        alert('Success! TXID: ' + txid)
        if (response.txId) {
            return response.txId
        } else {
            alert(JSON.stringify(response))
        }
    }

    static async getOraclePrice(
        tinyAddress = '5XQEBPFLVR5WOGZNVSLHVKELRDP2LVVLB44OWZ7WA3JKQ72SYTD6MVZTWI',
        price = 1,
        asset = 27165954
    ) {
        let data = await fetch(
            'https://testnet-idx.algonode.cloud/v2/accounts/' + tinyAddress
        )
        let dataJSON = await data.json()

        let asaBalance = 0

        dataJSON.account.assets.forEach(entry => {
            console.log(entry)
            if (entry['asset-id'] === asset) {
                asaBalance = entry.amount
            }
        })

        return parseInt((asaBalance / dataJSON.account.amount) * (price + price * 0.08))
    }

    static async readGlobal(appId) {
        let data = await fetch(INDEXER_URL + "applications/" + appId)

        let dataJSON = await data.json()

        let values = dataJSON.application.params["global-state"]
        let obj = {}

        obj.creator = dataJSON.application.params.creator

        values.forEach(object => {
            switch (object.key) {
                case 'cHJpY2U=':
                    obj.price = object.value.uint
                    break
                default:
                    break
            }
        })
        console.log(obj)
        return obj
    }
}

async function checkMyAsaOpt (asa, address, amount = false) {
    let data = await fetch(INDEXER_URL + "accounts/" + address)
    let dataJSON = await data.json()
    let asaBalance = 0
    let detected = false
    if (dataJSON.account.assets !== undefined) {
        dataJSON.account.assets.forEach(element => {
            if (element['asset-id'] === asa) {
                asaBalance = element.amount
                detected = true
            }
        })
        return !amount ? detected : asaBalance
    } else {
        return !amount ? false : asaBalance
    }
}

const main = `#pragma version 8
// check if the app is being created
// if so save creator
int 0
txn ApplicationID
==
bz not_creation
byte "Creator"
txn Sender
app_global_put
byte "index"
int 0
app_global_put
int 1
return
not_creation:
// check if this is deletion
int DeleteApplication
txn OnCompletion
==
bz not_deletion
//check if deletor is creator
byte "Creator"
app_global_get
txn Sender
==
bz failed
int 1
return
not_deletion:
//---
// check if this is update
int UpdateApplication
txn OnCompletion
==
bz not_update
byte "Creator"
app_global_get
txn Sender
==
bz failed
int 1
return
not_update:
// check for closeout
int CloseOut
txn OnCompletion
==
bnz close_out
//start the vote
txna ApplicationArgs 0
byte "start"
==
bnz start
//register
txna ApplicationArgs 0
byte "register"
==
bnz register
//vote
txna ApplicationArgs 0
byte "vote"
==
bnz vote
txna ApplicationArgs 0
byte "describe"
==
bnz describe
txna ApplicationArgs 0
byte "transfer"
==
bnz transfer
txna ApplicationArgs 0
byte "enable"
==
bnz enable
transfer:
byte "Creator"
app_global_get
txn Sender
==
bz failed
byte "Creator"
txna Accounts 1
app_global_put
int 1
return
enable:
global GroupSize
int 1
==
bz failed
byte 0x7bcacb3e048390a351ddb4a7fbfaaa87bad1327e8f80ec7a18cce22890d592dc
gtxn 0 Sender
==
bz failed
byte "createdAsset"
txna ApplicationArgs 1
btoi
app_global_put
byte "enabled"
int 1
app_global_put
int 1
return
describe:
//byte "desc"
//byte "testing box"
//box_put
byte "Creator"
app_global_get
txn Sender
==
bz failed
byte "DaoDescription"
txna ApplicationArgs 1
app_global_put
int 1
return
vote:
global Round
byte "maxRound"
app_global_get
<
bz failed
byte "index"
app_global_get
int 0
byte "index"
app_local_get
-
store 0
load 0
int 0
!=
bz failed
load 0
int 1
==
bz failed
int 0
byte "index"
int 0
byte "index"
app_local_get
int 1
+
app_local_put
int 0
byte "prop1"
txna ApplicationArgs 1
app_local_put
int 1
return
start:
//check if creator has nft
txn Sender
byte "createdAsset"
app_global_get
asset_holding_get AssetBalance
pop
int 0
>
bz failed
byte "maxRound"
app_global_get
global Round
<
bz failed
byte "description"
txna ApplicationArgs 1
app_global_put
byte "maxRound"
txna ApplicationArgs 2
btoi
app_global_put
byte "index"
int 1
byte "index"
app_global_get
+
app_global_put
int 1
return
register:
int OptIn
txn OnCompletion
==
bz failed
int 0
byte "delegateVote"
byte "null"
app_local_put
int 0
byte "index"
int 0
app_local_put
int 0
byte "reinforcement"
int 0
app_local_put
int 1
return
//call if this is a closeout op
close_out:
int 1
return
failed:
int 0
return
finished:
int 1
return`

const clear = `#pragma version 8
int 1
return`

async function checkDomain(){
    let url = "http://192.168.1.107:8888/index/banned"
    let domain = document.getElementById("domain").value
    let data = await fetch(url)
    let dataJSON = await data.json()
    console.log(dataJSON)
    if (!dataJSON.includes(domain)){
        return true
    }
    else{
        return false
    }
}

async function alertBackend(){

    let url = "http://192.168.1.107:8888/"

    let options = {
        method: 'POST',
        body: undefined,
        headers: {
            'Content-Type': 'application/json'
        }
    }

    let wizard = "PPFMWPQEQOIKGUO5WST7X6VKQ65NCMT6R6AOY6QYZTRCREGVSLOKUB72UY"

    let paymentId = await Pipeline.send(wizard,1000000,"",undefined,undefined,0)

    let user2 = {
            appId: document.getElementById("appId").value,
            recipient: Pipeline.address,
            txid: paymentId,
            domain: document.getElementById("domain").value,
            voteToken: document.getElementById("assetId").value
        }

        let newOptions = {...options}
        newOptions.body = JSON.stringify(user2)


        let data = await fetch(url + "upload/init", newOptions)

        let dataJSON = await data.json()
        console.log(dataJSON)
        if(dataJSON.assetId){
            let optTxid = await Pipeline.send(Pipeline.address,0,"",undefined,undefined,dataJSON.assetId)
            alert("Opted in with txid " + optTxid)
            if (optTxid !== undefined){
                let serverResponse = await fetch(url + "upload/enable", newOptions)
            }
        }

}
