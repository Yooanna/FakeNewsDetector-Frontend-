const API_URL = 'https://grovelingly-treelined-euclid.ngrok-free.dev/predict';

const checkButton = document.getElementById('checkButton');
const newsInput = document.getElementById('newsInput');
const resultDiv = document.getElementById('result');
const blockchainDiv = document.getElementById('blockchainProof');

checkButton.addEventListener('click', checkNews);

newsInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        checkNews();
    }
});

async function checkNews() {
    const newsText = newsInput.value.trim();
    
    if (!newsText) {
        alert('Please paste some news text!');
        return;
    }
    
    resultDiv.innerHTML = '⏳ Analyzing...';
    resultDiv.className = 'loading';
    blockchainDiv.innerHTML = '';
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: newsText })
        });
        
        const data = await response.json();
        
        if (data.prediction === 'FAKE') {
            resultDiv.innerHTML = `
                <div style="font-size: 24px;">🔴 FAKE NEWS</div>
                <div style="font-size: 18px;">Confidence: ${(data.confidence * 100).toFixed(1)}%</div>
            `;
            resultDiv.className = 'fake';
        } else {
            resultDiv.innerHTML = `
                <div style="font-size: 24px;">🟢 REAL NEWS</div>
                <div style="font-size: 18px;">Confidence: ${(data.confidence * 100).toFixed(1)}%</div>
            `;
            resultDiv.className = 'real';
        }
        
        // ===== NEW BLOCKCHAIN CODE START =====
        try {
            const blockchainResult = await verifyOnBlockchain(newsText, data.prediction);
            
            if (blockchainResult.success) {
                blockchainDiv.innerHTML = `
                    <div style="font-size: 14px;">
                        ⛓️ <strong>Verified on Blockchain</strong><br>
                        Tx: ${blockchainResult.hash.substring(0, 10)}...${blockchainResult.hash.substring(58)}<br>
                        Block: #${blockchainResult.blockNumber}<br>
                        <a href="${blockchainResult.explorerUrl}" target="_blank" style="color: #667eea;">
                            🔍 View on Etherscan
                        </a>
                    </div>
                `;
            } else {
                blockchainDiv.innerHTML = `⛓️ ${blockchainResult.hash}`;
            }
        } catch (error) {
            blockchainDiv.innerHTML = '⛓️ Blockchain verification pending (Member 2)';
        }
        // ===== NEW BLOCKCHAIN CODE END =====
        
    } catch (error) {
        resultDiv.innerHTML = '❌ Error connecting to API';
        resultDiv.className = '';
        console.error(error);
    }
}