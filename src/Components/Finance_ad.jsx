import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { saveAs } from "file-saver";

export default function TradeDoublerMaatr() {
  const [rawData, setRawData] = useState([]);
  const [brands, setBrands] = useState([]);
  const [groupedData, setGroupedData] = useState({});
  const [customFileName, setCustomFileName] = useState("");

  const mapFinanceRow = (row) => {
    let camp_id;
    if (row["Program"] == "nutzungsdauer.com") {
      camp_id = 2076;
    } else if (row["Program"] == "C24 Bank") {
      camp_id = 2081;
    } else if (row["Program"] == "SMARTBROKER+") {
      camp_id = 2100;
    } else if (row["Program"] == "TF Bank DE") {
      camp_id = 2141;
    } else if (row["Program"] == "Accountable") {
      camp_id = 2140;
    } else if (row["Program"] == "FINOM") {
      camp_id = 2575;
    }

    const revenue = parseFloat(
      row["Commission"].replace(",", ".").split(" ")[0],
    );
    return {
      p1: row["Sub-ID"],
      created: row["Date"].replaceAll(".", "-") || "",
      txn_id: row["Order-ID"] || "",
      sale_amount: 0,
      revenue: revenue || 0,
      payout: ((revenue * 70) / 100).toFixed(10),
      payout_currency: "EUR",
      campaign_id: camp_id,
      publisher_id: "",
      status: "Pending",
    };
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

        const mapped = jsonData.map((row) => mapFinanceRow(row));
        setRawData(jsonData);
        setGroupedData({ "Finance-ad": mapped });
        setBrands(["Finance-ad"]);
      };

      reader.readAsArrayBuffer(file);
    } else {
      alert("Unsupported file format");
    }
  };

  const parseImpactDate = (value) => {
    if (!value) return null;

    // Date object
    if (value instanceof Date && !isNaN(value)) {
      return new Date(value.getFullYear(), value.getMonth(), value.getDate());
    }

    // Excel serial
    if (typeof value === "number") {
      const excelEpoch = new Date(1899, 11, 30);
      const date = new Date(excelEpoch.getTime() + value * 86400000);
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    // String: D-M-YY or D-M-YYYY
    if (typeof value === "string") {
      const clean = value.split(" ")[0];

      // D-M-YY  →  8-1-26
      if (/^\d{1,2}-\d{1,2}-\d{2}$/.test(clean)) {
        let [day, month, year] = clean.split("-");
        year = Number(year) + 2000;
        return new Date(year, month - 1, day);
      }

      // D-M-YYYY
      if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(clean)) {
        const [day, month, year] = clean.split("-");
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

    // 📅 Extract dates from created field
    const dates = data
      .map((row) => parseImpactDate(row.created))
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
      <h2>📁 Upload Finance ad Report</h2>

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
