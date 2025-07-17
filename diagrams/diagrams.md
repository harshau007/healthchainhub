HealthChainHub Project Diagrams: This document contains all the diagrams for the HealthChainHub project, including flowcharts, architecture diagrams, sequence diagrams, and data flow diagrams (DFDs).

<hr/>1. Data & User FlowchartHere is the Mermaid code for the user and data flow diagram.

    graph LR
        subgraph "User Interaction"
            A[User Arrives] --> B{Connect Crypto Wallet};
            B --> C{User Type?};
        end

        subgraph "Patient Actions"
            D[Sign Up/Login as Patient] --> F[View Dashboard & Vitals];
            F --> G[Browse Medical Records];
            F --> H[Manage Consent];
        end

        subgraph "Doctor Actions"
            E[Sign Up/Login as Doctor] --> J[View Hospital Dashboard];
            J --> K[Select Patient] --> L{Consent Check};
            L -- Granted --> M[View Patient Records];
            L -- Granted --> N[Upload Documents];
            L -- Revoked/None --> O[Access Denied];
        end

        subgraph "Backend Systems"
            P[Express SSE Vitals Stream]
            Q[IPFS Document Storage]
            R[Blockchain Consent Contracts]
        end

        C -- Patient --> D;
        C -- Doctor --> E;

        F --> P;
        G --> Q;
        H --> R;
        L --> R;
        M --> Q;
        N --> Q;

<hr>2. System Architecture DiagramHere is the corrected Mermaid code for the system architecture diagram.

    graph TD
        subgraph Users
            Patient[👩‍⚕️ Patient]
            Doctor[👨‍⚕️ Doctor]
        end

        subgraph Frontend [Frontend: Next.js 15]
            direction LR
            UI[App UI/UX]
            State[Zustand State Mgt]
            Auth[Wallet Authentication]
        end

        subgraph Backend
            Fog[Fog Simulation: Express.js SSE]
            BlockchainNet[Blockchain: Hardhat Network]
            Storage[Storage: IPFS/Pinata]
        end

        subgraph "Blockchain Components"
            direction TB
            SC[Solidity Smart Contracts]
            Consent[Consent Logic]
            AuthLogic[Auth Logic]
            SC --> Consent & AuthLogic
        end

        Patient -- "Interacts with" --> UI
        Doctor -- "Interacts with" --> UI
        UI -- "Fetches Vitals" --> Fog
        UI -- "Reads/Writes" --> BlockchainNet
        UI -- "Uploads/Fetches Docs" --> Storage
        BlockchainNet -- "Contains" --> SC

<hr>3. Sequence Diagram: Patient Grants ConsentThis diagram shows the sequence of events when a patient grants access to a doctor.

    sequenceDiagram
        participant Patient
        participant Browser (Next.js)
        participant Wallet
        participant Blockchain (Smart Contract)

        Patient->>Browser (Next.js): 1. Connect Wallet & Login
        Browser (Next.js)->>Wallet: 2. Request account signature
        Wallet-->>Browser (Next.js): 3. Return signed message
        Browser (Next.js)->>Blockchain (Smart Contract): 4. Authenticate user

        Patient->>Browser (Next.js): 5. Navigates to 'Consent' page and enters Doctor's address
        Browser (Next.js)->>Wallet: 6. Request signature for grantConsent() transaction
        Wallet-->>Patient: 7. Prompt for transaction confirmation
        Patient-->>Wallet: 8. Confirms transaction
        Wallet->>Blockchain (Smart Contract): 9. Submit signed grantConsent() transaction
        Blockchain (Smart Contract)-->>Browser (Next.js): 10. Return transaction receipt
        Browser (Next.js)-->>Patient: 11. Display "Consent Granted" message

<hr>4. Sequence Diagram: Doctor Views Data & Uploads DocumentThis diagram shows the flow for a doctor accessing a consenting patient's data and uploading a new record.

    sequenceDiagram
        participant Doctor
        participant Browser (Next.js)
        participant Wallet
        participant Blockchain (Smart Contract)
        participant IPFS (Pinata)
        participant Fog Service (SSE)

        Doctor->>Browser (Next.js): 1. Login with Wallet
        Browser (Next.js)->>Doctor: 2. Display Hospital Dashboard

        Doctor->>Browser (Next.js): 3. Selects a patient
        Browser (Next.js)->>Blockchain (Smart Contract): 4. Call checkConsent(doctorAddress, patientAddress)
        Blockchain (Smart Contract)-->>Browser (Next.js): 5. Return consentStatus = true

        alt Consent is Granted
            Browser (Next.js)->>IPFS (Pinata): 6. Fetch patient records via CID
            IPFS (Pinata)-->>Browser (Next.js): 7. Return medical documents
            Browser (Next.js)->>Fog Service (SSE): 8. Open connection to /events
            Fog Service (SSE)-->>Browser (Next.js): 9. Stream live vital signs
            Browser (Next.js)->>Doctor: 10. Display patient dashboard with records and vitals

            Doctor->>Browser (Next.js): 11. Selects file to upload
            Browser (Next.js)->>IPFS (Pinata): 12. Upload file
            IPFS (Pinata)-->>Browser (Next.js): 13. Return new file CID

            Browser (Next.js)->>Wallet: 14. Request signature for addRecord(patient, newCID)
            Wallet-->>Doctor: 15. Prompt for confirmation
            Doctor-->>Wallet: 16. Confirms transaction
            Wallet->>Blockchain (Smart Contract): 17. Submit signed addRecord() transaction
            Blockchain (Smart Contract)-->>Browser (Next.js): 18. Return transaction receipt
            Browser (Next.js)-->>Doctor: 19. Display "Upload Successful"
        end

<hr>5. Data Flow Diagram (DFD) - Level 0This is the context diagram, showing the entire system as a single process interacting with external entities.

    graph LR
        Patient -- "Login, Manage Consent, View Data" --> System("HealthChainHub System")
        System -- "Patient Records, Vitals" --> Patient

        Doctor -- "Login, View Patient Data, Upload Docs" --> System
        System -- "Patient List, Consented Records" --> Doctor

<hr>6. Data Flow Diagram (DFD) - Level 1This diagram breaks the system into its main processes and shows the primary data stores.

    graph LR
        subgraph Entities
            Patient[Patient]
            Doctor[Doctor]
        end

        subgraph Processes
            P1("1.0 Manage Users")
            P2("2.0 Manage Data")
            P3("3.0 Manage Consent")
        end

        subgraph Data Stores
            DS1[("DS1: User Accounts")]
            DS2[("DS2: Medical Records (IPFS)")]
            DS3[("DS3: Consent Log (Blockchain)")]
            DS4[("DS4: Vitals Stream (SSE)")]
        end

        Entities -- Auth Details --> P1 --> DS1
        Patient -- Request Data --> P2
        Doctor -- Request/Upload --> P2
        P2 -- Records & Vitals --> Patient
        P2 -- Consented Records --> Doctor
        P2 <--> DS2
        P2 <--> DS4
        Patient -- Consent Actions --> P3
        P3 <--> DS3
        P2 -- Verify Consent --> DS3

<hr>7. Data Flow Diagram (DFD) - Level 2 (Manage Data Process)This diagram provides a more detailed look at the "Manage Data" process from Level 1.

    graph LR
        subgraph Entities
            Patient[Patient]
            Doctor[Doctor]
        end

        subgraph Processes
            P2_1("2.1 Fetch Records")
            P2_2("2.2 Stream Vitals")
            P2_3("2.3 Upload Document")
        end

        subgraph Data Stores
            DS2[("DS2: Medical Records")]
            DS3[("DS3: Consent Log")]
            DS4[("DS4: Vitals Stream")]
        end

        Patient -- Request --> P2_1 & P2_2
        Doctor -- Request --> P2_1 & P2_2
        Doctor -- Upload --> P2_3

        P2_1 -- "Reads Consent" --> DS3
        P2_1 -- "Fetches from" --> DS2
        P2_1 -- Returns Document --> Doctor & Patient

        P2_2 -- "Reads Consent" --> DS3
        P2_2 -- "Connects to" --> DS4
        DS4 -- Streams Vitals --> P2_2

        P2_3 -- "Verifies Consent in" --> DS3
        P2_3 -- "Writes to" --> DS2
        P2_3 -- "Updates Record in" --> DS3

<hr>8. Implementation DiagramThis diagram shows the physical deployment of the application components.

    graph TD
        subgraph "User's Device"
            Browser[Browser with Wallet Extension]
        end

        subgraph "Web Server (e.g., Vercel, AWS)"
            Frontend[Next.js Frontend]
        end

        subgraph "Backend Server (e.g., AWS EC2, Heroku)"
            Backend[Express.js SSE Service]
        end

        subgraph "Development/Local Environment"
            Blockchain[Hardhat Local Network]
        end

        subgraph "Cloud Services"
            IPFS[Pinata IPFS Service]
        end

        Browser -- "HTTPS" --> Frontend
        Frontend -- "HTTP API Call" --> Backend
        Frontend -- "RPC Call" --> Blockchain
        Frontend -- "HTTPS API Call" --> IPFS
