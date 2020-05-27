const url = new URL(document.location)
const log = console.log

let search = url.search

// remove ?
search = search.substr(1, search.length)
let countryToDisplay = search.split("=")[1]
countryToDisplay = countryToDisplay.split("%20").join(" ")

countryName.innerHTML = `<span class="flag" id="flag"></span>${countryToDisplay}`

const xhttp = new XMLHttpRequest()
xhttp.open("GET", covidApi)

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

xhttp.onerror = function(e) {

                info.innerHTML = `
                    <h3>Error <span onclick="return closeInfo()" class="color-black float-right">x</span><span onclick="return reloadPage()" class="float-right color-black pad-right-8">&#8635</span></h3>
                    Error occurred. Try refreshing the page. 
                `
                info.classList.add("info-danger")
                info.classList.remove("close")

    try {
        loading1.classList.add("close")
        loading2.classList.add("close")
    } catch(err) {}
    
    log("error")
}
xhttp.send()
