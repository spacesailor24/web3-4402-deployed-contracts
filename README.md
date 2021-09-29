# Test Repo for Web3.js Issue 4402

## How to Run

1. Run `yarn` or `npm i` in this repo
2. Run `npx @chainsafe/geth-dev-assistant --accounts 1 --tag 'stable'` to start a docker container running Geth (with a pregenerated account)
3. Run `node index.js`

After step 3 you should see output similar to:

```
Pending contract deployment
From: 0x0c4D34E74B5145C588ce75Ad94c0dBd01ED0fcc9
Contract address: 0x44C82B4A2086B18c618D0d6b4C0Fe5eeeE83195e
.............................................................
Mined contract deployment
Block: 11
From: 0x0c4D34E74B5145C588ce75Ad94c0dBd01ED0fcc9
Contract address: 0x44C82B4A2086B18c618D0d6b4C0Fe5eeeE83195e
Transaction hash: 0x4e99f4053d18c6d853b13c23b9caa4ff609f5b8f8b27b442999abf5b95334ffd
.............................................................
```

A contract is deployed immediately, and every 3.5 seconds, so you will continue to see output if you leave the script running
