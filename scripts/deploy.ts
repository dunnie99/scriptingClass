import { ethers } from "hardhat";
import * as fs from "fs"; 
import * as path from 'path';
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import {keccak256} from "ethers/lib/utils";
import dotenv from "dotenv";
import { parse } from 'csv-parse';
dotenv.config();

type data ={
  Address: string;
  Amount: number;
}




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
  const headers = ['address', 'amount'];

  const jsonto = "claimers.json";

  const output: any[] =[];
  parse(csvFile, {
    delimiter: ',',
    columns: headers,
  }, (error, result: data[] ) => {
      if (error){
        console.error(error);
      }
      const jsonObj = JSON.stringify(result);
      fs.writeFileSync(jsonto, jsonObj); 
      result.map((e)=>{
        output.push([e.Address, e.Amount])
      }) 
  });

  const merkleFile = fs.readFileSync(jsonto,"utf-8");
  console.log(`merkleFile is ${merkleFile}`);


  const tree = StandardMerkleTree.of(output, ['address', 'uint256']);
  console.log(tree.root);
  


  

  // JSONList.forEach((item: any )=> {
  //   console.log(item.address, item.amount);
    
  // });

  // const byteData = ethers.utils.defaultAbiCoder.encode(
  //   ['address', 'uint256'],
  //   [JSONList.address, JSONList.amount]
  // )
  // console.log(`byteData is ${byteData}`);
  
  
  // const leaves = JSONList.map((item: any) => keccak256(JSON.stringify(item)));
  // const CSVmerkleTree = new MerkleTree(leaves,keccak256,{sort:true});

  // console.log("generated merkle root is", CSVmerkleTree.getRoot().toString("hex"));





















































  }
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
