const Web3 = require('web3'),
  Accounts = require('web3-eth-accounts');

var accounts = new Accounts('ws://localhost:8546');

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  // set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}


const CONTRACT_ABI_ARRAY = [
  {
   "constant": true,
   "inputs": [
    {
     "name": "",
     "type": "address"
    }
   ],
   "name": "investrosBal",
   "outputs": [
    {
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
   "inputs": [],
   "name": "proposalId",
   "outputs": [
    {
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
     "name": "",
     "type": "uint256"
    }
   ],
   "name": "proposalsSum",
   "outputs": [
    {
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
     "name": "",
     "type": "uint256"
    }
   ],
   "name": "investors",
   "outputs": [
    {
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
   "inputs": [
    {
     "name": "_propWhy",
     "type": "string"
    },
    {
     "name": "_propSum",
     "type": "uint256"
    },
    {
     "name": "_propAddress",
     "type": "address"
    },
    {
     "name": "_propDur",
     "type": "uint256"
    }
   ],
   "name": "makeProposal",
   "outputs": [
    {
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
     "name": "_idProp",
     "type": "uint256"
    }
   ],
   "name": "askForFinanlTransaction",
   "outputs": [
    {
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
     "name": "_idProp",
     "type": "uint256"
    },
    {
     "name": "_vote",
     "type": "bool"
    }
   ],
   "name": "voteForProposal",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "",
     "type": "uint256"
    }
   ],
   "name": "proposalStatus",
   "outputs": [
    {
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
   "inputs": [
    {
     "name": "",
     "type": "uint256"
    }
   ],
   "name": "proposalsWhy",
   "outputs": [
    {
     "name": "",
     "type": "bytes32"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "orgAddress",
   "outputs": [
    {
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
     "name": "",
     "type": "uint256"
    }
   ],
   "name": "proposalAddress",
   "outputs": [
    {
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
   "inputs": [
    {
     "name": "_orgAddress",
     "type": "address"
    }
   ],
   "name": "setOrgAddress",
   "outputs": [
    {
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
     "name": "_idProp",
     "type": "uint256"
    }
   ],
   "name": "showFinalResultofProposal",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "admin",
   "outputs": [
    {
     "name": "",
     "type": "address"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "inputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "constructor"
  },
  {
   "payable": true,
   "stateMutability": "payable",
   "type": "fallback"
  }
 ]
 
const DATA = '0x6060604052341561000f57600080fd5b33600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610d0d8061005f6000396000f3006060604052600436106100d0576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806308410967146100e55780632dfca4451461013257806330a009751461015b5780633feb5f2b14610192578063560495ec146101f557806362252b7b1461029b5780636505e8e8146102d657806374c260cf1461031c578063785cbf5b14610357578063797ea25d1461039657806389107dc8146103eb578063b21d01901461044e578063bb26549d1461049f578063f851a440146104da575b6100d93361052f565b6100e33334610595565b005b34156100f057600080fd5b61011c600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506105dd565b6040518082815260200191505060405180910390f35b341561013d57600080fd5b6101456105f5565b6040518082815260200191505060405180910390f35b341561016657600080fd5b61017c60048080359060200190919050506105fb565b6040518082815260200191505060405180910390f35b341561019d57600080fd5b6101b36004808035906020019091905050610613565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561020057600080fd5b610281600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001909190803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035906020019091905050610652565b604051808215151515815260200191505060405180910390f35b34156102a657600080fd5b6102bc60048080359060200190919050506107da565b604051808215151515815260200191505060405180910390f35b34156102e157600080fd5b610302600480803590602001909190803515159060200190919050506108fb565b604051808215151515815260200191505060405180910390f35b341561032757600080fd5b61033d6004808035906020019091905050610a68565b604051808215151515815260200191505060405180910390f35b341561036257600080fd5b6103786004808035906020019091905050610a88565b60405180826000191660001916815260200191505060405180910390f35b34156103a157600080fd5b6103a9610aa0565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156103f657600080fd5b61040c6004808035906020019091905050610ac5565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561045957600080fd5b610485600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610af8565b604051808215151515815260200191505060405180910390f35b34156104aa57600080fd5b6104c06004808035906020019091905050610b9f565b604051808215151515815260200191505060405180910390f35b34156104e557600080fd5b6104ed610bcf565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b600280548060010182816105439190610c90565b9160005260206000209001600083909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050565b80600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505050565b60016020528060005260406000206000915090505481565b60085481565b60056020528060005260406000206000915090505481565b60028181548110151561062257fe5b90600052602060002090016000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156106af57600080fd5b6001600860008282540192505081905550846040518082805190602001908083835b6020831015156106f657805182526020820191506020810190506020830392506106d1565b6001836020036101000a0380198251168184511680821785525050505050509050019150506040518091039020600460006008548152602001908152602001600020816000191690555083600560006008548152602001908152602001600020819055508260066000600854815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555042610e10830201600a600060085481526020019081526020016000208190555060009050949350505050565b60006107e582610bf5565b6007600083815260200190815260200160002060009054906101000a900460ff16801561085d575060056000838152602001908152602001600020546000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163110155b156108f1576006600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc60056000858152602001908152602001600020549081150290604051600060405180830381858888f1935050505015156108e857600080fd5b600190506108f6565b600090505b919050565b60008060008090505b6002805490508110156109915760028181548110151561092057fe5b906000526020600020900160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561098457600191505b8080600101915050610904565b81151561099d57600080fd5b836009600087815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550600115158415151415610a39576001600b600087815260200190815260200160002060008282540192505081905550610a5c565b6001600b6000878152602001908152602001600020600082825403925050819055505b60009250505092915050565b60076020528060005260406000206000915054906101000a900460ff1681565b60046020528060005260406000206000915090505481565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60066020528060005260406000206000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610b5657600080fd5b816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060009050919050565b600080600b6000848152602001908152602001600020541315610bc55760019050610bca565b600090505b919050565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600a60008281526020019081526020016000205442118015610c2a57506000600b600083815260200190815260200160002054135b15610c605760016007600083815260200190815260200160002060006101000a81548160ff021916908315150217905550610c8d565b60006007600083815260200190815260200160002060006101000a81548160ff0219169083151502179055505b50565b815481835581811511610cb757818360005260206000209182019101610cb69190610cbc565b5b505050565b610cde91905b80821115610cda576000816000905550600101610cc2565b5090565b905600a165627a7a723058208d24f0eac0f68101532d623ccfe32622e58882f961a55f0f9d3e4755f26ec2560029';
const CONTRACT_ADDRESS = '0xD641ee9833f11Cd40C7Dd7b777C8e80bD8d842A8';

const CONTRACT = new web3.eth.Contract(CONTRACT_ABI_ARRAY, CONTRACT_ADDRESS, {gasPrice: '12345678', from: "0x6D377De54Bde59c6a4B0fa15Cb2EFB84BB32D433"});

// Посмотреть адорес организатора.
CONTRACT.methods.orgAddress().call()
.then((result) => {
  console.log(result);
});

// web3.eth.call({
//     to: address,
//     data: contract.methods.balanceOf(address).encodeABI()
// }).then(balance => {}

// web3.eth.accounts.privateKeyToAccount('0x2e0a3351bc4f1d619ba654a861ec40a1f307ddc66473ff4cb93717980551b944');

var account = web3.eth.accounts.wallet.add('0x2e0a3351bc4f1d619ba654a861ec40a1f307ddc66473ff4cb93717980551b944');
// разблокировать добавленный в geth аккаунт
// web3.eth.personal.unlockAccount("0x03b825db4af2A61eaFdeCe3A2AA3039743996df2", "123").
// then(() => {
//   console.log('Account unlocked.');
  // Отправить какие-то данные на смарт контракт с этого аккаунта
  CONTRACT.methods.setOrgAddress("0x6d377de54bde59c6a4b0fa15cb2efb84bb32d433").send({from: "0x03b825db4af2A61eaFdeCe3A2AA3039743996df2", gas: "1234422"}, (err,res) => {
    console.log(err)
    console.log(res)
  })


// ДЕПЛОЙ СМАРТ КОНТРАКТА В БЛОКЧЕЙН
//   CONTRACT.deploy({
//     data: DATA
//   })
//   .send({
//     from: '0x6d377de54bde59c6a4b0fa15cb2efb84bb32d433',
//     gas: 1500000,
//     gasPrice: '1000000000'
//   }, function (error, transactionHash) {})
//   .on('error', function (error) {
//     console.log('Ошибка.')
//     console.log(error)
//   })
//   .on('transactionHash', (transactionHash) => {
//     console.log('Хэш транзакции.')
//     console.log(transactionHash)
//   })
//   .on('receipt', function (receipt) {
//     console.log('Адрес контракта.')
//     console.log(receipt.contractAddress) // contains the new contract address
//   })
//   .on('confirmation', function (confirmationNumber, receipt) {
//     console.log('Подтверждения.')
//     console.log(confirmationNumber);
//     console.log(receipt)
//   })
//   .then(function (newContractInstance) {
//     console.log('Адрес контракта.')
//     console.log(newContractInstance.options.address) // instance with the new contract address
//   });
// })
// .catch(console.error);