pragma solidity ^0.4.19;

library SafeMath {
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        assert(c / a == b);
        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
      // assert(b > 0); // Solidity automatically throws when dividing by 0
        uint256 c = a / b;
      // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }
}

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimum) external {
        address newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.length = deployedCampaigns.length + 1;
        deployedCampaigns[deployedCampaigns.length] = newCampaign;
    }

    function getDeployedCampaigns() external view returns (address[]) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(uint minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() external payable {
        require(msg.value > minimumContribution);

        approvers[msg.sender] = true;
        approversCount = SafeMath.add(approversCount, 1);
    }

    function createRequest(string description, uint value, address recipient) external restricted {
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });
        requests.length = requests.length + 1;
        requests[requests.length] = newRequest;
    }

    function approveRequest(uint index) external {
        Request storage request = requests[index];

        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount = SafeMath.add(request.approvalCount, 1);
    }

    function finalizeRequest(uint index) external restricted {
        Request storage request = requests[index];

        require(request.approvalCount > SafeMath.div(approversCount, 2));
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;
    }
}