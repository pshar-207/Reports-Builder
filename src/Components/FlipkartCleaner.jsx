import React, { useState } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { saveAs } from "file-saver";

export default function FlipkartCleaner() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [deductionFile, setDeductionFile] = useState(null);

  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState("");

  const updateProgress = (p, msg = "") => {
    setProgress(p);
    if (msg) setLog(msg);
  };

  const SHEETS_1 = [
    "111-link-nov",
    "112-link-nov",
    "113-link-nov",
    "114-link-nov",
    "115-link-nov",
    "116-link-nov",
  ];
  const SHEETS_2_MAP = {
    "2-link-nov": "10",
    "114-link-nov": "114 New",
    "115-link-nov": "115 New",
    "116-link-nov": "116 New",
  };

  const handleProcess = async () => {
    if (!file1 || !file2 || !deductionFile) {
      alert("Upload all three files");
      return;
    }

    updateProgress(5, "Reading files...");

    const wb1 = XLSX.read(await file1.arrayBuffer());
    const wb2 = XLSX.read(await file2.arrayBuffer());
    const wbDed = XLSX.read(await deductionFile.arrayBuffer());

    updateProgress(10, "Processing Flipkart - 1 MMA...");

    let OUTPUT = {}; // final excel workbook sheets

    // -----------------------------
    // PROCESS FLIPKART 1
    // -----------------------------
    let clean1 = {};

    SHEETS_1.forEach((sheet, i) => {
      const mainSheet = XLSX.utils.sheet_to_json(wb1.Sheets[sheet] || [], {
        raw: true,
      });
      const dedSheet = XLSX.utils.sheet_to_json(wbDed.Sheets[sheet] || [], {
        raw: true,
      });

      const dedIds = new Set(dedSheet.map((r) => String(r.id).trim()));

      const filtered = mainSheet.filter(
        (row) => !dedIds.has(String(row.id).trim())
      );

      clean1[sheet] = filtered;

      updateProgress(15 + i * 3, `Processed ${sheet}`);
    });

    updateProgress(35, "Processing Flipkart - 2 MMA...");

    // -----------------------------
    // PROCESS FLIPKART 2
    // -----------------------------
    let clean2 = {};

    for (const [mainSheet, dedSheet] of Object.entries(SHEETS_2_MAP)) {
      const sheetData = XLSX.utils.sheet_to_json(wb2.Sheets[mainSheet] || [], {
        raw: true,
      });
      const dedData = XLSX.utils.sheet_to_json(wbDed.Sheets[dedSheet] || [], {
        raw: true,
      });

      const dedOrderIds = new Set(
        dedData.map((r) => String(r.order_id).trim())
      );

      let filtered = sheetData.filter(
        (row) => !dedOrderIds.has(String(row.orderId).trim())
      );

      // Normalizing columns
      filtered = filtered.map((row) => ({
        sale_date: row.orderDate || "", // Keep date raw
        date_part: "",
        time_part: "",
        id: "",
        amount: row.productPrice || "",
        order_id: row.orderId || "",
        platform: "Flipkart",
        payout: row.payout || "",
        product_id_on_brand: "",
        order_status: "Pending",
      }));

      clean2[mainSheet] = filtered;
    }

    updateProgress(55, "Merging sheets...");

    // ---------------------------------------------------
    // FINAL SHEET STRUCTURE THAT YOU REQUESTED
    // ---------------------------------------------------

    OUTPUT["111-link-nov"] = clean1["111-link-nov"];
    OUTPUT["112-link-nov"] = clean1["112-link-nov"];
    OUTPUT["113-link-nov"] = clean1["113-link-nov"];

    // "link-1-nov" becomes "link-9-nov"
    OUTPUT["link-9-nov"] = XLSX.utils.sheet_to_json(
      wb1.Sheets["link-1-nov"] || [],
      { raw: true }
    );

    // Merge Flipkart-1 + Flipkart-2
    OUTPUT["114-link-nov"] = [
      ...clean1["114-link-nov"],
      ...clean2["114-link-nov"],
    ];

    OUTPUT["115-link-nov"] = [
      ...clean1["115-link-nov"],
      ...clean2["115-link-nov"],
    ];

    OUTPUT["116-link-nov"] = [
      ...clean1["116-link-nov"],
      ...clean2["116-link-nov"],
    ];

    // 2-link-nov becomes link-10-nov
    OUTPUT["link-10-nov"] = clean2["2-link-nov"];

    updateProgress(75, "Generating Excel file...");

    // ---------------------------------------------------
    // EXPORT INTO ONE EXCEL FILE
    // ---------------------------------------------------
    const finalWB = XLSX.utils.book_new();

    Object.entries(OUTPUT).forEach(([sheetName, data]) => {
      const ws = XLSX.utils.json_to_sheet(data, { raw: true });
      XLSX.utils.book_append_sheet(finalWB, ws, sheetName);
    });

    const excelBuffer = XLSX.write(finalWB, {
      bookType: "xlsx",
      type: "array",
    });
    saveAs(new Blob([excelBuffer]), "Flipkart_Final_Output.xlsx");

    updateProgress(100, "Completed!");
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Flipkart Automation</h2>

      <div className="mb-3">
        <label>Flipkart - 1 MMA</label>
        <br />
        <input type="file" onChange={(e) => setFile1(e.target.files[0])} />
      </div>

      <div className="mb-3">
        <label>Flipkart - 2 MMA</label>
        <br />
        <input type="file" onChange={(e) => setFile2(e.target.files[0])} />
      </div>

      <div className="mb-3">
        <label>Flipkart Deduction</label>
        <br />
        <input
          type="file"
          onChange={(e) => setDeductionFile(e.target.files[0])}
        />
      </div>

      <button
        onClick={handleProcess}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Process
      </button>

      <div className="mt-4">
        <div className="w-full bg-gray-300 rounded h-4">
          <div
            className="bg-green-600 h-4 rounded transition-all duration-300"
            style={{ width: progress + "%" }}
          ></div>
        </div>
        <p className="text-sm mt-1">
          {progress}% – {log}
        </p>
      </div>
    </div>
  );
}
