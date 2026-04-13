import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { saveAs } from "file-saver";

import TradeDoublerMMads from "./Components/TradeDoublerMMads";
import TradeDoublerMaxMania from "./Components/TradeDoublerMaxMania";
import TradeDoublerMediaMax from "./Components/TradeDoublerMediaMax";
import TradeDoublerMNK from "./Components/TradeDoublerMNK";

import RakutenMMads from "./Components/RakutenMMads";
import RakutenMaxMania from "./Components/RakutenMaxMania";

import Finance_ad from "./Components/Finance_ad";

import MyLeadsMaatr from "./Components/MyLeadsMaatr";

import ImpactMediaMax from "./Components/ImpactMediaMax";
import ImpactTechMMads from "./Components/ImpactTechMMads";
import ImpactSaleMMads from "./Components/ImpactSaleMMads";
import ImpactMaxMania from "./Components/ImpactMaxMania";
import ImpactMNK from "./Components/ImpactMNK";

import Partnerizemediamaxadv from "./Components/Partnerizemediamaxadv";
import PartnerizeMaxMania from "./Components/PartnerizeMaxMania";
import PartnerizeMMadsTech from "./Components/PartnerizeMMadsTech";
import PartnerizeMnkdigi from "./Components/PartnerizeMnkdigi";

import AwinMediamax from "./Components/AwinMediamax";

import OctaadsMedia from "./Components/OctaadsMedia";

import HumeClickOrbit from "./Components/HumeClickOrbit";

import ViatorMNK from "./Components/ViatorMNK";

import SaatvaClickdealerMaxMania from "./Components/SaatvaClickdealerMaxMania";

import MedviMaxmania from "./Components/MedviMaxmania";

import Aroma360MMads from "./Components/Aroma360MMads";

import GetYourGuide from "./Components/GetYourGuide";

import NitinPartnerize from "./Components/NitinPartnerize";

//git setup check

export default function App() {
  const [fileType, setFileType] = useState("Impact");
  const [rawData, setRawData] = useState([]);
  const [brands, setBrands] = useState([]);
  const [groupedData, setGroupedData] = useState({});
  const [customFileName, setCustomFileName] = useState("");

  const mapKlookRow = (row) => {
    const formatCompactDate = (dateStr) => {
      if (!dateStr || dateStr.length !== 8) return "";

      const year = dateStr.slice(0, 4);
      const month = dateStr.slice(4, 6);
      const day = dateStr.slice(6, 8);

      return `${day}-${month}-${year}`;
    };

    return {
      created: formatCompactDate(row["Action Date"]) || "",
      txn_id: row["Order ID"] || "",
      sale_amount: row["Sales Amount"].split(" ")[1] || 0,
      revenue: row["Commission Amount"].split(" ")[1] || 0,
      payout: ((row["Commission Amount"].split(" ")[1] * 80) / 100).toFixed(10),
      payout_currency: "USD",
      campaign_id: 1251,
      publisher_id: 212,
      status: "Approved",
      sub1: row["Booking Number"] || "",
      device_id: row["Platform"] || "",
    };
  };

  const mapKlookMRow = (row) => {
    const formatCompactDate = (dateStr) => {
      if (!dateStr || dateStr.length !== 8) return "";

      const year = dateStr.slice(0, 4);
      const month = dateStr.slice(4, 6);
      const day = dateStr.slice(6, 8);

      return `${day}-${month}-${year}`;
    };

    return {
      created: formatCompactDate(row["Action Date"]) || "",
      txn_id: row["Order ID"] || "",
      sale_amount: row["Sales Amount"].split(" ")[1] || 0,
      revenue: row["Commission Amount"].split(" ")[1] || 0,
      payout: ((row["Commission Amount"].split(" ")[1] * 80) / 100).toFixed(10),
      payout_currency: "USD",
      campaign_id: 2102,
      publisher_id: 212,
      status: "Approved",
      sub1: row["Booking Number"] || "",
      device_id: row["Platform"] || "",
    };
  };

  const mapAgodaPRow = (row) => {
    const formatCompactDate = (inputDate) => {
      if (inputDate.includes("/")) {
        const [month, day, year] = inputDate.split("/").map(Number);
        return `${day}-${month}-${year}`;
      } else {
        return inputDate;
      }
    };

    const payout = parseFloat(
      row["Booking Value Before Tax"].replace("$", "").replace(",", "").trim(),
    );

    const revenue = parseFloat(
      (payout * parseFloat(row["Commission Rate"])) / 100,
    );

    return {
      created: formatCompactDate(row["Booking Date"]) || "",
      txn_id: row["Booking ID"] || "",
      sale_amount: payout || 0,
      revenue: revenue || 0,
      payout: ((revenue * 90) / 100).toFixed(10),
      payout_currency: "USD",
      campaign_id: 2074,
      publisher_id: 168,
      status: "Approved",
      device_id: row["Device Breakdown"] || "",
    };
  };

  // 📥 Handle Excel Upload
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

            if (fileType === "Klook") {
              const cleaned = csvData.filter(
                (row) =>
                  parseFloat(row["Commission Amount"].split(" ")[1] || 0) > 0,
              );

              const mapped = cleaned.map(mapKlookRow).filter(Boolean);

              setRawData(cleaned);
              setGroupedData({ Klook: mapped });
              setBrands(["Klook"]);
            } else if (fileType === "Klook-M") {
              const cleaned = csvData.filter(
                (row) =>
                  parseFloat(row["Commission Amount"].split(" ")[1] || 0) > 0,
              );

              const mapped = cleaned.map(mapKlookMRow).filter(Boolean);

              setRawData(cleaned);
              setGroupedData({ "Klook-M": mapped });
              setBrands(["Klook-M"]);
            } else if (fileType === "Agoda-P") {
              const cleaned = csvData.filter(
                (row) =>
                  parseFloat(
                    row["Site ID"],
                    // &&
                    //   row["Booking Value Before Tax"].replace("$", "").trim()
                  ) > 0,
              );

              const mapped = cleaned.map(mapAgodaPRow).filter(Boolean);

              setRawData(cleaned);
              setGroupedData({ "Agoda-P": mapped });
              setBrands(["Agoda-P"]);
            }
          },
        });
      };
      reader.readAsText(file);
    } else {
      alert("Unsupported file format");
    }
  };

  // ⬇️ Download CSV for a specific brand
  const handleDownloadCSV = (brand) => {
    const data = groupedData[brand];
    if (!data || !data.length) return;
    const csv = Papa.unparse(data);

    const fileName = customFileName
      ? `${customFileName}.csv`
      : `${brand}_output.csv`;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, fileName);
  };

  return (
    <>
      <div className="NitinPartnerize">
        <NitinPartnerize />
      </div>
      <hr></hr>

      <hr></hr>
      <div className="TradeDoublerMMads">
        <TradeDoublerMMads />
      </div>
      <div className="TradeDoublerMaxMania">
        <TradeDoublerMaxMania />
      </div>
      <div className="TradeDoublerMediaMax">
        <TradeDoublerMediaMax />
      </div>
      <div className="TradeDoublerMNK">
        <TradeDoublerMNK />
      </div>
      <hr></hr>

      <hr></hr>
      <div className="RakutenMMads">
        <RakutenMMads />
      </div>
      <div className="RakutenMaxMania">
        <RakutenMaxMania />
      </div>
      <hr></hr>

      <hr></hr>
      <div className="Finance_ad">
        <Finance_ad />
      </div>
      <hr></hr>

      <hr></hr>
      <div className="MyLeadsMaatr">
        <MyLeadsMaatr />
      </div>
      <hr></hr>

      <hr></hr>
      <div className="ImpactMediaMax">
        <ImpactMediaMax />
      </div>

      <div className="ImpactTechMMads">
        <ImpactTechMMads />
      </div>

      <div className="ImpactSaleMMads">
        <ImpactSaleMMads />
      </div>

      <div className="ImpactMaxMania">
        <ImpactMaxMania />
      </div>

      <div className="ImpactMNK">
        <ImpactMNK />
      </div>
      <hr></hr>

      <hr></hr>
      <div className="Partnerizemediamaxadv">
        <Partnerizemediamaxadv />
      </div>

      <div className="PartnerizeMaxMania">
        <PartnerizeMaxMania />
      </div>

      <div className="PartnerizeMMadsTech">
        <PartnerizeMMadsTech />
      </div>

      <div className="PartnerizeMnkdigi">
        <PartnerizeMnkdigi />
      </div>
      <hr></hr>

      <hr></hr>
      <div className="AwinMediamax">
        <AwinMediamax />
      </div>
      <hr></hr>

      <hr></hr>
      <div className="OctaadsMedia">
        <OctaadsMedia />
      </div>
      <hr></hr>

      <hr></hr>
      <div className="HumeClickOrbit">
        <HumeClickOrbit />
      </div>
      <hr></hr>

      <hr></hr>
      <div className="ViatorMNK">
        <ViatorMNK />
      </div>
      <hr></hr>

      <hr></hr>
      <div className="SaatvaClickdealerMaxMania">
        <SaatvaClickdealerMaxMania />
      </div>
      <hr></hr>

      <hr></hr>
      <div className="MedviMaxmania">
        <MedviMaxmania />
      </div>
      <hr></hr>

      <hr></hr>
      <div className="Aroma360MMads">
        <Aroma360MMads />
      </div>
      <hr></hr>

      <hr></hr>
      <div className="GetYourGuide">
        <GetYourGuide />
      </div>
      <hr></hr>

      <hr></hr>
      <div style={{ padding: "20px" }}>
        <h2>📁 Upload Affiliate Report</h2>

        <label>
          Select File Type:{" "}
          <select
            value={fileType}
            onChange={(e) => {
              setFileType(e.target.value);
              setRawData([]);
              setBrands([]);
              setGroupedData({});
            }}
          >
            <option value="Klook">Klook</option>
            <option value="Klook-M">Klook-M</option>
            <option value="Agoda-P">Agoda-P</option>
          </select>
        </label>

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
    </>
  );
}
