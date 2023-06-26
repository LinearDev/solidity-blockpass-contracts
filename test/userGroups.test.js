const { expect } = require("chai");
const { ethers } = require("hardhat");

let contract;

describe("UserGroups contract", function () {

    beforeEach(async () => {
        contract = await(await ethers.getContractFactory("UserGroups")).deploy();
    })

    it("Should create group with title: 'test' and color '#fff'", async () => {
        const [owner] = await ethers.getSigners();

        await contract.addGroupToUser("test", "#fff")
        await contract.addGroupToUser("test", "#fff")

        const groups = await contract.getUserGroups(owner.address)

        expect([groups[0].title, groups[0].color]).to.deep.equal(["test", "#fff"]);
    })

    it("Should not create more than 5 groups", async () => {
        const [owner] = await ethers.getSigners();

        await contract.addGroupToUser("test", "#fff")
        await contract.addGroupToUser("test", "#fff")
        await contract.addGroupToUser("test", "#fff")
        await contract.addGroupToUser("test", "#fff")
        await contract.addGroupToUser("test", "#fff")

        await expect(contract.addGroupToUser("test", "#fff"))
            .to.be.revertedWith("Can't create more than 5 groups");

        const groups = await contract.getUserGroupsLength(owner.address)
        expect(groups.toString()).to.be.equal("5")
    })

    it("Should return group with id 2", async () => {
        const [owner] = await ethers.getSigners();

        await contract.addGroupToUser("test0", "#000")
        await contract.addGroupToUser("test", "#fff")
        await contract.addGroupToUser("test3", "#dedede")

        const group = await contract.getUserGroupById(owner.address, 2)
        expect(group[1], group[2])
        .to.deep.equal("test3", "#dedede");
    })

    it("Should't return group with not existing id", async () => {
        const [owner] = await ethers.getSigners();

        await contract.addGroupToUser("test0", "#000")
        await contract.addGroupToUser("test", "#fff")
        await contract.addGroupToUser("test3", "#dedede")

        await expect(contract.getUserGroupById(owner.address, 4))
        .to.be.revertedWith("Provided id not exist");
    })

    it("Should change title and color in group", async () => {
        const [owner] = await ethers.getSigners();

        await contract.addGroupToUser("test0", "#000")
        await contract.changeAllDataInExistingGroup(0, "t", "#hehehe")
        const data = await contract.getUserGroupById(owner.address, 0)

        expect(data[1], data[2])
        .to.deep.equal("t", "#hehehe");
    })

    it("Should be reverted if title or color not provided", async () => {
        await contract.addGroupToUser("test0", "#000")

        await expect(contract.changeAllDataInExistingGroup(0, "", "#hehehe"))
        .revertedWith("Title not provided");
        await expect(contract.changeAllDataInExistingGroup(0, "test", ""))
        .revertedWith("Color not provided");
    })

    it("Should change only color in group", async () => {
        const [owner] = await ethers.getSigners();

        await contract.addGroupToUser("test0", "#000")
        await contract.changeColorOfExistingGroup(0, "#eee")
        const data = await contract.getUserGroupById(owner.address, 0)
        
        expect(data[1], data[2])
        .to.deep.equal("test0", "#eee");
    })

    it("Should be reverted if color not provided", async () => {
        await contract.addGroupToUser("test0", "#000");
        
        await expect(contract.changeColorOfExistingGroup(0, ""))
        .revertedWith("Color not provided");
    })
    
    it("Should change only title in group", async () => {
        const [owner] = await ethers.getSigners();

        await contract.addGroupToUser("test0", "#000")
        await contract.changeTitleOfExistingGroup(0, "hello")
        const data = await contract.getUserGroupById(owner.address, 0)
        
        expect(data[1], data[2])
        .to.deep.equal("hello", "#000");
    })
    
    it("Should be reverted if title not provided", async () => {
        await contract.addGroupToUser("test0", "#000")
        
        await expect(contract.changeTitleOfExistingGroup(0, ""))
        .revertedWith("Title not provided");
    })

    it("Should return amount of groups", async () => {
        const [owner] = await ethers.getSigners();

        await contract.addGroupToUser("test0", "#000")
        
        const data = await contract.getUserGroupsLength(owner.address)
        expect(data.toString()).to.be.equal("1");
    })

    it("Should return amount of groups", async () => {
        const [owner] = await ethers.getSigners();

        await contract.addGroupToUser("test0", "#000")
        await contract.addGroupToUser("test1", "#000")
        
        const data = await contract.getUserGroupsLength(owner.address)
        expect(data.toString()).to.be.equal("2");
    })
});
