// import React, { useEffect, useState } from "react";
// import * as XLSX from "xlsx";
// import Papa from "papaparse";
// import { saveAs } from "file-saver";

// const Campaigns = [
//   {
//     name: "AirAsia Travel",
//     Id: 1632,
//     pub_id: 77,
//     percentage: 80,
//     currency: "GBP",
//     P1: true,
//   },
//   {
//     name: "F-Secure | Internet Security & VPN",
//     Id: 2142,
//     pub_id: 168,
//     percentage: 80,
//     currency: "GBP",
//     P1: true,
//   },
//   {
//     name: "Gamivo Global",
//     Id: 2163,
//     pub_id: 434,
//     percentage: 80,
//     currency: "GBP",
//     P1: false,
//   },
//   {
//     name: "GoCity",
//     Id: 1860,
//     pub_id: 459,
//     percentage: 80,
//     currency: "GBP",
//     P1: false,
//   },
//   {
//     name: "Klook (US)",
//     Id: 1547,
//     pub_id: 77,
//     percentage: 80,
//     currency: "GBP",
//     P1: true,
//   },
//   {
//     name: "Malwarebytes | Cybersecurity for Everyone",
//     Id: 1861,
//     pub_id: 77,
//     percentage: 80,
//     currency: "GBP",
//     P1: false,
//   },
//   {
//     name: "stadium_goods_us",
//     Id: 1632,
//     pub_id: 77,
//     percentage: 80,
//     currency: "GBP",
//     P1: true,
//   },
//   {
//     name: "MPB.com",
//     Id: 1990,
//     pub_id: 77,
//     percentage: 80,
//     currency: "GBP",
//     P1: true,
//   },
// ];

// export default function PartnerizeMaatr() {
//   const [fileType, setFileType] = useState("Impact");
//   const [rawData, setRawData] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [groupedData, setGroupedData] = useState({});
//   const [customFileName, setCustomFileName] = useState("");

//   // 📥 Handle Excel Upload
//   const handleExcelUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const extension = file.name.split(".").pop().toLowerCase();
//     const reader = new FileReader();
//     if (extension === "csv") {
//       reader.onload = (evt) => {
//         const text = evt.target.result;

//         Papa.parse(text, {
//           header: true,
//           skipEmptyLines: true,
//           complete: (results) => {
//             const csvData = results.data;

//             const cleaned = csvData.filter(
//               (row) => parseFloat(row["publisher_commission"] || 0) > 0
//             );

//             // 🔍 Extract unique brands
//             const uniqueBrands = [
//               ...new Set(cleaned.map((row) => row.Brand.trim())),
//             ];
//             setBrands(uniqueBrands);

//             const mapped = cleaned.map(mapExpediaRow).filter(Boolean);

//             setRawData(cleaned);
//             setGroupedData({ Expedia: mapped });
//             setBrands(["Expedia"]);
//           },
//         });
//       };
//       reader.readAsText(file);
//     } else {
//       alert("Unsupported file format");
//     }
//   };

//   // ⬇️ Download CSV for a specific brand
//   const handleDownloadCSV = (brand) => {
//     const data = groupedData[brand];
//     if (!data || !data.length) return;
//     const csv = Papa.unparse(data);

//     const fileName = customFileName
//       ? `${customFileName}.csv`
//       : `${brand}_output.csv`;

//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     saveAs(blob, fileName);
//   };

//   return (
//     <>
//       <div style={{ padding: "20px" }}>
//         <h2>📁 Upload Partnerize Maatr Report</h2>

//         <input
//           type="file"
//           accept=".xlsx,.csv"
//           onChange={handleExcelUpload}
//           style={{ marginLeft: "10px" }}
//         />

//         {rawData.length > 0 && (
//           <>
//             <h3>✅Raw Rows - {rawData.length}</h3>
//             <pre
//               style={{
//                 background: "rgb(67, 67, 67)",
//                 padding: "10px",
//                 border: "1px solid white",
//                 maxHeight: "200px",
//                 overflowY: "scroll",
//                 fontSize: "12px",
//               }}
//             >
//               {JSON.stringify(rawData, null, 2)}
//             </pre>
//           </>
//         )}

//         {brands.map((brand) => (
//           <div
//             key={brand}
//             style={{
//               border: "1px solid #ccc",
//               padding: "10px",
//               marginTop: "20px",
//             }}
//           >
//             <h4>
//               📌 {brand} — {groupedData[brand]?.length || 0} entries
//             </h4>
//             <input
//               type="text"
//               placeholder="Enter custom file name (optional)"
//               value={customFileName}
//               onChange={(e) => setCustomFileName(e.target.value)}
//               className="p-2 border rounded mb-2"
//             />

//             <button onClick={() => handleDownloadCSV(brand)}>
//               ⬇️ Download CSV
//             </button>
//             <pre
//               style={{
//                 background: "#111",
//                 color: "#0f0",
//                 padding: "10px",
//                 fontSize: "12px",
//                 maxHeight: "200px",
//                 overflowY: "auto",
//               }}
//             >
//               {JSON.stringify(groupedData[brand], null, 2)}
//             </pre>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// }

import React, { useState } from "react";
import Papa from "papaparse";
import { saveAs } from "file-saver";

const Campaigns = [
  {
    name: "AirAsia Travel",
    Id: 1632,
    pub_id: 77,
    percentage: 80,
    currency: "GBP",
    P1: true,
  },
  {
    name: "F-Secure | Internet Security & VPN",
    Id: 2142,
    pub_id: 168,
    percentage: 80,
    currency: "GBP",
    P1: true,
  },
  {
    name: "Gamivo Global",
    Id: 2163,
    pub_id: 434,
    percentage: 80,
    currency: "GBP",
    P1: false,
  },
  {
    name: "GoCity",
    Id: 1860,
    pub_id: 459,
    percentage: 80,
    currency: "GBP",
    P1: false,
  },
  {
    name: "Klook (US)",
    Id: 1547,
    pub_id: 77,
    percentage: 80,
    currency: "GBP",
    P1: true,
  },
  {
    name: "Malwarebytes | Cybersecurity for Everyone",
    Id: 1861,
    pub_id: 77,
    percentage: 80,
    currency: "GBP",
    P1: false,
  },
  {
    name: "stadium_goods_us",
    Id: 1632,
    pub_id: 77,
    percentage: 80,
    currency: "GBP",
    P1: true,
  },
  {
    name: "MPB.com",
    Id: 1990,
    pub_id: 77,
    percentage: 80,
    currency: "GBP",
    P1: true,
  },
];

export default function PartnerizeSheet() {
  const [rawData, setRawData] = useState([]);
  const [groupedData, setGroupedData] = useState({});
  const [brands, setBrands] = useState([]);
  const [customFileName, setCustomFileName] = useState("");

  // 🧠 Function to clean campaign name (remove region)
  const getBaseBrandName = (campaignTitle) => {
    if (!campaignTitle) return "";
    // Example: "MPB.com BE" => "MPB.com"
    const match = campaignTitle.match(/^[A-Za-z0-9 .|_-]+/);
    let cleaned = campaignTitle.trim();
    if (cleaned.includes("(")) cleaned = cleaned.split("(")[0].trim();
    if (cleaned.match(/ [A-Z]{2,3}$/))
      cleaned = cleaned.replace(/ [A-Z]{2,3}$/, "");
    return cleaned;
  };

  // 🧾 Handle CSV Upload
  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      Papa.parse(evt.target.result, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data;

          // Remove empty or invalid rows
          const cleaned = data.filter(
            (row) =>
              row.campaign_title &&
              parseFloat(row.publisher_commission || 0) > 0
          );

          // 🧩 Map and clean brand names
          const processed = cleaned
            .map((row) => {
              const brandName = getBaseBrandName(row.campaign_title);
              const campaign = Campaigns.find((c) =>
                brandName.includes(c.name)
              );

              if (!campaign) return null;

              const payout =
                (parseFloat(row.publisher_commission) || 0) *
                (campaign.percentage / 100);

              return {
                created: row["conversion_date"],
                txn_id: row["conversion_id"],
                campaign_id: campaign.Id,
                sale_amount: row.value,
                revenue: row.publisher_commission,
                payout: row.publisher_commission * campaign.percentage,

                campaign_name: brandName,
                publisher_id: campaign.pub_id,
                currency: campaign.currency,
                action_earning: row.publisher_commission,
                // payout,
                status: campaign.P1 ? "Approved" : "Pending",
                date: row.date || "",
              };
            })
            .filter(Boolean);

          // 🧱 Group by base brand
          const grouped = {};
          processed.forEach((row) => {
            if (!grouped[row.campaign_name]) grouped[row.campaign_name] = [];
            grouped[row.campaign_name].push(row);
          });

          setRawData(processed);
          setGroupedData(grouped);
          setBrands(Object.keys(grouped));
        },
      });
    };
    reader.readAsText(file);
  };

  // ⬇️ Download CSV
  const handleDownloadCSV = (brand) => {
    const data = groupedData[brand];
    if (!data?.length) return;

    const csv = Papa.unparse(data);
    const fileName = customFileName ? `${customFileName}.csv` : `${brand}.csv`;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, fileName);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📁 Upload Partnerize Sheet</h2>
      <input type="file" accept=".csv" onChange={handleExcelUpload} />

      {rawData.length > 0 && (
        <>
          <h3>✅ Processed Rows: {rawData.length}</h3>
        </>
      )}

      {brands.map((brand) => (
        <div
          key={brand}
          style={{
            border: "1px solid #ccc",
            marginTop: "20px",
            padding: "10px",
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
