import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { saveAs } from "file-saver";

const Campaigns = [
  {
    name: "Alinea Invest",
    Id: 2662,
  },
  {
    name: "Boden DE",
    Id: 2027,
  },
  {
    name: "Contiki",
    Id: 2065,
  },
  {
    name: "Express LLC",
    Id: 2566,
  },
  {
    name: "Faye Travel Insurance",
    Id: 2658,
  },
  {
    name: "flexispot.de",
    Id: 2500,
  },
  {
    name: "Gauth AI",
    Id: 2636,
  },
  {
    name: "Humble Bundle, Inc.",
    Id: 1722,
  },
  {
    name: "Kovo Affiliate Program",
    Id: 2671,
  },
  {
    name: "Little Sleepies",
    Id: 2434,
  },
  {
    name: "Malaysia Airlines",
    Id: 2451,
  },
  {
    name: "Network Solutions Affiliate Program",
    Id: 2181,
  },
  {
    name: "Nutrafol",
    Id: 2567,
  },
  {
    name: "Pins & Aces",
    Id: 2657,
  },
  {
    name: "Reolink",
    Id: 2164,
  },
  {
    name: "Stitch Fix",
    Id: 2344,
  },
  {
    name: "Target",
    Id: 2115,
  },
  {
    name: "Travala.com",
    Id: 2044,
  },
  {
    name: "Udemy",
    Id: 2356,
  },
  {
    name: "VEGAS.com",
    Id: 2447,
  },
  {
    name: "YouFibre",
    Id: 2656,
  },
  {
    name: "AARP",
    Id: 2119,
  },
  {
    name: "SHOKZ US",
    Id: 2660,
  },
  {
    name: "1st Phorm",
    Id: 2659,
  },

  {
    // name: "StockX",
    Id: 2049,
  },
  {
    // name: "Fleshlight and Fleshjack",
    Id: 2424,
  },
  {
    // name: "Hostinger",
    Id: 2338,
  },
  {
    // name: "Orthofeet",
    Id: 2343,
  },
  {
    // name: "Otter.ai",
    Id: 2167,
  },
];

export default function ImpactMaxMania() {
  const [rawData, setRawData] = useState([]);
  const [brands, setBrands] = useState([]);
  const [groupedData, setGroupedData] = useState({});
  const [customFileName, setCustomFileName] = useState("");

  const mapImpactRow = (row, campaign) => {
    const actionEarning = parseFloat(row["Action Earnings"]);

    if (campaign.Id === 2119 && campaign.name === "AARP") {
      return {
        // p1: row["Sub Id 3"],
        created: row["Action Date"],
        txn_id: row["Action Id"],
        sale_amount: row["Sale Amount"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["SharedId"],
        status: row["SharedId"] === "77" ? "Pending" : "Approved",
        sub1: row["Sub Id 1"],
        device_id: row["Device Type"] || "unknown",
      };
    } else if (campaign.Id === 2065 && campaign.name === "Contiki") {
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
        device_id: row["Device Type"] || "unknown",
      };
    } else if (
      campaign.Id === 2424 &&
      campaign.name === "Fleshlight and Fleshjack"
    ) {
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
    } else if (campaign.Id === 2500 && campaign.name === "flexispot.de") {
      return {
        // p1: row["Sub Id 3"],
        created: row["Action Date"],
        txn_id: row["Action Id"],
        sale_amount: row["Sale Amount"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["Sub Id 2"],
        status: row["Sub Id 2"] === "77" ? "Pending" : "Approved",
        // sub1: row["Sub Id 1"],
        device_id: row["Device Type"] || "unknown",
      };
    } else if (campaign.Id === 2338 && campaign.name === "Hostinger") {
      return {
        // p1: row["Sub Id 3"],
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
    } else if (
      campaign.Id === 1722 &&
      campaign.name === "Humble Bundle, Inc."
    ) {
      return {
        // p1: row["Sub Id 3"],
        created: row["Action Date"],
        txn_id: row["Action Id"],
        sale_amount: row["Sale Amount"],
        revenue: actionEarning,
        payout: ((actionEarning * 90) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["Sub Id 2"],
        status: row["Sub Id 2"] === "77" ? "Pending" : "Approved",
        sub1: row["Sub Id 1"],
        device_id: row["Device Type"] || "unknown",
      };
    } else if (campaign.Id === 2343 && campaign.name === "Orthofeet") {
      return {
        // p1: row["Sub Id 3"],
        created: row["Action Date"],
        txn_id: row["Action Id"],
        sale_amount: row["Sale Amount"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["Sub Id 1"],
        status: row["Sub Id 1"] === "77" ? "Pending" : "Approved",
        sub1: row["Sub Id 2"],
        device_id: row["Device Type"] || "unknown",
      };
    } else if (campaign.Id === 2167 && campaign.name === "Otter.ai") {
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
    } else if (campaign.Id === 2164 && campaign.name === "Reolink") {
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
    } else if (campaign.Id === 2344 && campaign.name === "Stitch Fix") {
      return {
        // p1: row["Sub Id 3"],
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
    } else if (campaign.Id === 2049 && campaign.name === "StockX") {
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
        device_id: row["Device Type"] || "unknown",
      };
    } else if (campaign.Id === 2044 && campaign.name === "Travala.com") {
      return {
        // p1: row["Sub Id 1"],
        created: row["Action Date"],
        txn_id: row["Action Id"],
        sale_amount: row["Sale Amount"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["Sub Id 2"],
        status: row["Sub Id 2"] === "77" ? "Pending" : "Approved",
        // sub1: row["Sub Id 3"],
        device_id: row["Device Type"] || "unknown",
      };
    } else if (campaign.Id === 2356 && campaign.name === "Udemy") {
      return {
        // p1: row["Sub Id 1"],
        created: row["Action Date"],
        txn_id: row["Action Id"],
        sale_amount: row["Sale Amount"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["Sub Id 1"],
        status: row["Sub Id 1"] === "77" ? "Pending" : "Approved",
        // sub1: row["Sub Id 3"],
        device_id: row["Device Type"] || "unknown",
      };
    } else if (campaign.Id === 2027 && campaign.name === "Boden DE") {
      return {
        // p1: row["Sub Id 1"],
        created: row["Action Date"],
        txn_id: row["Action Id"],
        sale_amount: row["Sale Amount"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["Sub Id 1"],
        status: row["Sub Id 1"] === "77" ? "Pending" : "Approved",
        // sub1: row["Sub Id 1"],
        device_id: row["Device Type"] || "unknown",
      };
    } else if (campaign.Id === 2566 && campaign.name === "Express LLC") {
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
    } else if (campaign.Id === 2115 && campaign.name === "Target") {
      return {
        // p1: row["Sub Id 3"].split("_")[1],
        created: row["Action Date"],
        txn_id: row["Action Id"],
        sale_amount: row["Sale Amount"],
        revenue: actionEarning,
        payout: ((actionEarning * 85) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["Sub Id 3"].split("_")[0],
        status: row["Sub Id 3"].split("_")[0] === "77" ? "Pending" : "Approved",
        sub1: row["Sub Id 1"],
        device_id: row["Device Type"] || "unknown",
      };
    } else if (campaign.Id === 2662 && campaign.name === "Alinea Invest") {
      return {
        // p1: row["Sub Id 3"],
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
    } else if (
      campaign.Id === 2658 &&
      campaign.name === "Faye Travel Insurance"
    ) {
      return {
        // p1: row["Sub Id 3"],
        created: row["Action Date"],
        txn_id: row["Action Id"],
        sale_amount: row["Sale Amount"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["Sub Id 1"],
        status: row["Sub Id 1"] === "77" ? "Pending" : "Approved",
        // sub1: row["Sub Id 1"],
        device_id: row["Device Type"] || "unknown",
      };
    } else if (campaign.Id === 2636 && campaign.name === "Gauth AI") {
      return {
        // p1: row["Sub Id 3"],
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
    } else if (campaign.Id === 2434 && campaign.name === "Little Sleepies") {
      return {
        // p1: row["Sub Id 3"],
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
    } else if (campaign.Id === 2451 && campaign.name === "Malaysia Airlines") {
      return {
        // p1: row["Sub Id 3"],
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
    } else if (
      campaign.Id === 2181 &&
      campaign.name === "Network Solutions Affiliate Program"
    ) {
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
        device_id: row["Device Type"] || "unknown",
      };
    } else if (campaign.Id === 2567 && campaign.name === "Nutrafol") {
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
    } else if (campaign.Id === 2657 && campaign.name === "Pins & Aces") {
      return {
        // p1: row["Sub Id 3"],
        created: row["Action Date"],
        txn_id: row["Action Id"],
        sale_amount: row["Sale Amount"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["Sub Id 1"],
        status: row["Sub Id 1"] === "77" ? "Pending" : "Approved",
        // sub1: row["Sub Id 1"],
        device_id: row["Device Type"] || "unknown",
      };
    } else if (campaign.Id === 2447 && campaign.name === "VEGAS.com") {
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
    } else if (campaign.Id === 2656 && campaign.name === "YouFibre") {
      return {
        // p1: row["Sub Id 3"],
        created: row["Action Date"],
        txn_id: row["Action Id"],
        sale_amount: row["Sale Amount"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["Sub Id 1"],
        status: row["Sub Id 1"] === "77" ? "Pending" : "Approved",
        // sub1: row["Sub Id 1"],
        device_id: row["Device Type"] || "unknown",
      };
    } else if (
      campaign.Id === 2671 &&
      campaign.name === "Kovo Affiliate Program"
    ) {
      return {
        // p1: row["Sub Id 3"],
        created: row["Action Date"],
        txn_id: row["Action Id"],
        sale_amount: row["Sale Amount"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["Sub Id 1"],
        status: row["Sub Id 1"] === "77" ? "Pending" : "Approved",
        // sub1: row["Sub Id 1"],
        device_id: row["Device Type"] || "unknown",
      };
    } else if (campaign.Id === 2660 && campaign.name === "SHOKZ US") {
      return {
        // p1: row["Sub Id 3"],
        created: row["Action Date"],
        txn_id: row["Action Id"],
        sale_amount: row["Sale Amount"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["Sub Id 3"],
        status: row["Sub Id 3"] === "77" ? "Pending" : "Approved",
        // sub1: row["Sub Id 1"],
        device_id: row["Device Type"] || "unknown",
      };
    } else if (campaign.Id === 2659 && campaign.name === "1st Phorm") {
      return {
        // p1: row["Sub Id 3"],
        created: row["Action Date"],
        txn_id: row["Action Id"],
        sale_amount: row["Sale Amount"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["Sub Id 1"],
        status: row["Sub Id 1"] === "77" ? "Pending" : "Approved",
        // sub1: row["Sub Id 1"],
        device_id: row["Device Type"] || "unknown",
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

  const parseImpactDate = (value) => {
    if (!value) return null;

    // ✅ If already Date (xlsx usually gives this)
    if (value instanceof Date && !isNaN(value)) {
      return new Date(value.getFullYear(), value.getMonth(), value.getDate());
    }

    // ✅ If Excel serial number
    if (typeof value === "number") {
      const excelEpoch = new Date(1899, 11, 30);
      const date = new Date(excelEpoch.getTime() + value * 86400000);

      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    // ✅ If string (Impact MM/DD/YYYY)
    if (typeof value === "string") {
      const clean = value.split(" ")[0];
      const [month, day, year] = clean.split("/");

      return new Date(year, month - 1, day);
    }

    return null;
  };

  const formatDateRange = (dates) => {
    const sorted = [...dates].sort((a, b) => a - b);

    const start = sorted[0];
    const end = sorted[sorted.length - 1];

    const startDay = start.getDate();
    const endDay = end.getDate();
    const startMonth = start.getMonth();
    const endMonth = end.getMonth();
    const year = start.getFullYear();

    const monthFormatter = (d) => d.toLocaleString("en-US", { month: "short" });

    // ✅ Same day
    if (startDay === endDay && startMonth === endMonth) {
      return `${startDay} ${monthFormatter(start)} ${year}`;
    }

    // ✅ Same month
    if (startMonth === endMonth) {
      return `${startDay}-${endDay} ${monthFormatter(start)} ${year}`;
    }

    // ✅ Cross-month (rare but correct)
    return `${startDay} ${monthFormatter(start)} - ${endDay} ${monthFormatter(
      end,
    )} ${year}`;
  };

  const handleDownloadCSV = (brand) => {
    const data = groupedData[brand];
    if (!data || !data.length) return;

    // 🔍 Find campaign config
    const campaign = Campaigns.find((c) => c.name === brand);
    if (!campaign) return;

    // 📅 Extract dates
    const dates = data
      .map((row) => parseImpactDate(row.created))
      .filter(Boolean);

    const dateRange = dates.length ? formatDateRange(dates) : "";

    // 📝 Final file name
    const fileName = `${brand} (${campaign.Id}) ${dateRange}.csv`;

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, fileName);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📁 Upload Impact MaxMania Report</h2>

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
