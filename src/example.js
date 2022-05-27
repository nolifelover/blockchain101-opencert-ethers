const { ethers } = require("ethers");

const provider = new ethers.providers.InfuraProvider("rinkeby", "d0def9a28dfb4337bd7315a2a9bcc22c");
const main = async () => {
    const blockNumber = await provider.getBlockNumber()
    console.log(`blockNumber = ${blockNumber}`)
    const balance = await provider.getBalance("0x88a3ca42f925abf084f5d0e640d1135e9faf0d9d")
    console.log(`issuer wallet balance = ${balance} wei`)
    const ethBalance = ethers.utils.formatEther(balance)
    console.log(`eth balance = ${ethBalance} ETH`)
}

const callContract = async () => {
    const dsAddress = "0xFe8eD9d4fb7D0ac19BF78bf34B10e561e0C66E85";
    const abi = [
        "function isIssued(bytes32 document) public view returns (bool)",
        "function isRevoked(bytes32 document) public view returns (bool)",
        "function name() public view returns (string)",
    ]
    const dsContract = new ethers.Contract(dsAddress, abi, provider);

    const documentHash = "0xb9b47c4711091dcc52f695cbadecf0193c214a21e006870111a793595a073c80"

    /*
    const isIssued = await dsContract.isIssued(documentHash)
    const isRevoked = await dsContract.isRevoked(documentHash)

    console.log(`document ${documentHash} isIssued=${isIssued}, isRevoked=${isRevoked}`)
    */

    // const [isIssued, isRevoked] = await Promise.all([dsContract.isIssued(documentHash), await dsContract.isRevoked(documentHash)])
    // console.log(`document ${documentHash} isIssued=${isIssued}, isRevoked=${isRevoked}`)
    const name = await dsContract.name();
    console.log(name)
}

const listeningEvent = async() => {
    const dsAddress = "0xFe8eD9d4fb7D0ac19BF78bf34B10e561e0C66E85";
    const abi = [
        "event DocumentIssued(bytes32 indexed document)",
        "event DocumentRevoked(bytes32 indexed document)",
    ]
    const dsContract = new ethers.Contract(dsAddress, abi, provider);

    console.log("Start listing to DocumentIssued event");
    dsContract.on("DocumentIssued", (document, event) => {
        console.log(`document ${document} issued`);
        console.log(event)
    });
}

const queryHistoryEvent = async() => {
    const dsAddress = "0xFe8eD9d4fb7D0ac19BF78bf34B10e561e0C66E85";
    const abi = [
        "event DocumentIssued(bytes32 indexed document)",
        "event DocumentRevoked(bytes32 indexed document)",
    ]
    const dsContract = new ethers.Contract(dsAddress, abi, provider);
    
    const filterIssueEvent = dsContract.filters.DocumentIssued();
    // 10747720, -1000
    // 10000
    const events = await dsContract.queryFilter(filterIssueEvent, 10746707);
    console.log(events)
    console.log(events.map(e => e.args.document));
}
// main();
// callContract();
// listeningEvent();
queryHistoryEvent();