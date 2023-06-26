const { expect } = require("chai");
const { ethers } = require("hardhat");

let contract;

describe("UserGroups contract", function () {

    beforeEach(async () => {
        contract = await(await ethers.getContractFactory("DeviceActivity")).deploy();
    });

    it("Should add user activity", async () => {
        const [owner] = await ethers.getSigners();
        await contract.addActivity("test", 12345678, "ios");

        const activity = await contract.getActivityById(owner.address, 0);

        expect(activity[0], activity[1].toString(), activity[3]).to.deep.equal("test", "12345678", "ios");
    })

    it("Should return correct activity length", async () => {
        const [owner] = await ethers.getSigners();
        await contract.addActivity("test", 12345678, "ios");
        await contract.addActivity("test", 12345678, "android");
        await contract.addActivity("test", 12345678, "chrome");

        const activityLength = await contract.getActivityLength(owner.address);

        expect(activityLength.toString()).to.deep.equal("3");
    })
});
