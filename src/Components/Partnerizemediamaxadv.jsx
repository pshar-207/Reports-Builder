import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { saveAs } from "file-saver";

const Campaigns = [
  {
    name: "GoCity",
    Id: 2154,
  },
  {
    name: "H&M (Hennes & Mauritz)",
    Id: 2324,
  },
  {
    name: "Malwarebytes | Cybersecurity for Everyone",
    Id: 2393,
  },
  {
    name: "StubHub NORAM",
    Id: 662,
  },

  {
    // name: "Playstation Direct DE",
    Id: 1985,
  },
  {
    // name: "Victoria's Secret",
    Id: 1338,
  },
];

export default function Partnerizemediamaxadv() {
  const [rawData, setRawData] = useState([]);
  const [brands, setBrands] = useState([]);
  const [groupedData, setGroupedData] = useState({});
  const [customFileName, setCustomFileName] = useState("");

  const mapPartnerizeRow = (row, campaign) => {
    const actionEarning = parseFloat(row["publisher_commission"]);

    if (campaign.Id === 2154 && campaign.name === "GoCity") {
      return {
        created: row["conversion_date"],
        txn_id: row["conversion_id"],
        sale_amount: row["value"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: row["currency"].split(" ")[0],
        campaign_id: campaign.Id,
        publisher_id: row["publisher_reference"],
        status: row["publisher_reference"] === "77" ? "Pending" : "Approved",
        sub1: row["clickref"],
        device_id: row["ref_device"] || "unknown",
      };
    } else if (
      campaign.Id === 2324 &&
      campaign.name === "H&M (Hennes & Mauritz)"
    ) {
      return {
        created: row["conversion_date"],
        txn_id: row["conversion_id"],
        sale_amount: row["value"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: row["currency"].split(" ")[0],
        campaign_id: campaign.Id,
        publisher_id: row["publisher_reference"],
        status: row["publisher_reference"] === "77" ? "Pending" : "Approved",
        sub1: row["clickref"],
        device_id: row["ref_device"] || "unknown",
      };
    } else if (
      campaign.Id === 2393 &&
      campaign.name === "Malwarebytes | Cybersecurity for Everyone"
    ) {
      return {
        p1: row["publisher_reference"],
        created: row["conversion_date"],
        txn_id: row["conversion_id"],
        sale_amount: row["value"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: row["currency"].split(" ")[0],
        campaign_id: campaign.Id,
        publisher_id: row["publisher_reference"].split("_")[0],
        status:
          row["publisher_reference"].split("_")[0] === "77"
            ? "Pending"
            : "Approved",
        sub1: row["clickref"],
        device_id: row["ref_device"] || "unknown",
      };
    } else if (
      campaign.Id === 1985 &&
      campaign.name === "Playstation Direct DE"
    ) {
      return {
        p1: row["publisher_reference"],
        created: row["conversion_date"],
        txn_id: row["conversion_id"],
        sale_amount: row["value"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: row["currency"].split(" ")[0],
        campaign_id: campaign.Id,
        publisher_id: row["advertiser_reference"],
        status: row["advertiser_reference"] === "77" ? "Pending" : "Approved",
        sub1: row["clickref"],
        device_id: row["ref_device"] || "unknown",
      };
    } else if (campaign.Id === 1338 && campaign.name === "Victoria's Secret") {
      return {
        // p1: row["publisher_reference"],
        created: row["conversion_date"],
        txn_id: row["conversion_id"],
        sale_amount: row["value"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: row["currency"].split(" ")[0],
        campaign_id: campaign.Id,
        publisher_id: row["publisher_reference"],
        status: row["publisher_reference"] === "77" ? "Pending" : "Approved",
        sub1: row["clickref"],
        device_id: row["ref_device"] || "unknown",
      };
    } else if (campaign.Id === 662 && campaign.name === "StubHub NORAM") {
      return {
        // p1: row["publisher_reference"],
        created: row["conversion_date"],
        txn_id: row["conversion_id"],
        sale_amount: row["value"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: row["currency"].split(" ")[0],
        campaign_id: campaign.Id,
        publisher_id: row["publisher_reference"],
        status: row["publisher_reference"] === "77" ? "Pending" : "Approved",
        sub1: row["clickref"],
        device_id: row["ref_device"] || "unknown",
      };
    }
  };

  //   📥 Handle Excel Upload
  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const extension = file.name.split(".").pop().toLowerCase();
    const reader = new FileReader();

    if (extension === "csv") {
      reader.onload = (evt) => {
        const text = evt.target.result;

        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const csvData = results.data;

            const cleaned = csvData.filter(
              (row) => parseFloat(row["publisher_commission"] || 0) > 0,
            );
            setRawData(cleaned);

            // 🔍 Extract unique brands
            const uniqueBrands = [
              ...new Set(cleaned.map((row) => row.campaign_title.trim())),
            ];
            setBrands(uniqueBrands);

            // 🔄 Group by brand and map data
            const brandWise = {};
            uniqueBrands.forEach((brand) => {
              const brandRows = cleaned.filter(
                (row) => row.campaign_title.trim() === brand,
              );
              const config = Campaigns.find((c) => c.name === brand);

              if (!config) {
                console.warn(`No campaign config found for brand: ${brand}`);
                return;
              }

              brandWise[brand] = brandRows.map((row) =>
                mapPartnerizeRow(row, config),
              );
            });

            setGroupedData(brandWise);
          },
        });
      };
      reader.readAsText(file);
    } else {
      alert("Unsupported file format");
    }
  };

  const parsePartnerizeDate = (value) => {
    if (!value) return null;

    // If already Date object
    if (value instanceof Date && !isNaN(value)) {
      return new Date(value.getFullYear(), value.getMonth(), value.getDate());
    }

    // String: "YYYY-MM-DD HH:mm:ss" or "YYYY-MM-DD"
    if (typeof value === "string") {
      const clean = value.split(" ")[0]; // remove time
      const [year, month, day] = clean.split("-");
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

    const monthName = (d) => d.toLocaleString("en-US", { month: "short" });

    // Single day
    if (startDay === endDay && startMonth === endMonth) {
      return `${startDay} ${monthName(start)} ${year}`;
    }

    // Same month
    if (startMonth === endMonth) {
      return `${startDay}-${endDay} ${monthName(start)} ${year}`;
    }

    // Cross month
    return `${startDay} ${monthName(start)} - ${endDay} ${monthName(
      end,
    )} ${year}`;
  };

  const handleDownloadCSV = (brand) => {
    const data = groupedData[brand];
    if (!data || !data.length) return;

    // 🔍 Get campaign ID
    const campaign = Campaigns.find((c) => c.name === brand);

    // 📅 Extract dates from created field
    const dates = data
      .map((row) => parsePartnerizeDate(row.created))
      .filter(Boolean);

    const dateRange = dates.length ? formatDateRange(dates) : "";

    // 📝 Final auto filename
    const fileName = customFileName
      ? `${customFileName}.csv`
      : `${brand} (${campaign?.Id}) ${dateRange}.csv`;

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, fileName);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📁 Upload Partnerize mediamaxadv Report</h2>

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
