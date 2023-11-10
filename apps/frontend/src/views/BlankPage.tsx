import React, { useState } from 'react';
import nacl from 'tweetnacl'
import Pipeline, { Escrow } from '@pipeline-ui-2/pipeline/index.js'

export function walletUtils() {
    let nonce = new Uint8Array(24)
    for (let i = 0; i < 24; i++) {
        nonce[i] = 0
    }

    let savedAccount = localStorage.getItem("pipeEscrow")

    if (savedAccount !== null) {
        let password = undefined

        let pString = prompt("sign in to your bot wallet")

        password = cBuffer(pString)
        password = pad(password)

        savedAccount = nacl.secretbox.open(cBuffer(savedAccount), nonce, password)

        savedAccount = deBuffer(savedAccount)

        console.log(savedAccount)
        Escrow.importAccount(savedAccount)
        console.log('escrow address')
        console.log('address', Escrow.address)
    }
    else {

        let password = undefined


        let pString = prompt("create a password for your bot wallet")

        password = cBuffer(pString)

        password = pad(password)

        console.log(password)


        //create escrow here
        let account = Escrow.createAccount()
        console.log(account)
        //encrypt and save mnemonic here

        let mnemonic = account.mnemonic

        let encrypted = nacl.secretbox(cBuffer(mnemonic), nonce, password)

        localStorage.setItem("pipeEscrow", deBuffer(encrypted))

    }

    function cBuffer(text) {
        let array = []
        for (let i = 0; i < text.length; i++) {
            array.push(text.charCodeAt(i))
        }

        let buffer = Uint8Array.from(array)
        return buffer
    }

    function deBuffer(uintArray) {
        let string = ""

        uintArray.forEach(entry => {
            string += String.fromCharCode(entry)
        })
        return string
    }

    function pad(uarray) {
        let n = new Uint8Array(32)

        for (let i = 0; i < 32; i++) {
            if (i < uarray.length) {
                n[i] = uarray[i]
            }
            else {
                n[i] = 0
            }
        }
        return n
    }
}

//walletUtils();

function BlankPage({ loading, domains, primeDomain, dd, address }) {


    return (
        <div id="content-right" className="relative float-right w-full pl-0 lg:w-3/4 lg:pl-5">
            Hello world
            <button onClick={()=> {
    walletUtils()
    Pipeline.pipeConnector = 'escrow'
            }}>Sign in</button>
            <input type="number" id="asaId"></input>
            <button onClick={() => {
                Pipeline.send(
                    Pipeline.address,
                    0,
                    '',
                    undefined,
                    undefined,
                    parseInt(document.getElementById('asaId').value))
            }}>Opt In</button>
        </div>
    );
}

export default BlankPage;
