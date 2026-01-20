import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { saveAs } from "file-saver";

const Campaigns = [
  {
    name: "Eobuwie (PL)",
    Id: 2152,
  },
  {
    name: "Grover DE",
    Id: 2146,
  },
  {
    name: "Avanti Travel Insurance",
    Id: 1875,
  },
  {
    name: "Eurowings DE",
    Id: 1690,
  },
  {
    name: "Lycamobile",
    Id: 2220,
  },
];

export default function TradeDoublerMaatr() {
  const [rawData, setRawData] = useState([]);
  const [brands, setBrands] = useState([]);
  const [groupedData, setGroupedData] = useState({});
  const [customFileName, setCustomFileName] = useState("");

  const mapTradeDoublerRow = (row, campaign) => {
    const actionEarning = parseFloat(row["commission"]);

    if (campaign.Id === 2152 && campaign.name === "Eobuwie (PL)") {
      return {
        p1: row["epi2"].split("_")[1],
        created: row["timeOfTransaction"],
        txn_id: row["transactionId"],
        sale_amount: row["orderValue"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["epi2"].split("_")[0],
        status: row["epi2"].split("_")[0] === "77" ? "Pending" : "Approved",
        sub1: row["epi"],
        device_id: row["mobileDeviceType"] || "unknown",
      };
    } else if (campaign.Id === 2146 && campaign.name === "Grover DE") {
      return {
        p1: row["epi2"].split("_")[1],
        created: row["timeOfTransaction"],
        txn_id: row["transactionId"],
        sale_amount: row["orderValue"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["epi2"].split("_")[0],
        status: row["epi2"].split("_")[0] === "77" ? "Pending" : "Approved",
        sub1: row["epi"],
        device_id: row["mobileDeviceType"] || "unknown",
      };
    } else if (
      campaign.Id === 1875 &&
      campaign.name === "Avanti Travel Insurance"
    ) {
      return {
        p1: row["epi2"].split("_")[1],
        created: row["timeOfTransaction"],
        txn_id: row["transactionId"],
        sale_amount: row["orderValue"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["epi2"].split("_")[0],
        status: row["epi2"].split("_")[0] === "77" ? "Pending" : "Approved",
        // sub1: row["epi"],
        device_id: row["mobileDeviceType"] || "unknown",
      };
    } else if (campaign.Id === 1690 && campaign.name === "Eurowings DE") {
      return {
        // p1: row["epi2"],
        created: row["timeOfTransaction"],
        txn_id: row["transactionId"],
        sale_amount: row["orderValue"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["epi2"],
        status: row["epi2"].split("_")[0] === "77" ? "Pending" : "Approved",
        sub1: row["orderNumber"],
        device_id: row["mobileDeviceType"] || "unknown",
      };
    } else if (campaign.Id === 2220 && campaign.name === "Lycamobile") {
      return {
        // p1: row["epi2"],
        created: row["timeOfTransaction"],
        txn_id: row["transactionId"],
        sale_amount: row["orderValue"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["epi"],
        status: row["epi"].split("_")[0] === "77" ? "Pending" : "Approved",
        sub1: row["orderNumber"],
        device_id: row["mobileDeviceType"] || "unknown",
      };
    }
  };

  // 📥 Handle Excel Upload
  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const extension = file.name.split(".").pop().toLowerCase();
    const reader = new FileReader();
    if (extension === "xlsx") {
      reader.onload = (evt) => {
        const workbook = XLSX.read(evt.target.result, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        const cleaned = jsonData
          .filter((row) => row.programName && row.programName.trim() !== "")
          .filter((row) => row["commission"] !== 0);
        setRawData(cleaned);

        // 🔍 Extract unique brands
        const uniqueBrands = [
          ...new Set(cleaned.map((row) => row.programName.trim())),
        ];
        setBrands(uniqueBrands);

        // 🔄 Group by brand and map data
        const brandWise = {};
        uniqueBrands.forEach((brand) => {
          const brandRows = cleaned.filter(
            (row) => row.programName.trim() === brand
          );
          const config = Campaigns.find((c) => c.name === brand);

          if (!config) {
            console.warn(`No campaign config found for brand: ${brand}`);
            return;
          }

          brandWise[brand] = brandRows.map((row) =>
            mapTradeDoublerRow(row, config)
          );
        });

        setGroupedData(brandWise);
      };

      reader.readAsArrayBuffer(file);
    } else {
      alert("Unsupported file format");
    }
  };

  const handleDownloadCSV = (brand) => {
    const data = groupedData[brand];
    if (!data || !data.length) return;

    const csv = Papa.unparse(data);
    // const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    // saveAs(blob, `${brand}_mapped.csv`);
    const fileName = customFileName
      ? `${customFileName}.csv`
      : `${brand}_output.csv`;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, fileName);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📁 Upload TradeDoubler Maatr Report</h2>

      <input
        type="file"
        accept=".xlsx,.csv"
        onChange={handleExcelUpload}
        style={{ marginLeft: "10px" }}
      />

      {rawData.length > 0 && (
        <>
          <h3>✅Raw Rows - {rawData.length}</h3>
          <pre
            style={{
              background: "rgb(67, 67, 67)",
              padding: "10px",
              border: "1px solid white",
              maxHeight: "200px",
              overflowY: "scroll",
              fontSize: "12px",
            }}
          >
            {JSON.stringify(rawData, null, 2)}
          </pre>
        </>
      )}

      {brands.map((brand) => (
        <div
          key={brand}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginTop: "20px",
          }}
        >
          <h4>
            📌 {brand} — {groupedData[brand]?.length || 0} entries
          </h4>
          <input
            type="text"
            placeholder="Enter custom file name (optional)"
            value={customFileName}
            onChange={(e) => setCustomFileName(e.target.value)}
            className="p-2 border rounded mb-2"
          />

          <button onClick={() => handleDownloadCSV(brand)}>
            ⬇️ Download CSV
          </button>
          <pre
            style={{
              background: "#111",
              color: "#0f0",
              padding: "10px",
              fontSize: "12px",
              maxHeight: "200px",
              overflowY: "auto",
            }}
          >
            {JSON.stringify(groupedData[brand], null, 2)}
          </pre>
        </div>
      ))}
    </div>
  );
}
