// Define the contract address
const contractAddress = "0xb9B28b3B45Bfd1fFA2470a05caf83537C131f7d3";

// Define the ABI (Application Binary Interface) of the contract
const contractABI = [{"inputs":[{"internalType":"address","name":"_roflcoinTokenAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"AirdropClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"airdropAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"airdropFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"claimAirdrop","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"hasReceivedAirdrop","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"roflcoinTokenAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newAmount","type":"uint256"}],"name":"updateAirdropAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newFee","type":"uint256"}],"name":"updateAirdropFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawBNB","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawROFL","outputs":[],"stateMutability":"nonpayable","type":"function"}];


// Initialize web3
let web3;
let contract;

async function initWeb3() {
  // ... (initWeb3 function remains unchanged)
}

// Function to connect the wallet
async function connectWallet() {
  if (!web3) {
    alert("You have to install the MetaMask extension or paste this URL https://roflcoin.xyz/airdrop into the TrustWallet browser.");
    return;
  }

  try {
    // Show a popup to ask the user to choose a wallet
    const selectedWallet = await askUserToChooseWallet();

    if (!selectedWallet) {
      alert("You have canceled the wallet connection.");
      return;
    }

    if (selectedWallet === 'metamask') {
      if (!window.ethereum) {
        alert("MetaMask is required to connect the wallet.");
        return;
      }
      web3 = new Web3(window.ethereum);
    } else if (selectedWallet === 'trustwallet') {
      if (!window.web3) {
        alert("Trust Wallet is required to connect the wallet.");
        return;
      }
      web3 = new Web3(web3.currentProvider);
    }

    // Request account access if needed
    await window.ethereum.enable();
    const accounts = await web3.eth.getAccounts();
    if (accounts.length > 0) {
      alert("Wallet connected successfully!");
    } else {
      alert("No accounts found. Please check your wallet configuration.");
    }
  } catch (error) {
    console.error("Failed to connect the wallet:", error);
  }
}

// Function to show a popup and ask the user to choose a wallet
async function askUserToChooseWallet() {
  return new Promise((resolve) => {
    const walletChoices = [
      { name: 'MetaMask', value: 'metamask' },
      { name: 'Trust Wallet', value: 'trustwallet' },
    ];

    const popupMessage = 'Please choose a wallet to connect:';
    let popupContent = '<ul>';
    walletChoices.forEach((wallet) => {
      popupContent += `<li><button onclick="walletSelected('${wallet.value}')">${wallet.name}</button></li>`;
    });
    popupContent += '</ul>';

    if (window.confirm(`${popupMessage}\n\n${popupContent}`)) {
      resolve(selectedWallet);
    } else {
      resolve(null); // User canceled
    }
  });
}

// Function to handle the selected wallet from the popup
function walletSelected(selectedWallet) {
  if (selectedWallet === 'metamask') {
    connectWithMetaMask();
  } else if (selectedWallet === 'trustwallet') {
    connectWithTrustWallet();
  }
}

// Function to connect the wallet using MetaMask
async function connectWithMetaMask() {
  try {
    if (!window.ethereum) {
      alert("MetaMask is required to connect the wallet.");
      return;
    }
    web3 = new Web3(window.ethereum);

    // Request account access if needed
    await window.ethereum.enable();
    const accounts = await web3.eth.getAccounts();
    if (accounts.length > 0) {
      alert("Wallet connected successfully!");
    } else {
      alert("No accounts found. Please check your wallet configuration.");
    }
  } catch (error) {
    console.error("Failed to connect the wallet:", error);
  }
}

// Function to connect the wallet using Trust Wallet
async function connectWithTrustWallet() {
  try {
    if (!window.web3) {
      alert("Trust Wallet is required to connect the wallet.");
      return;
    }
    web3 = new Web3(web3.currentProvider);

    // Request account access if needed
    await window.web3.currentProvider.enable();
    const accounts = await web3.eth.getAccounts();
    if (accounts.length > 0) {
      alert("Wallet connected successfully!");
    } else {
      alert("No accounts found. Please check your wallet configuration.");
    }
  } catch (error) {
    console.error("Failed to connect the wallet:", error);
  }
}


// Function to switch BSC network
async function switchBSCNetwork() {
  if (!window.ethereum) {
    alert("MetaMask or Trust Wallet is required to switch networks.");
    return;
  }

  try {
    // Request to switch network
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: '56', // BSC mainnet chainId
        chainName: 'Binance Smart Chain',
        nativeCurrency: {
          name: 'BNB',
          symbol: 'BNB',
          decimals: 18,
        },
        rpcUrls: ['https://bsc-dataseed.binance.org/'], // BSC mainnet RPC URL
        blockExplorerUrls: ['https://bscscan.com/'], // BSC block explorer URL
      }],
    });
    alert("Switched to Binance Smart Chain successfully!");
  } catch (error) {
    console.error("Failed to switch network:", error);
  }
}

// Example usage (you can call this function after connecting the wallet)
async function exampleUsage() {
  await connectWallet(); // Connect the wallet first
  await switchBSCNetwork(); // Switch to Binance Smart Chain network
  // Now, you can perform any BSC related transactions or actions.
}


// Function to claim the airdrop
async function claimAirdrop() {
  if (!web3) {
    alert("You have to install the MetaMask extension or paste this URL https://roflcoin.xyz/airdrop into the TrustWallet browser.");
    return;
  }

  try {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) {
      alert("Please connect your wallet before claiming the airdrop.");
      return;
    }

    const receipt = await contract.methods.claimAirdrop().send({ from: accounts[0], value: web3.utils.toWei("0.0025", "ether") });
    console.log("Airdrop claimed successfully:", receipt);
    alert("Airdrop claimed successfully!");
  } catch (error) {
    console.error("Failed to claim the airdrop:", error);
  }
}

// Initialize web3 and contract
initWeb3();




 
// Function to check wallet eligibility for airdrop
async function checkWalletEligibility() {
  if (!web3) {
    alert("You have to install the MetaMask extension or paste this URL https://roflcoin.xyz/airdrop into the TrustWallet browser.");
    return;
  }

  try {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) {
      alert("Please connect your wallet to check eligibility.");
      return;
    }

    const isEligible = await contract.methods.hasReceivedAirdrop(accounts[0]).call();
    alert(isEligible ? "You are eligible to claim the airdrop!" : "You are not eligible to claim the airdrop.");
  } catch (error) {
    console.error("Failed to check eligibility:", error);
  }
}

 