import React from 'react';
import { useEffect, useState, useRef } from "react";
import './App.css';
import SortableTable from "./components/SortableTable";
import PatientInfoForm from "./components/PatientInfoForm";
import MNVTable from "./components/MNVTable";
import LoadingSpinner from "./components/Spinner";
import GeneButton from "./components/GeneButton";
import { ListFormat } from "typescript";
import axios from "axios";

const data = [{ 'id': 1234, 'molecular_impact': 'HIGH', 'pathogenicity': 'benign' },
{ 'id': 2345, 'molecular_impact': '', 'pathogenicity': 'likely pathogenic' },
{ 'id': 3456, 'molecular_impact': 'LOW', 'pathogenicity': 'benign' },
{ 'id': 4567, 'molecular_impact': 'MED', 'pathogenicity': 'benign' },];

type VariantRow = {
  spdi: string,
  dnaChangeType: string,
  sourceClass: string,
  allelicState: string,
  molecImpact: string,
  alleleFreq: number,
}

type MNVRow = {
  mnvSPDI: string,
  molecImpact: string,
  snvSPDIs: Array<string>
}

function App() {
  const [geneButtons, setGeneButtons] = useState<Array<{ geneName: string, geneData: Array<VariantRow>, mnvData: Array<MNVRow>, score?: string, tested: boolean}>>([])
  const [selectedGene, setSelectedGene] = useState<{ geneName: string, geneData: Array<VariantRow>, mnvData: Array<MNVRow>, tested: boolean }>({ geneName: "None", geneData: [], mnvData: [], tested: false })
  const [genesToLoad, setGenesToLoad] = useState<Array<string>>([])

  const getGeneData = (newGene: { geneName: string, geneData: Array<VariantRow>, mnvData: Array<MNVRow>, score?: string, tested:boolean}) => {
    // Update state variable from within the form component
    setGeneButtons((prevGeneButtons) => {
      let geneButtonsUpdatedTarget = prevGeneButtons.filter(function (geneDict) {
        return geneDict.geneName !== newGene.geneName
      })

      geneButtonsUpdatedTarget.push(newGene)

      console.log("In get gene data for gene ", newGene.geneName)
      console.log("geneButtons is ", geneButtons)
      console.log("geneButtons Updated target is", geneButtonsUpdatedTarget)

      return geneButtonsUpdatedTarget
    })

    setGenesToLoad((prevGenesToLoad) => {
      let newGenesToLoad = prevGenesToLoad.filter(function (geneName) {
        return geneName !== newGene.geneName
      })

      return newGenesToLoad
    })

  }

  const setSpinnerInfo = (genesToLoad: Array<string>) => {
    // Update state variable from within the form component
    setGenesToLoad(genesToLoad)
  }

  function makeButton(geneDict: { geneName: string, geneData: Array<VariantRow>, mnvData: Array<MNVRow>, score?: string, tested: boolean }) {
    if (geneDict.geneName == "BRCA1") {
      console.log(geneButtons)
    }

    let displayName = geneDict.geneName
    if (geneDict.score) {
      displayName += ` Score: ${geneDict.score.slice(0, 4)}`
    }

    return (
      <button
        className="geneButton"
        onClick={() => setSelectedGene(geneDict)}>
        {displayName}
      </button>
    );
  }

  function displaySpinner() {
    if(genesToLoad.length > 0) {
      return <LoadingSpinner/>
    }
  }

  function displaySNVData() {
    if (selectedGene.geneData.length > 0) {
      return <SortableTable data={selectedGene.geneData} />
    } else if (selectedGene.geneName != "None") {
      if (selectedGene.tested) {
        return <h1>Gene tested, no variants found</h1>
      }
        return <h1>Gene not tested</h1>
    }
  }

  function displayMNVData() {
    if (selectedGene.mnvData.length > 0) {
      return <MNVTable data={selectedGene.mnvData} />
    }
  }

  return (
    <div className="App">
      <div className="sidebar">
        <div id="patientInfoForm">
          <PatientInfoForm callback={getGeneData} setSpinnerInfo={setSpinnerInfo}/>
        </div>
        <div>{displaySpinner()}</div>
        <div className="geneButtonContainer">
          {geneButtons.map((geneDict) => makeButton(geneDict))}
        </div>
      </div>
      <div className="variantTables">
        <p>Gene Displayed: {selectedGene.geneName}</p>
        <div>{displaySNVData()}</div>
        <div>{displayMNVData()}</div>
      </div>
    </div>
  );
}

export default App;
