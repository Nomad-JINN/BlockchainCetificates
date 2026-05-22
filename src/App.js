import "./App.css";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import jsPDF from "jspdf";
import QRCode from "qrcode";

const contractAddress = "0xcD15Bc17ED12ae9E36C679008e9b8666F4905b08";
const ownerWallet = "0x4C77d47d8B0463C3D0d0D737c17C638CddeAf8B7";

const contractABI = [
  {
    inputs: [{ internalType: "address", name: "_issuer", type: "address" }],
    name: "addIssuer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_issuer", type: "address" }],
    name: "removeIssuer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_issuer", type: "address" }],
    name: "checkIssuer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_id", type: "uint256" },
      { internalType: "string", name: "_studentName", type: "string" },
      { internalType: "string", name: "_courseName", type: "string" },
      { internalType: "string", name: "_issueDate", type: "string" },
      { internalType: "string", name: "_certificateHash", type: "string" },
      { internalType: "address", name: "_studentWallet", type: "address" },
    ],
    name: "issueCertificate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_id", type: "uint256" }],
    name: "revokeCertificate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_id", type: "uint256" }],
    name: "verifyCertificate",
    outputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "string", name: "", type: "string" },
      { internalType: "string", name: "", type: "string" },
      { internalType: "string", name: "", type: "string" },
      { internalType: "string", name: "", type: "string" },
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" },
      { internalType: "bool", name: "", type: "bool" },
      { internalType: "bool", name: "", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
];

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [networkName, setNetworkName] = useState("Not Connected");
  const [studentName, setStudentName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [studentWallet, setStudentWallet] = useState("");
  const [certificateID, setCertificateID] = useState("");
  const [verifyID, setVerifyID] = useState("");
  const [revokeID, setRevokeID] = useState("");
  const [issuerAddress, setIssuerAddress] = useState("");
  const [verifiedCertificate, setVerifiedCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthorizedIssuer, setIsAuthorizedIssuer] = useState(false);

  const [activityLog, setActivityLog] = useState(() => {
    const savedLog = localStorage.getItem("activityLog");
    return savedLog ? JSON.parse(savedLog) : [];
  });

  useEffect(() => {
    localStorage.setItem("activityLog", JSON.stringify(activityLog));
  }, [activityLog]);

  const isOwner =
    walletAddress &&
    walletAddress.toLowerCase() === ownerWallet.toLowerCase();

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Install MetaMask first");
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setWalletAddress(accounts[0]);
    await checkNetwork();
    await checkCurrentIssuer(accounts[0]);
  };

  const checkNetwork = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();

    if (network.chainId.toString() === "31337") {
      setNetworkName("Hardhat Localhost");
    } else {
      setNetworkName(`Wrong Network: ${network.chainId.toString()}`);
    }
  };

  const getContract = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(contractAddress, contractABI, signer);
  };

  const checkCurrentIssuer = async (address) => {
    try {
      const contract = await getContract();
      const result = await contract.checkIssuer(address);
      setIsAuthorizedIssuer(result);
    } catch (error) {
      console.error(error);
    }
  };

  const addIssuer = async () => {
    if (!issuerAddress) {
      alert("Enter issuer wallet address");
      return;
    }

    if (!isOwner) {
      alert("Only contract owner can add issuers.");
      return;
    }

    try {
      setLoading(true);
      const contract = await getContract();

      const tx = await contract.addIssuer(issuerAddress, {
        gasLimit: 300000,
        maxFeePerGas: ethers.parseUnits("2", "gwei"),
        maxPriorityFeePerGas: ethers.parseUnits("1", "gwei"),
      });

      await tx.wait();

      setActivityLog((prev) => [
        {
          type: "Issuer Added",
          id: "Admin",
          student: issuerAddress,
          hash: "Permission granted",
          time: new Date().toLocaleString(),
        },
        ...prev,
      ]);

      alert("Issuer added successfully");
      setIssuerAddress("");
    } catch (error) {
      console.error(error);
      alert("Failed to add issuer");
    } finally {
      setLoading(false);
    }
  };

  const removeIssuer = async () => {
    if (!issuerAddress) {
      alert("Enter issuer wallet address");
      return;
    }

    if (!isOwner) {
      alert("Only contract owner can remove issuers.");
      return;
    }

    try {
      setLoading(true);
      const contract = await getContract();

      const tx = await contract.removeIssuer(issuerAddress, {
        gasLimit: 300000,
        maxFeePerGas: ethers.parseUnits("2", "gwei"),
        maxPriorityFeePerGas: ethers.parseUnits("1", "gwei"),
      });

      await tx.wait();

      setActivityLog((prev) => [
        {
          type: "Issuer Removed",
          id: "Admin",
          student: issuerAddress,
          hash: "Permission revoked",
          time: new Date().toLocaleString(),
        },
        ...prev,
      ]);

      alert("Issuer removed successfully");
      setIssuerAddress("");
    } catch (error) {
      console.error(error);
      alert("Failed to remove issuer");
    } finally {
      setLoading(false);
    }
  };

  const issueCertificate = async () => {
    if (!studentName || !courseName || !certificateID || !studentWallet) {
      alert("Please fill all fields including student wallet");
      return;
    }

    if (!isAuthorizedIssuer) {
      alert("Only authorized issuers can issue certificates.");
      return;
    }

    try {
      setLoading(true);

      const contract = await getContract();
      const issueDate = new Date().toLocaleDateString();

      const certificateHash = ethers.keccak256(
        ethers.toUtf8Bytes(
          studentName + courseName + certificateID + studentWallet + issueDate
        )
      );

      const tx = await contract.issueCertificate(
        certificateID,
        studentName,
        courseName,
        issueDate,
        certificateHash,
        studentWallet,
        {
          gasLimit: 600000,
          maxFeePerGas: ethers.parseUnits("2", "gwei"),
          maxPriorityFeePerGas: ethers.parseUnits("1", "gwei"),
        }
      );

      await tx.wait();

      setActivityLog((prev) => [
        {
          type: "Issued",
          id: certificateID,
          student: studentName,
          hash: certificateHash,
          time: new Date().toLocaleString(),
        },
        ...prev,
      ]);

      alert("Certificate issued successfully on blockchain");

      setStudentName("");
      setCourseName("");
      setCertificateID("");
      setStudentWallet("");
    } catch (error) {
      console.error(error);
      alert("Transaction failed. Certificate may already exist or wallet is not authorized.");
    } finally {
      setLoading(false);
    }
  };

  const verifyCertificate = async () => {
    if (!verifyID) {
      alert("Enter certificate ID");
      return;
    }

    try {
      setLoading(true);

      const contract = await getContract();
      const cert = await contract.verifyCertificate(verifyID);

      if (!cert[8]) {
        setVerifiedCertificate("not-found");
        return;
      }

      setVerifiedCertificate({
        id: cert[0].toString(),
        studentName: cert[1],
        courseName: cert[2],
        issueDate: cert[3],
        certificateHash: cert[4],
        studentWallet: cert[5],
        issuedBy: cert[6],
        isValid: cert[7],
        exists: cert[8],
      });
    } catch (error) {
      console.error(error);
      alert("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const revokeCertificate = async () => {
    if (!revokeID) {
      alert("Enter certificate ID to revoke");
      return;
    }

    if (!isAuthorizedIssuer) {
      alert("Only authorized issuers can revoke certificates.");
      return;
    }

    try {
      setLoading(true);

      const contract = await getContract();

      const tx = await contract.revokeCertificate(revokeID, {
        gasLimit: 300000,
        maxFeePerGas: ethers.parseUnits("2", "gwei"),
        maxPriorityFeePerGas: ethers.parseUnits("1", "gwei"),
      });

      await tx.wait();

      setActivityLog((prev) => [
        {
          type: "Revoked",
          id: revokeID,
          student: "N/A",
          hash: "N/A",
          time: new Date().toLocaleString(),
        },
        ...prev,
      ]);

      alert("Certificate revoked successfully on blockchain");
      setRevokeID("");
    } catch (error) {
      console.error(error);
      alert("Revocation failed");
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = async (certificate) => {
    const doc = new jsPDF();

    const verificationText = `CertiChain Blockchain Certificate
Certificate ID: ${certificate.id}
Student: ${certificate.studentName}
Course: ${certificate.courseName}
Student Wallet: ${certificate.studentWallet}
Issued By: ${certificate.issuedBy}
Issue Date: ${certificate.issueDate}
Hash: ${certificate.certificateHash}
Status: ${certificate.isValid ? "Valid" : "Revoked"}
Contract: ${contractAddress}`;

    const qrCode = await QRCode.toDataURL(verificationText);

    doc.setLineWidth(1);
    doc.rect(15, 15, 180, 260);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.text("Blockchain Certificate", 55, 30);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Verified using CertiChain smart contract", 55, 40);

    doc.setFontSize(14);
    doc.text(`Certificate ID: ${certificate.id}`, 25, 70);
    doc.text(`Student Name: ${certificate.studentName}`, 25, 88);
    doc.text(`Course Name: ${certificate.courseName}`, 25, 106);
    doc.text(`Issue Date: ${certificate.issueDate}`, 25, 124);
    doc.text(`Status: ${certificate.isValid ? "Valid" : "Revoked"}`, 25, 142);

    doc.setFontSize(9);
    doc.text("Student Wallet:", 25, 165);
    doc.text(certificate.studentWallet, 25, 174, { maxWidth: 150 });

    doc.text("Issued By:", 25, 190);
    doc.text(certificate.issuedBy, 25, 199, { maxWidth: 150 });

    doc.text("Blockchain Hash:", 25, 215);
    doc.text(certificate.certificateHash, 25, 224, { maxWidth: 150 });

    doc.addImage(qrCode, "PNG", 140, 65, 40, 40);

    doc.setFontSize(10);
    doc.text("Generated by CertiChain DApp.", 25, 252);

    doc.save(`certificate-${certificate.id}.pdf`);
  };

  const clearActivityLog = () => {
    setActivityLog([]);
    localStorage.removeItem("activityLog");
  };

  return (
    <div className="app">
      <nav className="navbar">
        <h2>CertiChain</h2>

        <button onClick={connectWallet}>
          {walletAddress
            ? walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4)
            : "Connect Wallet"}
        </button>
      </nav>

      <section className="hero">
        <h1>Blockchain Certificate Verification</h1>
        <p>
          Issue, verify, revoke, and export academic certificates using wallet
          ownership, authorized issuers, and blockchain records.
        </p>
      </section>

      <section className="dashboardStats">
        <div className="statCard">
          <h3>Network</h3>
          <p>{networkName}</p>
        </div>

        <div className="statCard">
          <h3>Contract</h3>
          <p>{contractAddress}</p>
        </div>

        <div className="statCard">
          <h3>Wallet</h3>
          <p>{walletAddress || "Not Connected"}</p>
        </div>

        <div className="statCard">
          <h3>Role</h3>
          <p>
            {isOwner
              ? "Owner"
              : isAuthorizedIssuer
              ? "Authorized Issuer"
              : "Verifier / Student"}
          </p>
        </div>
      </section>

      <section className="mainGrid">
        <div className="formCard">
          <h2>Issuer Management</h2>

          <input
            type="text"
            placeholder="Issuer Wallet Address"
            value={issuerAddress}
            onChange={(e) => setIssuerAddress(e.target.value)}
          />

          <button onClick={addIssuer} disabled={loading}>
            Add Issuer
          </button>

          <button className="dangerBtn" onClick={removeIssuer} disabled={loading}>
            Remove Issuer
          </button>

          <p className="helperText">Only owner can manage issuers.</p>
        </div>

        <div className="formCard">
          <h2>Issue Certificate</h2>

          <input
            type="number"
            placeholder="Certificate ID"
            value={certificateID}
            onChange={(e) => setCertificateID(e.target.value)}
          />

          <input
            type="text"
            placeholder="Student Name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Course Name"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Student Wallet Address"
            value={studentWallet}
            onChange={(e) => setStudentWallet(e.target.value)}
          />

          <button onClick={issueCertificate} disabled={loading}>
            {loading ? "Processing..." : "Issue on Blockchain"}
          </button>
        </div>

        <div className="formCard">
          <h2>Verify Certificate</h2>

          <input
            type="number"
            placeholder="Enter Certificate ID"
            value={verifyID}
            onChange={(e) => setVerifyID(e.target.value)}
          />

          <button onClick={verifyCertificate} disabled={loading}>
            Verify from Blockchain
          </button>

          {verifiedCertificate && verifiedCertificate !== "not-found" && (
            <div className={verifiedCertificate.isValid ? "verifiedBox" : "invalidBox"}>
              <h3>
                {verifiedCertificate.isValid
                  ? "Certificate Verified"
                  : "Certificate Revoked"}
              </h3>

              <p><strong>Name:</strong> {verifiedCertificate.studentName}</p>
              <p><strong>Course:</strong> {verifiedCertificate.courseName}</p>
              <p><strong>Date:</strong> {verifiedCertificate.issueDate}</p>
              <p><strong>Student Wallet:</strong> {verifiedCertificate.studentWallet}</p>
              <p><strong>Issued By:</strong> {verifiedCertificate.issuedBy}</p>
              <p><strong>Hash:</strong> {verifiedCertificate.certificateHash}</p>

              <button onClick={() => downloadCertificate(verifiedCertificate)}>
                Download PDF Certificate
              </button>
            </div>
          )}

          {verifiedCertificate === "not-found" && (
            <div className="invalidBox">Certificate Not Found</div>
          )}
        </div>

        <div className="formCard">
          <h2>Revoke Certificate</h2>

          <input
            type="number"
            placeholder="Certificate ID to Revoke"
            value={revokeID}
            onChange={(e) => setRevokeID(e.target.value)}
          />

          <button className="dangerBtn" onClick={revokeCertificate} disabled={loading}>
            Revoke Certificate
          </button>

          <p className="helperText">
            Only authorized issuers can revoke certificates.
          </p>
        </div>
      </section>

      <section className="activitySection">
        <div className="activityHeader">
          <h2>Recent Blockchain Activity</h2>

          {activityLog.length > 0 && (
            <button className="dangerBtn" onClick={clearActivityLog}>
              Clear Activity
            </button>
          )}
        </div>

        <div className="activityContainer">
          {activityLog.length === 0 && (
            <p className="helperText">No blockchain activity yet.</p>
          )}

          {activityLog.map((log, index) => (
            <div className="activityCard" key={index}>
              <h3>{log.type}</h3>
              <p><strong>Certificate ID:</strong> {log.id}</p>
              <p><strong>Student / Wallet:</strong> {log.student}</p>
              <p><strong>Hash:</strong> {log.hash}</p>
              <p><strong>Timestamp:</strong> {log.time}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;