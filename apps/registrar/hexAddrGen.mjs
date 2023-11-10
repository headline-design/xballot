import algosdk from "algosdk";

let seeder = "PPFMWPQEQOIKGUO5WST7X6VKQ65NCMT6R6AOY6QYZTRCREGVSLOKUB72UY";

let addrArray = algosdk.decodeAddress(seeder);

let hex = Buffer.from(addrArray.publicKey).toString("hex");

hex = "0x" + hex;

console.log(hex);
