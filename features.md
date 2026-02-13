# HealthChainHub Features

## 🔹 Core Functionality
- **Dual-Role Dashboard**: Specialized views for Patients and Doctors.
- **Real-Time Simulation**: 24/7 mock vital signs streamed via Server-Sent Events (SSE).
- **Blockchain Simulation**: Fully client-side blockchain logic mimicking Smart Contracts.

## 🔐 Trust & Security
- **Simulated Wallet Authentication**: MetaMask-style "Connect Wallet" flow.
- **Account Switching**: Built-in demo accounts for Patient, Doctor, and Admin roles.
- **Consent Management**: Patients grant/revoke access to specific doctors on-chain.
- **Secure Access Mode**: Doctors can only view records of consenting patients.
- **Access Requests**: Doctors can request access, which patients can approve or reject.
- **Beneficiary Delegation**: Patients can appoint a trusted beneficiary to act on their behalf.

## 💰 Finance & Administration
- **Invoicing System**: Doctors can issue invoices for services directly on the blockchain.
- **Crypto Payments**: Patients (or beneficiaries) can pay invoices using simulated ETH.
- **Transparent History**: Immutable record of all financial transactions.

## 📄 Records & Data
- **IPFS Storage**: Integration with Pinata for sequestering medical files.
- **Visual Record Viewer**: Built-in viewer for medical images (X-Rays, MRIs).
- **Vital Tracking**: Charts for standard vital signs (Temperature, BP, Heart Rate).

## 🎨 UI/UX Design
- **High-End Aesthetic**: Glassmorphism, deep dark mode, and refined typography (Manrope + JetBrains Mono).
- **Micro-Interactions**: Transaction confirmation modals, toast notifications, and loading states.
- **Responsive Layout**: Mobile-first design adaptable to tablets and desktops.

## 🛠 Technical Simulation
- **Transaction Modals**: Realistic gas estimation and confirmation popups.
- **Persisted State**: Local storage simulation of blockchain ledger (`chain_data.json`).
- **Zero-Config Demo**: Runs entirely locally without needing a real Ethereum node or wallet extension.
