import React, { useState } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { saveAs } from "file-saver";

const Campaigns = [
  {
    name: "Turkish Airlines APAC",
    Id: 2262,
  },
  {
    name: "Bangkok Airways",
    Id: 2261,
  },
  {
    name: "Emirates",
    Id: 1475,
  },
  {
    name: "Home Depot Mexico",
    Id: 798,
  },
];

export default function RakutenMMAds() {
  const [rawData, setRawData] = useState([]);
  const [brands, setBrands] = useState([]);
  const [groupedData, setGroupedData] = useState({});
  const [customFileName, setCustomFileName] = useState("");

  const mapRakutenRow = (row, campaign) => {
    const actionEarning = parseFloat(row["Total Commission"] || 0);

    const formatDate = (inputDate) => {
      if (inputDate && inputDate.includes("/")) {
        const [month, day, year] = inputDate.split("/");
        return `${day}-${month}-${year}`;
      }
      return inputDate || "";
    };

    if (campaign.Id === 2262 && campaign.name === "Turkish Airlines APAC") {
      return {
        created: formatDate(row["Transaction Date"]),
        txn_id: row["Transaction ID"],
        sale_amount: row["Sales"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: row["Currency"],
        campaign_id: campaign.Id,

        publisher_id: row["Member ID (U1)"]
          ? row["Member ID (U1)"].split("_")[0]
          : "",

        status:
          row["Member ID (U1)"] && row["Member ID (U1)"].split("_")[0] === "77"
            ? "Pending"
            : "Approved",

        sub1: row["Order ID"],
        device_id: row["Device"] || "unknown",
      };
    } else if (campaign.Id === 1475 && campaign.name === "Emirates") {
      return {
        p1: row["Member ID (U1)"] ? row["Member ID (U1)"].split("_")[1] : "",
        created: formatDate(row["Transaction Date"]),
        txn_id: row["Transaction ID"],
        sale_amount: row["Sales"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: row["Currency"],
        campaign_id: campaign.Id,

        publisher_id: row["Member ID (U1)"]
          ? row["Member ID (U1)"].split("_")[0]
          : "",

        status:
          row["Member ID (U1)"] && row["Member ID (U1)"].split("_")[0] === "77"
            ? "Pending"
            : "Approved",

        sub1: row["Order ID"],
        device_id: row["Device"] || "unknown",
      };
    } else if (campaign.Id === 798 && campaign.name === "Home Depot Mexico") {
      return {
        created: formatDate(row["Transaction Date"]),
        txn_id: row["Transaction ID"],
        sale_amount: row["Sales"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: row["Currency"],
        campaign_id: campaign.Id,
        publisher_id: "168",
        status: "Approved",
        sub1: row["Order ID"],
        device_id: row["Device"] || "unknown",
      };
    } else if (campaign.Id === 2261 && campaign.name === "Bangkok Airways") {
      return {
        created: formatDate(row["Transaction Date"]),
        txn_id: row["Transaction ID"],
        sale_amount: row["Sales"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: row["Currency"],
        campaign_id: campaign.Id,

        publisher_id: row["Member ID (U1)"]
          ? row["Member ID (U1)"].split("_")[0]
          : "",

        status:
          row["Member ID (U1)"] && row["Member ID (U1)"].split("_")[0] === "77"
            ? "Pending"
            : "Approved",

        sub1: row["Order ID"],
        device_id: row["Device"] || "unknown",
      };
    }
  };

  // 📥 Handle CSV Upload
  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const extension = file.name.split(".").pop().toLowerCase();
    if (extension !== "csv") {
      alert("Please upload a CSV file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;

      Papa.parse(text, {
        skipEmptyLines: false,
        complete: (results) => {
          const csvData = results.data;

          // 🔍 Skip first 4 rows (your file header)
          const usableRows = csvData.slice(4);

          const [header, ...rowValues] = usableRows;

          // Convert rows to key-value objects
          const cleanData = rowValues
            .filter((row) => row.length > 1) // remove empty last row
            .map((row) => {
              const obj = {};
              header.forEach((col, i) => {
                obj[col] = row[i] || "";
              });
              return obj;
            });

          // Remove rows with no Transaction ID
          const cleaned = cleanData.filter(
            (r) => r["Transaction ID"] && r["Transaction ID"] !== ""
          );

          setRawData(cleaned);

          // Extract brands
          const uniqueBrands = [
            ...new Set(cleaned.map((r) => r["Advertiser Name"].trim())),
          ];

          setBrands(uniqueBrands);

          // Group data
          const brandWise = {};
          uniqueBrands.forEach((brand) => {
            const rows = cleaned.filter(
              (r) => r["Advertiser Name"].trim() === brand
            );

            const config = Campaigns.find(
              (c) => c.name.trim().toLowerCase() === brand.trim().toLowerCase()
            );

            if (!config) return;

            brandWise[brand] = rows.map((row) => mapRakutenRow(row, config));
          });

          setGroupedData(brandWise);
        },
      });
    };

    reader.readAsText(file);
  };

  const handleDownloadCSV = (brand) => {
    const data = groupedData[brand];
    if (!data || !data.length) return;

    const csv = Papa.unparse(data);
    const fileName = customFileName
      ? `${customFileName}.csv`
      : `${brand}_output.csv`;

    saveAs(new Blob([csv], { type: "text/csv;charset=utf-8;" }), fileName);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📁 Upload Rakuten MMAds Report</h2>

      <input
        type="file"
        accept=".csv"
        onChange={handleExcelUpload}
        style={{ marginLeft: "10px" }}
      />

      {rawData.length > 0 && (
        <>
          <h3>✅ Raw Rows — {rawData.length}</h3>
          <pre
            style={{
              background: "#222",
              color: "#0f0",
              padding: "10px",
              maxHeight: "200px",
              overflow: "auto",
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
          />

          <button onClick={() => handleDownloadCSV(brand)}>
            ⬇️ Download CSV
          </button>

          <pre
            style={{
              background: "#111",
              color: "#0f0",
              padding: "10px",
              maxHeight: "200px",
              overflow: "auto",
              fontSize: "12px",
            }}
          >
            {JSON.stringify(groupedData[brand], null, 2)}
          </pre>
        </div>
      ))}
    </div>
  );
}
