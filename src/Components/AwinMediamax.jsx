import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { saveAs } from "file-saver";

const Campaigns = [
  {
    name: "Brittany Ferries UK",
    Id: 2515,
  },
  {
    name: "El Corte Ingles ES",
    Id: 2590,
  },
  {
    name: "Trivago USA",
    Id: 2629,
  },
  {
    name: "Trivago UK",
    Id: 2628,
  },
  {
    name: "Cottages.com",
    Id: 2600,
  },

  {
    // name: "Hume Health US",
    Id: 2565,
  },
];

export default function AwinMediamax() {
  const [rawData, setRawData] = useState([]);
  const [brands, setBrands] = useState([]);
  const [groupedData, setGroupedData] = useState({});
  const [customFileName, setCustomFileName] = useState("");

  const mapPartnerizeRow = (row, campaign) => {
    const actionEarning = parseFloat(row["commission"]);

    if (campaign.Id === 2515 && campaign.name === "Brittany Ferries UK") {
      return {
        created: row["date"],
        txn_id: row["id"],
        sale_amount: row["sale_amount"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "GBP",
        campaign_id: campaign.Id,
        publisher_id: row["click_ref"],
        status: row["click_ref"] === "77" ? "Pending" : "Approved",
        // sub1: row["clickref"],
        device_id: row["click_device"] || "unknown",
      };
    } else if (campaign.Id === 2600 && campaign.name === "Cottages.com") {
      return {
        created: row["date"],
        txn_id: row["id"],
        sale_amount: row["sale_amount"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "GBP",
        campaign_id: campaign.Id,
        publisher_id: row["click_ref"],
        status: row["click_ref"] === "77" ? "Pending" : "Approved",
        // sub1: row["clickref"],
        device_id: row["click_device"] || "unknown",
      };
    } else if (campaign.Id === 2628 && campaign.name === "Trivago UK") {
      return {
        created: row["date"],
        txn_id: row["id"],
        sale_amount: row["sale_amount"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "GBP",
        campaign_id: campaign.Id,
        publisher_id: row["click_ref"],
        status: row["click_ref"] === "77" ? "Pending" : "Approved",
        // sub1: row["clickref"],
        device_id: row["click_device"] || "unknown",
      };
    } else if (campaign.Id === 2629 && campaign.name === "Trivago USA") {
      return {
        created: row["date"],
        txn_id: row["id"],
        sale_amount: row["sale_amount"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["click_ref"],
        status: row["click_ref"] === "77" ? "Pending" : "Approved",
        // sub1: row["clickref"],
        device_id: row["click_device"] || "unknown",
      };
    } else if (campaign.Id === 2565 && campaign.name === "Hume Health US") {
      return {
        p1: row["click_ref3"],
        created: row["date"],
        txn_id: row["id"],
        sale_amount: row["sale_amount"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: "",
        status: "Pending",
        // sub1: row["clickref"],
        device_id: row["click_device"] || "unknown",
      };
    } else if (campaign.Id === 2590 && campaign.name === "El Corte Ingles ES") {
      return {
        created: row["date"],
        txn_id: row["id"],
        sale_amount: row["sale_amount"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "EUR",
        campaign_id: campaign.Id,
        publisher_id: row["click_ref"],
        status: row["click_ref"] === "77" ? "Pending" : "Approved",
        // sub1: row["clickref"],
        device_id: row["click_device"] || "unknown",
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
              (row) => parseFloat(row["commission"] || 0) > 0,
            );
            setRawData(cleaned);

            // 🔍 Extract unique brands
            const uniqueBrands = [
              ...new Set(cleaned.map((row) => row.site_name.trim())),
            ];
            setBrands(uniqueBrands);

            // 🔄 Group by brand and map data
            const brandWise = {};
            uniqueBrands.forEach((brand) => {
              const brandRows = cleaned.filter(
                (row) => row.site_name.trim() === brand,
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

  const parseAwinDate = (value) => {
    if (!value) return null;

    if (typeof value === "string") {
      // "2026-01-08 16:31:00" → "2026-01-08"
      const dateOnly = value.split(" ")[0];

      const [year, month, day] = dateOnly.split("-");

      return new Date(Number(year), Number(month) - 1, Number(day));
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

    // 🔍 Campaign config
    const campaign = Campaigns.find((c) => c.name === brand);

    // 📅 Extract & parse dates
    const dates = data
      .map((row) => {
        console.log(row.created);

        return parseAwinDate(row.created);
      })
      .filter(Boolean);

    const dateRange = dates.length ? formatDateRange(dates) : "";

    // 📝 Auto filename
    const fileName = customFileName
      ? `${customFileName}.csv`
      : `${brand} (${campaign?.Id}) ${dateRange}.csv`;

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, fileName);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📁 Upload Awin Mediamax Report</h2>

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
