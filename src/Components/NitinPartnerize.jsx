import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { saveAs } from "file-saver";

const Campaigns = [
  {
    name: "Vrbo UK",
    Id: 2738,
  },
  {
    name: "Expedia US",
    Id: 2740,
  },
  {
    name: "Hotels.com USA",
    Id: 2739,
  },
];

export default function NitinPartnerize() {
  const [rawData, setRawData] = useState([]);
  const [brands, setBrands] = useState([]);
  const [groupedData, setGroupedData] = useState({});
  const [customFileName, setCustomFileName] = useState("");

  const mapCampaignRow = (row, campaign) => {
    const actionEarning = parseFloat(row["publisher_commission"]);

    if (campaign.Id === 2738 && campaign.name === "Vrbo UK") {
      return {
        p1: row["publisher_reference"],
        created: row["conversion_date"],
        txn_id: row["conversion_id"],
        sale_amount: row["value"],
        revenue: ((actionEarning * 75) / 100).toFixed(10),
        payout: ((((actionEarning * 75) / 100) * 90) / 100).toFixed(10),
        payout_currency: row["currency"].split(" ")[0],
        campaign_id: campaign.Id,
        publisher_id: row["advertiser_reference"],
        status: row["advertiser_reference"] === "77" ? "Pending" : "Approved",
        sub1: row["clickref"],
        device_id: row["ref_device"] || "unknown",
      };
    } else if (campaign.Id === 2740 && campaign.name === "Expedia US") {
      return {
        p1: row["publisher_reference"],
        created: row["conversion_date"],
        txn_id: row["conversion_id"],
        sale_amount: row["value"],
        revenue: ((actionEarning * 75) / 100).toFixed(10),
        payout: ((((actionEarning * 75) / 100) * 90) / 100).toFixed(10),
        payout_currency: row["currency"].split(" ")[0],
        campaign_id: campaign.Id,
        publisher_id: row["advertiser_reference"],
        status: row["advertiser_reference"] === "77" ? "Pending" : "Approved",
        sub1: row["clickref"],
        device_id: row["ref_device"] || "unknown",
      };
    } else if (campaign.Id === 2739 && campaign.name === "Hotels.com USA") {
      return {
        p1: row["publisher_reference"],
        created: row["conversion_date"],
        txn_id: row["conversion_id"],
        sale_amount: row["value"],
        revenue: ((actionEarning * 75) / 100).toFixed(10),
        payout: ((((actionEarning * 75) / 100) * 90) / 100).toFixed(10),
        payout_currency: row["currency"].split(" ")[0],
        campaign_id: campaign.Id,
        publisher_id: row["advertiser_reference"],
        status: row["advertiser_reference"] === "77" ? "Pending" : "Approved",
        sub1: row["clickref"],
        device_id: row["ref_device"] || "unknown",
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

        const cleaned = jsonData.filter(
          (row) => row.campaign_title && row.campaign_title.trim() !== "",
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
            mapCampaignRow(row, config),
          );
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
      <h2>📁 Upload Nitin MMads Report</h2>

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
