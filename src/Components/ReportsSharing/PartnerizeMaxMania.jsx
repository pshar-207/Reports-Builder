import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { saveAs } from "file-saver";

const Campaigns = [
  {
    name: "viagogo",
    payoutPercent: 80,
    publisher: "Sachin Sharma",
  },
];
export default function PartnerizeMaxManiaReportSharing() {
  const [rawData, setRawData] = useState([]);
  const [brands, setBrands] = useState([]);
  const [groupedData, setGroupedData] = useState({});
  const [customFileName, setCustomFileName] = useState("");

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
            const filteredRows = csvData.filter((row) =>
              Campaigns.some(
                (campaign) => campaign.name === row.campaign_title?.trim(),
              ),
            );

            setRawData(filteredRows);

            const uniqueBrands = [
              ...new Set(filteredRows.map((row) => row.campaign_title?.trim())),
            ];

            setBrands(uniqueBrands);

            const brandWise = {};

            uniqueBrands.forEach((brand) => {
              const campaign = Campaigns.find((c) => c.name === brand);

              if (!campaign) return;

              const rows = filteredRows
                .filter((row) => row.campaign_title?.trim() === brand)
                .map((row) => {
                  const payout =
                    (parseFloat(row.publisher_commission || 0) *
                      campaign.payoutPercent) /
                    100;

                  const newRow = {};

                  Object.keys(row).forEach((key) => {
                    if (key === "publisher_commission") {
                      newRow["Payout(USD)"] = payout.toFixed(10);
                    } else {
                      newRow[key] = row[key];
                    }
                  });

                  return newRow;
                })
                .sort(
                  (a, b) =>
                    parsePartnerizeDate(a.conversion_date) -
                    parsePartnerizeDate(b.conversion_date),
                );

              brandWise[brand] = rows;
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
      .map((row) => parsePartnerizeDate(row.conversion_date))
      .filter(Boolean);

    const dateRange = dates.length ? formatDateRange(dates) : "";

    // 📝 Final auto filename
    const fileName = customFileName
      ? `${customFileName}.csv`
      : `${brand} ${dateRange}.csv`;

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, fileName);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📁 Upload Partnerize MaxMania Report</h2>

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
            📌
            {Campaigns.find((c) => c.name === brand)?.publisher}
            {" - "}
            {brand}
            {" ("}
            {Campaigns.find((c) => c.name === brand)?.payoutPercent}
            %)
            {" — "}
            {groupedData[brand]?.length || 0} rows
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
