const API_CONFIG = {
    weatherApiKey: "5b8e72b346b31174bdd1ba94eef549fc",
    geoapifyApiKey: "042e0a9b873b4572a5572e340f7b2809",
    secondaryApiKey: "rc_live_2ecf3495f47e4851b9f06c9e144dc77c"
};

//task2 integrate external apis and process JSON
async function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_CONFIG.weatherApiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Weather API Error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("OpenWeather API Error:", error);
        return null;// Return null to indicate failure
    }
}

async function getCountryDetails(countryName) {
    const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Country API Error: ${response.status}`);
        const data = await response.json();
        return data[0]; 
    } catch (error) {
        console.error("Country API Error:", error);
        return null;
    }
}

async function getWorldTime(timezone) {
    const url = `https://worldtimeapi.org/api/timezone/${timezone}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`World Time API Error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("World Time API Error:", error);
        return null;
    }
}
