# CertiChain – Blockchain Certificate Verification System

## Overview

CertiChain is a decentralized blockchain-based certificate verification system developed using Solidity, React.js, Hardhat, MetaMask, and Ethereum Sepolia Testnet.

The project aims to eliminate fake and forged academic certificates by storing certificate records on blockchain, making them secure, transparent, tamper-resistant, and publicly verifiable.

---

# Features

- Blockchain-based certificate storage
- Public certificate verification
- Multi-admin / issuer authorization system
- Certificate revocation functionality
- Student wallet ownership
- Ethereum Sepolia deployment
- MetaMask wallet integration
- PDF certificate generation
- QR code generation
- Activity log tracking
- Decentralized verification process

---

# Technologies Used

## Frontend
- React.js
- CSS
- Ethers.js

## Blockchain
- Solidity
- Hardhat
- Ethereum Sepolia Testnet
- MetaMask

## Libraries
- jsPDF
- QRCode

---

# System Architecture

```text
React Frontend
       ↓
MetaMask Wallet
       ↓
Ethers.js
       ↓
Solidity Smart Contract
       ↓
Ethereum Sepolia Blockchain
```

---

# Smart Contract Functionalities

The smart contract supports:

## Certificate Issuing
Authorized issuers can issue certificates containing:
- Certificate ID
- Student Name
- Course Name
- Issue Date
- Certificate Hash
- Student Wallet Address
- Issuer Wallet Address

## Certificate Verification
Users can verify certificates through blockchain records.

## Certificate Revocation
Authorized issuers can revoke certificates if needed.

## Multi-Admin System
The owner can:
- Add authorized issuers
- Remove authorized issuers

## Student Wallet Ownership
Each certificate is linked to a student wallet address for ownership verification.

---

# Smart Contract Address (Sepolia)

```text
0xcD15Bc17ED12ae9E36C679008e9b8666F4905b08
```

---

# Smart Contract File

```text
contracts/CertificateVerification.sol
```

---

# Installation & Setup

## Clone Repository

```bash
git clone <repository-link>
cd BlockchainCetificates
```

---

## Install Dependencies

```bash
npm install
```

---

# Environment Variables

Create a `.env` file in the root directory:

```env
SEPOLIA_RPC_URL=YOUR_ALCHEMY_RPC_URL
PRIVATE_KEY=YOUR_METAMASK_PRIVATE_KEY
```

---

# Compile Smart Contract

```bash
npx hardhat compile
```

---

# Run Local Blockchain

```bash
npx hardhat node
```

---

# Deploy Smart Contract Locally

```bash
npx hardhat run scripts/deploy.js --network localhost
```

---

# Deploy to Sepolia

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

---

# Start React Frontend

```bash
npm start
```

---

# How The System Works

1. Owner connects MetaMask wallet
2. Owner authorizes issuers
3. Issuer issues certificate
4. Certificate data is stored on blockchain
5. Student receives certificate ownership
6. Any user can verify certificate using certificate ID
7. Issuer can revoke certificate if necessary

---

# PDF Certificate Generation

The system generates downloadable PDF certificates containing:
- Certificate details
- Blockchain hash
- Student wallet address
- Issuer wallet address
- QR code
- Verification metadata

---

# Testnet Verification

All blockchain transactions can be viewed publicly on Sepolia Etherscan.

Example:
- Contract deployment
- Certificate issuance
- Certificate revocation
- Issuer authorization

---

# Future Improvements

- IPFS integration
- MongoDB backend analytics
- Institution dashboard
- Mobile application
- AI-based fraud detection
- NFT-based certificates
- Email verification system

---

# Advantages

- Tamper-resistant records
- Decentralized verification
- Improved transparency
- Reduced certificate fraud
- Public blockchain auditability
- Secure ownership tracking

---

# Conclusion

CertiChain demonstrates how blockchain technology can modernize academic certificate verification systems by improving security, transparency, decentralization, and trust.

The project provides a real-world implementation of Ethereum smart contracts integrated with a modern web application.

---

# Authors

Developed as a Blockchain-Based Semester Project.

---

# License

This project is for educational and academic purposes.