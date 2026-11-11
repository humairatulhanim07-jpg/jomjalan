let currentWeatherData = null;
let currentCity = "";

const searchBtn = document.getElementById("searchBtn");

if (searchBtn) {
    //1. event listener for search button click
    //Acara Klik Butang Cari Destinasi / Cuaca
    searchBtn.addEventListener("click", async () => {
        const citySelect = document.getElementById("country");
        const city = citySelect.value;

        if (!city) {
            alert("Please select a destination country/city first.");
            return;
        }

        //error handling: Semakan sambungan internet sebelum memanggil API (Failed APIs Requests)
        if (!navigator.onLine) {
            alert("⚠️ No internet connection. Please check your Wi-Fi or network connection.");
            document.getElementById("cityNameTitle").innerText = `${city}, International`;
            document.getElementById("weatherDescText").innerText = "Offline mode - network unavailable";
            document.getElementById("tempText").innerText = "28 °C";
            document.getElementById("conditionText").innerText = "Unknown";
            document.getElementById("humidityText").innerText = "75%";
            document.getElementById("windText").innerText = "3.5 m/s";
            document.getElementById("suggestionsText").innerHTML = `<p>⚠️ Network Error: Unable to fetch live weather data because your internet is disconnected. Please reconnect to view live weather and tailored recommendations.</p>`;
            return;
        }

        currentCity = city;
        //DOM1 bila user tekan button explore dia akan display result container
        const resultContainer = document.getElementById("resultContainer");
        resultContainer.style.display = "block";

        //DOM2 ubah teks elemen tajuk dan display loading message
        document.getElementById("cityNameTitle").innerText = "Loading destination data...";
        //DOM3  sama jugak macam atas
        document.getElementById("weatherDescText").innerText = "Please wait...";

        document.getElementById("tempText").innerText = "-- °C";
        document.getElementById("conditionText").innerText = "--";
        document.getElementById("humidityText").innerText = "--%";
        document.getElementById("windText").innerText = "-- m/s";
        document.getElementById("suggestionsText").innerHTML = "Analyzing weather and country rules...";

        let weatherData = null;
        try {
            weatherData = await getWeather(city);
        } catch (err) {
            console.error("Fetch error:", err);
        }

        // Senarai gambar khas mengikut bandar
    const cityImages = {
        "Tokyo": "https://cdn.mainichi.jp/vol1/2024/12/19/20241219p2g00m0na026000p/0c10.jpg?1",
        "Kuala Lumpur": "https://live.staticflickr.com/4091/5161044232_b6a2192bb2_b.jpg",
        "Paris": "https://cosmopoliclan.com/wp-content/uploads/2021/10/CosmopoliClan-France-Paris-Things-to-do-at-night-in-Paris-14-1-1024x768.jpg.webp",
        "Sydney": "https://media.istockphoto.com/id/1564247869/photo/sydney-at-night-nsw-australia.jpg?s=612x612&w=0&k=20&c=c9go8TrmozUgUg_wkElXarUG2r3uj8ewQlkvphBMlu8=",
        "London": "https://img.magnific.com/premium-photo/night-view-london-featuring-big-ben-london-eye-starry-sky_836155-9367.jpg?semt=ais_hybrid&w=740&q=80"
    };

    // Ambil gambar terus secara dinamik mengikut pilihan dropdown
    let bgUrl = cityImages[city];

    // DOM4: Ubah background image berdasarkan city yang dipilih
    const bannerElement = document.getElementById("destinationBanner");
    if (bannerElement) {
        bannerElement.style.minHeight = "180px";
        bannerElement.style.backgroundSize = "cover";
        bannerElement.style.backgroundPosition = "center";
        bannerElement.style.backgroundImage = `linear-gradient(to top, rgba(0,0,0,0.8), transparent), url('${bgUrl}')`;
    }

        //error handling: Permintaan API Gagal (Failed API Requests)
        if (!weatherData || weatherData.cod !== 200) {
            alert("⚠️ Failed to retrieve live weather data from server.");
            document.getElementById("cityNameTitle").innerText = `${city}, International`;
            document.getElementById("weatherDescText").innerText = "Live weather connection restricted";
            document.getElementById("tempText").innerText = "28 °C";
            document.getElementById("conditionText").innerText = "Clear";
            document.getElementById("humidityText").innerText = "75%";
            document.getElementById("windText").innerText = "3.5 m/s";
            //DOM5 display default message and recommendation
            document.getElementById("suggestionsText").innerHTML = `<p>☀️ General Travel Recommendation: Perfect weather conditions to explore key landmarks in ${city}. Enjoy your trip!</p>`;
            return;
        }

        currentWeatherData = weatherData;
        //1.temperature
        const temp = weatherData.main.temp;
        //2. condition
        const weatherCondition = weatherData.weather[0].main;
        //3. description
        const weatherDesc = weatherData.weather[0].description;
        //4. humidity
        const humidity = weatherData.main.humidity;
        //5. wind speed
        const windSpeed = weatherData.wind.speed;
        const countryCode = weatherData.sys.country;

        document.getElementById("cityNameTitle").innerText = `${weatherData.name}, ${countryCode}`;
        document.getElementById("weatherDescText").innerText = weatherDesc;
        document.getElementById("tempText").innerText = `${temp} °C`;
        document.getElementById("conditionText").innerText = weatherCondition;
        document.getElementById("humidityText").innerText = `${humidity}%`;
        document.getElementById("windText").innerText = `${windSpeed} m/s`;

        let activityRecommendation = "";

        //task3 implement suggestion logic (control statement) if...else
        if (city === "Tokyo") {
            if (weatherCondition === "Rain" || temp < 10) {
                activityRecommendation = "🌧️ Indoor Tokyo Experience: Since it's rainy or chilly, visit teamLab Planets art museum and indoor arcades in Akihabara.";
            } else if (temp >= 10 && temp <= 25) {
                activityRecommendation = "🌸 Outdoor Sightseeing in Tokyo: Take a peaceful walk through Ueno Park and visit Senso-ji Temple.";
            } else {
                activityRecommendation = "☀️ Summer Tokyo Attractions: Head over to Odaiba Seaside Park and shop inside air-conditioned complexes.";
            }
        } else if (city === "Kuala Lumpur") {
            if (weatherCondition === "Rain" || temp > 32) {
                activityRecommendation = "🏙️ Indoor KL Exploration: Explore Aquaria KLCC and shop at Pavilion Bukit Bintang.";
            } else {
                activityRecommendation = "🌿 Heritage Tour: Visit Batu Caves and stroll around Perdana Botanical Garden.";
            }
        } else if (city === "London") {
            if (weatherCondition === "Rain" || temp < 12) {
                activityRecommendation = "🏛️ Indoor London Tour: Visit the British Museum and explore the Natural History Museum.";
            } else {
                activityRecommendation = "🌳 Outdoor London Tour: Walk along the South Bank and visit Hyde Park.";
            }
        }else if (city === "Paris") {
            if (weatherCondition === "Rain" || temp < 15) {
                activityRecommendation = "🎨 Indoor Paris Experience: Explore the Louvre Museum and enjoy pastries in a classic Parisian café.";
            } else {
                activityRecommendation = "✨ Outdoor Paris Tour: Stroll along the Seine River and view the Eiffel Gardens.";
            }
        } else if (city === "Sydney") {
            if (weatherCondition === "Rain" || temp > 30) {
                activityRecommendation = "🦈 Indoor Sydney Experience: Visit SEA LIFE Sydney Aquarium and shop at the Queen Victoria Building.";
            } else {
                activityRecommendation = "🌊 Outdoor Sydney Experience: Walk around Sydney Opera House and Bondi Beach.";
            }
        }
        document.getElementById("suggestionsText").innerHTML = `<p>${activityRecommendation}</p>`;
    });
}

//2. event listener for Enter key press on the dropdown
//code calculate insurance and validation 
const calculateBtn = document.getElementById("calculateBtn");

if (calculateBtn) {
    //Acara Klik Butang Pengiraan Insurans
    calculateBtn.addEventListener("click", () => {
        const days = parseInt(document.getElementById("travelDays").value, 10);
        const travelers = parseInt(document.getElementById("travelersCount").value, 10);
        const dailyRate = parseFloat(document.getElementById("insuranceType").value);
        const selectedCity = document.getElementById("country").value;

        //make sure destination is selected and days and travelers are valid numbers
        if (!selectedCity) {
            alert("Please select a destination country/city at the top first!");
            return;
        }

        // Validate input values(positive value)
        //error handling: Input Tidak Sah (Invalid Input)
        let isValid = true;
        
        if (isNaN(days)) {
            isValid = false;
        } else if (days <= 0) {
            isValid = false;
        } else if (isNaN(travelers)) {
            isValid = false;
        } else if (travelers <= 0) {
            isValid = false;
        }

if (!isValid) {
    alert("Please enter a valid positive number for travel days and travelers.");
    return;
}

        //task4 perform a meaningful calculation (Base cost + processing fee + SST 6%)
        const baseInsuranceCost = days * travelers * dailyRate;
        const processingFee = 15.00;
        const serviceTax = baseInsuranceCost * 0.06;
        const grandTotal = baseInsuranceCost + processingFee + serviceTax;

        //display the breakdown of the insurance cost
        document.getElementById("costDisplay").innerHTML = `
            <div style="background: #f8fafc; padding: 16px; border-radius: 8px;">
                <h4 style="color: var(--primary); margin-bottom: 8px;">Insurance Breakdown Summary:</h4>
                <ul style="list-style: none; line-height: 1.8; font-size: 0.95rem;">
                    <li>• Base Premium (${days} Days × ${travelers} Pax): <strong>RM ${baseInsuranceCost.toFixed(2)}</strong></li>
                    <li>• Processing Fee: <strong>RM ${processingFee.toFixed(2)}</strong></li>
                    <li>• Service Tax (6% SST): <strong>RM ${serviceTax.toFixed(2)}</strong></li>
                    <li style="margin-top: 8px; font-size: 1.05rem; color: var(--primary-accent);">
                        <strong>Grand Total Payable: RM ${grandTotal.toFixed(2)}</strong>
                    </li>
                </ul>
            </div>
        `;
    });
}

function initAuthModalHandlers() {
    const openAuthBtn = document.getElementById("openAuthBtn");
    const closeAuthBtn = document.getElementById("closeAuthBtn");
    const authModal = document.getElementById("authModal");

    if (openAuthBtn && authModal) {
        openAuthBtn.onclick = () => {
            authModal.style.display = "flex";
        };
    }

    if (closeAuthBtn && authModal) {
        closeAuthBtn.onclick = () => {
            authModal.style.display = "none";
        };
    }

    const authForm = document.getElementById("authForm");
    if (authForm) {
        //3. event listener for form submission
        //Acara Hantar Borang Pengesahan (Authentication Form Submission)
        authForm.onsubmit = (e) => {
            e.preventDefault();
            const email = document.getElementById("emailInput").value;
            const username = email.split('@')[0];
            
            if (openAuthBtn) {
                openAuthBtn.innerHTML = `<i class="fa-solid fa-user-check"></i> Hello user ${username}`;
                openAuthBtn.style.background = "#eff6ff";
                openAuthBtn.style.borderColor = "var(--primary-accent)";
                openAuthBtn.style.color = "var(--primary-accent)";
            }

            alert(`Signed in successfully as ${email}!`);
            authModal.style.display = "none";
        };
    }
}

//5. event listener for DOMContentLoaded to initialize modal handlers
document.addEventListener("DOMContentLoaded", initAuthModalHandlers);