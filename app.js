// Define the contract address
const contractAddress = "0xb9B28b3B45Bfd1fFA2470a05caf83537C131f7d3";

// Define the ABI (Application Binary Interface) of the contract
const contractABI = [{"inputs":[{"internalType":"address","name":"_roflcoinTokenAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"AirdropClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"airdropAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"airdropFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"claimAirdrop","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"hasReceivedAirdrop","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"roflcoinTokenAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newAmount","type":"uint256"}],"name":"updateAirdropAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newFee","type":"uint256"}],"name":"updateAirdropFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawBNB","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawROFL","outputs":[],"stateMutability":"nonpayable","type":"function"}];


// Initialize web3
let web3;
let contract;
let provider; // Add a variable to hold the WalletConnect provider instance

async function initWeb3() {
  // Modern dapp browsers with WalletConnect support
  if (window.ethereum) {
    if (window.ethereum.isMetaMask) {
      web3 = new Web3(window.ethereum);
    } else {
      // WalletConnect provider for mobile users
      const bridge = "https://bridge.walletconnect.org";
      provider = new WalletConnectProvider({ bridge, qrcodeModalOptions: { mobileLinks: true } });
      web3 = new Web3(provider);
      // Subscribe to accounts change event to update UI
      provider.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          alert("Wallet connected successfully!");
        } else {
          alert("No accounts found. Please check your wallet configuration.");
        }
      });
    }
  }
  // Legacy dapp browsers
  else if (window.web3) {
    web3 = new Web3(web3.currentProvider);
  }
  // Non-dapp browsers
  else {
    alert("You have to install the MetaMask extension or paste this URL https://roflcoin.xyz/airdrop into the TrustWallet browser.");
    return;
  }

  // Load the contract
  contract = new web3.eth.Contract(contractABI, contractAddress);
}

// Function to connect the wallet using WalletConnect
async function connectWallet() {
  if (!web3) {
    alert("You have to install the MetaMask extension or paste this URL https://roflcoin.xyz/airdrop into the TrustWallet browser.");
    return;
  }

  try {
    if (provider) {
      // Open the WalletConnect modal to request account access
      await provider.enable();
    } else {
      // For browsers with MetaMask
      await window.ethereum.enable();
    }
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