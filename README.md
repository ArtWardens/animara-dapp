
# Animara DApp Web Application (Internal)

This repository contains the code for **Animara DApp**, a decentralized web application for managing **ANIFriends NFTs** and interacting with the Animara ecosystem. This project is intended for **internal use only**.

## Table of Contents
1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Environment Variables](#environment-variables)
4. [Features](#features)
5. [Usage](#usage)
   - [Running the App](#running-the-app)
   - [Building the App](#building-the-app)
6. [Development Guidelines](#development-guidelines)
7. [Contact](#contact)

---

## Overview

The **Animara DApp** is a private decentralized application (DApp) developed using **React.js**. It allows users to summon, trade, and manage **ANIFriends NFTs** while unlocking exclusive areas in the Animara ecosystem. This app is part of Animara's broader blockchain-based NFT platform.

> **Note**: This project is for internal use only. Unauthorized access or distribution is prohibited.

## Project Structure

```plaintext
.
├── public/                 # Public assets, including index.html
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/              # Page components for routing
│   ├── services/           # API calls and blockchain interactions
│   ├── hooks/              # Custom React hooks
│   ├── App.js              # Main application component
│   └── index.js            # Entry point for the React app
├── package.json            # Project metadata and dependencies
└── README.md               # This file
```

### Key Technologies
- **React.js**: Used for building the user interface.
- **Solana**: Blockchain for handling transactions related to ANIFriends NFTs.
- **Firebase**: For user authentication, leaderboard, and data storage.
- **TailwindCSS**: Used for styling the web app.

## Getting Started

### Prerequisites
Before you begin, ensure the following tools are installed:
- **Node.js** (v14.x or later)
- **npm** or **pnpm** (recommended)
- **Git** for version control
- **Solana CLI** for blockchain interactions
- **Firebase CLI** for managing Firebase services

### Installation

1. **Clone the repository** (make sure you have the necessary access):
   ```bash
   git clone https://your-private-repo-url/animara-dapp.git
   cd animara-dapp
   ```

2. **Install dependencies**:
   Using `pnpm` (recommended):
   ```bash
   pnpm install
   ```
   Or using npm:
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the project root with the following environment variables:

```env
REACT_APP_SOLANA_NETWORK=devnet
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_PROJECT_ID=your-firebase-project-id
REACT_APP_ANIMARA_API_BASE_URL=https://api.animara.world
```

> **Important**: Ensure `.env` files are not committed to the repository to protect sensitive information.

## Features

- **NFT Summoning**: Users can summon new ANIFriends NFTs.
- **Location Unlocking**: Unlock and explore locations based on owned NFTs.
- **Leaderboard**: Track and compete with other users via Explora Points.
- **Multi-chain Support**: Currently running on Solana, with future possibilities for expansion to other blockchains.
- **Responsive UI**: Mobile-first design using TailwindCSS for a seamless experience across devices.

## Usage

### Running the App

To run the development server locally:

```bash
pnpm start
```

Or with npm:

```bash
npm start
```

Access the app at `http://localhost:3000`.

### Building the App

To build the app for production:

```bash
pnpm build
```

Or with npm:

```bash
npm run build
```

The production build will be created in the `build/` folder, ready for deployment.

## Development Guidelines

### Code Standards

- **Linting**: The project uses **ESLint** for code quality. Run the following to check for any linting issues:
   ```bash
   pnpm lint
   ```
   Or:
   ```bash
   npm run lint
   ```

- **Branching Strategy**: Follow the team's **Git branching model**. Feature branches should be named as `feature/your-feature-name`, and ensure that branches are merged into `dev` or `main` following code reviews.

### Testing

Before pushing code, run tests to ensure all functionality is working as expected:

```bash
pnpm test
```

Or with npm:

```bash
npm run test
```

### Deployment

Deployments should be made only by authorized personnel. Ensure that the Firebase and Solana configurations are properly set up for production.

## Contact

For internal support or inquiries related to the project, contact:

- **Email**: [eeyuyeap76@gmail.com](mailto:eeyuyeap76@gmail.com)
- **LinkedIn**: [Geokyew Yeap](https://www.linkedin.com/in/geokyew-yeap-3a3363311/)

---
