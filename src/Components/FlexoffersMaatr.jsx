import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { saveAs } from "file-saver";

const Campaigns = [
  {
    name: "Autodoc UK",
    Id: 2137,
  },
  {
    name: "Marc Jacobs",
    Id: 2133,
  },
  {
    name: "Sephora MX",
    Id: 2108,
  },
  {
    name: "Stanley",
    Id: 2132,
  },
  {
    name: "Thrive Causemetics",
    Id: 2442,
  },
  {
    name: "YesStyle US/ Global",
    Id: 2166,
  },
  {
    name: "Aesop US",
    Id: 2134,
  },
  {
    name: "Furla US",
    Id: 2117,
  },
  {
    name: "Alibaba US",
    Id: 2143,
  },
  {
    name: "24bottles FR",
    Id: 2525,
  },
  
  
];

export default function FlexoffersMaatr() {
  const [rawData, setRawData] = useState([]);
  const [brands, setBrands] = useState([]);
  const [groupedData, setGroupedData] = useState({});
  const [customFileName, setCustomFileName] = useState("");

  const mapFlexofferRow = (row, campaign) => {
    const actionEarning = parseFloat(row["Commissions"]);

    if (campaign.Id === 2137 && campaign.name === "Autodoc UK") {
      return {
        p1: row["Sub ID 1"].split("_")[1],
        created: row["Event Date"].split("T")[0],
        txn_id: row["Transaction ID"],
        sale_amount: row["Sales Amount"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["Sub ID 2"],
        status: row["Sub ID 2"] === "77" ? "Pending" : "Approved",
        sub1: row["Order Number"],
        device_id: row["Device"] || "unknown",
      };
    } else if (campaign.Id === 2133 && campaign.name === "Marc Jacobs") {
      return {
        p1: row["Sub ID 1"].split("_")[1],
        created: row["Event Date"].split("T")[0],
        txn_id: row["Transaction ID"],
        sale_amount: row["Sales Amount"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["Sub ID 2"],
        status: row["Sub ID 2"] === "77" ? "Pending" : "Approved",
        sub1: row["Order Number"],
        device_id: row["Device"] || "unknown",
      };
    } else if (campaign.Id === 2108 && campaign.name === "Sephora MX") {
      return {
        p1: row["Sub ID 1"].split("_")[1],
        created: row["Event Date"].split("T")[0],
        txn_id: row["Transaction ID"],
        sale_amount: row["Sales Amount"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["Sub ID 2"],
        status: row["Sub ID 2"] === "77" ? "Pending" : "Approved",
        sub1: row["Order Number"],
        device_id: row["Device"] || "unknown",
      };
    } else if (campaign.Id === 2132 && campaign.name === "Stanley") {
      return {
        p1: row["Sub ID 1"].split("_")[1],
        created: row["Event Date"].split("T")[0],
        txn_id: row["Transaction ID"],
        sale_amount: row["Sales Amount"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["Sub ID 2"],
        status: row["Sub ID 2"] === "77" ? "Pending" : "Approved",
        sub1: row["Order Number"],
        device_id: row["Device"] || "unknown",
      };
    } else if (campaign.Id === 2442 && campaign.name === "Thrive Causemetics") {
      return {
        p1: row["Sub ID 1"].split("_")[1],
        created: row["Event Date"].split("T")[0],
        txn_id: row["Transaction ID"],
        sale_amount: row["Sales Amount"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["Sub ID 2"],
        status: row["Sub ID 2"] === "77" ? "Pending" : "Approved",
        sub1: row["Order Number"],
        device_id: row["Device"] || "unknown",
      };
    } else if (
      campaign.Id === 2166 &&
      campaign.name === "YesStyle US/ Global"
    ) {
      return {
        p1: row["Sub ID 1"].split("_")[1],
        created: row["Event Date"].split("T")[0],
        txn_id: row["Transaction ID"],
        sale_amount: row["Sales Amount"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["Sub ID 2"],
        status: row["Sub ID 2"] === "77" ? "Pending" : "Approved",
        sub1: row["Order Number"],
        device_id: row["Device"] || "unknown",
      };
    } else if (campaign.Id === 2134 && campaign.name === "Aesop US") {
      return {
        p1: row["Sub ID 1"].split("_")[1],
        created: row["Event Date"].split("T")[0],
        txn_id: row["Transaction ID"],
        sale_amount: row["Sales Amount"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["Sub ID 2"],
        status: row["Sub ID 2"] === "77" ? "Pending" : "Approved",
        sub1: row["Order Number"],
        device_id: row["Device"] || "unknown",
      };
    } else if (campaign.Id === 2117 && campaign.name === "Furla US") {
      return {
        p1: row["Sub ID 1"].split("_")[1],
        created: row["Event Date"].split("T")[0],
        txn_id: row["Transaction ID"],
        sale_amount: row["Sales Amount"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["Sub ID 2"],
        status: row["Sub ID 2"] === "77" ? "Pending" : "Approved",
        sub1: row["Order Number"],
        device_id: row["Device"] || "unknown",
      };
    } else if (campaign.Id === 2143 && campaign.name === "Alibaba US") {
      return {
        p1: row["Sub ID 1"].split("_")[1],
        created: row["Event Date"].split("T")[0],
        txn_id: row["Transaction ID"],
        sale_amount: row["Sales Amount"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["Sub ID 2"],
        status: row["Sub ID 2"] === "77" ? "Pending" : "Approved",
        sub1: row["Order Number"],
        device_id: row["Device"] || "unknown",
      };
    } else if (campaign.Id === 2525 && campaign.name === "24bottles FR") {
      return {
        p1: row["Sub ID 1"].split("_")[1],
        created: row["Event Date"].split("T")[0],
        txn_id: row["Transaction ID"],
        sale_amount: row["Sales Amount"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["Sub ID 2"],
        status: row["Sub ID 2"] === "77" ? "Pending" : "Approved",
        sub1: row["Order Number"],
        device_id: row["Device"] || "unknown",
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
          .filter((row) => row.Advertiser && row.Advertiser.trim() !== "")
          .filter((row) => row["Commissions"] > 0);
        setRawData(cleaned);

        // 🔍 Extract unique brands
        const uniqueBrands = [
          ...new Set(cleaned.map((row) => row.Advertiser.trim())),
        ];
        setBrands(uniqueBrands);

        // 🔄 Group by brand and map data
        const brandWise = {};
        uniqueBrands.forEach((brand) => {
          const brandRows = cleaned.filter(
            (row) => row.Advertiser.trim() === brand
          );
          const config = Campaigns.find((c) => c.name === brand);

          if (!config) {
            console.warn(`No campaign config found for brand: ${brand}`);
            return;
          }

          brandWise[brand] = brandRows.map((row) =>
            mapFlexofferRow(row, config)
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
      <h2>📁 Upload Flexoffers Maatr Report</h2>

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
