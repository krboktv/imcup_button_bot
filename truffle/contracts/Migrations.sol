pragma solidity ^0.4.18;


contract GetMoney {
    uint totalBalance;

    bool allowance;

    address[] investors;

    mapping(address => uint) investorsbal;

    mapping(address => int256) votres;

    bool ffff;
    
    modifier allow {
        for (uint i = 0; i < investors.length; i++) {
            if (investors[i] == msg.sender) {
                allowance = true;
                break;
            }
        }
        _;
    }

    function () public payable {
        updateTotalbalance();
        investorsbal[msg.sender] += msg.value;
    }
    
    function investPart() public allow payable returns(uint) {
        return investorsbal[msg.sender];
    }
    
    function vote(int256 res) public allow {
        if (res == 1) {
            votres[msg.sender] = (int256)(investorsbal[msg.sender] / 100000000);
        } else if (res == -1) {
            votres[msg.sender] = ((int256)(investorsbal[msg.sender]) / 1000000000);
        }
    }
    
    function showAdd() public view returns(address) {
        return investors[0];
    }
    
    function showFinalRes() public view returns(bool) {
        return ffff;
    }
    
    function finalress() public payable returns(bool) {
        // address a = investors[0];
        // address b = investors[1];
        int256 finalres;
        // int256 finalres = votres[a] + votres[b];
        
        for (uint i = 0; i < investors.length; i++) {
            finalres += votres[investors[i]];
        }
        
        if (finalres > 23000000000) {
            ffff = true;
            return true;
        } else {
            return false;
        }
       
    }
    
    function showTotal() public payable allow returns(uint) {
        return totalBalance;
    }
    
    function showVotres() public  payable allow  returns(int256) {
        return votres[msg.sender];
    }
    
    function updateTotalbalance() internal {
        investors.push(msg.sender);
        totalBalance += msg.value;
    }
}