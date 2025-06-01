# Healthcare Management System PWA

![Healthcare PWA Logo](https://via.placeholder.com/150) <!-- Replace with actual logo if available -->

A modern, production-quality Progressive Web Application (PWA) for managing healthcare operations. This application provides real-time monitoring of patient vital signs and hospital metrics, supports Role-Based Access Control (RBAC), and offers a minimalistic, mobile-first design with both light and dark themes. Built with Next.js, TypeScript, and TailwindCSS, it ensures a seamless user experience across devices.

---

## Table of Contents

- [Healthcare Management System PWA](#healthcare-management-system-pwa)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Technology Stack](#technology-stack)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Steps](#steps)
  - [Usage](#usage)
    - [Role-Based Access](#role-based-access)
    - [Screens](#screens)
  - [Contributing](#contributing)
  - [License](#license)

---

## Overview

The Healthcare Management System PWA is designed to streamline hospital operations and patient care. It integrates real-time data from an SSE (Server-Sent Events) endpoint, providing up-to-date information on patient vital signs and hospital metrics. The application supports different user roles, including hospital administrators, staff, and patients, each with tailored access to specific features and data.

---

## Features

- **Real-Time Data Monitoring**: Fetches and displays real-time patient vital signs and hospital metrics every 5 seconds via SSE.
- **Role-Based Access Control (RBAC)**: Dedicated screens and permissions for admins, hospital staff, and patients.
- **Progressive Web App (PWA)**: Installable on mobile and desktop devices with offline capabilities.
- **Minimalistic & Responsive Design**: Mobile-first, clean UI with light and dark theme support.
- **Notifications**: Toast notifications for key events and push notifications for critical updates.
- **Typesafety**: Fully typesafe with TypeScript, ensuring robust and error-free code.

---

## Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) with PWA support via [next-pwa](https://github.com/shadowwalker/next-pwa)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/) for toast notifications
- **Data Fetching**: Server-Sent Events (SSE)

---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Steps

1. **Clone the repository**:

   ```bash
   git clone https://github.com/harshau007/healthcare-pwa.git
   cd healthcare-pwa
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run Hardhat Node**

   ```bash
   npx hardhat node
   ```

4. **Deploy Contract on Node**

   ```bash
   npx hardhat run scripts/deploy.ts --network localhost
   ```

5. **Copy Contract address in `src/providers/auth-provider.tsx`**
6. **Run the development server**:

   ```bash
   npm run dev
   ```

7. **Open the app**:
   Visit `http://localhost:3000` in your browser.

---

## Usage

### Role-Based Access

The application supports three user roles:

- **Admin**: Full access to hospital management and patient data.
- **Hospital Staff**: Access to patient records and imaging.
- **Patient**: Access to personal health data and appointments.

To simulate login:

- Navigate to the homepage (`/`).
- Click on one of the login buttons to select a role (e.g., "Login as Admin").

### Screens

- **Dashboard**: Real-time overview of patient vital signs and hospital metrics.
- **EHR (Electronic Health Records)**: View and manage patient health records.
- **HMS (Hospital Management System)**: Manage appointments, beds, and billing.
- **Imaging**: View patient imaging records.
- **Patient Portal**: Patient-specific dashboard for appointments and health summaries.
- **Patient Detail**: Detailed view of individual patient data.

Each screen is accessible based on the user's role and permissions.

---

## Contributing

We welcome contributions to improve the Healthcare Management System PWA. To contribute:

1. **Fork the repository**.
2. **Create a new branch** for your feature or bugfix.
3. **Submit a pull request** with a clear description of your changes.

Please ensure your code adheres to the project's coding standards and includes appropriate tests.

For bug reports or feature requests, open an issue on the [GitHub repository](https://github.com/harshau007/healthcare-pwa/issues).

---

## License

This project is licensed under the [MIT License](LICENSE).
