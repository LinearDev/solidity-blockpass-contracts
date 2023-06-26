// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.15;

contract UserGroups {

    // Group memory slot
    struct Group {
        // group id
        uint256 id;

        // group name
        string title;

        // hex group color
        string color;
    }

    event AddUserGrop(Group g);

    //users groups storage
    mapping (address => Group[]) private groups;

    /**
        Function "addGroupToUser" uses to create new group for user

        @param title [string] - name of group
        @param color [string] - hex color string
    */
    function addGroupToUser(string memory title, string memory color) public {
        uint256 l = groups[msg.sender].length;
        require(l < 5, "Can't create more than 5 groups");
        
        //creating new group struct with info (id, title, color)
        Group memory groupStruct = Group(groups[msg.sender].length, title, color);

        //add struct to mapping
        groups[msg.sender].push(groupStruct);
        
        //emit group creation event
        emit AddUserGrop(groupStruct);
    }

    /**
        Function for get user groups array
    */
    function getUserGroups(address sender) public view returns (Group[] memory) {
        return groups[sender];
    }

    /**
        Function for get group by provided id

        @param id [uint256] - id of group struct in array
    */
    function getUserGroupById (address sender, uint id) public view returns (uint256, string memory, string memory) {
        // require(id < groups[msg.sender].length, "Provided id not exist");
        require(groups[sender].length > id, "Provided id not exist");

        return (groups[sender][id].id, groups[sender][id].title, groups[sender][id].color);
    }

    function getUserGroupsLength (address sender) public view returns (uint256) {
        return groups[sender].length;
    }

    /**
        Functions that modifies data such as title and color in existing group

        @param id [uint256] - numerical id of existing group that need to modify 
        @param title [string] - new title
        @param color [string] - new hex color
    */
    function changeAllDataInExistingGroup (uint id, string memory title, string memory color) public {
        require(bytes(title).length != 0, "Title not provided");
        require(bytes(color).length != 0, "Color not provided");
        
        groups[msg.sender][id].title = title;
        groups[msg.sender][id].color = color;
    }

    /**
        Functions that modifies data such as color in existing group
        
        @param id [uint256] - numerical id of existing group that need to modify 
        @param color [string] - new hex color
    */
    function changeColorOfExistingGroup (uint256 id, string memory color) public {
        require(bytes(color).length != 0, "Color not provided");

        groups[msg.sender][id].color = color;
    }

    /**
        Functions that modifies data such as title in existing group

        @param id [uint256] - numerical id of existing group that need to modify
        @param title [string] - new title
    */
    function changeTitleOfExistingGroup (uint id, string memory title) public {
        require(bytes(title).length != 0, "Title not provided");
        
        groups[msg.sender][id].title = title;
    }
}