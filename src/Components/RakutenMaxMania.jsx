import React, { useState } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { saveAs } from "file-saver";

const Campaigns = [
  {
    name: "Kitsch",
    Id: 2107,
  },
  {
    name: "Temu USA",
    Id: 2489,
  },
  {
    name: "SHEIN USD",
    Id: 2572,
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

    if (campaign.Id === 2107 && campaign.name === "Kitsch") {
      return {
        p1: row["Member ID (U1)"] ? row["Member ID (U1)"].split("_")[1] : "",
        created: formatDate(row["Transaction Date"]),
        txn_id: row["Order ID"],
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
        device_id: row["Device"] || "unknown",
      };
    } else if (campaign.Id === 2489 && campaign.name === "Temu USA") {
      return {
        p1: row["Member ID (U1)"] ? row["Member ID (U1)"].split("_")[1] : "",
        created: formatDate(row["Transaction Date"]),
        txn_id: row["Order ID"],
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
        device_id: row["Device"] || "unknown",
      };
    } else if (campaign.Id === 2572 && campaign.name === "SHEIN USD") {
      return {
        p1: row["Member ID (U1)"] ? row["Member ID (U1)"].split("_")[1] : "",
        created: formatDate(row["Transaction Date"]),
        txn_id: row["Order ID"],
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
            (r) => r["Order ID"] && r["Order ID"] !== "",
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
              (r) => r["Advertiser Name"].trim() === brand,
            );

            const config = Campaigns.find(
              (c) => c.name.trim().toLowerCase() === brand.trim().toLowerCase(),
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

  const parseImpactDate = (value) => {
    if (!value) return null;

    // ✅ Already a Date object
    if (value instanceof Date && !isNaN(value)) {
      return new Date(value.getFullYear(), value.getMonth(), value.getDate());
    }

    // ✅ Excel serial number
    if (typeof value === "number") {
      const excelEpoch = new Date(1899, 11, 30);
      const date = new Date(excelEpoch.getTime() + value * 86400000);

      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    // ✅ String formats
    if (typeof value === "string") {
      const clean = value.split(" ")[0]; // remove time

      // ✅ D-M-YY  →  8-1-26 = 8 Jan 2026
      if (/^\d{1,2}-\d{1,2}-\d{2}$/.test(clean)) {
        let [day, month, year] = clean.split("-");
        year = Number(year) + 2000; // 26 → 2026
        return new Date(year, month - 1, day);
      }

      // ✅ D/M/YYYY
      if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(clean)) {
        const [day, month, year] = clean.split("/");
        return new Date(year, month - 1, day);
      }

      // ✅ YYYY-MM-DD (fallback)
      if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
        const [year, month, day] = clean.split("-");
        return new Date(year, month - 1, day);
      }
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
      .map((row) => {
        console.log(row.created);
        return parseImpactDate(row.created);
      })
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
      <h2>📁 Upload Rakuten MaxMania Report</h2>

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
