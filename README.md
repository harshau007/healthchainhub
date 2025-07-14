# HealthChainHub

**Blockchain-Enabled Trust Management in Fog-Based Healthcare System**

## 🚀 Project Overview

HealthChainHub is a secure, dual-role (doctors & patients) healthcare platform that integrates fog-computing simulations and blockchain technology to manage electronic health records (EHR), real-time vitals, and document storage. Key features include wallet-based authentication, IPFS-backed document uploads via Pinata, and on-chain consent management to ensure privacy and trust.

## 🎯 Key Features

- **Dual-Role Dashboards**

  - **Patient:** View personal vitals, EHR, imaging, findings; grant/revoke consent.
  - **Doctor:** Monitor hospital metrics (occupancy, beds), access consenting patient records, and upload new files.

- **Real-Time Vitals Simulation**

  - Mock vital signs streamed via Server-Sent Events (SSE).

- **Blockchain Integration**

  - Wallet-based signup/login.
  - Smart contracts (Solidity) on a Hardhat local network for consent management.
  - IPFS storage (via Pinata) for all medical documents.

- **Consent-Driven Trust Layer**

  - Patients control access: only granted parties can view or upload data.

## 📦 Tech Stack

- **Frontend:** Next.js 15 (App Directory) + TypeScript + Zustand
- **Backend (Simulation):** Express.js SSE service
- **Blockchain:** Hardhat local chain + Solidity smart contracts
- **Storage:** IPFS (Pinata)
- **State Management:** Zustand

## ⚙️ Getting Started

1. **Clone the repository**:

   ```bash
   git clone https://github.com/harshau007/healthchainhub.git
   cd healthchainhub
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run Hardhat Node**

   ```bash
   cd blockchain/
   npx hardhat node
   ```

4. **Deploy Contract on Node**

   ```bash
   npx hardhat run scripts/deploy.ts --network localhost
   ```

5. **Copy Contract address in `.env.local`**
6. **Run the development server in root**:

   ```bash
   npm run dev
   ```

7. **Open the app**:
   Visit `http://localhost:3000` in your browser.

## 🌐 API Endpoints

| Endpoint                                     | Method | Description                     |
| -------------------------------------------- | ------ | ------------------------------- |
| **SSE Vitals**`http://localhost:4000/events` | GET    | Stream mock vital signs via SSE |

## 💡 Roadmap & Potential Enhancements

- AI-driven anomaly detection & alerts
- Predictive analytics dashboard for risk scoring
- Telemedicine (secure video consultations)
- Emergency alert notifications
- Decentralized Identity (DID) integration
- On-chain audit logs for tamper-evident tracking
- FHIR interoperability
- GDPR/HIPAA compliance modules
- Mobile companion app
- Smart contract billing & insurance automation

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Open a pull request

## 📄 License

This project is licensed under the [MIT License](LICENSE).
