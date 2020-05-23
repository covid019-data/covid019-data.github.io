const url = new URL(document.location)
const log = console.log

let search = url.search

// remove ?
search = search.substr(1, search.length)
let countryToDisplay = search.split("=")[1]
countryToDisplay = countryToDisplay.split("%20").join(" ")

countryName.innerHTML = `<span class="flag" id="flag"></span>${countryToDisplay}`

const xhttp = new XMLHttpRequest()
xhttp.open("GET",  "https://api.covid19api.com/summary")

xhttp.onload = function() {
    covid19 = JSON.parse(xhttp.response)

    // load countries
    const countries = covid19.Countries

    for (var index = 0; index < countries.length; index++) {
        var country = countries[index];
        const { 
            Country, 
            CountryCode,
            NewConfirmed,
            TotalConfirmed,
            NewDeaths,
            TotalDeaths,
            NewRecovered,
            TotalRecovered
        } = country
        if(country.Country === countryToDisplay) {
            const h = `
                <tr><td class="leftTd">New Confirmed</td><td class="rightTd">${addCommas(NewConfirmed)}</td></tr>
                <tr><td class="leftTd">Total Confirmed</td><td class="rightTd">${addCommas(TotalConfirmed)}</td></tr>
                <tr><td class="leftTd">New Deaths</td><td class="rightTd">${addCommas(NewDeaths)}</td></tr>
                <tr><td class="leftTd">Total Deaths</td><td class="rightTd">${addCommas(TotalDeaths)}</td></tr>
                <tr><td class="leftTd">Death Rate(%)</td><td class="rightTd">${Math.ceil((TotalDeaths/TotalConfirmed)*100)}%</td></tr>
                <tr><td class="leftTd">New Recovered</td><td class="rightTd">${addCommas(NewRecovered)}</td></tr>
                <tr><td class="leftTd">Total Recovered</td><td class="rightTd">${addCommas(TotalRecovered)}</td></tr>
                <tr><td class="leftTd">Recovery Rate(%)</td><td class="rightTd">${Math.ceil((TotalRecovered/TotalConfirmed)*100)}%</td></tr>
            `
             // remove loading

             loading1.classList.add("close")
             loading2.classList.add("close")

            // set flag
            flag .innerHTML = `${flags[CountryCode].emoji} `

            date.innerHTML = country["Date"];
            tBodyStats.innerHTML = h;
            break; 
        }
    }
}

xhttp.onerror = function() {
    log("error")
}
xhttp.send()
