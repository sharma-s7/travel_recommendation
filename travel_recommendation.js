document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('destination');
  const searchBtn = document.getElementById('btnSearch');
  const clearBtn = document.getElementById('btnClear');
  const resultDiv = document.getElementById('result');

  let travelData = {};

  // Fetch JSON data
  fetch('travel_recommendation.json')
    .then(res => res.json())
    .then(data => {
      travelData = data;
      console.log('Travel data loaded:', travelData);
    })
    .catch(err => console.error('Failed to load data:', err));

  // Timezone mapping
  const timeZoneMap = {
    'Australia': 'Australia/Sydney',
    'Japan': 'Asia/Tokyo',
    'Brazil': 'America/Sao_Paulo',
    'Colombia': 'America/Bogota',
    'India': 'Asia/Kolkata',
    'French Polynesia': 'Pacific/Tahiti'
  };


  // Search handler
  searchBtn.addEventListener('click', () => {
  const keyword = searchInput.value.trim().toLowerCase();
  resultDiv.innerHTML = ''; // Clear previous results

  if (!keyword) return;

  const matches = [];

  // Normalize keyword to match categories
  const isBeachKeyword = /beach|beaches/.test(keyword);
  const isTempleKeyword = /temple|temples/.test(keyword);
  const isCountryKeyword = /country|countries|city|cities/.test(keyword);

  // Match by category
  if (isBeachKeyword && travelData.beaches) {
    travelData.beaches.forEach(beach => matches.push(beach));
  }

  if (isTempleKeyword && travelData.temples) {
    travelData.temples.forEach(temple => matches.push(temple));
  }

  if (isCountryKeyword && travelData.countries) {
    travelData.countries.forEach(country => {
      country.cities.forEach(city => matches.push(city));
    });
  }

  // Fallback: match by name if keyword doesn't match a category
  if (!isBeachKeyword && !isTempleKeyword && !isCountryKeyword) {
    travelData.countries?.forEach(country => {
      country.cities.forEach(city => {
        if (city.name.toLowerCase().includes(keyword)) {
          matches.push(city);
        }
      });
    });

    travelData.temples?.forEach(temple => {
      if (temple.name.toLowerCase().includes(keyword)) {
        matches.push(temple);
      }
    });

    travelData.beaches?.forEach(beach => {
      if (beach.name.toLowerCase().includes(keyword)) {
        matches.push(beach);
      }
    });
  }
 
  // Display results
  if (matches.length === 0) {
    alert(`No Results found for "${keyword}"`);
  } else {
    matches.forEach(item => {
      const card = document.createElement('div');
      card.className = 'recommendation-card';
      // Get local time for item's country
        const countryFromName = item.name.split(',').pop().trim();

  // Normalize country name if needed
  const normalizeCountryName = name => {
    const map = {
      'JP': 'Japan',
      'AU': 'Australia',
      'BR': 'Brazil',
      'CO': 'Colombia',
      'IN': 'India',
      '日本': 'Japan',
      'Brasil': 'Brazil',
      'French Polynesia': 'French Polynesia'
    };
    return map[name] || name;
  };

    const timeZone = timeZoneMap[normalizeCountryName(countryFromName)];

  // Set up card HTML first with empty <h3>
  card.innerHTML = `
    <img src="${item.imageUrl}" alt="${item.name}" />
    <h3></h3>
    <p>${item.description}</p>
    <button class="visit-btn">Visit</button>
  `;
  resultDiv.appendChild(card);

  // Now safely select <h3> and update it
  const title = card.querySelector('h3');

  const updateTime = () => {
    if (timeZone) {
      const options = {
        timeZone,
        hour12: true,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      };
      const localTime = new Date().toLocaleTimeString('en-US', options);
      title.innerHTML = `${item.name} – ${localTime}`;
    } else {
      title.textContent = item.name;
    }
  };

  updateTime();
  setInterval(updateTime, 1000); // Update every second

      card.querySelector('.visit-btn').addEventListener('click', () => {
        alert(`You clicked Visit for ${item.name}`);
      });
    });
  }
});

  // Clear handler
  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    resultDiv.innerHTML = '';
  });
});
