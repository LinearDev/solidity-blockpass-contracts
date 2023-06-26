// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.15;

contract DeviceActivity {

    //user account activity
    struct Activity {

        //What user do
        string title;

        // time when user do this
        string datetime;

        //on what device user do this
        string deviceType;
    }

    //User activity memory slot
    mapping(address => Activity[]) private userActivity;

    /**
     * Save user activity
     * 
     * @param title What user do
     * @param datetime time when user do this
     * @param deviceType on what device user do this
     */
    function addActivity(string memory title, string memory datetime, string memory deviceType) public {
        Activity memory a = Activity(title, datetime, deviceType);

        userActivity[msg.sender].push(a);
    }

    function getActivityById(address sender, uint256 id) public view 
        returns (string memory title, string memory datetime, string memory deviceType)
    {
        return (userActivity[sender][id].title, userActivity[sender][id].datetime, userActivity[sender][id].deviceType);
    }

    function getActivityLength (address sender) public view returns (uint256 length) {
        return userActivity[sender].length;
    }
}