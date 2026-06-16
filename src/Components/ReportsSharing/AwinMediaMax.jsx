import React, { useState } from "react";
import Papa from "papaparse";
import { saveAs } from "file-saver";

const Campaigns = [
  {
    name: "Trivago USA",
    payoutPercent: 80,
    publisher: "Dealism",
  },
  {
    name: "Trivago UK",
    payoutPercent: 80,
    publisher: "Dealism",
  },
  {
    name: "Brittany Ferries UK",
    payoutPercent: 80,
    publisher: "Dealism",
  },
  {
    name: "El Corte Ingles ES",
    payoutPercent: 80,
    publisher: "Dealism",
  },
];

export default function AwinMediaMaxReportSharing() {
  const [rawData, setRawData] = useState([]);
  const [brands, setBrands] = useState([]);
  const [groupedData, setGroupedData] = useState({});

  const parseDate = (dateStr) => {
    if (!dateStr) return new Date(0);

    const parsed = new Date(dateStr);

    if (!isNaN(parsed)) {
      return parsed;
    }

    return new Date(0);
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

  const handleUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,

      complete: (results) => {
        const csvData = results.data;

        const filteredRows = csvData.filter((row) =>
          Campaigns.some((campaign) => campaign.name === row.site_name?.trim()),
        );

        setRawData(filteredRows);

        const uniqueBrands = [
          ...new Set(filteredRows.map((row) => row.site_name?.trim())),
        ];

        setBrands(uniqueBrands);

        const brandWise = {};

        uniqueBrands.forEach((brand) => {
          const campaign = Campaigns.find((c) => c.name === brand);

          if (!campaign) return;

          const rows = filteredRows
            .filter((row) => row.site_name?.trim() === brand)
            .map((row) => {
              const payout =
                (parseFloat(row.commission || 0) * campaign.payoutPercent) /
                100;

              const newRow = {};

              Object.keys(row).forEach((key) => {
                if (key === "commission") {
                  newRow["Payout(USD)"] = payout.toFixed(10);
                } else {
                  newRow[key] = row[key];
                }
              });

              return newRow;
            })
            .sort((a, b) => parseDate(a.date) - parseDate(b.date));

          brandWise[brand] = rows;
        });

        setGroupedData(brandWise);
      },
    });
  };

  const handleDownloadCSV = (brand) => {
    const data = groupedData[brand];

    if (!data?.length) return;

    const dates = data
      .map((row) => parseDate(row.date))
      .filter((d) => !isNaN(d));

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
      <h2>📁 Upload Awin MediaMax Report</h2>

      <input type="file" accept=".csv" onChange={handleUpload} />

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
            {JSON.stringify(groupedData[brand]?.slice(0, 5), null, 2)}
          </pre>
        </div>
      ))}
    </div>
  );
}
