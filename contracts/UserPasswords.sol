// // SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.15;

contract UserPasswords {
    
    /**
     * Password lables data
     */
    struct PassData {
        // title in lable
        string title;

        // value in lable
        string data;
    }

    /**
     * User Password
     */
    struct Password {
        // Connected group id
        uint256 groupId;

        // Title to display
        string title;

        mapping (uint => PassData) data;

        uint dataLength;
    }

    // Password memory slot
    mapping (address => Password[]) passwords;
    mapping (address => uint256) private userPasswordsAmount;

    /**
     * Emits when user creates new password 
     * 
     * @param sender creator address
     */
    event PasswordAdded(address sender);

    /**
     * Emits when user change the title
     * 
     * @param sender user address
     * @param id index in array
     */
    event ChangeTitle(address sender, uint256 id);

    /**
     * Emits when user change group
     * 
     * @param sender user address
     * @param id index in array
     */
    event ChangeGroup(address sender, uint256 id);

    /**
     * Emits when user change inputs
     * 
     * @param sender user address
     * @param id index in array
     */
    event ChangeData(address sender, uint256 id);

    /**
     * Creates new password
     * 
     * @param title caption for display in ui
     * @param groupId to which the assigned
     * @param data lables
     */
    function addPassword (string memory title, uint256 groupId, PassData[] memory data) public {
        require(bytes(title).length > 0, "Title can not be empty");
        require(data.length >= 2, "There must be at least 2 fields with data");
        
        uint256 amount = userPasswordsAmount[msg.sender];
        Password[] storage passw = passwords[msg.sender];
        passw.push();
        Password storage pass = passw[amount];
        pass.groupId = groupId;
        pass.title = title;
        pass.dataLength = data.length;
        
        for (uint i = 0; i < data.length; i++) {
            pass.data[i] = data[i];
        }

        userPasswordsAmount[msg.sender] += 1;

        emit PasswordAdded(msg.sender);
    }

    /**
     * Returns amount of passwords stored by user
     * 
     * @param sender address
     */
    function getUserPasswordsLenght (address sender) public view returns (uint length) {
        return passwords[sender].length;
    }

    /**
     * Returns password
     * 
     * @param sender user address
     * @param id password index in array
     * @return title caption for display in ui
     * @return groupId to which the assigned
     */
    function getUserPasswordById(address sender, uint256 id) public view
        returns (string memory title, uint256 groupId) 
    {
        require(id <= userPasswordsAmount[sender], "The requested data does not exist");
        
        Password storage pass = passwords[sender][id];
        
        return (pass.title, pass.groupId);
    }

    function getUserPasswordData(address sender, uint256 id, uint256 dataId) public view
        returns (string memory title, string memory data) 
    {
        require(id <= userPasswordsAmount[sender], "The requested data does not exist");
        
        Password storage pass = passwords[sender][id];
        
        return (pass.data[dataId].title, pass.data[dataId].data);
    }

    function getUserPasswordDataLength(address sender, uint256 id) public view
        returns (uint title) 
    {
        require(id <= userPasswordsAmount[sender], "The requested data does not exist");
        
        Password storage pass = passwords[sender][id];
        
        return pass.dataLength;
    }

    /**
     * Chages title in password
     * 
     * @param title caption for display in ui
     * @param id password index in array
     */
    function changeTitle (string memory title, uint256 id) public {
        require(bytes(title).length > 0, "Title can not be empty");
        
        passwords[msg.sender][id].title = title;

        emit ChangeTitle(msg.sender, id);
    }

    /**
     * Chages group id in password
     * 
     * @param groupId to which the assigned
     * @param id password index in array
     */
    function changeGroup (uint256 groupId, uint256 id) public {
        passwords[msg.sender][id].groupId = groupId;

        emit ChangeGroup(msg.sender, id);
    }

    /**
     * Chages data lables in password
     * 
     * @param data lables
     * @param id password index in array
     */
    function changeData (PassData[] memory data, uint256 id) public {
        require(data.length >= 2, "There must be at least 2 fields with data");
        
        Password storage pass = passwords[msg.sender][id];
        
        for (uint256 i = 0; i < data.length; i++) {
            pass.data[i] = data[i];
        }

        pass.dataLength = data.length;

        emit ChangeData(msg.sender, id);
    }
}