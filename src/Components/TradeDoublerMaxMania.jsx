import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { saveAs } from "file-saver";

const Campaigns = [
  {
    name: "Hugendubel",
    Id: 2025,
  },
  {
    name: "Irish Ferries DE",
    Id: 2520,
  },

  {
    // name: "Avanti Travel Insurance",
    Id: 2416,
  },
  {
    // name: "Billiger Mietwagen",
    Id: 2414,
  },
  {
    // name: "Destinia UK",
    Id: 2418,
  },
  {
    // name: "Eurowings ES",
    Id: 2421,
  },
  {
    // name: "Falke DE",
    Id: 1683,
  },
  {
    // name: "getyourguide.fr",
    Id: 2411,
  },
  {
    // name: "Lycamobile",
    Id: 2371,
  },
  {
    // name: "Tamaris DE",
    Id: 1684,
  },
  {
    // name: "Teletext Holidays",
    Id: 2419,
  },
  {
    // name: "Promovacances",
    Id: 1689,
  },
  {
    // name: "ArmedAngels DE",
    Id: 2407,
  },
  {
    // name: "Bonprix SE",
    Id: 2409,
  },
  {
    // name: "Best Western",
    Id: 2519,
  },
  {
    // name: "AutoEurope",
    Id: 2415,
  },
  {
    // name: "Open Ferry UK",
    Id: 2568,
  },
  {
    // name: "eDreams",
    Id: 2452,
  },
];

export default function TradeDoublerMaxMania() {
  const [rawData, setRawData] = useState([]);
  const [brands, setBrands] = useState([]);
  const [groupedData, setGroupedData] = useState({});
  const [customFileName, setCustomFileName] = useState("");

  const mapTradeDoublerRow = (row, campaign) => {
    const actionEarning = parseFloat(row["commission"]);

    if (campaign.Id === 2416 && campaign.name === "Avanti Travel Insurance") {
      return {
        p1: row["epi2"].split("_")[1],
        created: row["timeOfTransaction"],
        txn_id: row["transactionId"],
        sale_amount: row["orderValue"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["epi2"].split("_")[0],
        status: row["epi2"].split("_")[0] === "77" ? "Pending" : "Approved",
        sub1: row["orderNumber"],
        device_id: row["mobileDeviceType"] || "unknown",
      };
    } else if (campaign.Id === 2414 && campaign.name === "Billiger Mietwagen") {
      return {
        p1: row["epi2"].split("_")[1],
        created: row["timeOfTransaction"],
        txn_id: row["transactionId"],
        sale_amount: row["orderValue"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["epi2"].split("_")[0],
        status: row["epi2"].split("_")[0] === "77" ? "Pending" : "Approved",
        sub1: row["orderNumber"],
        device_id: row["mobileDeviceType"] || "unknown",
      };
    } else if (campaign.Id === 2418 && campaign.name === "Destinia UK") {
      return {
        p1: row["epi2"].split("_")[1],
        created: row["timeOfTransaction"],
        txn_id: row["transactionId"],
        sale_amount: row["orderValue"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["epi2"].split("_")[0],
        status: row["epi2"].split("_")[0] === "77" ? "Pending" : "Approved",
        sub1: row["orderNumber"],
        device_id: row["mobileDeviceType"] || "unknown",
      };
    } else if (campaign.Id === 2421 && campaign.name === "Eurowings ES") {
      return {
        p1: row["epi2"].split("_")[1],
        created: row["timeOfTransaction"],
        txn_id: row["transactionId"],
        sale_amount: row["orderValue"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: row["epi2"].split("_")[0] === "77" ? campaign.Id : 2064,
        publisher_id: row["epi2"].split("_")[0],
        status: row["epi2"].split("_")[0] === "77" ? "Pending" : "Approved",
        sub1: row["orderNumber"],
        device_id: row["mobileDeviceType"] || "unknown",
      };
    } else if (campaign.Id === 1683 && campaign.name === "Falke DE") {
      return {
        p1: row["epi"],
        created: row["timeOfTransaction"],
        txn_id: row["transactionId"],
        sale_amount: row["orderValue"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["epi2"],
        status: row["epi2"].split("_")[0] === "77" ? "Pending" : "Approved",
        sub1: row["orderNumber"],
        device_id: row["mobileDeviceType"] || "unknown",
      };
    } else if (campaign.Id === 2411 && campaign.name === "getyourguide.fr") {
      return {
        p1: row["epi2"].split("_")[1],
        created: row["timeOfTransaction"],
        txn_id: row["transactionId"],
        sale_amount: row["orderValue"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["epi2"].split("_")[0],
        status: row["epi2"].split("_")[0] === "77" ? "Pending" : "Approved",
        sub1: row["orderNumber"],
        device_id: row["mobileDeviceType"] || "unknown",
      };
    } else if (campaign.Id === 2371 && campaign.name === "Lycamobile") {
      return {
        // p1: row["epi2"].split("_")[1],
        created: row["timeOfTransaction"],
        txn_id: row["transactionId"],
        sale_amount: row["orderValue"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: 212,
        status: "Approved",
        sub1: row["orderNumber"],
        device_id: row["mobileDeviceType"] || "unknown",
      };
    } else if (campaign.Id === 1684 && campaign.name === "Tamaris DE") {
      return {
        p1: row["epi"].split("_")[1],
        created: row["timeOfTransaction"],
        txn_id: row["transactionId"],
        sale_amount: row["orderValue"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["epi"],
        status: row["epi"].split("_")[0] === "77" ? "Pending" : "Approved",
        sub1: row["orderNumber"],
        device_id: row["mobileDeviceType"] || "unknown",
      };
    } else if (campaign.Id === 2419 && campaign.name === "Teletext Holidays") {
      return {
        p1: row["epi2"].split("_")[1],
        created: row["timeOfTransaction"],
        txn_id: row["transactionId"],
        sale_amount: row["orderValue"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["epi2"].split("_")[0],
        status: row["epi2"].split("_")[0] === "77" ? "Pending" : "Approved",
        sub1: row["epi"],
        device_id: row["mobileDeviceType"] || "unknown",
      };
    } else if (campaign.Id === 2025 && campaign.name === "Hugendubel") {
      return {
        created: row["timeOfTransaction"],
        txn_id: row["transactionId"],
        sale_amount: row["orderValue"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["epi2"].split("_")[0],
        status: row["epi2"].split("_")[0] === "77" ? "Pending" : "Approved",
        sub1: row["orderNumber"],
        device_id: row["mobileDeviceType"] || "unknown",
      };
    } else if (campaign.Id === 1689 && campaign.name === "Promovacances") {
      return {
        created: row["timeOfTransaction"],
        txn_id: row["transactionId"],
        sale_amount: row["orderValue"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["epi"],
        status: row["epi"].split("_")[0] === "77" ? "Pending" : "Approved",
        sub1: row["orderNumber"],
        device_id: row["mobileDeviceType"] || "unknown",
      };
    } else if (campaign.Id === 2407 && campaign.name === "ArmedAngels DE") {
      return {
        p1: row["epi2"].split("_")[1],
        created: row["timeOfTransaction"],
        txn_id: row["transactionId"],
        sale_amount: row["orderValue"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["epi2"].split("_")[0],
        status: row["epi2"].split("_")[0] === "77" ? "Pending" : "Approved",
        sub1: row["orderNumber"],
        device_id: row["mobileDeviceType"] || "unknown",
      };
    } else if (campaign.Id === 2409 && campaign.name === "Bonprix SE") {
      return {
        created: row["timeOfTransaction"],
        txn_id: row["transactionId"],
        sale_amount: row["orderValue"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["epi"],
        status: row["epi"].split("_")[0] === "77" ? "Pending" : "Approved",
        sub1: row["orderNumber"],
        device_id: row["mobileDeviceType"] || "unknown",
      };
    } else if (campaign.Id === 2520 && campaign.name === "Irish Ferries DE") {
      return {
        p1: row["epi"].split("_")[1],
        created: row["timeOfTransaction"],
        txn_id: row["transactionId"],
        sale_amount: row["orderValue"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["epi"].split("_")[0],
        status: row["epi"].split("_")[0] === "77" ? "Pending" : "Approved",
        sub1: row["orderNumber"],
        device_id: row["mobileDeviceType"] || "unknown",
      };
    } else if (campaign.Id === 2519 && campaign.name === "Best Western") {
      return {
        p1: row["epi"].split("_")[1],
        created: row["timeOfTransaction"],
        txn_id: row["transactionId"],
        sale_amount: row["orderValue"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["epi"].split("_")[0],
        status: row["epi"].split("_")[0] === "77" ? "Pending" : "Approved",
        sub1: row["orderNumber"],
        device_id: row["mobileDeviceType"] || "unknown",
      };
    } else if (campaign.Id === 2415 && campaign.name === "AutoEurope") {
      return {
        p1: row["epi2"].split("_")[1],
        created: row["timeOfTransaction"],
        txn_id: row["transactionId"],
        sale_amount: row["orderValue"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["epi2"].split("_")[0],
        status: row["epi2"].split("_")[0] === "77" ? "Pending" : "Approved",
        sub1: row["orderNumber"],
        device_id: row["mobileDeviceType"] || "unknown",
      };
    } else if (campaign.Id === 2452 && campaign.name === "eDreams") {
      return {
        // p1: row["epi2"].split("_")[1],
        created: row["timeOfTransaction"],
        txn_id: row["transactionId"],
        sale_amount: row["orderValue"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["epi2"].split("_")[0],
        status: row["epi2"].split("_")[0] === "77" ? "Pending" : "Approved",
        sub1: row["orderNumber"],
        device_id: row["mobileDeviceType"] || "unknown",
      };
    } else if (campaign.Id === 2568 && campaign.name === "Open Ferry UK") {
      return {
        p1: row["epi"].split("_")[1],
        created: row["timeOfTransaction"],
        txn_id: row["transactionId"],
        sale_amount: row["orderValue"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["epi"].split("_")[0],
        status: row["epi"].split("_")[0] === "77" ? "Pending" : "Approved",
        sub1: row["orderNumber"],
        device_id: row["mobileDeviceType"] || "unknown",
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
          .filter((row) => row.programName && row.programName.trim() !== "")
          .filter((row) => row["commission"] !== 0);
        setRawData(cleaned);

        // 🔍 Extract unique brands
        const uniqueBrands = [
          ...new Set(cleaned.map((row) => row.programName.trim())),
        ];
        setBrands(uniqueBrands);

        // 🔄 Group by brand and map data
        const brandWise = {};
        uniqueBrands.forEach((brand) => {
          const brandRows = cleaned.filter(
            (row) => row.programName.trim() === brand,
          );
          const config = Campaigns.find((c) => c.name === brand);

          if (!config) {
            console.warn(`No campaign config found for brand: ${brand}`);
            return;
          }

          brandWise[brand] = brandRows.map((row) =>
            mapTradeDoublerRow(row, config),
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
      <h2>📁 Upload TradeDoubler MaxMania Report</h2>

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
