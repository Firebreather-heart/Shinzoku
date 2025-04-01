import nacl from "tweetnacl";
import bs58 from "bs58";
import axios from "axios";

const baseUrl = 'http://localhost:3000/api/'
const randomPublicKey = "B1aGauHXJk3Z1q1T4v5Q7dR8yF2wE3rT6yU8i9oP0pL1k2J3hG4fD5sA6fV7b";
const keyPair = nacl.sign.keyPair()

const base58PublicKey = bs58.encode(keyPair.publicKey)
const res = await axios.post(`${baseUrl}request-nonce`, {
    publicKey: base58PublicKey
})
console.log(res.data);

const m = res.data.message+ res.data.nonce

let msg= new TextEncoder().encode(m)
const signature = nacl.sign.detached(msg, keyPair.secretKey)

const base58Signature = bs58.encode(signature)

const res2 = await axios.post(`${baseUrl}verify-signature`, {
    publicKey: base58PublicKey,
    signature: base58Signature,
})
console.log(res2)



