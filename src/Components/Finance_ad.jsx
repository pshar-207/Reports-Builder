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
    }

    const revenue = parseFloat(
      row["Commission"].replace(",", ".").split(" ")[0]
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
      publisher_id: 77,
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

  const handleDownloadCSV = (brand) => {
    const data = groupedData[brand];
    if (!data || !data.length) return;

    const csv = Papa.unparse(data);
    // const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    // saveAs(blob, `${brand}_mapped.csv`);
    const fileName = customFileName
      ? `${customFileName}.csv`
      : `${brand}_output.csv`;

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
