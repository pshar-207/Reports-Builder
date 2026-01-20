import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { saveAs } from "file-saver";

import TradeDoublerMaatr from "./Components/TradeDoublerMaatr";
import TradeDoublerMMads from "./Components/TradeDoublerMMads";
import TradeDoublerMaxMania from "./Components/TradeDoublerMaxMania";
import TradeDoublerMediaMax from "./Components/TradeDoublerMediaMax";
import FlexoffersMaatr from "./Components/FlexoffersMaatr";
import RakutenMMads from "./Components/RakutenMMads";
import RakutenMaxMania from "./Components/RakutenMaxMania";
import ImpactMediaMax from "./Components/ImpactMediaMax";
import ImpactTechMMads from "./Components/ImpactTechMMads";
import ImpactSaleMMads from "./Components/ImpactSaleMMads";
import ImpactMaxMania from "./Components/ImpactMaxMania";
import ImpactMaatr from "./Components/ImpactMaatr";

export default function App() {
  

  return (
    <>
     
      <hr></hr>
      <div className="ImpactMediaMax">
        <ImpactMediaMax />
      </div>
      <hr></hr>
      <hr></hr>
      <div className="ImpactTechMMads">
        <ImpactTechMMads />
      </div>
      <hr></hr>
      <hr></hr>
      <div className="ImpactSaleMMads">
        <ImpactSaleMMads />
      </div>
      <hr></hr>
      <hr></hr>
       <div className="ImpactMaxMania">
        <ImpactMaxMania />
      </div>
      <hr></hr>
      <hr></hr>
       <div className="ImpactMaatr">
        <ImpactMaatr />
      </div>
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
      <div className="TradeDoublerMaatr">
        <TradeDoublerMaatr />
      </div>
      <hr></hr>
      <div className="FlexofferMaatr">
        <FlexoffersMaatr />
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
    </>
  );
}
