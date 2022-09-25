// use an arguments.js file to pass constructor arguments 
// when verifying a contract. can use in run and deploy scripts to keep one source of arge
// example code below
require("dotenv").config();

const worldcoin_addr = process.env.WORLDID_ADDR_STAGING

module.exports = [
    worldcoin_addr,
];