import { ethers } from "hardhat";
import * as fs from "fs";
import csv from 'csv-parser';
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import {keccak256} from "ethers/lib/utils";
import dotenv from "dotenv";
import csvParser from "csv-parser";
import MerkleTree from "merkletreejs";
dotenv.config();





async function main() {
  const [owner] = await ethers.getSigners();
  const Token = await ethers.getContractFactory("CSRtoken");
  const token = await Token.deploy("CAESAR", "CSR");
  await token.deployed();

  console.log(`Contract deployed to ${token.address}`);

  const airDroptoken = token.address;

  const csvFile = fs.readFileSync("claimers.csv", "utf-8");
  const claimersCsv = csvFile.split("\n").splice(1);
  console.log(`your csv is ${claimersCsv}`);
  
  const csvfrom = "claimers.csv";
  const jsonto = "claimers.json";

  const output: any[] =[];
  fs.createReadStream(csvfrom)
  .pipe(csv())
  .on('data', (data) => {
    output.push(data);
  })
  .on('end', () => {
    fs.writeFile(jsonto, JSON.stringify(output, null, 2), (err) => {
      if (err) throw err;
      console.log('CSV to JSON Conversion completed successfully');
    });
  });



  const merkleFile = fs.readFileSync(jsonto,"utf-8");
  console.log(`merkleFile is ${merkleFile}`);


  const JSONList = JSON.parse(merkleFile);

  JSONList.forEach((item: any )=> {
    console.log(item.address, item.amount);
    
  });

  const byteData = ethers.utils.defaultAbiCoder.encode(
    ['address', 'uint256'],
    [JSONList.address, JSONList.amount]
  )
  console.log(`byteData is ${byteData}`);
  
  
  const leaves = JSONList.map((item: any) => keccak256(JSON.stringify(item)));
  const CSVmerkleTree = new MerkleTree(leaves,keccak256,{sort:true});

  // console.log("generated merkle root is", CSVmerkleTree.getRoot().toString("hex"));





















































  }
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
