import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { saveAs } from "file-saver";

const Campaigns = [
  {
    name: "12Go Asia Pte., Ltd.",
    Id: 2989,
  },
  {
    name: "AARP",
    Id: 2119,
  },
  {
    name: "Airpaz",
    Id: 2779,
  },
  {
    name: "Boden DE",
    Id: 2027,
  },
  {
    name: "Boden USA",
    Id: 2851,
  },
  {
    name: "Contiki",
    Id: 2065,
  },
  {
    name: "en route jewelry",
    Id: 2812,
  },
  {
    name: "Express LLC",
    Id: 2566,
  },
  {
    name: "Fabletics Performance",
    Id: 2752,
  },
  {
    name: "Helium 10",
    Id: 2759,
  },
  {
    name: "Hill House Home",
    Id: 2829,
  },
  {
    name: "HostGator.com",
    Id: 1705,
  },
  {
    name: "JJ's House",
    Id: 2720,
  },
  {
    name: "JustAnswer",
    Id: 2856,
  },
  {
    name: "New Balance Athletics, Inc.",
    Id: 2978,
  },
  {
    name: "Nomad eSIM",
    Id: 2741,
  },
  {
    name: "Omio Travel Partner Program",
    Id: 2984,
  },
  {
    name: "QVC - US",
    Id: 2751,
  },
  {
    name: "Remitly",
    Id: 2728,
  },
  {
    name: "Rothy's",
    Id: 2733,
  },
  {
    name: "Super.com - Travel",
    Id: 2793,
  },
  {
    name: "Uniform Advantage",
    Id: 2715,
  },
  {
    name: "Upstart Personal Loans",
    Id: 2990,
  },
  {
    name: "Whatnot Affiliates",
    Id: 2970,
  },
  {
    name: "Carwow UK",
    Id: 2254,
  },
  {
    name: "Firefly",
    Id: 2802,
  },
];

export default function ImpactMaxMania() {
  const [rawData, setRawData] = useState([]);
  const [brands, setBrands] = useState([]);
  const [groupedData, setGroupedData] = useState({});
  const [customFileName, setCustomFileName] = useState("");

  const mapImpactRow = (row, campaign) => {
    const actionEarning = parseFloat(row["Action Earnings"]);

    if (campaign.Id === 2989 && campaign.name === "12Go Asia Pte., Ltd.") {
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
    } else if (campaign.Id === 2119 && campaign.name === "AARP") {
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
    } else if (campaign.Id === 2779 && campaign.name === "Airpaz") {
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
        sub1: row["Sub Id 1"],
        device_id: row["Device Type"] || "unknown",
      };
    } else if (campaign.Id === 2027 && campaign.name === "Boden DE") {
      return {
        // p1: row["Sub Id 1"],
        created: row["Action Date"],
        txn_id: row["Action Id"],
        sale_amount: row["Sale Amount"],
        revenue: actionEarning,
        payout: ((actionEarning * 90) / 100).toFixed(10),
        payout_currency: "USD",
        campaign_id: campaign.Id,
        publisher_id: row["Sub Id 1"],
        status: row["Sub Id 1"] === "77" ? "Pending" : "Approved",
        // sub1: row["Sub Id 1"],
        device_id: row["Device Type"] || "unknown",
      };
    } else if (campaign.Id === 2851 && campaign.name === "Boden USA") {
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
    } else if (campaign.Id === 2812 && campaign.name === "en route jewelry") {
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
    } else if (
      campaign.Id === 2752 &&
      campaign.name === "Fabletics Performance"
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
    } else if (campaign.Id === 2759 && campaign.name === "Helium 10") {
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
    } else if (campaign.Id === 2829 && campaign.name === "Hill House Home") {
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
    } else if (campaign.Id === 1705 && campaign.name === "HostGator.com") {
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
    } else if (campaign.Id === 2720 && campaign.name === "JJ's House") {
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
    } else if (campaign.Id === 2856 && campaign.name === "JustAnswer") {
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
    } else if (
      campaign.Id === 2978 &&
      campaign.name === "New Balance Athletics, Inc."
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
    } else if (campaign.Id === 2741 && campaign.name === "Nomad eSIM") {
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
      campaign.Id === 2984 &&
      campaign.name === "Omio Travel Partner Program"
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
    } else if (campaign.Id === 2751 && campaign.name === "QVC - US") {
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
        sub1: row["Sub Id 1"],
        device_id: row["Device Type"] || "unknown",
      };
    } else if (campaign.Id === 2728 && campaign.name === "Remitly") {
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
    } else if (campaign.Id === 2733 && campaign.name === "Rothy's") {
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
    } else if (campaign.Id === 2793 && campaign.name === "Super.com - Travel") {
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
    } else if (campaign.Id === 2715 && campaign.name === "Uniform Advantage") {
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
    } else if (
      campaign.Id === 2990 &&
      campaign.name === "Upstart Personal Loans"
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
    } else if (campaign.Id === 2970 && campaign.name === "Whatnot Affiliates") {
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
    } else if (campaign.Id === 2254 && campaign.name === "Carwow UK") {
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
    } else if (campaign.Id === 2802 && campaign.name === "Firefly") {
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
