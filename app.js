var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const Web3 = require("web3");
var Tx = require('ethereumjs-tx');

const rpcURL = "https://rinkeby.infura.io/v3/3ad8ea74c8a44043964e128c323bd7a2";
const web3 = new Web3(rpcURL);
const contractABI = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "account",
        "type": "address"
      }
    ],
    "name": "isInstitution",
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
        "name": "account",
        "type": "address"
      }
    ],
    "name": "isVerifier",
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
    "constant": false,
    "inputs": [
      {
        "name": "account",
        "type": "address"
      }
    ],
    "name": "renounceVerifier",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "account",
        "type": "address"
      }
    ],
    "name": "renounceInstitution",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
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
    "constant": false,
    "inputs": [
      {
        "name": "account",
        "type": "address"
      }
    ],
    "name": "renounceCredHolder",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "owner",
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
    "inputs": [],
    "name": "isOwner",
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
    "constant": false,
    "inputs": [
      {
        "name": "account",
        "type": "address"
      }
    ],
    "name": "addVerifier",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "account",
        "type": "address"
      }
    ],
    "name": "addInstitution",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "account",
        "type": "address"
      }
    ],
    "name": "addCredHolder",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
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
    "constant": true,
    "inputs": [
      {
        "name": "account",
        "type": "address"
      }
    ],
    "name": "isCredHolder",
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
    "inputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "credID",
        "type": "uint256"
      }
    ],
    "name": "Created",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "credID",
        "type": "uint256"
      }
    ],
    "name": "Issued",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "credID",
        "type": "uint256"
      }
    ],
    "name": "Valid",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "account",
        "type": "address"
      }
    ],
    "name": "VerifierAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "account",
        "type": "address"
      }
    ],
    "name": "VerifierRemoved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "account",
        "type": "address"
      }
    ],
    "name": "CredHolderAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "account",
        "type": "address"
      }
    ],
    "name": "CredHolderRemoved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "account",
        "type": "address"
      }
    ],
    "name": "InstitutionAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "account",
        "type": "address"
      }
    ],
    "name": "InstitutionRemoved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "oldOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "TransferOwnership",
    "type": "event"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "kill",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_issuingInstitutionID",
        "type": "address"
      },
      {
        "name": "_institutionName",
        "type": "string"
      },
      {
        "name": "_institutionType",
        "type": "string"
      },
      {
        "name": "_institutionInfo",
        "type": "string"
      },
      {
        "name": "_credentialName",
        "type": "string"
      },
      {
        "name": "_credentialNotes",
        "type": "string"
      },
      {
        "name": "_credentialType",
        "type": "string"
      }
    ],
    "name": "createCredential",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_credID",
        "type": "uint256"
      },
      {
        "name": "_earnerID",
        "type": "address"
      }
    ],
    "name": "issueCredential",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_credID",
        "type": "uint256"
      }
    ],
    "name": "getCredentialInfo",
    "outputs": [
      {
        "name": "institutionName",
        "type": "string"
      },
      {
        "name": "credentialName",
        "type": "string"
      },
      {
        "name": "credentialNotes",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];
const contractAddress = "0x72E9E674b78f5348BE6E2E27642bE392Ea87198F";

const account1 = "0xF1cE5dcCD31e82DaFd9558A8d148f285215Bd4d6";
const account2 = "0x52A59CF5c9BEc72327B12ad4E4A4aC449A424377";

const privateKey1 = Buffer.from("0A391D8D78A24D1C4F98BC31B37071797DD03FC7A9C04225054D5E85220CE69C", 'hex');
const privateKey2 = Buffer.from("2B386E02929DDA080B7D36F41FAB32F155413269EB0464ECE70A4096F5DE8AF0", 'hex');
const contract = new web3.eth.Contract(contractABI,contractAddress);





// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.get('/test', (req,res)=>{
  console.log('here it is')
})
app.get('/credential/:id', (req,res)=>{
    let credId = req.params.id;
    console.log('id', credId)
    let result = contract.methods.getCredentialInfo(credId).call( (error,result)=>{
      if(error){console.log('error', error);}else{
        res.send(result)

      }
    });

    console.log('result', result)
});

app.post('/createCredential', (req,res)=>{
  let institutionID = req.body.institutionID;
  let institutionName = req.body.institutionName;
  let institutionType = req.body.institutionType;
  let institutionInfo = req.body.institutionInfo;
  let credentialName = req.body.credentialName;
  let credentialNotes = req.body.credentialNotes;
  let credentialType = req.body.credentialType;

  const data = contract.methods.createCredential(
            institutionID,
            institutionName,
            institutionType,
            institutionInfo,
            credentialName,
            credentialNotes,
            credentialType).encodeABI()
  console.log(data)
  web3.eth.getTransactionCount(account1, (err, txCount) => {
    // Build the transaction
    console.log('count', txCount)
    const txObject = {
      nonce:web3.utils.toHex(txCount),
      to:contractAddress,
      value:0,
      gasLimit: web3.utils.toHex(250000),
      gasPrice: web3.utils.toHex(web3.utils.toWei('3', 'gwei')),
      data: data
    };
    // Sign the transaction
    const tx = new Tx(txObject)
    tx.sign(privateKey1)

    const serializedTx = tx.serialize()
    const raw = '0x' + serializedTx.toString('hex')

    // Broadcast the transaction
    web3.eth.sendSignedTransaction(raw, (err, txHash) => {
      console.log('err', err)
      console.log('txHash:', txHash)
      res.send(txHash);
    })
  })
});

app.post('/addIssuer', (req,res)=>{
  let issuerId = req.body.newIssuerId;
  const data = contract.methods.addInstitution(issuerId).encodeABI();
  console.log(data);
  web3.eth.getTransactionCount(account1, (err, txCount) => {
    // Build the transaction
    console.log('count', txCount)
    const txObject = {
      nonce:web3.utils.toHex(txCount),
      to:contractAddress,
      value:0,
      gasLimit: web3.utils.toHex(250000),
      gasPrice: web3.utils.toHex(web3.utils.toWei('3', 'gwei')),
      data: data
    };
    // Sign the transaction
    const tx = new Tx(txObject)
    tx.sign(privateKey1)

    const serializedTx = tx.serialize()
    const raw = '0x' + serializedTx.toString('hex')

    // Broadcast the transaction
    web3.eth.sendSignedTransaction(raw, (err, txHash) => {
      console.log('err', err)
      console.log('txHash:', txHash)
      res.send(txHash);
    })
  })
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



app.listen(3000);
module.exports = app;
