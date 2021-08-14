// this script contains the integration logic for the FoodPrint application to interact with the
// productv2 solidity smart contract

// import MetaMaskOnboarding from '@metamask/onboarding' // TODO this requires prebundling of the foodprint_blockchain.js before including in html templates


const currentUrl = new URL(window.location.href)
const forwarderOrigin = currentUrl.hostname === 'localhost'
    ? 'http://localhost:3000'
    : undefined

// this function will be called when content in the DOM is loaded
const initialize = () => {
  // Basic Actions Section
  const onboardButton = document.querySelector(".enableBlockchainButton");
  const showAccount = document.querySelector(".showAccount");

  // Contract and Account Objects
  let accounts;
  let foodPrintProduceContractABI;
  let foodPrintProduceContractAddress;
  let FoodPrintProduceContractV2;


  //------MetaMask Functions------\\

  // function to check if MetaMask is connected
  const isMetaMaskConnected = () => accounts && accounts.length > 0;

  // function to see if the MetaMask extension is installed
  const isMetaMaskInstalled = () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  };

  // function when connect to wallet is clicked
  const onClickConnect = async () => {
    try {
      // Will open the MetaMask UI
      // You should disable this button while the request is pending!
      await ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      showAccount.innerHTML = account;
      console.log(account || "Not able to get accounts");
      console.log(isMetaMaskConnected());
      if (isMetaMaskConnected()) {
        console.log("Metamask is connected :)");
      }
    } catch (error) {
      var message_description = "Access to your Ethereum account rejected.";
      //TODO - trigger pop up notification
      return console.log(message_description);

      console.error(error);
    }
  };



  const MetaMaskClientCheck = () => {
    //Now we check to see if Metamask is installed
    if (!isMetaMaskInstalled()) {
      //If it isn't installed we ask the user to click to install it
      onboardButton.innerText = 'Click here to install MetaMask!';
      //When the button is clicked we call this function
      onboardButton.onclick =  window.open("https://metamask.io/download");;
      //The button is now disabled
      onboardButton.disabled = false;
    } else {
      //If MetaMask is installed we ask the user to connect to their wallet
      onboardButton.innerText = 'Connect to Wallet';
      //When the button is clicked we call this function to connect the users MetaMask Wallet
      onboardButton.onclick = onClickConnect;
      //The button is now disabled
      onboardButton.disabled = false;
    }
  };
  MetaMaskClientCheck();
  //------/MetaMask Checks------\\


  //------Contract Interactions------\\
  // in order to create a contract instance, we need the contract address and its ABI
  // const foodPrintProduceContractAddress = '0xf12ec65861A8103af5B2F9B07e8F1790D391E832'; // Ethereum Rinkeby
  foodPrintProduceContractAddress = '0xf12ec65861A8103af5B2F9B07e8F1790D391E832'; // Matic Mumbai

  // The second is the Application Binary interface or the ABI of the contract code.
  // ABI is just a list of method signatures, return types, members etc of the contract in a defined JSON format.
  // This ABI is needed when you will call your contract from a real javascript client.
  foodPrintProduceContractABI = [
    {
      "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "_harvestID",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_harvestSubmissionBlockNumber",
          "type": "uint256"
        }
      ],
      "name": "registeredHarvestDetailEvent",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_harvestLogIDIndex",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "_harvestID",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_harvestSubmissionBlockNumber",
          "type": "uint256"
        }
      ],
      "name": "registeredHarvestEvent",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_storageLogIDIndex",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "_storageID",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_storageSubmissionBlockNumber",
          "type": "uint256"
        }
      ],
      "name": "registeredStorageEvent",
      "type": "event"
    },
    {
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "fallback"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "harvestAddressMap",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "harvestDetailMap",
      "outputs": [
        {
          "internalType": "string",
          "name": "harvestID",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "growingCondtions",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "harvestDescription",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "harvestTableName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "harvestQuantity",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "harvestUser",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "BlockNumber",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "harvestLogIDs",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "harvestMap",
      "outputs": [
        {
          "internalType": "string",
          "name": "harvestID",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "supplierproduceID",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "photoHash",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "geolocation",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "harvestTimeStamp",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "BlockNumber",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "IsSet",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "isOwner",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "storageAddressMap",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "storageLogIDs",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "storageMap",
      "outputs": [
        {
          "internalType": "string",
          "name": "storageID",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "harvestID",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "otherID",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "storageTimeStamp",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "storageDetail",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "BlockNumber",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "IsSet",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "toggleContractActive",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "string",
          "name": "_supplierproduceID",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_photoHash",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_geolocation",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_harvestTimeStamp",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_harvestID",
          "type": "string"
        }
      ],
      "name": "registerHarvestSubmission",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "string",
          "name": "_growingCondtions",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_harvestDescription",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_harvestTableName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_harvestQuantity",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_harvestUser",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_harvestID",
          "type": "string"
        }
      ],
      "name": "registerHarvestSubmissionDetails",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getHarvestSubmissionsCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "string",
          "name": "harvest_id",
          "type": "string"
        }
      ],
      "name": "getHarvestSubmitterAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "arrayIndex",
          "type": "uint256"
        }
      ],
      "name": "getHarvestLogIDByIndex",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "string",
          "name": "harvest_id",
          "type": "string"
        }
      ],
      "name": "getHarvestSubmission",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "string",
          "name": "harvest_id",
          "type": "string"
        }
      ],
      "name": "getHarvestSubmissionDetail",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "string",
          "name": "harvest_id",
          "type": "string"
        }
      ],
      "name": "checkHarvestSubmission",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "string",
          "name": "_otherID",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_storageTimeStamp",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_storageDetail",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_storageID",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_harvestID",
          "type": "string"
        }
      ],
      "name": "registerStorageSubmission",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getStorageSubmissionsCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "string",
          "name": "storage_id",
          "type": "string"
        }
      ],
      "name": "getStorageSubmitterAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "arrayIndex",
          "type": "uint256"
        }
      ],
      "name": "getStorageLogIDByIndex",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "string",
          "name": "storage_id",
          "type": "string"
        }
      ],
      "name": "getStorageSubmission",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "string",
          "name": "storage_id",
          "type": "string"
        }
      ],
      "name": "checkStorageSubmission",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "checkContractIsRunning",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "destroy",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  // FoodPrintProduceContractV2 = web3.eth.contract(foodPrintProduceContractABI).at(foodPrintProduceContractAddress);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  console.log({ provider });

  // The Metamask plugin also allows signing transactions to send ether and
  // pay to change state within the blockchain. For this, we need the account signer
  const signer = provider.getSigner();

  // the contract object
  FoodPrintProduceContractV2 = new ethers.Contract(
      foodPrintProduceContractAddress,
      foodPrintProduceContractABI,
      signer
  );


  // trigger smart contract call to  addHarvestToBlockchain() function on UI button click
  $(".addHarvestToBlockchainBtn").click(addHarvestToBlockchain);

  // trigger smart contract call to addStorageToBlockchain() function on button click
  $(".addStorageToBlockchainBtn").click(addStorageToBlockchain);

  // trigger smart contract call to verifyHarvestEntry function on UI button click
  $("#verifyHarvestEntryBtn").click(function (e) {
    e.preventDefault();
    var data = {};
    data.harvest_logid = $('#search_harvest_id').val();
    verifyHarvestEntry(data);
  });

  // trigger smart contract call to verifyStorageEntry function on UI button click
  $("#verifyStorageEntryBtn").click(function (e) {
    e.preventDefault();
    var data = {};
    data.storage_logid = $('#search_storage_id').val();
    verifyStorageEntry(data);
  });

  // trigger smart contract call to retrieveHarvestEntrySubmitAddress function on UI button click
  $("#retrieveHarvestEntrySubmitAddressBtn").click(retrieveHarvestEntrySubmitAddress);

  // trigger smart contract call to getProduceHarvestCount() function after clicking on Harvest count button
  $("#getProduceHarvestCountBtn").click(function (e) {
    e.preventDefault();
    getProduceHarvestCount();
  });

  // trigger smart contract call to destroyContract() function after clicking on Initiate Self Destruct button
  $("#destroyFoodProduceContractBtn").click(function (e) {
    e.preventDefault();
    destroyContract();
  });

  // trigger smart contract call to toggleContractStatus() function after clicking on toggle contract status button
  $("#toggleContractStatusBtn").click(function (e) {
    e.preventDefault();
    toggleContractStatus();
  });

  // trigger smart contract call to getContractStatus() function after clicking on check contract status button
  $("#getContractStatusBtn").click(function (e) {
    e.preventDefault();
    getContractStatus();
  });

  //function to handle error from smart contract call
  function handle_error(err) {
    console.log("function handle_error(err).");
    var error_data = err.data;
    var message_description = "FoodPrint Produce smart contract call failed: " + err;
    if (typeof error_data !== 'undefined') {
      var error_message = error_data.message;
      if (typeof error_message !== 'undefined') {
        message_description = "FoodPrint Produce smart contract call failed: " + error_message;
      }
    }

    // TODO - trigger  notification
    return console.log(message_description);
  };

  // var account = web3.currentProvider.selectedAddress

  //function to handle web 3 undefined error from smart contract call
  function handle_web3_undefined_error() {
    console.log("function handle_web3_undefined_error(err).");
    var message_description = "Please install MetaMask to access the Ethereum Web3 injected API from your Web browser.";

    //TODO - trigger notification
    return console.log(message_description);
  };

  // function Add to Blockchain
  async function addHarvestToBlockchain() {

    // disable button wont work because it is actually a link
    // $("this").prop("disabled", true);

    //  disable link
    $(this).addClass('disabled');

    // add spinner to button
    $(this).html(
        `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Adding to Blockchain...`
    );

    //harvest entry variables from selected record
    var harvest_logid = $(this).data('harvest_logid');
    var harvest_suppliershortcode = $(this).data('harvest_suppliershortcode');
    var harvest_suppliername = $(this).data('harvest_suppliername');
    var harvest_farmername = $(this).data('harvest_farmername');
    var harvest_supplieraddress = $(this).data('harvest_supplieraddress');
    var harvest_producename = $(this).data('harvest_producename');
    var harvest_photohash = $(this).data('harvest_photohash');
    var harvest_photoimage = harvest_photohash;
    var harvest_timestamp = $(this).data('harvest_timestamp');
    var harvest_capturetime = $(this).data('harvest_capturetime');
    var harvest_description = $(this).data('harvest_description');
    var harvest_geolocation = $(this).data('harvest_geolocation');
    var harvest_quantity = $(this).data('harvest_quantity');
    var harvest_unitofmeasure = $(this).data('harvest_unitofmeasure');
    var harvest_description_json = $(this).data('harvest_description_json'); //growing conditions
    var harvest_blockchainhashid = $(this).data('harvest_blockchainhashid');
    var harvest_blockchainhashdata = $(this).data('harvest_blockchainhashdata');
    var supplierproduce = $(this).data('supplierproduce');
    var harvest_bool_added_to_blockchain = $(this).data('harvest_bool_added_to_blockchain');
    var harvest_added_to_blockchain_date = $(this).data('harvest_added_to_blockchain_date');
    var harvest_added_to_blockchain_by = $(this).data('harvest_added_to_blockchain_by');
    var harvest_blockchain_uuid = $(this).data('harvest_blockchain_uuid');
    var harvest_user = $(this).data('harvest_user');
    var year_established = $(this).data('year_established');
    var covid19_response = $(this).data('covid19_response');
    var logdatetime = $(this).data('logdatetime');
    var lastmodifieddatetime = $(this).data('lastmodifieddatetime');

    var harvest_tablename = 'foodprint_harvest';
    var harvest_quantity_combined = harvest_quantity + "(" + harvest_unitofmeasure + ")";

    console.log("this harvest_logid - " + harvest_logid);

    //let farmer_details = '{HarvestDescription:"Leafy Veg", HarvestGrowingConditions:"Organic",SupplierID:OZCF}';
    let photoHash = sha256(harvest_photohash);
    console.log("harvest_photohash successfully hashed (hash value " + photoHash + ").");

    if (typeof web3 === 'undefined') {
      return handle_web3_undefined_error();
    }

    // solidityContext required if you use msg object in contract function e.g. msg.sender
    // var solidityContext = {from: web3.eth.accounts[1], gas:3000000}; //add gas to avoid out of gas exception

    // FoodPrint Produce contract
    // registerHarvestSubmission(string calldata _supplierproduceID,
    //     string calldata _photoHash,  string calldata _geolocation,
    //     string calldata _harvestTimeStamp,
    //     string calldata _harvestID)

    // registerHarvestSubmission(
    // supplierproduce,
    // harvest_photohash,
    // harvest_geolocation,
    // harvest_timestamp,
    // harvest_logid);

    console.log("Test before submit - supplierproduce: " + supplierproduce + ", photoHash: " + photoHash +
        ", harvest_geolocation: " + harvest_geolocation + ",harvest_timestamp: " + harvest_timestamp.toString() + ", harvest_logid:" + harvest_logid);

    //Load the contract schema from the abi and Instantiate the contract by address
    // at(): Create an instance of MyContract that represents your contract at a specific address.
    // deployed(): Create an instance of MyContract that represents the default address managed by FoodPrintProduceContractV2.
    // new(): Deploy a new version of this contract to the network, getting an instance of FoodPrintProduceContractV2 that represents the newly deployed instance.
    FoodPrintProduceContractV2.registerHarvestSubmission(supplierproduce, photoHash, harvest_geolocation, harvest_timestamp.toString(), harvest_logid,
        function (err, result) {
          if (err) {
            console.log("Error Adding to Blockchain");
            $(this).html(
                `Error Adding to Blockchain`
            );
            return handle_error(err);
          } else {

            // function registerHarvestSubmissionDetails(string calldata _growingCondtions, string calldata _harvestDescription,
            //   string calldata _harvestTableName, string calldata _harvestQuantity, string calldata _harvestUser,
            //    string calldata _harvestID)

            console.log("Test before submit - harvest_description_json: " + harvest_description_json + ", harvest_description: " + harvest_description +
                ", harvest_tablename: " + harvest_tablename + ",harvest_quantity_combined: " + harvest_quantity_combined + ",harvest_user:" + harvest_user +
                ", harvest_logid:" + harvest_logid);

            FoodPrintProduceContractV2.registerHarvestSubmissionDetails(harvest_description_json, harvest_description, harvest_tablename,
                harvest_quantity_combined, harvest_user, harvest_logid,
                function (err2, result) {
                  if (err2) {
                    console.log("Error Adding to Blockchain");
                    $(this).html(
                        `Error Adding to Blockchain`
                    );
                    return handle_error(err2);
                  }
                });
          }
          ;

          var message_description = `Transaction submitted to Blockchain for processing (Upload Harvest Entry from ${supplierproduce} with Harvest ID  ${harvest_logid}). Check your Metamask for transaction update.`;

          //TODO - trigger notification
          console.log(message_description);
        });
  };


  //Watch for registeredHarvestEvent, returns  _harvestLogIDIndex, _harvestID and _harvestSubmissionBlockNumber
    FoodPrintProduceContractV2.on('registeredHarvestEvent', (harvestLogIDIndex, harvestID, harvestSubmissionBlockNumber, event) => {
    console.log("registeredHarvestEvent");
    console.log('First parameter harvestLogIDIndex:', harvestLogIDIndex);
    console.log('Second parameter harvestID:', harvestID);
    console.log('Third parameter harvestSubmissionBlockNumber:', harvestSubmissionBlockNumber);
    console.log('Event : ', event);  //Event object
    // TODO - if not error
      // Enable button?
      // Remove spinner from button
      //$("spinner_addHarvestBtn").hide();
      //update text
      //$("addHarvestBtn").html(`Added to Blockchain`);
      // TODO - Update status in DB via ajax post then update UI button, maybe ID button should include harvestid in its ID
    });

  /*var registeredHarvestEvent = FoodPrintProduceContractV2.registeredHarvestEvent();
  registeredHarvestEvent.watch(function (error, result) {
    if (!error) {
      console.log("registeredHarvestEvent");
      // TODO - enable button?
      //$(addHarvestBtn).attr("disabled", true);

      // Remove spinner from button
      //$("spinner_addHarvestBtn").hide();

      //update text
      //$("addHarvestBtn").html(`Added to Blockchain`);

      // TODO - Update status in DB via ajax post then update UI button, maybe ID button should include harvestid in its ID
    } else {
      // Remove spinner from button
      // $("spinner_addHarvestBtn").hide();

      //update text
      //$("addHarvestBtn").html(`Error Adding to Blockchain`);
      console.log(error);

      // TODO - Update status in DB via ajax post then update UI button, maybe ID button should include harvestid in its ID
    }
  });*/

  //Watch for registeredHarvestDetailEvent, returns  _harvestID and _harvestSubmissionBlockNumber
  FoodPrintProduceContractV2.on('registeredHarvestDetailEvent', (harvestID, harvestSubmissionBlockNumber, event) => {
    console.log("registeredHarvestDetailEvent");
    console.log('First parameter harvestID:', harvestID);
    console.log('Second parameter harvestSubmissionBlockNumber:', harvestSubmissionBlockNumber);
    console.log('Event : ', event);  //Event object
    // TODO - if not error
    // TODO - Update status in DB via ajax post then update UI button, maybe ID button should include harvestid in its ID
    });

  // var registeredHarvestDetailEvent = FoodPrintProduceContractV2.registeredHarvestDetailEvent();
  // registeredHarvestEvent.watch(function (error, result) {
  //   if (!error) {
  //     console.log("registeredHarvestDetailEvent" + result);
  //     // TODO - Update status in DB via ajax post then update UI button, maybe ID button should include harvestid in its ID
  //   } else {
  //     console.log("registeredHarvestDetailEvent error" + error);
  //
  //     // TODO - Update status in DB via ajax post then update UI button, maybe ID button should include harvestid in its ID
  //   }
  // });

  // function to verify Harvest entry exists on blockchain
  //TODO - Harvest detail
  function verifyHarvestEntry(data) {
    //  disable link
    $(this).addClass('disabled');

    // add spinner to button
    $(this).html(
        `<span class="spinner-border spinner-border-sm" id="spinner_verifyHarvestEntryBtn" role="status" aria-hidden="true"></span> Searching on Blockchain...`
    );

    if (typeof web3 === 'undefined') {
      return handle_web3_undefined_error();
    }

    var harvest_logid = data.harvest_logid;
    console.log("search_harvest_logid: " + harvest_logid);


    FoodPrintProduceContractV2.getHarvestSubmission(harvest_logid, function (err, result) {
      if (err) {
        return handle_error(err);
      }
      //result:
      // harvest_id,
      // harvestEntry.supplierproduceID,
      // harvestEntry.harvestTimeStamp,
      // harvestEntry.BlockNumber,
      // harvestMap[harvest_id].IsSet 1,

      // Output from the contract function call
      console.log("result: " + result);

      let contractIsSet = result[4].toNumber();
      console.log("contractIsSet: " + contractIsSet);
      console.log("result[0]: " + result[0]);
      console.log("(contractIsSet > 0): " + (contractIsSet > 0));

      // if the Harvest Entry is not in the smart contracts harvestMap, then isSet will not be 1
      if (contractIsSet > 0) {
        let contract_harvest_id = result[0];
        let contract_harvestEntry_supplierproduceID = result[1];
        let contract_harvestEntry_harvestTimeStamp = result[2];
        let contract_harvestEntry_BlockNumber = result[3];
        // let displayDate = new Date(contractSubmissionBlocktime * 1000).toLocaleString();

        var message_description = `Harvest Entry for ${contract_harvestEntry_supplierproduceID} with Harvest ID ${contract_harvest_id} is <b>valid</b>. Uploaded to FoodPrint Produce (Blockchain) on: ${contract_harvestEntry_harvestTimeStamp}.` +
            `BlockNumber ${contract_harvestEntry_BlockNumber}.`;
        //trigger notification
        $("#search_result_harvest").html(message_description);
        //$("#search_result_harvest").css('display','block'); //display result - not working
        $("#search_result_harvest").removeAttr('style');//display result

        // Remove spinner from button
        $("#spinner_verifyHarvestEntryBtn").hide();
        $(this).html('Verify Harvest ID');
        $(this).removeClass("disabled");
        //$(this).html( `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Search on Blockchain...` );
        return console.log(message_description);
      } else
        var message_description = `Harvest Entry with Harvest ID ${harvest_logid} is <b>invalid</b>: not found in the FoodPrint Harvest Logbook (Blockchain).`;

      // Remove spinner from button
      $("#spinner_verifyHarvestEntryBtn").hide();
      $(this).html('Verify Harvest ID');
      $(this).removeClass("disabled");

      //trigger notification
      $("#search_result_harvest").html(message_description);
      $("#search_result_harvest").removeAttr('style');//display result
      return console.log(message_description);
    });
  };

  // function to retrieve a submitted Harvest Entry submitter address
  function retrieveHarvestEntrySubmitAddress() {
    FoodPrintProduceContractV2.getHarvestSubmitterAddress(harvest_logid, function (err, result) {
      if (err) {
        return handle_error(err);
      }

      //result:
      // harvestSubmissionAddress 0x874950B8c006e6D166f015236623fCD0C0a7DC75,

      // Output from the contract function call
      console.log("result: " + result);

      if (result === '0x0000000000000000000000000000000000000000') {
        var message_description = `Harvest Entry with Harvest ID ${harvest_logid} is <b>invalid</b>: no corresponding submitter address found in the FoodPrint Produce (Blockchain).`;

        // TODO - trigger notification
        return console.log(message_description);
      } else {
        var message_description = `Harvest Entry with Harvest ID ${harvest_logid} is <b>valid</b>. Uploaded to FoodPrint Produce (Blockchain) by address : ${result}.`;
        // TODO - trigger notification
        return console.log(message_description);
      }
    });
  };

  // function to get count of Harvest entries that have been previously uploaded
  function getProduceHarvestCount() {
    if (typeof web3 === 'undefined') {
      return handle_web3_undefined_error();
    }

    FoodPrintProduceContractV2.getHarvestSubmissionsCount(function (err, result) {
      if (err) {
        return handle_error(err);
      }
      let harvestSubmissionsCount = result.toNumber(); // Output from the contract function call
      console.log("getHarvestSubmissionsCount: " + harvestSubmissionsCount);
      var message_description = `Number of Harvest Entries: + ${harvestSubmissionsCount}`;

      // TODO - trigger notification
      return console.log(message_description);
    });
  };


  // function Add Storage Entry to Blockchain
  //TODO - should only be able to add Storage to Blockchain if there is a corresponding Harvest ID already on Blockchain
  async function addStorageToBlockchain() {

    // disable button wont work because it is actually a link
    // $("this").prop("disabled", true);

    //  disable link
    $(this).addClass('disabled');

    // add spinner to button
    $(this).html(
        `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Adding to Blockchain...`
    );

    //storage entry variables from selected record
    var harvest_logid = $(this).data('harvest_logid');
    var storage_logid = $(this).data('storage_logid');
    var harvest_suppliershortcode = $(this).data('harvest_suppliershortcode');
    var supplierproduce = $(this).data('supplierproduce');
    var market_Shortcode = $(this).data('market_shortcode');
    var market_Name = $(this).data('market_name');
    var market_Address = $(this).data('market_address');
    var market_quantity = $(this).data('market_quantity');
    var market_unitOfMeasure = $(this).data('market_unitofmeasure');
    var market_storageTimeStamp = $(this).data('market_storagetimestamp');
    var market_storageCaptureTime = $(this).data('market_storagecapturetime');
    var market_URL = $(this).data('market_url');
    var storage_BlockchainHashID = $(this).data('storage_blockchainhashid');
    var storage_BlockchainHashData = $(this).data('storage_blockchainhashdata');
    var storage_Description = $(this).data('storage_description');
    var storage_bool_added_to_blockchain = $(this).data('storage_bool_added_to_blockchain');
    var storage_added_to_blockchain_date = $(this).data('storage_added_to_blockchain_date');
    var storage_added_to_blockchain_by = $(this).data('storage_added_to_blockchain_by');
    var storage_blockchain_uuid = $(this).data('storage_blockchain_uuid');
    var storage_user = $(this).data('storage_user');
    var logdatetime = $(this).data('logdatetime');
    var lastmodifieddatetime = $(this).data('lastmodifieddatetime');

    var storage_tablename = 'foodprint_storage';
    var storage_quantity_combined = market_quantity + "(" + market_unitOfMeasure + ")";

    console.log("this harvest_logid - " + harvest_logid);
    console.log("this storage_logid - " + storage_logid);

    let storageDetail = `{storageDescription:${storage_Description}, storageTableName:${storage_tablename}, storageUser:${storage_user}, storageQuantity:${storage_quantity_combined}}`;
    let otherID = `{supplierproduceID:${supplierproduce}, marketID:${market_Shortcode}}`;
    //TODO - similar implementation for timestamps

    console.log("this storageDetail - " + storageDetail);
    console.log("this otherID - " + otherID);

    if (typeof web3 === 'undefined') {
      return handle_web3_undefined_error();
    }

    // solidityContext required if you use msg object in contract function e.g. msg.sender
    // var solidityContext = {from: web3.eth.accounts[1], gas:3000000}; //add gas to avoid out of gas exception

    // FoodPrint Produce contract
    // registerStorageSubmission (string calldata _otherID, string calldata _storageTimeStamp,  string calldata _storageDetail, string calldata _storageID, string calldata _harvestID)

    // registerStorageSubmission(
    // otherID,
    // market_storageTimeStamp,
    // storageDetail,
    // storage_logid,
    // harvest_logid);

    console.log("Test before submit - otherID: " + otherID + ", market_storageTimeStamp: " + market_storageTimeStamp +
        ", storageDetail: " + storageDetail + ",storage_logid: " + storage_logid + ", harvest_logid:" + harvest_logid);

    //Load the contract schema from the abi and Instantiate the contract by address
    // at(): Create an instance of MyContract that represents your contract at a specific address.
    // deployed(): Create an instance of MyContract that represents the default address managed by FoodPrintProduceContractV2.
    // new(): Deploy a new version of this contract to the network, getting an instance of FoodPrintProduceContractV2 that represents the newly deployed instance.

    FoodPrintProduceContractV2.registerStorageSubmission(otherID, market_storageTimeStamp, storageDetail, storage_logid, harvest_logid,
        function (err, result) {
          if (err) {
            console.log("Error Adding Storage to Blockchain");
            $(this).html(
                `Error Adding Storage to Blockchain`
            );
            return handle_error(err);
          }

          var message_description = `Transaction submitted to Blockchain for processing (Upload Storage Entry from ${supplierproduce} with Harvest ID ${harvest_logid} and Storage ID ${storage_logid}). Check your Metamask for transaction update.`;

          //TODO - trigger notification
          console.log(message_description);
        });
  };

  //Watch for registeredStorageEvent, returns  returns uint _storageLogIDIndex,  string _storageID, _storageSubmissionBlockNumber
  FoodPrintProduceContractV2.on('registeredStorageEvent', (storageLogIDIndex, storageID, storageSubmissionBlockNumber, event) => {
    console.log("registeredStorageEvent");
    console.log('First parameter storageLogIDIndex:', storageLogIDIndex);
    console.log('Second parameter storageID:', storageID);
    console.log('Third parameter storageSubmissionBlockNumber:', storageSubmissionBlockNumber);
    console.log('Event : ', event);  //Event object
    // TODO - if not error
    // TODO - Update status in DB via ajax post then update UI button, maybe ID button should include harvestid in its ID
  });


  //Watch for registeredStorageEvent, returns uint _storageLogIDIndex,  string _storageID, _storageSubmissionBlockNumber
/*  var registeredStorageEvent = FoodPrintProduceContractV2.registeredStorageEvent();
  registeredStorageEvent.watch(function (error, result) {
    if (!error) {
      console.log("registeredStorageEvent");
      // TODO - Update status in DB via ajax post then update UI button, maybe ID button should include harvestid in its ID
    } else {
      console.log("registeredStorageEvent Error" + error);

      // TODO - Update status in DB via ajax post then update UI button, maybe ID button should include harvestid in its ID
    }
  });*/

  // function to verify Harvest entry exists on blockchain
  function verifyStorageEntry(data) {
    //  disable link 
    $(this).addClass('disabled');

    // add spinner to button
    $(this).html(
        `<span class="spinner-border spinner-border-sm" id="spinner_verifyStorageEntryBtn" role="status" aria-hidden="true"></span> Searching on Blockchain...`
    );

    if (typeof web3 === 'undefined') {
      return handle_web3_undefined_error();
    }
    var storage_logid = data.storage_logid;
    console.log("search_storage_logid: " + storage_logid);

    FoodPrintProduceContractV2.getStorageSubmission(storage_logid, function (err, result) {
      if (err) {
        return handle_error(err);
      }
      //result:
      //storageEntry.storageID,
      //storageEntry.harvestID,
      //storageEntry.otherID,
      //storageEntry.storageDetail,
      //storageEntry.BlockNumber,
      //storageEntry.IsSet

      // Output from the contract function call
      console.log("result: " + result);

      let contractIsSet = result[5].toNumber();
      console.log("contractIsSet: " + contractIsSet);
      console.log("result[0]: " + result[0]);
      console.log("(contractIsSet > 0): " + (contractIsSet > 0));

      // if the Storage Entry is not in the smart contracts storageMap, then isSet will not be 1
      if (contractIsSet > 0) {
        let contract_storage_id = result[0];
        let contract_harvest_id = result[1];
        let contract_otherID = result[2];
        let contract_storageDetail = result[3];
        let contract_storageEntry_BlockNumber = result[4];

        var message_description = `Storage Entry with Storage ID ${contract_storage_id} and Harvest ID ${contract_harvest_id} is <b>valid</b>. This corresponds to ${contract_otherID}. Additional details from 
                                      FoodPrint Produce (Blockchain) include: ${contract_storageDetail}.` +
            `BlockNumber ${contract_storageEntry_BlockNumber}.`;
        //trigger notification
        $("#search_result_storage").html(message_description);
        $("#search_result_storage").removeAttr('style');//display result
        // $('#search_result_storage').css('display','none'); //hide result

        // Remove spinner from button
        $("#spinner_verifyStorageEntryBtn").hide();
        $(this).html('Verify Storage ID');
        $(this).removeClass("disabled");
        //$(this).html( `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Search on Blockchain...` );
        return console.log(message_description);
      } else
        var message_description = `Storage Entry with Storage ID ${contract_storage_id} is <b>invalid</b>: not found in the FoodPrint Storage Logbook (Blockchain).`;

      // Remove spinner from button
      $("#spinner_verifyStorageEntryBtn").hide();
      $(this).html('Verify Storage ID');
      $(this).removeClass("disabled");

      //trigger notification
      $("#search_result_hstorage").html(message_description);
      $("#search_result_storage").removeAttr('style');//display result
      return console.log(message_description);
    });
  };


  // function to check FoodPrint Produce Contract Status - stopped or not stopped
  function getContractStatus() {
    if (typeof web3 === 'undefined') {
      return handle_web3_undefined_error();
    }

    FoodPrintProduceContractV2.checkContractIsRunning(function (err, result) {
      if (err) {
        return handle_error(err);
      }

      console.log("Is FoodPrint Produce Contract currently stopped " + result);
    });
  };

  // function to toggle contract status between stopped and not stopped
  function toggleContractStatus() {
    if (typeof web3 === 'undefined') {
      return handle_web3_undefined_error();
    }

    FoodPrintProduceContractV2.checkContractIsRunning(function (err, result) {
      if (err) {
        return handle_error(err);
      }
      ;
      var original_contract_status = result;
      console.log("Is FoodPrint Produce Contract currently stopped before toggle: " + original_contract_status);

      FoodPrintProduceContractV2.toggleContractActive(function (err2, result2) {
        if (err2) {
          return handle_error(err2);
        }
        ;
        var new_contract_status = !original_contract_status;

        // TODO - trigger a custom notification
        console.log("FoodPrint Produce Contract status toggled. Transaction submitted to Blockchain for processing");
      });
    });
  };

  // function to initiate FoodPrint Produce selfdestruct
  function destroyContract() {
    if (typeof web3 === 'undefined') {
      return handle_web3_undefined_error();
    }

    FoodPrintProduceContractV2.destroy(function (err, result) {
      if (err) {
        return handle_error(err);
      }
      console.log("result: " + result);
      // TODO - trigger a custom notification
      if (typeof result !== 'undefined') {
        console.log("Contract destroy initiated");
      }
    });
  };
};


// As soon as the content in the DOM is loaded we are calling our initialize function
window.addEventListener("DOMContentLoaded", initialize);
