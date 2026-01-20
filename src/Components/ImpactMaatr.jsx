import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { saveAs } from "file-saver";

const Campaigns = [
  {
    name: "Bitdefender",
    Id: 1844,
  },

  {
    name: "Walmart Affiliate Program",
    Id: 2028,
  },

  {
    name: "ADT-PX",
    Id: 2453,
  },

  {
    name: "Homestyler",
    Id: 1857,
  },

  {
    name: "IMG",
    Id: 2177,
  },

  {
    name: "VEVOR DE",
    Id: 1559,
  },

  {
    name: "Whatnot Affiliates",
    Id: 2224,
  },
   
];

export default function ImpactMaatr() {
  const [rawData, setRawData] = useState([]);
  const [brands, setBrands] = useState([]);
  const [groupedData, setGroupedData] = useState({});
  const [customFileName, setCustomFileName] = useState("");

  const mapImpactRow = (row, campaign) => {
    const actionEarning = parseFloat(row["Action Earnings"]);

    if (campaign.Id === 1844 && campaign.name === "Bitdefender") {
      return {
        p1: row["Sub Id 3"],
        created: row["Action Date"],
        txn_id: row["Action Id"],
        sale_amount: row["Sale Amount"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["Sub Id 2"],
        status: row["Sub Id 2"] === "77" ? "Pending" : "Approved",
        sub1: row["Sub Id 1"],
        device_id: row["Device Type"] || "unknown",
      };
    } else if (campaign.Id === 2028 && campaign.name === "Walmart Affiliate Program") {
      return {
        p1: row["Sub Id 1"],
        created: row["Action Date"],
        txn_id: row["Action Id"],
        sale_amount: row["Sale Amount"],
        revenue: actionEarning,
        payout: ((actionEarning * 90) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["Sub Id 2"],
        status: row["Sub Id 2"] === "77" ? "Pending" : "Approved",
        device_id: row["Device Type"] || "unknown",
      };
    } else if (campaign.Id === 2453 && campaign.name === "ADT-PX") {
      return {
        p1: row["Sub Id 2"],
        created: row["Action Date"],
        txn_id: row["Action Id"],
        sale_amount: row["Sale Amount"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["Sub Id 2"],
        status: row["Sub Id 2"] === "77" ? "Pending" : "Approved",
        sub1: row["Sub Id 1"],
        device_id: row["Device Type"] || "Unknown",
      };
    } else if (campaign.Id === 1857 && campaign.name === "Homestyler") {
      return {
        p1: row["Sub Id 3"],
        created: row["Action Date"],
        txn_id: row["Action Id"],
        sale_amount: row["Sale Amount"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["Sub Id 2"],
        status: row["Sub Id 2"] === "77" ? "Pending" : "Approved",
        sub1: row["Sub Id 1"],
        device_id: row["Device Type"] || "Unknown",
      };
    } else if (campaign.Id === 2177 && campaign.name === "IMG") {
      return {
        created: row["Action Date"],
        txn_id: row["Action Id"],
        sale_amount: row["Sale Amount"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["Sub Id 2"],
        status: row["Sub Id 2"] === "77" ? "Pending" : "Approved",
        sub1: row["Sub Id 1"],
        device_id: row["Device Type"] || "Desktop",
      };
    } else if (campaign.Id === 1559 && campaign.name === "VEVOR DE") {
      return {
        p1: row["Sub Id 1"],
        created: row["Action Date"],
        txn_id: row["Action Id"],
        sale_amount: row["Sale Amount"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["Sub Id 2"],
        status: row["Sub Id 2"] === "77" ? "Pending" : "Approved",
        sub1: row["Sub Id 3"],
        device_id: row["Device Type"] || "Unknown",
      };
    } else if (campaign.Id === 2224 && campaign.name === "Whatnot Affiliates") {
      return {
        p1: row["Sub Id 1"],
        created: row["Action Date"],
        txn_id: row["Action Id"],
        sale_amount: row["Sale Amount"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["Sub Id 2"],
        status: row["Sub Id 2"] === "77" ? "Pending" : "Approved",
        sub1: row["Sub Id 3"],
        device_id: row["Device Type"] || "Unknown",
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
          .filter((row) => row.Brand && row.Brand.trim() !== "")
          .filter((row) => row["Action Earnings"] !== 0);
        setRawData(cleaned);

        // 🔍 Extract unique brands
        const uniqueBrands = [
          ...new Set(cleaned.map((row) => row.Brand.trim())),
        ];
        setBrands(uniqueBrands);

        // 🔄 Group by brand and map data
        const brandWise = {};
        uniqueBrands.forEach((brand) => {
          const brandRows = cleaned.filter((row) => row.Brand.trim() === brand);
          const config = Campaigns.find((c) => c.name === brand);

          if (!config) {
            console.warn(`No campaign config found for brand: ${brand}`);
            return;
          }

          brandWise[brand] = brandRows.map((row) => mapImpactRow(row, config));
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
      <h2>📁 Upload Impact Maatr Report</h2>

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
