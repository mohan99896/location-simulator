let map, marker, accuracyCircle, watchId = null;
let simInterval = null;
let lat = 28.6139, lon = 77.2090; // Default: New Delhi
let acc = 15; // Accuracy for simulator

function initMap() {
    map = L.map('map').setView([lat, lon], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}

function updateUI(lat, lon, acc) {
    document.getElementById('lat').textContent = lat.toFixed(6);
    document.getElementById('lon').textContent = lon.toFixed(6);

    if (!marker) {
        marker = L.marker([lat, lon]).addTo(map);
    } else {
        marker.setLatLng([lat, lon]);
    }

    if (!accuracyCircle) {
        accuracyCircle = L.circle([lat, lon], { radius: acc }).addTo(map);
    } else {
        accuracyCircle.setLatLng([lat, lon]);
        accuracyCircle.setRadius(acc);
    }

    map.setView([lat, lon], 16);
    marker.bindPopup(`Lat: ${lat.toFixed(6)}<br>Lon: ${lon.toFixed(6)}<br>Accuracy: ${Math.round(acc)} m`).openPopup();
}

function startLiveMode() {
    stopSimulator();
    if (!('geolocation' in navigator)) {
        alert('Geolocation is not supported by your browser.');
        return;
    }
    watchId = navigator.geolocation.watchPosition(
        (pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            const acc = pos.coords.accuracy;
            updateUI(lat, lon, acc);
        },
        (err) => {
            console.error(err);
            alert('Location error: ' + err.message);
        },
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );
}

function startSimulator() {
    stopLiveMode();
    simInterval = setInterval(() => {
        lat += (Math.random() - 0.5) * 0.0005;
        lon += (Math.random() - 0.5) * 0.0005;
        updateUI(lat, lon, acc);
    }, 2000);
}

function stopLiveMode() {
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
}

function stopSimulator() {
    if (simInterval !== null) {
        clearInterval(simInterval);
        simInterval = null;
    }
}

window.addEventListener('load', () => {
    initMap();
    startLiveMode(); // Auto-start in live mode

    document.getElementById('liveBtn').addEventListener('click', startLiveMode);
    document.getElementById('simBtn').addEventListener('click', startSimulator);
});
