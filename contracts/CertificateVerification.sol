// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CertificateVerification {
    address public owner;

    constructor() {
        owner = msg.sender;
        authorizedIssuers[msg.sender] = true;
    }

    struct Certificate {
        uint id;
        string studentName;
        string courseName;
        string issueDate;
        string certificateHash;
        address studentWallet;
        address issuedBy;
        bool isValid;
        bool exists;
    }

    mapping(uint => Certificate) public certificates;
    mapping(address => bool) public authorizedIssuers;
    mapping(address => uint[]) public studentCertificates;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier onlyIssuer() {
        require(authorizedIssuers[msg.sender], "Only authorized issuer allowed");
        _;
    }

    function addIssuer(address _issuer) public onlyOwner {
        authorizedIssuers[_issuer] = true;
    }

    function removeIssuer(address _issuer) public onlyOwner {
        authorizedIssuers[_issuer] = false;
    }

    function issueCertificate(
        uint _id,
        string memory _studentName,
        string memory _courseName,
        string memory _issueDate,
        string memory _certificateHash,
        address _studentWallet
    ) public onlyIssuer {
        require(!certificates[_id].exists, "Certificate already exists");

        certificates[_id] = Certificate(
            _id,
            _studentName,
            _courseName,
            _issueDate,
            _certificateHash,
            _studentWallet,
            msg.sender,
            true,
            true
        );

        studentCertificates[_studentWallet].push(_id);
    }

    function revokeCertificate(uint _id) public onlyIssuer {
        require(certificates[_id].exists, "Certificate does not exist");
        certificates[_id].isValid = false;
    }

    function verifyCertificate(uint _id)
        public
        view
        returns (
            uint,
            string memory,
            string memory,
            string memory,
            string memory,
            address,
            address,
            bool,
            bool
        )
    {
        Certificate memory cert = certificates[_id];

        return (
            cert.id,
            cert.studentName,
            cert.courseName,
            cert.issueDate,
            cert.certificateHash,
            cert.studentWallet,
            cert.issuedBy,
            cert.isValid,
            cert.exists
        );
    }

    function getStudentCertificates(address _studentWallet)
        public
        view
        returns (uint[] memory)
    {
        return studentCertificates[_studentWallet];
    }

    function checkIssuer(address _issuer) public view returns (bool) {
        return authorizedIssuers[_issuer];
    }
}