import { MainIndexer } from './urls'
import algosdk from 'algosdk'
import { base58btc } from 'multiformats/bases/base58'
import { base32 } from 'multiformats/bases/base32'
import { get } from 'lodash'
import { staticEndpoints } from 'utils/endPoints'

async function fetchWithTimeout(resource, timeout = 8000) {
    let controller = new AbortController()
    setTimeout(() => controller.abort(), timeout)

    try {
        let response = await fetch(resource, {
            signal: controller.signal,
        })
        return response
    } catch (err) {
        console.log('TIMED OUT')
        console.log(resource)
        throw err
    }
}

export default class nftFunctions {
    static async claimNft(userInfo, nftData) {
        try {
            let address = userInfo.walletAddress
            let owned = await nftFunctions.checkOwned(address, nftData.assetId)

            if (owned) {
                let sendData = {
                    nftId: nftData.assetId,
                    ownerId: userInfo.id,
                    toAddress: userInfo.id,
                }
                return 1
            } else {
                alert('Claim failed')
            }
        } catch (error) {
            alert('error occured')
        }
    }

    static async getAlgoPrice() {
        let data = await fetch(staticEndpoints.algoPrice)
        let dataJSON = await data.json()
        let price = dataJSON.price
        return price
    }

    static checkSold = async escrow => {
        try {
            let data = await fetch(MainIndexer + 'accounts/' + escrow)
            let dataJSON = await data.json()
            console.log(dataJSON)
            if (dataJSON.account.ammount > 0) {
                return false
            } else {
                return true
            }
        } catch (error) {
            return false
        }
    }
    static resizeImage(name) {
        function dataURLtoFile(dataurl, filename) {
            var arr = dataurl.split(','),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = window.atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n)

            while (n--) {
                u8arr[n] = bstr.charCodeAt(n)
            }

            return new File([u8arr], filename, { type: mime })
        }

        let imageResizer = document.getElementById('resizer')
        imageResizer.innerHTML = `
      <canvas id="resized"></canvas>
      `

        var canvas = document.getElementById('resized')
        var ctx = canvas.getContext('2d')

        let img = document.getElementById('resizerFull')

        ctx.drawImage(img, 0, 0, 100, 100)

        try {
            let data = canvas.toDataURL()
            return dataURLtoFile(data, name)
        } catch (error) {
            console.error(error)
        }
    }

    static checkMyAsaOpt = async (asa, address, amount = false) => {
        let data = await fetch(`${MainIndexer}accounts/${address}`)
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

    static getUniqueUsers(array) {
        let unique = []
        let unique2 = []
        array.forEach(nft => {
            let imgLink = nft.creator.coverImageUrl
            if (
                !unique.includes(nft.creator.id) &&
                imgLink !== null &&
                imgLink.includes('https')
            ) {
                unique2.push(nft.creator)
                unique.push(nft.creator.id)
            }
        })
        return unique2.slice(0, 5)
    }

    static checkGetArc19 = async asa => {
        let assetId = parseInt(asa)
        let asaData = await fetch(MainIndexer + 'assets/' + assetId)
        let asaDataJson = await asaData.json()
        if (get(asaDataJson, 'asset.params.reserve', false)) {
            let account = algosdk.decodeAddress(asaDataJson.asset?.params?.reserve)

            if (!asaDataJson.asset?.params?.url.includes('arc3')) {
                let newArray = new Uint8Array(34)

                newArray[0] = 18
                newArray[1] = 32
                let i = 2
                account.publicKey.forEach(byte => {
                    newArray[i] = byte
                    i++
                })

                let encoded = base58btc.baseEncode(newArray)
                //console.log(encoded)
                let response = await complete(encoded)
                return response
            } else {
                let newArray = new Uint8Array(36)

                newArray[0] = 1
                newArray[1] = 85
                newArray[2] = 18
                newArray[3] = 32

                let i = 4
                account.publicKey.forEach(byte => {
                    newArray[i] = byte
                    i++
                })

                console.log(newArray)

                let encoded = base32.encode(newArray)

                let response = await complete(encoded)
                return response
            }

            async function complete(hash) {
                try {
                    let url = 'https://xballot-testnet.infura-ipfs.io/ipfs/' + hash
                    //console.log(url)
                    let myJson = await fetchWithTimeout(url)
                    //console.log(myJson)

                    let myJsonParsed = await myJson.json()
                    window.defaultJson = myJsonParsed
                    //let jsonString = JSON.stringify(myJsonParsed);
                    //console.log(jsonString)
                    return myJsonParsed.image.replace(
                        'ipfs://',
                        'https://xballot-testnet.infura-ipfs.io/ipfs/'
                    )
                } catch (e) {
                    return false
                }
            }
        } else {
            return asaDataJson
        }
    }

    static readLocal = async (address, asset = 0) => {
        if (address) {
            let data = await fetch(MainIndexer + 'accounts/' + address)
            let dataJSON = await data.json()
            let usdcBalance = 0
            let hdlBalance = 0
            let ownedAmount = 0

            try {
                dataJSON.account.assets.forEach(assetArray => {
                    if (assetArray['asset-id'] === 31566704) {
                        usdcBalance = assetArray.amount / 1000000
                    }
                    if (assetArray['asset-id'] === 137594422) {
                        hdlBalance = assetArray.amount / 1000000
                    } else {
                        if (assetArray['asset-id'] === asset) {
                            ownedAmount = assetArray.amount
                        }
                    }
                })
            } catch (error) {
                console.log(error)
            }
            let priceURL = 'https://price.algoexplorerapi.io/price/algo-usd'
            try {
                let data2 = await fetch(priceURL)
                let data2Json = await data2.json()
                let price = data2Json.price
                if (dataJSON.account !== undefined) {
                    return {
                        algoBalance: dataJSON.account.amount / 1000000,
                        usdcBalance: usdcBalance,
                        hdlBalance: hdlBalance,
                        price: price,
                        ownedAmount: ownedAmount,
                    }
                } else {
                    console.error('----- undefined account:', dataJSON.account)
                }
            } catch (e) {
                console.error('----- ALGO USD fetch ERROR:', e)
            }
        }
    }

    static getCreator = async assetId => {
        let data = await fetch(MainIndexer + 'assets/' + assetId)
        let dataJSON = await data.json()
        let creator =
            dataJSON.asset && dataJSON.asset?.params && dataJSON.asset?.params?.creator
        return creator
    }

    static getCreator = async asset => {
        let data = await fetch(MainIndexer + 'assets/' + asset)
        let dataJson = await data.json()
        let creator =
            dataJson.asset && dataJson.asset?.params && dataJson.asset?.params?.creator
        //console.log(creator)
        return creator
    }

    static checkOwned = async (owner, asa) => {
        let data = await fetch(MainIndexer + 'accounts/' + owner)

        let dataJSON = await data.json()
        let myAssets = dataJSON.account.assets ? dataJSON.account.assets : []
        let myCreatedAssets = dataJSON.account['created-assets']
            ? dataJSON.account['created-assets']
            : []
        let assets = [...myAssets, ...myCreatedAssets]
        let owned = false

        assets.forEach(asset => {
            if (asset['asset-id'] == asa && asset.amount > 0) {
                owned = true
            }
        })
        console.log(assets)
        return owned
    }

    static getOwner = async asa => {
        let data = await fetch(MainIndexer + 'assets/' + asa + '/balances')

        let dataJSON = await data.json()
        let owner = dataJSON.balances[0].address
        return owner
    }

    static getImage = async asa => {
        let data = await fetch(MainIndexer + 'assets/' + asa)
        let dataJSON = await data.json()
        if (dataJSON.asset) {
            let data2 = dataJSON.asset
            if (data2?.params && data2?.params?.url) {
                let url = dataJSON.asset?.params?.url
                return { url: url, data: data2 }
            }
        }
    }

    static getNFT = async asa => {
        let assetId = parseInt(asa)

        let asaData = await fetch(MainIndexer + 'assets/' + assetId)
        let asaDataJson = await asaData.json()
        return asaDataJson
    }

    static async checkNft(assetId) {
        const defaultArcData =
            '{"standard":"Turbo","description":"Secondary NFT listed via Turbo List.","external_url":"https://nftfactory.org","mime_type":"image/png","properties":{}}'
        let nftObject = {
            true: false,
            hash: '',
            assetId: assetId,
            data: {},
            arc69Data: defaultArcData,
        }

        try {
            let assetData = await nftFunctions.getImage(assetId)
            let newUrl = assetData.url
            nftObject.data = assetData
            //console.log('Creator: ' + assetData.data.params.creator)

            switch (true) {
                case newUrl.includes(
                    'template-ipfs://{ipfscid:0:dag-pb:reserve:sha2-256}'
                ):
                    newUrl = await nftFunctions.checkGetArc19(assetId)
                    if (newUrl.message) {
                        console.log('----- checkGetArc19 ERROR:', newUrl.message)
                    } else {
                        nftObject.hash = newUrl.replace(
                            'https://xballot-testnet.infura-ipfs.io/ipfs/',
                            ''
                        )
                        nftObject.true = true
                        nftObject.type = 'arc19'
                        console.log('detected arc19')
                        return nftObject
                    }
                    break
                case newUrl.includes(
                    'template-ipfs://{ipfscid:1:raw:reserve:sha2-256}#arc3'
                ):
                    newUrl = await nftFunctions.checkGetArc19(assetId)
                    if (newUrl.message) {
                        console.log('----- checkGetArc19 ERROR:', newUrl.message)
                    } else {
                        nftObject.hash = newUrl.replace(
                            'https://xballot-testnet.infura-ipfs.io/ipfs/',
                            ''
                        )
                        nftObject.true = true
                        nftObject.type = 'arc19'
                        console.log('detected arc19')
                        return nftObject
                    }
                    break
                case newUrl.includes(
                    'template-ipfs://{ipfscid:1:dag-pb:reserve:sha2-256}/nfd.json'
                ):
                    newUrl = await nftFunctions.checkGetArc19(assetId)
                    if (newUrl.message) {
                        console.log('----- checkGetArc19 ERROR:', newUrl.message)
                    } else {
                        nftObject.hash = newUrl.replace(
                            'https://xballot-testnet.infura-ipfs.io/ipfs/',
                            ''
                        )
                        nftObject.true = true
                        nftObject.type = 'arc19'
                        console.log('detected arc19')
                        return nftObject
                    }
                    break
                case newUrl.includes('ipfs://'):
                    nftObject.hash = newUrl.split('//')[1]
                    nftObject['true'] = true
                    nftObject.type = 'arc69'
                    nftObject.arc69Data = await this.getArc69Json(assetId)
                    console.log('detected arc69')
                    return nftObject
                case newUrl.includes('ipfs/'):
                    nftObject.hash = newUrl.split('ipfs/')[1]
                    nftObject['true'] = true
                    nftObject.type = 'arc69'
                    nftObject.arc69Data = await this.getArc69Json(assetId)
                    console.log('detected arc69')
                    return nftObject
                default:
                    console.log('Nft not detected')
                    return nftObject
            }

            /*
              if (newUrl.includes("ipfs")) {
                console.log('attempting to Fetch IPFS Data')
                let ipfsData = await fetch(
                  'https://xballot-testnet.infura-ipfs.io/ipfs/' +
                  newUrl.replace('ipfs://', '')
                )
                console.log(ipfsData)

                let type = await ipfsData.headers.get('content-type')

                if (type === 'application/json') {
                  console.log('Detected JSON object')
                  let ijson = await ipfsData.json()
                  newUrl = ijson.image
                  console.log('Image URL:')
                  console.log(newUrl)
                }
              }
              else{
                console.log("No ipfs data detected")
              }
            }

        }
        */
        } catch (e) {
            return nftObject
        }
    }

    static async getMyAssets(address) {
        //let myCreated = []
        let myOpted = []

        let data = await fetch(MainIndexer + 'accounts/' + address)
        let dataJson = await data.json()

        dataJson.account.assets.forEach(asaObject => {
            if (asaObject.amount && asaObject.amount < 2) {
                myOpted.push(asaObject['asset-id'])
            }
        })
        return myOpted
    }

    static async checkMyAssets(address, callback = undefined, callback2 = undefined) {
        let assetArray = await this.getMyAssets(address)
        let counter = 1
        if (callback !== undefined && assetArray.length) {
            callback(counter)
        }
        if (callback2 !== undefined) {
            callback2(assetArray.length)
        }
        const nftPromises = []
        for (let i = 0; i < assetArray.length; i++) {
            const asset = assetArray[i]
            nftPromises.push(
                new Promise(async (resolve, reject) => {
                    const nftData = await nftFunctions.checkNft(asset)
                    if (nftData.true) {
                        let onFactoryData = await this.checkOnFactory(asset)
                        nftData.onFactory = onFactoryData.onFactory
                        nftData.fullData = onFactoryData.fullData
                        nftData.creator = await this.getCreator(asset)
                        if (callback !== undefined) {
                            callback(++counter)
                        }
                        resolve(nftData)
                    } else {
                        resolve(null)
                    }
                })
            )
        }
        let myNftObjects = []
        if (nftPromises.length) {
            myNftObjects = await Promise.all(nftPromises)
            myNftObjects = myNftObjects.filter(n => n !== null)
        }
        return myNftObjects
    }

    static async checkOnFactory(assetId) {
        let data = await fetch('https://backend.nftfactory.org/nft/getById/' + assetId)
        let dataJSON = await data.json()
        console.log('Factory data:', dataJSON)

        let toReturn = {
            onFactory: data.status !== 404,
            fullData: dataJSON.response,
        }

        return toReturn
    }

    static async getArc69Json(asa = 829457864) {
        let url =
            'https://indexer.algoexplorerapi.io/rl/v1/transactions?page=1&&limit=1&&asset-id=' +
            asa

        //console.log(url)

        let data = await fetchWithTimeout(url)
        let dataJSON = await data.json()
        let objectString = window.atob(dataJSON?.transactions[0].note)

        return objectString || '{}'
    }

    static async getBlogFeed() {
        let url =
            'https://blog.nftfactory.org/blog/ghost/api/v3/content/posts/?key=cd7d7f6e15b91da6dfa7111b5b'

        //console.log(url)

        let data = await fetch(url)
        let data2 = await data.json()

        //console.log(data2)

        return data2.posts
    }
}
