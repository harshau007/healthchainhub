// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract HealthcareAuth {
    enum Role { None, Patient, Doctor, Admin }

    struct UserInfo {
        Role role;
        bool isRegistered;
    }

    // Consent: patient => (consumer address => bool)
    // Example: patient grants consent to hospitalAddr
    mapping(address => mapping(address => bool)) private consentGranted;

    // HealthRecord: store minimal metadata + pointer (IPFS CID or other hash)
    struct HealthRecord {
        bytes32 dataHash;      // e.g. keccak256 of IPFS CID
        uint256 timestamp;     // block timestamp when added
        string recordType;     // e.g. "LabReport", "Imaging", etc.
    }
    // patientAddr => array of HealthRecords
    mapping(address => HealthRecord[]) private records;

    // Existing user registry
    mapping(address => UserInfo) private users;
    address public owner;
    uint256 public recordFee = 0.001 ether;  // example fee for registering a record

    event UserRegistered(address indexed user, Role role);
    event RoleUpdated(address indexed user, Role newRole);
    event ConsentGranted(address indexed patient, address indexed consumer);
    event ConsentRevoked(address indexed patient, address indexed consumer);
    event HealthRecordAdded(
        address indexed patient,
        bytes32 dataHash,
        uint256 timestamp,
        string recordType
    );
    event TipSent(
        address indexed from,
        address indexed to,
        uint256 amount,
        string message
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not contract owner");
        _;
    }

    modifier onlyRegistered() {
        require(users[msg.sender].isRegistered, "Not registered");
        _;
    }

    modifier onlyDoctor() {
        require(users[msg.sender].role == Role.Doctor, "Not a doctor");
        _;
    }

    constructor() {
        owner = msg.sender;
        users[owner] = UserInfo({ role: Role.Admin, isRegistered: true });
    }

    /// ------------------------------------------------------------------------------------------------
    /// 1) Basic Registration / Role Management (same as before)
    /// ------------------------------------------------------------------------------------------------

    function register(Role _role) external {
        require(!users[msg.sender].isRegistered, "Already registered");
        require(
            _role == Role.Patient || _role == Role.Doctor,
            "Invalid role"
        );
        users[msg.sender] = UserInfo({ role: _role, isRegistered: true });
        emit UserRegistered(msg.sender, _role);
    }

    function updateRole(address _user, Role _newRole) external onlyOwner {
        require(users[_user].isRegistered, "User not registered yet");
        users[_user].role = _newRole;
        emit RoleUpdated(_user, _newRole);
    }

    function isRegistered(address _user) external view returns (bool) {
        return users[_user].isRegistered;
    }

    function getRole(address _user) external view returns (Role) {
        return users[_user].role;
    }

    /// ------------------------------------------------------------------------------------------------
    /// 2) Consent Management
    /// ------------------------------------------------------------------------------------------------

    /// @notice Patient grants consent to `consumer` to read their records
    function grantConsent(address consumer) external onlyRegistered {
        require(users[msg.sender].role == Role.Patient, "Only patient can grant consent");
        require(users[consumer].isRegistered, "Consumer not registered");
        consentGranted[msg.sender][consumer] = true;
        emit ConsentGranted(msg.sender, consumer);
    }

    /// @notice Patient revokes consent from `consumer`
    function revokeConsent(address consumer) external onlyRegistered {
        require(users[msg.sender].role == Role.Patient, "Only patient can revoke consent");
        require(consentGranted[msg.sender][consumer], "Consent not found");
        consentGranted[msg.sender][consumer] = false;
        emit ConsentRevoked(msg.sender, consumer);
    }

    /// @notice Check if `consumer` has consent to read `patient` data
    function hasConsent(address patient, address consumer) public view returns (bool) {
        return consentGranted[patient][consumer];
    }

    /// ------------------------------------------------------------------------------------------------
    /// 3) Health Record Pointers (On-Chain Metadata)
    /// ------------------------------------------------------------------------------------------------

    /// @notice Add a new health record pointer for `patient`. Caller must pay `recordFee`.
    /// @param patient The address of patient (only doctor or patient can add)
    /// @param dataHash keccak256(IPFS_CID || other pointer)
    /// @param recordType A short string, e.g. "LabReport"
    function addHealthRecord(
        address patient,
        bytes32 dataHash,
        string calldata recordType
    ) external payable onlyRegistered {
        // Only the patient themselves or a doctor may add a record
        require(
            msg.sender == patient || users[msg.sender].role == Role.Doctor,
            "Not authorized to add record"
        );
        require(msg.value >= recordFee, "Insufficient fee");

        HealthRecord memory rec = HealthRecord({
            dataHash: dataHash,
            timestamp: block.timestamp,
            recordType: recordType
        });
        records[patient].push(rec);
        emit HealthRecordAdded(patient, dataHash, block.timestamp, recordType);
    }

    /// @notice Returns how many records a patient has
    function getRecordCount(address patient) external view returns (uint256) {
        return records[patient].length;
    }

    /// @notice Get a specific HealthRecord struct for patient
    function getHealthRecord(address patient, uint256 index)
        external
        view
        returns (
            bytes32 dataHash,
            uint256 timestamp,
            string memory recordType
        )
    {
        require(index < records[patient].length, "Index out of range");

        HealthRecord storage rec = records[patient][index];
        return (rec.dataHash, rec.timestamp, rec.recordType);
    }

    /// ------------------------------------------------------------------------------------------------
    /// 4) Tipping / Payments
    /// ------------------------------------------------------------------------------------------------

    /// @notice Send a tip (in native ETH) to any registered user
    /// @param to Recipient address
    /// @param message Optional message
    function tip(address to, string calldata message) external payable onlyRegistered {
        require(users[to].isRegistered, "Recipient not registered");
        require(msg.value > 0, "Tip must be > 0");
        // Automatically forwarded to `to`
        (bool sent, ) = to.call{ value: msg.value }("");
        require(sent, "Tip transfer failed");

        emit TipSent(msg.sender, to, msg.value, message);
    }

    /// @notice Admin can update the fee required for new records
    function setRecordFee(uint256 newFee) external onlyOwner {
        recordFee = newFee;
    }
}
