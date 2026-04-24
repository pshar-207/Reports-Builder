import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { saveAs } from "file-saver";

const Campaigns = [
  {
    name: "Booking.com LATAM",
    Id: 2545,
  },
  {
    name: "Booking.com North America",
    Id: 1605,
  },
  {
    name: "Lufthansa.com",
    Id: 2555,
  },
  {
    name: "Turkish Airlines",
    Id: 2017,
  },
  {
    name: "Dorothy Perkins UK",
    Id: 2541,
  },
  {
    name: "Trivago UK",
    Id: 2772,
  },
];

export default function OctaadsMedia() {
  const [rawData, setRawData] = useState([]);
  const [brands, setBrands] = useState([]);
  const [groupedData, setGroupedData] = useState({});
  const [customFileName, setCustomFileName] = useState("");

  const mapOctaadsMediaRow = (row, campaign) => {
    const actionEarning = parseFloat(row["MMAds Commission"]);

    if (campaign.Id === 2545 && campaign.name === "Booking.com LATAM") {
      return {
        p1: row["click_ref2"],
        created: row["date"],
        txn_id: row["id"],
        sale_amount: row["sale_amount"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: row["Currency"],
        campaign_id: campaign.Id,
        publisher_id: row["click_ref2"],
        status: row["click_ref2"] === "77" ? "Pending" : "Approved",
        // sub1: row["clickref"],
        device_id: row["click_device"] || "unknown",
      };
    } else if (
      campaign.Id === 1605 &&
      campaign.name === "Booking.com North America"
    ) {
      return {
        p1: row["click_ref3"],
        created: row["date"],
        txn_id: row["id"],
        sale_amount: row["sale_amount"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: row["Currency"],
        campaign_id: campaign.Id,
        publisher_id: row["click_ref2"],
        status: row["click_ref2"] === "77" ? "Pending" : "Approved",
        // sub1: row["clickref"],
        device_id: row["click_device"] || "unknown",
      };
    } else if (campaign.Id === 2541 && campaign.name === "Dorothy Perkins UK") {
      return {
        p1: row["click_ref3"],
        created: row["date"],
        txn_id: row["id"],
        sale_amount: row["sale_amount"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: row["Currency"],
        campaign_id: campaign.Id,
        publisher_id: row["click_ref2"],
        status: row["click_ref2"] === "77" ? "Pending" : "Approved",
        // sub1: row["clickref"],
        device_id: row["click_device"] || "unknown",
      };
    } else if (campaign.Id === 2772 && campaign.name === "Trivago UK") {
      return {
        p1: row["click_ref3"],
        created: row["date"],
        txn_id: row["id"],
        sale_amount: row["sale_amount"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: row["Currency"],
        campaign_id: campaign.Id,
        publisher_id: row["click_ref2"],
        status: row["click_ref2"] === "77" ? "Pending" : "Approved",
        // sub1: row["clickref"],
        device_id: row["click_device"] || "unknown",
      };
    }
  };

  const mapOctaadsLufthansaRow = (row, campaign) => {
    const actionEarning = parseFloat(row["MMAds Payout"]);

    if (campaign.Id === 2555 && campaign.name === "Lufthansa.com") {
      return {
        p1: row["Affiliate Sub ID 1"],
        created: row["Date"],
        txn_id: row["Transaction ID"],
        sale_amount: row["Sale Amount"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: row["Currency"],
        campaign_id: campaign.Id,
        publisher_id: "",
        status: "Pending",
        // sub1: row["clickref"],
        device_id: row["Device Type"] || "unknown",
      };
    }
  };

  const mapOctaadsTurkishAirlinesRow = (row, campaign) => {
    const actionEarning = parseFloat(row["MMAds Total Commission"]);

    if (campaign.Id === 2017 && campaign.name === "Turkish Airlines") {
      return {
        p1: "",
        created: row["Transaction Date"],
        txn_id: row["Transaction ID"],
        sale_amount: row["Gross Sales"],
        revenue: actionEarning,
        payout: ((actionEarning * 80) / 100).toFixed(10),
        payout_currency: row["Currency"],
        campaign_id: campaign.Id,
        publisher_id: "",
        status: "Pending",
        sub1: row["Order ID"],
        device_id: row["Device"] || "unknown",
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

            if (csvData[0].Offer == "Lufthansa.com") {
              const cleaned = csvData.filter(
                (row) => parseFloat(row["MMAds Payout"] || 0) > 0,
              );
              setRawData(cleaned);

              // 🔍 Extract unique brands
              const uniqueBrands = [
                ...new Set(cleaned.map((row) => row.Offer.trim())),
              ];
              setBrands(uniqueBrands);

              // 🔄 Group by brand and map data
              const brandWise = {};
              uniqueBrands.forEach((brand) => {
                const brandRows = cleaned.filter(
                  (row) => row.Offer.trim() === brand,
                );
                const config = Campaigns.find((c) => c.name === brand);

                if (!config) {
                  console.warn(`No campaign config found for brand: ${brand}`);
                  return;
                }

                brandWise[brand] = brandRows.map((row) =>
                  mapOctaadsLufthansaRow(row, config),
                );
              });

              setGroupedData(brandWise);
            } else {
              const cleaned = csvData.filter(
                (row) => parseFloat(row["MMAds Commission"] || 0) > 0,
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
                  mapOctaadsMediaRow(row, config),
                );
              });

              setGroupedData(brandWise);
            }
          },
        });
      };
      reader.readAsText(file);
    } else if (extension === "xlsx") {
      reader.onload = (evt) => {
        const workbook = XLSX.read(evt.target.result, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        if (jsonData[0]["Advertiser Name"] == "Turkish Airlines") {
          const cleaned = jsonData
            .filter(
              (row) =>
                row["Advertiser Name"] && row["Advertiser Name"].trim() !== "",
            )
            .filter((row) => row["MMAds Total Commission"] !== 0);
          setRawData(cleaned);

          // 🔍 Extract unique brands
          const uniqueBrands = [
            ...new Set(cleaned.map((row) => row["Advertiser Name"].trim())),
          ];
          setBrands(uniqueBrands);

          // 🔄 Group by brand and map data
          const brandWise = {};
          uniqueBrands.forEach((brand) => {
            const brandRows = cleaned.filter(
              (row) => row["Advertiser Name"].trim() === brand,
            );
            const config = Campaigns.find((c) => c.name === brand);

            if (!config) {
              console.warn(`No campaign config found for brand: ${brand}`);
              return;
            }

            brandWise[brand] = brandRows.map((row) =>
              mapOctaadsTurkishAirlinesRow(row, config),
            );
          });

          setGroupedData(brandWise);
        }
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

    console.log(dates);

    const dateRange = dates.length ? formatDateRange(dates) : "";

    // 📝 Final file name
    const fileName = `${brand} (${campaign.Id}) ${dateRange}.csv`;

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, fileName);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📁 Upload OctaadsMedia Report</h2>

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
