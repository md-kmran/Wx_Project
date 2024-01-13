const usertab = document.querySelector("[data-userweather]");
const searchtab = document.querySelector("[data-searchweather]");
const usercontainer = document.querySelector(".wxcontainer");
const grantaccess = document.querySelector(".glocation");
const searchform = document.querySelector("[data-searchform]");
const loadscreen = document.querySelector(".loading");
const userinfocontainer = document.querySelector(".uic");

// Varaibales declaration

let currenttab = usertab;
const API_KEY = "edd5b90525a698c15659fe2460eea554";
currenttab.classList.add("current-tab");

function switchtab(clickedtab) {
    if (clickedtab !== currenttab) {
        currenttab.classList.remove("current-tab");
        currenttab = clickedtab;
        currenttab.classList.add("current-tab");

        if (!searchform.classList.contains("active")) {
            userinfocontainer.classList.remove("active");
            grantaccess.classList.remove("active");

            // Check if the clicked tab is the search tab, if not, show the search form
            if (currenttab === searchtab) {
                searchform.classList.add("active");
            } else {
                searchform.classList.remove("active");
                getfromsessionstorage();
            }
        } else {
            searchform.classList.remove("active");
            userinfocontainer.classList.remove("active");
            getfromsessionstorage();
        }
    }
}

usertab.addEventListener("click", () => {
    switchtab(usertab);
});

searchtab.addEventListener("click", () => {
    switchtab(searchtab);
});


function getfromsessionstorage() 
{
    const lc = sessionStorage.getItem("user-c");
    if(!lc)
    {
        grantaccess.classList.add("active");

    }
    else{
        const cords = JSON.parse(lc);
        fetchuserwxinfo(cords);
    }
}

async function fetchuserwxinfo(cords)
{
    const{lat,lon}= cords;

    grantaccess.classList.remove("active");
    loadscreen.classList.add("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadscreen.classList.remove("active");
        userinfocontainer.classList.add("active");
        renderwxinfo(data);

    }
    catch(err)
    {
        loadscreen.classList.remove("active");
    }

}

function renderwxinfo(wxinfo) {
    const cityname = document.querySelector("[data-cityname]");
    const countryicon = document.querySelector("[data-countryicon]");
    const desc = document.querySelector("[data-wxdesc]");
    const wxicon = document.querySelector("[data-wxicon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");
    
    cityname.innerText = wxinfo?.name;
    countryicon.src = `https://flagcdn.com/144x108/${wxinfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = wxinfo?.weather?.[0]?.description;
    wxicon.src = `http://openweathermap.org/img/w/${wxinfo?.weather?.[0]?.icon}.png`;
    temp.innerText =   `${wxinfo?.main?.temp} °C`;
    
    windspeed.innerText = `${wxinfo?.wind?.speed} m/s`;
    humidity.innerText = `${wxinfo?.main?.humidity} %`;
    cloudiness.innerText = `${wxinfo?.clouds?.all} %`;
    
}


function getlocation(){
    if(navigator.geolocation)
    {   navigator.geolocation.getCurrentPosition(showposition);

    }
    else{
        console.log("CANT ACCESS IN YOUR BROWESER");

    }
}

function showposition(position){
    const usercoords = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-c", JSON.stringify(usercoords));
    fetchuserwxinfo(usercoords);
}

const grantbtn =  document.querySelector("[data-grantbtn]");
grantbtn.addEventListener("click",getlocation);  

const searchinput = document.querySelector("[data-searchform] input");

searchform.addEventListener("submit", (e) =>{
    e.preventDefault();
    let cityname= searchinput.value;
    if(cityname==="")
    {
        return;
    }
    else{
        fetchsearchwxinfo(cityname);
    }
});

async function fetchsearchwxinfo(city)
{
    loadscreen.classList.add("active");
    userinfocontainer.classList.remove("active");
    grantaccess.classList.remove("active");

    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        const data = await response.json();
        loadscreen.classList.remove("active");
        userinfocontainer.classList.add("active");
        renderwxinfo(data); 

    }
    catch(err){

    }
}