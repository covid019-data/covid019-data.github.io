// on dom content load, load the covid-19 stats from jscusse API

const log = console.log
var start = 0;
var end = 14;
var covid19 = {
    Global: {},
    Countries: []
}

var all
var lastEl
var io

const xhttp = new XMLHttpRequest()

xhttp.onload = function() {
    covid19 = JSON.parse(xhttp.response)

    worldStats.innerHTML = ""        
    for(const key in covid19.Global) {
        const val = covid19.Global[key]
        let bgType = ""
        if(key.endsWith("Deaths"))
            bgType = "bg-danger"
        else if(key.endsWith("Recovered"))
            bgType = "bg-green"
        else if (key.endsWith("Confirmed"))
            bgType = "bg-default"

        const h =`
            <div class="smallbox ${bgType}">
                <h1>${addCommas(val)}</h1>
                <p>${camelPad(key)}</p>
            </div>        
        `
        worldStats.innerHTML += h        
    }

    // load countries
    countriesCnt.innerHTML = ""        
    loadData.running = true
    loadData()
    loadData.running = false

    try {
        loading1.classList.add("close")
        loading2.classList.add("close")
    } catch(err) {}

    all = document.querySelectorAll(".country")
    lastEl = all[all.length - 1]

    io.observe(lastEl)
}

xhttp.onerror = function(e) {

                info.innerHTML = `
                    <h3>Error <span onclick="return closeInfo()" class="color-black float-right">x</span><span onclick="return reloadPage()" class="float-right color-black pad-right-8">&#8635</span></h3>
                    Error occurred while loading data. Try to refresh the page. 
                `
                info.classList.add("info-danger")
                info.classList.remove("close")

    try {
        loading1.classList.add("close")
        loading2.classList.add("close")
        // xhttp.send()
    } catch(err) {}
    
    log("error")
}

xhttp.timeout = function() {}

window.addEventListener("DOMContentLoaded", (evt) => {
    

    io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                try{
                    if(loadData.running == false) {
                        loadData()
                    } else {}
                } catch(err) {}            
                io.unobserve(lastEl)
                all = document.querySelectorAll(".country")
                lastEl = all[all.length - 1]
                io.observe(lastEl)
            }
        })
    })
    
    xhttp.open("GET", covidApi)
    xhttp.send()
})

function loadData() {
    for(var index = 0; index < end ; index++) {
        var country = covid19.Countries[start]
        start++

        const h = `
                <div class="country">
                    <div class="country-inner">
                        <h3>${country["Country"]}</h3>    
                        <p>Infected: <span class="color-default">${addCommas(country["TotalConfirmed"])}</span></p>
                        <p>Deaths: <span class="color-danger">${addCommas(country["TotalDeaths"])}</span></p>
                    </div>
                    <div class="country-footer"><a href="./viewcountry.html?q=${country['Country']}">View full details</a></div>
                </div>
        `
        countriesCnt.innerHTML += h   
    }
    loadData.running = false
}
loadData.running = true

searchCountryInput.addEventListener("keyup", (evt) => {
    const val = evt.target.value.toLowerCase()

    // search country

    const countries = covid19.Countries
    const searchRes = []

    for (var index = 0; index < countries.length; index++) {
        var country = countries[index];
        if(country.Country.toLowerCase().startsWith(val)) {
            searchRes.push(country)
        }
    }

    if(searchRes.length === 0) {
        start = 0;
        loadData()
        return;
    }

    countriesCnt.innerHTML = ""

    for(var index = 0; index < searchRes.length ; index++) {
        var country = searchRes[index]
        const h = `
                <div class="country">
                    <div class="country-inner">
                        <h3>${country["Country"]}</h3>    
                        <p>Infected: <span class="color-default">${addCommas(country["TotalConfirmed"])}</span></p>
                        <p>Deaths: <span class="color-danger">${addCommas(country["TotalDeaths"])}</span></p>
                    </div>
                    <div class="country-footer"><a href="./viewcountry.html?q=${country['Country']}">View full details</a></div>
                </div>
        `
        countriesCnt.innerHTML += h   
    }
})

