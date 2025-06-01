// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract HealthcareAuth {
    enum Role { None, Patient, Doctor, Admin }

    struct UserInfo {
        Role role;
        bool isRegistered;
    }

    mapping(address => UserInfo) private users;
    address public owner;

    event UserRegistered(address indexed user, Role role);
    event RoleUpdated(address indexed user, Role newRole);

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
        // Register the owner as Admin by default
        users[owner] = UserInfo({ role: Role.Admin, isRegistered: true });
    }

    /// @notice Register msg.sender as either Patient or Doctor
    /// @param _role The role to register as (must be Patient or Doctor)
    function register(Role _role) external {
        require(!users[msg.sender].isRegistered, "Already registered");
        require(
            _role == Role.Patient || _role == Role.Doctor,
            "Invalid role"
        );

        users[msg.sender] = UserInfo({ role: _role, isRegistered: true });
        emit UserRegistered(msg.sender, _role);
    }

    /// @notice For the contract owner to promote or demote a user
    /// @param _user The address of the user whose role will be updated
    /// @param _newRole The new role to assign (None, Patient, Doctor, or Admin)
    function updateRole(address _user, Role _newRole) external onlyOwner {
        require(users[_user].isRegistered, "User not registered yet");

        users[_user].role = _newRole;
        emit RoleUpdated(_user, _newRole);
    }

    /// @notice Check if an address is registered
    /// @param _user The address to query
    /// @return True if the address is registered, false otherwise
    function isRegistered(address _user) external view returns (bool) {
        return users[_user].isRegistered;
    }

    /// @notice Get the role of a registered address
    /// @param _user The address to query
    /// @return The Role enum value (None, Patient, Doctor, or Admin)
    function getRole(address _user) external view returns (Role) {
        return users[_user].role;
    }

    /// @notice Only a Doctor can add a patient's health data on-chain
    /// @param patient The address of the patient whose data is being added
    /// @param data Arbitrary health data bytes
    function addHealthData(address patient, bytes calldata data)
        external
        onlyDoctor
    {
        // Implementation placeholder: you could emit an event or store data
        // Example: emit an event for off-chain indexing
        // emit HealthDataAdded(patient, msg.sender, data);
    }
}
