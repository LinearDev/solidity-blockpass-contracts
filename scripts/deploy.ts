const fs = require('fs');
const path = require("path");
import { ethers } from "hardhat";
import { json } from "hardhat/internal/core/params/argumentTypes";

async function deploy() {

    const userGroups = await (await ethers.getContractFactory("UserGroups")).deploy();
    const userPasswords = await (await ethers.getContractFactory("UserPasswords")).deploy();
    const deviceActivity = await (await ethers.getContractFactory("DeviceActivity")).deploy();

    const addresses = {
        UserGroups: userGroups.address,
        UserPasswords: userPasswords.address,
        DeviceActivity: deviceActivity.address,
    };

    const fileName = `addresses.json`;
    fs.writeFileSync("./artifacts/" + fileName, JSON.stringify(addresses));
}

function format(file: string) {
    const rawData = fs.readFileSync('./artifacts/contracts/'+ file +'.sol/'+ file +'.json');
    const data = JSON.parse(rawData);

    const outputPath = path.join(__dirname, 'artifacts', 'stringified');
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
    }
    const jsonString = JSON.stringify(data['abi']);
    let escapedString = jsonString.replace(/"/g, '\\"');
    escapedString = '"' + escapedString + '"';

    fs.writeFileSync(path.join(outputPath, file), escapedString);
}

async function main() {
    await deploy()
    format("UserGroups");
    format("UserPasswords");
    format("DeviceActivity");
}
main()

// deploy().then(() => {
//     format("UserGroups");
// }).catch((error) => {
//     console.error(error);
//     process.exitCode = 1;
// });
