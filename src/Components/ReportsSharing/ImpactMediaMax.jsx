import React, { useState } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { saveAs } from "file-saver";

const Campaigns = [
  {
    name: "Network Solutions Affiliate Programs",
    payoutPercent: 80,
    publisher: "AM Tech",
  },
  {
    name: "Ro",
    payoutPercent: 80,
    publisher: "AM Tech",
  },
  {
    name: "Hims, Inc.",
    payoutPercent: 80,
    publisher: "AM Tech",
  },
  {
    name: "Hers, Inc.",
    payoutPercent: 80,
    publisher: "AM Tech",
  },
  {
    name: "ezCater",
    payoutPercent: 80,
    publisher: "AM Tech",
  },

  {
    name: "Udemy",
    payoutPercent: 80,
    publisher: "Raffesia Sahil",
  },

  {
    name: "Lenme",
    payoutPercent: 80,
    publisher: "ViralSpot",
  },
  {
    name: "Pogo",
    payoutPercent: 80,
    publisher: "ViralSpot",
  },

  {
    name: "FitVille-DE",
    payoutPercent: 90,
    publisher: "ClickOrbit Vratika",
  },
  {
    name: "FitVille-UK",
    payoutPercent: 90,
    publisher: "ClickOrbit Vratika",
  },

  {
    name: "Boden DE",
    payoutPercent: 80,
    publisher: "Dealism",
  },
  {
    name: "Hers, Inc.",
    payoutPercent: 80,
    publisher: "Dealism",
  },

  {
    name: "Airpaz",
    payoutPercent: 80,
    publisher: "Levitadz",
  },
  {
    name: "BetterHelp",
    payoutPercent: 80,
    publisher: "Levitadz",
  },

  {
    name: "Coursera B2C Affiliate Program",
    payoutPercent: 80,
    publisher: "Sachin Sharma",
  },
];

export default function ImpactMediaMaxReport() {
  const [rawData, setRawData] = useState([]);
  const [brands, setBrands] = useState([]);
  const [groupedData, setGroupedData] = useState({});

  const parseImpactDate = (value) => {
    if (!value) return null;

    if (value instanceof Date && !isNaN(value)) {
      return new Date(value.getFullYear(), value.getMonth(), value.getDate());
    }

    if (typeof value === "number") {
      const excelEpoch = new Date(1899, 11, 30);
      const date = new Date(excelEpoch.getTime() + value * 86400000);

      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

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

    if (startDay === endDay && startMonth === endMonth) {
      return `${startDay} ${monthFormatter(start)} ${year}`;
    }

    if (startMonth === endMonth) {
      return `${startDay}-${endDay} ${monthFormatter(start)} ${year}`;
    }

    return `${startDay} ${monthFormatter(
      start,
    )} - ${endDay} ${monthFormatter(end)} ${year}`;
  };

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (evt) => {
      const workbook = XLSX.read(evt.target.result, {
        type: "array",
      });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      const filteredRows = jsonData.filter((row) =>
        Campaigns.some((campaign) => campaign.name === row.Brand?.trim()),
      );

      setRawData(filteredRows);

      const uniqueBrands = [
        ...new Set(filteredRows.map((row) => row.Brand.trim())),
      ];

      setBrands(uniqueBrands);

      const brandWise = {};

      uniqueBrands.forEach((brand) => {
        const campaign = Campaigns.find((c) => c.name === brand);

        if (!campaign) return;

        const rows = filteredRows
          .filter((row) => row.Brand.trim() === brand)
          .map((row) => {
            const payout =
              (parseFloat(row["Action Earnings"] || 0) *
                campaign.payoutPercent) /
              100;

            const newRow = {};

            Object.keys(row).forEach((key) => {
              if (key === "Action Earnings") {
                newRow["Payout(USD)"] = payout.toFixed(10);
              } else {
                newRow[key] = row[key];
              }
            });

            return newRow;
          })
          .sort(
            (a, b) =>
              parseImpactDate(a["Action Date"]) -
              parseImpactDate(b["Action Date"]),
          );

        brandWise[brand] = rows;
      });

      setGroupedData(brandWise);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleDownloadCSV = (brand) => {
    const data = groupedData[brand];

    if (!data?.length) return;

    const campaign = Campaigns.find((c) => c.name === brand);

    if (!campaign) return;

    const dates = data
      .map((row) => parseImpactDate(row["Action Date"]))
      .filter(Boolean);

    const dateRange = dates.length ? formatDateRange(dates) : "";

    const fileName = `${brand} ${dateRange}.csv`;

    const csv = Papa.unparse(data);

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    saveAs(blob, fileName);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📁 Upload Impact MediaMax Report</h2>

      <input type="file" accept=".xlsx" onChange={handleExcelUpload} />

      {rawData.length > 0 && (
        <>
          <h3>✅ Matching Rows - {rawData.length}</h3>

          <pre
            style={{
              background: "#444",
              padding: "10px",
              maxHeight: "200px",
              overflowY: "auto",
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
            📌{Campaigns.find((c) => c.name === brand)?.publisher} {" - "}{" "}
            {brand} ({Campaigns.find((c) => c.name === brand)?.payoutPercent}
            %)
            {" — "}
            {groupedData[brand]?.length || 0} rows
          </h4>

          <button onClick={() => handleDownloadCSV(brand)}>
            ⬇️ Download CSV
          </button>

          <pre
            style={{
              background: "#111",
              color: "#0f0",
              padding: "10px",
              maxHeight: "200px",
              overflowY: "auto",
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
