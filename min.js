/**
 * Minified by jsDelivr using Terser v5.14.1.
 * Original file: /npm/@walletconnect/web3-provider@1.8.0/dist/esm/index.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
import WalletConnect from"@walletconnect/client";import QRCodeModal from"@walletconnect/qrcode-modal";import HttpConnection from"@walletconnect/http-connection";import{payloadId,signingMethods,parsePersonalSign,getRpcUrl}from"@walletconnect/utils";const ProviderEngine=require("web3-provider-engine"),CacheSubprovider=require("web3-provider-engine/subproviders/cache"),FixtureSubprovider=require("web3-provider-engine/subproviders/fixture"),FilterSubprovider=require("web3-provider-engine/subproviders/filters"),HookedWalletSubprovider=require("web3-provider-engine/subproviders/hooked-wallet"),NonceSubprovider=require("web3-provider-engine/subproviders/nonce-tracker"),SubscriptionsSubprovider=require("web3-provider-engine/subproviders/subscriptions");class WalletConnectProvider extends ProviderEngine{constructor(t){if(super({pollingInterval:t.pollingInterval||8e3}),this.bridge="https://bridge.walletconnect.org",this.qrcode=!0,this.qrcodeModal=QRCodeModal,this.qrcodeModalOptions=void 0,this.rpc=null,this.infuraId="",this.http=null,this.isConnecting=!1,this.connected=!1,this.connectCallbacks=[],this.accounts=[],this.chainId=1,this.rpcUrl="",this.enable=async()=>{const t=await this.getWalletConnector();if(t)return this.start(),this.subscribeWalletConnector(),t.accounts;throw new Error("Failed to connect to WalleConnect")},this.request=async t=>this.send(t),this.send=async(t,e)=>{var n;if("string"==typeof t){const n=t;let i=e;return"personal_sign"===n&&(i=parsePersonalSign(i)),this.sendAsyncPromise(n,i)}if("personal_sign"===(t=Object.assign({id:payloadId(),jsonrpc:"2.0"},t)).method&&(t.params=parsePersonalSign(t.params)),!e){if("eth_signTypedData_v4"===t.method&&"MetaMask"===(null===(n=this.walletMeta)||void 0===n?void 0:n.name)){const{result:e}=await this.handleOtherRequests(t);return e}return this.sendAsyncPromise(t.method,t.params)}this.sendAsync(t,e)},this.onConnect=t=>{this.connectCallbacks.push(t)},this.triggerConnect=t=>{this.connectCallbacks&&this.connectCallbacks.length&&this.connectCallbacks.forEach((e=>e(t)))},this.bridge=t.connector?t.connector.bridge:t.bridge||"https://bridge.walletconnect.org",this.qrcode=void 0===t.qrcode||!1!==t.qrcode,this.qrcodeModal=t.qrcodeModal||this.qrcodeModal,this.qrcodeModalOptions=t.qrcodeModalOptions,this.wc=t.connector||new WalletConnect({bridge:this.bridge,qrcodeModal:this.qrcode?this.qrcodeModal:void 0,qrcodeModalOptions:this.qrcodeModalOptions,storageId:null==t?void 0:t.storageId,signingMethods:null==t?void 0:t.signingMethods,clientMeta:null==t?void 0:t.clientMeta}),this.rpc=t.rpc||null,!(this.rpc||t.infuraId&&"string"==typeof t.infuraId&&t.infuraId.trim()))throw new Error("Missing one of the required parameters: rpc or infuraId");this.infuraId=t.infuraId||"",this.chainId=(null==t?void 0:t.chainId)||this.chainId,this.initialize()}get isWalletConnect(){return!0}get connector(){return this.wc}get walletMeta(){return this.wc.peerMeta}async disconnect(){this.close()}async close(){const t=await this.getWalletConnector({disableSessionCreation:!0});await t.killSession(),await this.onDisconnect()}async handleRequest(t){try{let e,n=null;const i=await this.getWalletConnector();switch(t.method){case"wc_killSession":await this.close(),n=null;break;case"eth_accounts":n=i.accounts;break;case"eth_coinbase":n=i.accounts[0];break;case"eth_chainId":case"net_version":n=i.chainId;break;case"eth_uninstallFilter":this.sendAsync(t,(t=>t)),n=!0;break;default:e=await this.handleOtherRequests(t)}return e||this.formatResponse(t,n)}catch(t){throw this.emit("error",t),t}}async handleOtherRequests(t){if(!signingMethods.includes(t.method)&&t.method.startsWith("eth_"))return this.handleReadRequests(t);const e=await this.getWalletConnector(),n=await e.sendCustomRequest(t);return this.formatResponse(t,n)}async handleReadRequests(t){if(!this.http){const t=new Error("HTTP Connection not available");throw this.emit("error",t),t}return this.http.send(t)}formatResponse(t,e){return{id:t.id,jsonrpc:t.jsonrpc,result:e}}getWalletConnector(t={}){const{disableSessionCreation:e=!1}=t;return new Promise(((t,n)=>{const i=this.wc;this.isConnecting?this.onConnect((e=>t(e))):i.connected||e?(this.connected||(this.connected=!0,this.updateState(i.session)),t(i)):(this.isConnecting=!0,i.on("modal_closed",(()=>{n(new Error("User closed modal"))})),i.createSession({chainId:this.chainId}).then((()=>{i.on("connect",((e,s)=>{if(e)return this.isConnecting=!1,n(e);this.isConnecting=!1,this.connected=!0,s&&this.updateState(s.params[0]),this.emit("connect"),this.triggerConnect(i),t(i)}))})).catch((t=>{this.isConnecting=!1,n(t)})))}))}async subscribeWalletConnector(){const t=await this.getWalletConnector();t.on("disconnect",(t=>{t?this.emit("error",t):this.onDisconnect()})),t.on("session_update",((t,e)=>{t?this.emit("error",t):this.updateState(e.params[0])}))}async onDisconnect(){await this.stop(),this.emit("close",1e3,"Connection closed"),this.emit("disconnect",1e3,"Connection disconnected"),this.connected=!1}async updateState(t){const{accounts:e,chainId:n,networkId:i,rpcUrl:s}=t;(!this.accounts||e&&this.accounts!==e)&&(this.accounts=e,this.emit("accountsChanged",e)),(!this.chainId||n&&this.chainId!==n)&&(this.chainId=n,this.emit("chainChanged",n)),(!this.networkId||i&&this.networkId!==i)&&(this.networkId=i,this.emit("networkChanged",i)),this.updateRpcUrl(this.chainId,s||"")}updateRpcUrl(t,e=""){const n={infuraId:this.infuraId,custom:this.rpc||void 0};(e=e||getRpcUrl(t,n))?(this.rpcUrl=e,this.updateHttpConnection()):this.emit("error",new Error(`No RPC Url available for chainId: ${t}`))}updateHttpConnection(){this.rpcUrl&&(this.http=new HttpConnection(this.rpcUrl),this.http.on("payload",(t=>this.emit("payload",t))),this.http.on("error",(t=>this.emit("error",t))))}sendAsyncPromise(t,e){return new Promise(((n,i)=>{this.sendAsync({id:payloadId(),jsonrpc:"2.0",method:t,params:e||[]},((t,e)=>{t?i(t):n(e.result)}))}))}initialize(){this.updateRpcUrl(this.chainId),this.addProvider(new FixtureSubprovider({eth_hashrate:"0x00",eth_mining:!1,eth_syncing:!0,net_listening:!0,web3_clientVersion:"WalletConnect/v1.x.x/javascript"})),this.addProvider(new CacheSubprovider),this.addProvider(new SubscriptionsSubprovider),this.addProvider(new FilterSubprovider),this.addProvider(new NonceSubprovider),this.addProvider(new HookedWalletSubprovider(this.configWallet())),this.addProvider({handleRequest:async(t,e,n)=>{try{const{error:e,result:i}=await this.handleRequest(t);n(e,i)}catch(t){n(t)}},setEngine:t=>t})}configWallet(){return{getAccounts:async t=>{try{const e=(await this.getWalletConnector()).accounts;e&&e.length?t(null,e):t(new Error("Failed to get accounts"))}catch(e){t(e)}},processMessage:async(t,e)=>{try{const n=await this.getWalletConnector();e(null,await n.signMessage([t.from,t.data]))}catch(t){e(t)}},processPersonalMessage:async(t,e)=>{try{const n=await this.getWalletConnector();e(null,await n.signPersonalMessage([t.data,t.from]))}catch(t){e(t)}},processSignTransaction:async(t,e)=>{try{const n=await this.getWalletConnector();e(null,await n.signTransaction(t))}catch(t){e(t)}},processTransaction:async(t,e)=>{try{const n=await this.getWalletConnector();e(null,await n.sendTransaction(t))}catch(t){e(t)}},processTypedMessage:async(t,e)=>{try{const n=await this.getWalletConnector();e(null,await n.signTypedData([t.from,t.data]))}catch(t){e(t)}}}}}export default WalletConnectProvider;
//# sourceMappingURL=/sm/9c721b8f3a25d7692c7fc42cf5ac758807491a9d5bd3d5cc032394f2d536ceeb.map