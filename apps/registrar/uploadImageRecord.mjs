import algosdk from 'algosdk'
import { CID } from 'multiformats/cid'
import CID2 from 'cids'
import { create } from 'ipfs-http-client'
const infuraProjectId = '2DBKADXQkjmd1KDSg7kq4ext7D3'
const infuraProjectSecret = '08c9d9923e313326c20a3d163193ab60'

function uploadAndGetReserve(workingHash) {

    const myJSON = {
        name: 'Astro #220',
        description: 'Algo Astros, An NFT Collection from the HEADLINE Team.',
        image: 'ipfs://',
        decimals: 0,
        unitName: 'ASTRO220',
        image_integrity:
            'sha256-2706140d2327ee37d13112cf7123beb28253132af94a1af323caa3b25486bdd2',
        image_mimetype: 'image/jpeg',
        properties: {},
    }

    let cidWorking = new CID2(workingHash).toV1()

    myJSON.image = 'ipfs://' + workingHash

    myJSON['image_integrity'] =
        'sha256-' + cidWorking.toString('base16').substring(9)

    async function uploadRecord() {
        try {
            // const client = create(new URL('https://ipfs.infura.io:5001'))
            const auth =
                'Basic ' +
                Buffer.from(
                    infuraProjectId + ':' + infuraProjectSecret
                ).toString('base64')

            const client = create({
                host: 'ipfs.infura.io',
                port: 5001,
                protocol: 'https',
                headers: {
                    authorization: auth,
                },
            })

            const returnedData = await client.add(
                Buffer.from(JSON.stringify(myJSON))
            )
            console.log('Uploaded Record')
            console.log(returnedData)
            return returnedData
        } catch (error) {
            console.log(error)
        }
    }

    function codeToCodec(code) {
        switch (code.toString(16)) {
            case '55':
                return 'raw'
            case '70':
                return 'dag-pb'
            default:
                throw new Error('Unknown codec')
        }
    }

    function cidToReserveURL() {
        let cid = ipfshash

        const decoded = CID.parse(cid)
        const version = decoded.version

        const url = 'template-ipfs://{ipfscid:0:dag-pb:reserve:sha2-256}'

        const reserveAddress = algosdk.encodeAddress(
            Uint8Array.from(Buffer.from(decoded.multihash.digest))
        )

        return {
            url,
            reserveAddress,
        }
    }

    async function calcReserve (){
        let data = await this.uploadRecord()

        const { url, reserveAddress } = this.cidToReserveURL(data.path)

        window.arc19 = {
            url: url,
            address: reserveAddress,
        }

        return reserveAddress
    }

    function hexToBytes(hex = []) {
        let bytes = []

        for (let c = 0; c < hex.length; c += 2) {
            bytes.push(parseInt(hex.substr(c, 2), 16))
        }

        console.log(bytes)

        this.setState({ address: algosdk.encodeAddress(bytes) })
    }

}

