import React, { useState, useEffect, useMemo } from "react";
import "./App.css";
import Globe from "react-globe.gl";
import * as d3 from "d3";
import axios from "axios";

function App() {
  const [countries, setCountries] = useState({ features: [] });
  const [hoverD, setHoverD] = useState();

  const [data, setData] = useState("");

  async function getData() {
    const temp = await axios.get("https://api.covid19api.com/summary");
    setData(temp);
  }

  function findCountryData(name) {
    //console.log("inside country data", name);

    switch (name) {
      /*
      case "United States of America":
        name = "US";
        break;
   
      case "Dominican Rep.":
        name = "Dominican Republic";
        break;
      */

      case "Russia":
        name = "Russian Federation";
        break;

      case "North Korea":
        name = "Korea (North)";
        break;

      case "South Korea":
        name = "Korea (South)";
        break;

      case "Venezuela":
        name = "Venezuela (Bolivarian Republic)";
        break;

      case "Vietnam":
        name = "Viet Nam";
        break;

      case "Laos":
        name = "Lao PDR";
        break;

      case "United Republic of Tanzania":
        name = "Tanzania, United Republic of";
        break;

      case "Bosnia and Herz.":
        name = "Bosnia and Herzegovina";
        break;

      case "Democratic Republic of the Congo":
        name = "Congo (Kinshasa)";
        break;

      case "Republic of the Congo":
        name = "Congo (Brazzaville)";
        break;
      /*
      case "Central African Rep.":
        name = "Central African Republic";
        break;
      */
      default:
        break;
    }

    for (let i = 0; i < data.data.Countries.length; i++) {
      //console.log(`${data.data.Countries[i].Country} ?== ${name}`);
      if (data.data.Countries[i].Country === name) {
        return `
        Confirmed Cases: ${data.data.Countries[i].TotalConfirmed} <br />
        Total Deaths: ${data.data.Countries[i].TotalDeaths} <br />
        Total Recovered: ${data.data.Countries[i].TotalRecovered}
        `;
      }
    }

    return "NO DATA FOUND...";
  }

  useEffect(() => {
    // load data
    axios
      .get("../datasets/ne_110m_admin_0_countries.geojson")
      .then(function (response) {
        // handle success
        //console.log(response.data);
        getData();
        setCountries(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }, []);

  const colorScale = d3.scaleSequentialSqrt(d3.interpolateYlOrRd);

  // GDP per capita (avoiding countries with small pop)
  const getVal = (feat) =>
    feat.properties.GDP_MD_EST / Math.max(1e5, feat.properties.POP_EST);

  const maxVal = useMemo(() => Math.max(...countries.features.map(getVal)), [
    countries,
  ]);
  colorScale.domain([0, maxVal]);

  return (
    <Globe
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
      backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
      polygonsData={countries.features}
      polygonAltitude={(d) => (d === hoverD ? 0.12 : 0.06)}
      polygonCapColor={(d) =>
        d === hoverD ? "steelblue" : colorScale(getVal(d))
      }
      polygonSideColor={() => "rgba(0, 100, 0, 0.15)"}
      polygonStrokeColor={() => "#111"}
      polygonLabel={({ properties: d }) => `
    <b>${d.ADMIN} (${d.ISO_A2}):</b> <br />
    GDP: <i>${d.GDP_MD_EST}</i> M$<br/>
    Population: <i>${d.POP_EST}</i>
    <br />
    ${findCountryData(d.ADMIN)}
  `}
      onPolygonHover={setHoverD}
      polygonsTransitionDuration={300}
    />
  );
}

export default App;
