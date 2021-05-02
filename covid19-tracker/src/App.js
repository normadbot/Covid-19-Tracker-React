import "./App.css";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { sortData,prettyPrintStat } from "./util";
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";

function App() {
  const [counteries, setCounteries] = useState([]);
  const [country, setCountry] = useState("Worldwide");
  const [countryInfo, setcountryInfo] = useState({});
  const [tableData, settableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setmapZoom] = useState(3);
  const [mapCountries, setmapCountries] = useState([]);
  const [casesType, setcasesType] = useState("cases")

  useEffect(() => {
    fetch("https://corona.lmao.ninja/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setcountryInfo(data);
      });
  }, []);

  useEffect(() => {
    // async code  -> pings a server, wait for it and then we do something with input
    const getCounteriesData = async () => {
      await fetch("https://corona.lmao.ninja/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const counteries = data.map((country) => ({
            id: country.countryInfo.id,
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedData = sortData(data);
          setCounteries(counteries);
          settableData(sortedData)
          setmapCountries(data);
        });
    };
    getCounteriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url =
      countryCode === "Worldwide"
        ? "https://corona.lmao.ninja/v3/covid-19/countries"
        : `https://corona.lmao.ninja/v3/covid-19/countries/${countryCode}?strict=true`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setcountryInfo(data);
        setCountry(countryCode);
        // coming from the Data Json
        setMapCenter([data.countryInfo.lat,data.countryInfo.long]);
        setmapZoom(4);
      });
  };

  return (
    <div className="app">
      <div className="app_left">
        <div className="app_header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app_dropdown">
            <Select
              value={country}
              variant="outlined"
              onChange={onCountryChange}
            >
              <MenuItem value="Worldwide">WorldWide</MenuItem>
              {counteries.map((country) => (
                <MenuItem id={country.id} value={country.value}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app_stats">
          <InfoBox
            title="CoronaVirus Cases"
            total={prettyPrintStat(countryInfo.cases)}
            cases={countryInfo.todayCases}
          />

          <InfoBox
            title="Recovered"
            total={prettyPrintStat(countryInfo.recovered)}
            cases={countryInfo.todayRecovered}
          />

          <InfoBox
            title="Deaths"
            total={prettyPrintStat(countryInfo.deaths)}
            cases={countryInfo.todayDeaths}
          />
        </div>

        <Map countries={mapCountries} center={mapCenter} zoom={mapZoom}/>
      </div>
      <div>
        <Card className="app_right">
          <CardContent>
            <h2>Live Cases by country</h2>
            <Table countries={tableData}/>
            <h3>WorldWide new cases</h3>
            <LineGraph casesType="cases"/>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
