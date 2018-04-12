pragma solidity ^0.4.18;


contract VotingBasic {
    address public orgAddress; // Адрес организации (назначает админ)
    mapping(address=>uint256) public investrosBal; // Баланс каждого инвестора
    address[] public investors; // Список всех, кто вложил деньги на контракт (инвестор)
    address public admin; // Админ, кто назначает организацию
    mapping (uint256=>bytes32) public proposalsWhy; // Конкретная причина (описание того, куда потратит организация),
    //  хранится по uint256 айди для каждой новой затраты  в виде хэша keccak256
    mapping (uint256=>uint256) public proposalsSum; // Конкретна сумма затраты, хранится по айди затраты
    mapping (uint256=>address) public proposalAddress; // Конкретный адрес каждой затраты 
    // на этот адрес перевод proposalsSum идет
    mapping (uint256=>bool) public proposalStatus; // Конкретный статус заявки на вывод тру
    // - вывод закончен и финальный статус перевода 
    uint256 public proposalId; // Айди последней затраты
    mapping (uint256=>mapping(address=>bool)) proposalRes; // Результат голосования по затрате 
    // По айди затраты и адреса голосовальщика - получаем его результат голосования
    mapping (uint256=>uint256) proposalDuration; // Длительность голосования в часах
    mapping (uint256=>int256) internal investersWhoVotedRes; // по айди предложения финальный результат 
    // (часто дергается) 
}


contract VotingModificators is VotingBasic {

    modifier onlyOrg() {
        require(msg.sender == orgAddress);
        _;
    }

    modifier onlyInvestor() {
        bool res;
        for (uint256 i = 0; i < investors.length; i++) {
            if (msg.sender == investors[i]) {
                res = true;
            }
        }
        require(res);
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin);
        _;
    }
}


contract VotingFunctions is VotingModificators {
    function setOrgAddress(address _orgAddress) public onlyAdmin returns(bool); 
    // Админ назначает организацию для контракта
    function voteForProposal(uint256 _idProp, bool _vote) public onlyInvestor returns(bool); 
    // Инвестор голосует по айди предложения
    function showFinalResultofProposal(uint256 _idProp) public returns(bool);
     // Результат голосования по айди предложения виден всем 
    function askForFinanlTransaction(uint256 _idProp) public returns(bool);
    // Будет говорить о том, совершится ли перевод или нет, 
    // если время пришло - то перевод пройдет в случае голосования за
    // и вернет тру 

    function makeProposal(string _propWhy, uint256 _propSum, address _propAddress,
            uint256 _propDur) public onlyOrg returns(bool); 
    // создание предложения(), почему(стринг), сумма (ETH/ 10^18), адрес перевода
    
    function setInvestor(address _invsetor) internal;
    // ставит инвестора - инвестором при переводе на контракт
    function setPropStatus(uint256 _idProp) internal; 
    // проверяется статус предложения - тут мы чекаем и результат голосования и длительность
    function setInvestorPie(address _invsetor, uint256 _value) internal; 
    // показывает, сколько вкинул инвестор нам на контракт
}


contract VoteMain is VotingFunctions {
    function VoteMain() public {
        admin = msg.sender;
    }

    function () public payable {
        setInvestor(msg.sender);
        setInvestorPie(msg.sender, msg.value);
    }
    
    function setOrgAddress(address _orgAddress) public onlyAdmin returns(bool) {
        orgAddress = _orgAddress;
    } 

    function makeProposal(string _propWhy, uint256 _propSum, address _propAddress, 
            uint256 _propDur) public onlyOrg returns(bool) {
        proposalId += 1;  
        proposalsWhy[proposalId] = keccak256(_propWhy);
        proposalsSum[proposalId] = _propSum;
        proposalAddress[proposalId] = _propAddress;
        proposalDuration[proposalId] = (_propDur * 3600) + now;
        return false;
    }

    function voteForProposal(uint256 _idProp, bool _vote) public onlyInvestor returns(bool) {
        proposalRes[_idProp][msg.sender] = _vote;
        if (_vote == true) {
            investersWhoVotedRes[_idProp] += 1; 
        } else {
            investersWhoVotedRes[_idProp] -= 1; 
        }
        return false;
    }
    
    function showFinalResultofProposal(uint256 _idProp) public returns(bool) {
        if (investersWhoVotedRes[_idProp] > 0) {
            return true;
        } else {
            return false;
        }
    }

    function askForFinanlTransaction(uint256 _idProp) public returns(bool) {
        setPropStatus(_idProp);
        if (proposalStatus[_idProp] && orgAddress.balance >= proposalsSum[_idProp]) {
            proposalAddress[_idProp].transfer(proposalsSum[_idProp]);
            return true;
        } else {
            return false;
        }
    }

    function setPropStatus(uint256 _idProp) internal {
        if (now > proposalDuration[_idProp] && investersWhoVotedRes[_idProp] > 0) {
            proposalStatus[_idProp] = true;
        } else {
            proposalStatus[_idProp] = false;
        }
    }

    function setInvestor(address _invsetor) internal {
        investors.push(_invsetor);
    }

    function setInvestorPie(address _invsetor, uint256 _value) internal {
        investrosBal[_invsetor] = _value;
    }
}