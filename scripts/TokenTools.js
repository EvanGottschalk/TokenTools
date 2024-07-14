//# To add:
// Get airdrop
// Switch wallet



//--------------------------------------------------------------------------------------------------
//# Imports


import { exec } from 'child_process';

import fs from 'fs';
import csv from 'csv-parser';
import inquirer from 'inquirer';

import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';








//--------------------------------------------------------------------------------------------------
//# Variable Declaration


const use_menu = false;
const network_addresses = {'mainnet': 'https://api.mainnet-beta.solana.com',
                           'devnet': 'https://api.devnet.solana.com'};


const token_list_file_name = 'token_list.csv';
var token_list; // = await readDictFromCSV(token_list_file_name);
var selected_token_address = '';
var selected_token_info = '' //await selectToken(selected_token_address);
var network = '';








//--------------------------------------------------------------------------------------------------
//# General Functions


async function readDictFromCSV(CSV_file_name) {
  const CSV_array = {};
  fs.createReadStream(CSV_file_name) // e.g. 'token_list.csv'
  .pipe(csv({ headers: false })) // Set headers to false to skip the header row
  .on('data', (row) => {
    // Assuming the first column is the key and the second column is the value
    CSV_array[row[0]] = row[1];
  })
  .on('end', () => {
    //console.log(CSV_array);
    return(CSV_array);
  });
};

async function correctDecimals(token_address, amount) {
  if (!token_address) {
    token_address = selected_token_address;
  };
  console.log('\n>>>RUNNING createToken()');
  console.log('Input Amount:', amount);
  console.log('Input Token Address:', token_address);
  const token_info = await getTokenInfo(token_address);
  console.log('Token Decimals:', token_info.decimals);
  const corrected_amount = amount * 10**(token_info.decimals);
  console.log('Corrected Amount:', corrected_amount);
  return(corrected_amount);
}







//--------------------------------------------------------------------------------------------------
//# Metaboss SPL Functions


async function selectToken(token_address) {
  console.log('\n>>>RUNNING selectToken()');
  selected_token_address = token_address;
  console.log("\n--- Selected Token Address ---");
  console.log(selected_token_address);
  if (use_menu) {
    displayMenu();
  };
  return(selected_token_address);
};


async function createToken(decimals=9, file_name, initial_supply=0) {
  console.log('\n>>>RUNNING createToken()');
  exec('metaboss create fungible -d ' + decimals + ' -m ./token_metadata/' + file_name + ' --initial-supply ' + initial_supply, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
  //console.log("New Token Address:", new_token_address);
  // await selectToken(new_token_address);
  // return(new_token_address);
  if (use_menu) {
    displayMenu();
  };
};


async function decodeToken(token_address) {
  console.log('\n>>>RUNNING decodeToken()');
  if (!token_address) {
    token_address = selected_token_address;
  };
  const token_info = exec('metaboss decode mint --account ' + token_address + ' -o C:/Users/magnu/s/projects/rust/TokenTools/decode', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
  console.log("\n--- Decoded Token Info ---");
  console.log(token_info);
  if (use_menu) {
    displayMenu();
  };
  return(token_info);
}


async function getSolanaConfig() {
  console.log('\n>>>RUNNING getSolanaConfig()');
  exec('solana config get', (error, stdout, stderr) => {
    if (error) {
      console.error(`\n\nError: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`\n\nstderr: ${stderr}`);
      return;
    }
    console.log(`\n\nstdout: ${stdout}`);
  });
};


async function switchNetwork(new_network) {
  console.log('\n>>>RUNNING switchNetwork()');
  if (!new_network) {
    if (network === 'mainnet') {
      network = 'devnet';
    } else {
      network = 'mainnet'
    }
  } else {
    network = new_network;
  };
  exec('solana config set --url ' + network_addresses[network], (error, stdout, stderr) => {
    if (error) {
      console.error(`\n\nError: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`\n\nstderr: ${stderr}`);
      return;
    }
    console.log(`\n\nstdout: ${stdout}`);
  });
  console.log('Connected to', network, 'successfully!');
  if (use_menu) {
    await displayMenu();
  };
};


async function setKeypair(file_name) {
  console.log('\n>>>RUNNING setKeypair()');
  exec('solana config set --keypair keypairs/' + file_name, (error, stdout, stderr) => {
    if (error) {
      console.error(`\n\nError: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`\n\nstderr: ${stderr}`);
      return;
    }
    console.log(`\n\nstdout: ${stdout}`);
  });
  console.log('Switched wallet to', file_name, 'successfully!');
  if (use_menu) {
    await displayMenu();
  };
}


async function transferTokens(token_address, amount, receiver_address) {
  console.log('\n>>>RUNNING transferTokens()');
  if (!token_address) {
    token_address = selected_token_address;
  };
  console.log('Token Address:', token_address);
  console.log('Amount:', amount);
  console.log('Receiver Address:', receiver_address);
  exec('metaboss transfer asset --mint ' + token_address + ' --receiver ' + receiver_address + ' --amount ' + amount.toString(), (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
  console.log('Tokens transferred successfully!');
  if (use_menu) {
    displayMenu();
  };
};


async function updateMetadata(token_address, metadata_URI) {
  console.log('\n>>>RUNNING updateMetadata()');
  if (!token_address) {
    token_address = selected_token_address;
  };
  exec('metaboss update uri --account ' + token_address + ' --new-uri ' + metadata_URI, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
  console.log('Metadata updated successfully!');
  if (use_menu) {
    displayMenu();
  }
};


async function requestAirdrop(amount=.5) {
  console.log('\n>>>RUNNING requestAirdrop()');
  exec('solana airdrop ' + amount.toString(), (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
  console.log('Airdrop for ' + amount.toString() + 'SOL requested!');
  if (use_menu) {
    await displayMenu();
  };
};



async function getKeypair(private_key) {
  // const PRIVATE_KEY = Buffer.from(PRIVATE_KEY_ARRAY, 'base64').toString('hex');
  const b = bs58.decode(private_key);
  const j = new Uint8Array(b.buffer, b.byteOffset, b.byteLength / Uint8Array.BYTES_PER_ELEMENT);
  const private_key_array = JSON.parse(`[${j}]`);
  // console.log("private_key_array:", private_key_array);
  const private_key_hex = Buffer.from(private_key_array, 'base64').toString('hex');
  // console.log("private_key_hex:", private_key_hex);
  const keypair = Keypair.fromSecretKey(Buffer.from(private_key_hex, 'hex'));
  // console.log("keypair:", keypair);
  const public_key = keypair['publicKey'].toBase58();
  // console.log("public_key:", public_key);
  // Write the JSON string to the file
  fs.writeFile("keypairs/" + public_key + ".json", ('[' + private_key_array + ']').toString(), (err) => {
    if (err) {
        console.error('Error writing file:', err);
    } else {
        console.log('Keypair JSON saved successfully!');
        console.log('File:', public_key + ".json");
    }
  });
  if (use_menu) {
    await displayMenu();
  };
};







//--------------------------------------------------------------------------------------------------
//# Menu

const main_menu_options = [
  '1) Switch Network',
  '2) Create New Token',
  '3) Select Token',
  '4) Send Tokens',
  '5) Update Metadata',
  '6) Request Airdrop',
  '7) Get Keypair from Private Key',
  '8) Set Keypair File\n'
];

const main_menu_prompt = {
  type: 'list',
  name: 'selected_option',
  message: 'Choose an option:',
  choices: main_menu_options,
};

var token_menu_options = createTokenMenu();

const token_menu_prompt = {
  type: 'list',
  name: 'selected_option',
  message: 'Choose a token:',
  choices: token_menu_options,
};


const decimal_input_prompt = {
  type: 'input',
  name: 'user_input',
  message: 'Enter a decimal length for your token:',
};


const mint_amount_input_prompt = {
  type: 'input',
  name: 'user_input',
  message: 'Enter a number of tokens to mint:',
};


const transfer_amount_input_prompt = {
  type: 'input',
  name: 'user_input',
  message: 'Enter a number of tokens to transfer:',
};


const recipient_address_input_prompt = {
  type: 'input',
  name: 'user_input',
  message: 'Enter the receiver of the tokens:',
};


const metadata_URI_input_prompt = {
  type: 'input',
  name: 'user_input',
  message: 'Enter the OFF-CHAIN metadata URI:',
};


const metadata_filename_input_prompt = {
  type: 'input',
  name: 'user_input',
  message: 'Enter the name of your ON-CHAIN metadata file:',
};


const private_key_input_prompt = {
  type: 'input',
  name: 'user_input',
  message: 'Enter a private key:',
};


const keypair_filename_input_prompt = {
  type: 'input',
  name: 'user_input',
  message: 'Enter a keypair file name:',
};


const initial_supply_input_prompt = {
  type: 'input',
  name: 'user_input',
  message: 'Enter an initial supply of tokens:',
};




async function createTokenMenu() {
  token_menu_options = [];
  token_list = await readDictFromCSV(token_list_file_name);
  for (const token_name in token_list) {
    if (token_list.hasOwnProperty(token_name)) {
      token_menu_options.push(token_name);
    };
  };
  return(token_menu_options);
};


async function displayMenu() {
  await getSolanaConfig();
  await inquirer.prompt(main_menu_prompt).then((selection) => {
    console.log(selection.selected_option)
    if (selection.selected_option[0] === '1') {
      switchNetwork();
    } else if (selection.selected_option[0] === '2') {
      inquirer.prompt(decimal_input_prompt).then((value) => {
        const decimals = value.user_input;
        inquirer.prompt(metadata_filename_input_prompt).then((value) => {
          const file_name = value.user_input;
          inquirer.prompt(initial_supply_input_prompt).then((value) => {
            const initial_supply = value.user_input;
            createToken(decimals, file_name, initial_supply);
          });
        });
      });
    } else if (selection.selected_option[0] === '3') {
      inquirer.prompt(token_menu_prompt).then((selection) => {
        selectToken(token_list[selection.selected_option.split(') ')[1]]);
      });
    } else if (selection.selected_option[0] === '4') {
      inquirer.prompt(mint_amount_input_prompt).then((value) => {
        const amount = value.user_input;
        mintTokens(amount);
      });
    } else if (selection.selected_option[0] === '5') {
      transferTokens(1, '8FMc41i7TbzNkT2KvxwE5keWBkA3JAP9iBZYbLBJqJN7');
    } else if (selection.selected_option[0] === '6') {
      requestAirdrop();
    } else if (selection.selected_option[0] === '7') {
      inquirer.prompt(private_key_input_prompt).then((value) => {
        const private_key = value.user_input;
        getKeypair(private_key);
      });
    } else if (selection.selected_option[0] === '8') {
      // inquirer.prompt(keypair_filename_input_prompt).then((value) => {
        // const file_name = value.user_input;
        const file_name = "ZA5mFZt1Gku3vTzuToKGbqtyhAmFLHhHdyqLtvyuoeZ.json";
        setKeypair(file_name);
      // });
    }
  });
}






//--------------------------------------------------------------------------------------------------
//# Execution

if (use_menu) {
  displayMenu();
} else {
  console.log('use_menu = False');
  const private_key = "";
  getKeypair(private_key);
};