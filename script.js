// on dom content load, load the covid-19 stats from jscusse API

const log = console.log
var start = 0;
var end = 4;
var covid19 = {
    Global: {},
    Countries: []
}

const xhttp = new XMLHttpRequest()
xhttp.open("GET", "./summary.json")

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
}

xhttp.onerror = function() {
    log("error")
}
xhttp.send()



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


const all = document.querySelectorAll(".country")
var lastEl = all[all.length - 1]

const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            io.unobserve(lastEl)
            try{
                if(loadData.running == false) {
                    loadData()
                } else {}
            } catch(err) {}            
            const all = document.querySelectorAll(".country")
            lastEl = all[all.length - 1]
            io.observe(lastEl)
        }
    })
})

io.observe(lastEl)


searchCountryInput.addEventListener("keyup", (evt) => {
    const val = evt.target.value

    // search country

    const countries = covid19.Countries
    const searchRes = []

    for (var index = 0; index < countries.length; index++) {
        var country = countries[index];
        if(country.Country.includes(val)) {
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

function addCommas(nStr){
nStr += '';
var x = nStr.split('.');
var x1 = x[0];
var x2 = x.length > 1 ? '.' + x[1] : '';
var rgx = /(\d+)(\d{3})/;
while (rgx.test(x1)) {
x1 = x1.replace(rgx, '$1' + ',' + '$2');
}
return x1 + x2;
}

function camelPad(str){ 
return str.replace(/([A-Z]+)([A-Z][a-z])/g, ' $1 $2').replace(/([a-z\d])([A-Z])/g, '$1 $2').replace(/([a-zA-Z])(\d)/g, '$1 $2') .replace(/^./, function(str){ return str.toUpperCase(); }).trim(); 
}