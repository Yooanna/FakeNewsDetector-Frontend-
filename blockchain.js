const CONTRACT_ADDRESS = "0xd9145CCE52D386f254917e481eB44e9943F39138";

const CONTRACT_ABI = [
    {
        "inputs": [{"internalType": "string", "name": "_newsHash", "type": "string"}, 
                  {"internalType": "string", "name": "_prediction", "type": "string"}],
        "name": "verifyNews",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "index", "type": "uint256"}],
        "name": "getVerification",
        "outputs": [{"internalType": "string", "name": "", "type": "string"},
                   {"internalType": "string", "name": "", "type": "string"},
                   {"internalType": "uint256", "name": "", "type": "uint256"},
                   {"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTotalVerifications",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }
];

// Function to generate hash of news text
function generateNewsHash(text) {
    // Simple hash for demo
    return '0x' + btoa(text).substring(0, 10).replace(/=/g, '');
}

// Main function to verify on blockchain
async function verifyOnBlockchain(newsText, prediction) {
    // Check if MetaMask is installed
    if (typeof window.ethereum === 'undefined') {
        return { 
            success: false, 
            hash: '⚠️ Please install MetaMask' 
        };
    }
    
    try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Create provider and signer
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        
        // Create contract instance
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        
        // Generate hash from news text
        const newsHash = generateNewsHash(newsText);
        
        // Call contract
        const tx = await contract.verifyNews(newsHash, prediction);
        
        // Wait for transaction
        const receipt = await tx.wait();
        
        return {
            success: true,
            hash: receipt.transactionHash,
            blockNumber: receipt.blockNumber,
            explorerUrl: `https://sepolia.etherscan.io/tx/${receipt.transactionHash}`
        };
        
    } catch (error) {
        console.error('Blockchain error:', error);
        return {
            success: false,
            hash: '❌ Transaction failed: ' + error.message
        };
    }
}