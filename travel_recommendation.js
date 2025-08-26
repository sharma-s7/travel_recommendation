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
    resultDiv.innerHTML = `<p>No results found for "${keyword}".</p>`;
  } else {
    matches.forEach(item => {
      const card = document.createElement('div');
      card.className = 'recommendation-card';
      card.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.name}" />
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <button class="visit-btn">Visit</button>
      `;
      resultDiv.appendChild(card);

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
