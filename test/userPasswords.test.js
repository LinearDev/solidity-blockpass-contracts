const { expect } = require("chai");
const { ethers } = require("hardhat");

let contract;

describe("UserGroups contract", function () {

    beforeEach(async () => {
        contract = await(await ethers.getContractFactory("UserPasswords")).deploy();
    })

    it("Should create new password", async () => {
        await expect(contract.addPassword("test pass", "0", [["login", "pricol"],["password", "ne pricol"]]))
            .to.be.not.reverted;
    })

    it("Should not create new password if title is empty", async () => {        
        await expect(contract.addPassword("", "0", [["login", "pricol"],["password", "ne pricol"]]))
            .to.be.revertedWith("Title can not be empty");
    })

    it("Should not create new password if data less then 2 fields", async () => {        
        await expect(contract.addPassword("test", "0", [["login", "pricol"]]))
            .to.be.revertedWith("There must be at least 2 fields with data");
    })

    it("Should create correct amount of passwords", async () => {
        const [owner] = await ethers.getSigners();
        
        await contract.addPassword("test pass", "0", [["login", "pricol"],["password", "ne pricol"]]);
        await contract.addPassword("test pass", "0", [["login", "pricol"],["password", "ne pricol"]]);
        await contract.addPassword("test pass", "0", [["login", "pricol"],["password", "ne pricol"]]);
        
        const passwords = await contract.getUserPasswordsLenght(owner.address)

        expect(passwords.toString()).to.deep.equal("3");
    })

    it("Should create correct password", async () => {
        const [owner] = await ethers.getSigners();
        
        await contract.addPassword("test pass", "0", [["login", "pricol"],["password", "ne pricol"]]);
        await contract.addPassword("test pass 2", "1", [["login", "pricolasdf"],["password", "ne_pricol"]]);
        await contract.addPassword("test pass 3", "4", [["login", "pricolfgsh"],["password", "ne-pricol"]]);
        
        const passwords = await contract.getUserPasswordById(owner.address, 1)
        const passwordsTwo = await contract.getUserPasswordById(owner.address, 0)

        expect(passwords[0]).to.deep.equal("test pass 2");
        expect(passwordsTwo[0]).to.deep.equal("test pass");
        await expect(contract.getUserPasswordById(owner.address, 4))
            .to.be.revertedWith("The requested data does not exist");
    })

    it("Should change title", async () => {
        const [owner] = await ethers.getSigners();
        
        await contract.addPassword("test pass", "0", [["login", "pricol"],["password", "ne pricol"]]);
        const passwords = await contract.getUserPasswordById(owner.address, 0)
        expect(passwords[0]).to.deep.equal("test pass");

        await contract.changeTitle("test pass 2", 0);
        const passwordsTwo = await contract.getUserPasswordById(owner.address, 0)

        expect(passwordsTwo[0]).to.deep.equal("test pass 2");
    })

    it("Should not change title if its empty", async () => {
        const [owner] = await ethers.getSigners();
        
        await contract.addPassword("test pass", "0", [["login", "pricol"],["password", "ne pricol"]]);
        const passwords = await contract.getUserPasswordById(owner.address, 0)
        expect(passwords[0]).to.deep.equal("test pass");

        await expect(contract.changeTitle("", 0))
            .to.be.revertedWith("Title can not be empty");
    })

    it("Should change group id", async () => {
        const [owner] = await ethers.getSigners();
        
        await contract.addPassword("test pass", "0", [["login", "pricol"],["password", "ne pricol"]]);
        const passwords = await contract.getUserPasswordById(owner.address, 0)
        expect(passwords[1].toString()).to.deep.equal("0");

        await contract.changeGroup("2", 0);
        const passwordsTwo = await contract.getUserPasswordById(owner.address, 0)

        expect(passwordsTwo[1].toString()).to.deep.equal("2");
    })

    it("Should change labels", async () => {
        const [owner] = await ethers.getSigners();
        
        await contract.addPassword("test pass", "0", [["login", "pricol"],["password", "ne pricol"]]);
        const passwords = await contract.getUserPasswordById(owner.address, 0)
        expect(passwords[2]).to.deep.equal([["login", "pricol"],["password", "ne pricol"]]);

        await contract.changeData([["user", "1223124"], ["login", "pricol"],["password", "ne pricol"]], 0);
        const passwordsTwo = await contract.getUserPasswordById(owner.address, 0)

        expect(passwordsTwo[2]).to.deep.equal([["user", "1223124"], ["login", "pricol"],["password", "ne pricol"]]);
    })

    it("Should not change labels if there is less then 2 fields", async () => {
        const [owner] = await ethers.getSigners();
        
        await contract.addPassword("test pass", "0", [["login", "pricol"],["password", "ne pricol"]]);
        const passwords = await contract.getUserPasswordById(owner.address, 0)
        expect(passwords[2]).to.deep.equal([["login", "pricol"],["password", "ne pricol"]]);

        await expect(contract.changeData([["user", "1223124"]], 0))
            .to.be.revertedWith("There must be at least 2 fields with data");
    })
});
