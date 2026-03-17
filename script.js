// --- DUMMY DATA --- //
// Graph showing physical connections between distinct locations in Chennai region
const locationGraph = {
    'Chengalpattu': ['Guduvancheri'],
    'Guduvancheri': ['Chengalpattu', 'Tambaram'],
    'Tambaram': ['Guduvancheri', 'Trisulam', 'Chromepet'],
    'Chromepet': ['Tambaram', 'Guindy', 'Trisulam'],
    'Trisulam': ['Tambaram', 'Chromepet', 'Perambur'],
    'Perambur': ['Trisulam'],
    'Guindy': ['Chromepet', 'Velachery', 'Adyar'],
    'Velachery': ['Guindy', 'Taramani'],
    'Taramani': ['Velachery', 'Adyar'],
    'Adyar': ['Guindy', 'Taramani']
};

// --- MAP SYSTEM --- //
const locationCoords = {
    'Chengalpattu': [12.6819, 79.9888],
    'Guduvancheri': [12.8427, 80.0558],
    'Tambaram': [12.9249, 80.1100],
    'Chromepet': [12.9516, 80.1404],
    'Trisulam': [12.9806, 80.1706],
    'Guindy': [13.0067, 80.2206],
    'Velachery': [12.9754, 80.2206],
    'Taramani': [12.9863, 80.2432],
    'Adyar': [13.0012, 80.2565],
    'Perambur': [13.1098, 80.2443]
};

let map;
let mapMarkers = {};
let mapPolylines = [];
let localDonorMarkers = [];

// Database of resources available at each node
const resourceDatabase = {
    'Chengalpattu': {
        name: 'Chengalpattu Govt Hospital',
        inventory: ['Blood', 'Hospital'],
        distance: 12, waitTime: 45, availability: 3
    },
    'Guduvancheri': {
        name: 'SRM Medical Clinic',
        inventory: ['Blood'],
        distance: 5, waitTime: 10, availability: 5
    },
    'Tambaram': {
        name: 'Hindu Mission Hospital',
        inventory: ['Hospital', 'Organ'],
        distance: 8, waitTime: 120, availability: 2
    },
    'Chromepet': {
        name: 'Balaji Memorial Clinic',
        inventory: ['Blood', 'Hospital'],
        distance: 10, waitTime: 20, availability: 4
    },
    'Trisulam': {
        name: 'Airport Trauma Center',
        inventory: ['Blood', 'Hospital', 'Organ'],
        distance: 15, waitTime: 30, availability: 4
    },
    'Guindy': {
        name: 'Guindy Speciality Care',
        inventory: ['Blood', 'Organ'],
        distance: 18, waitTime: 40, availability: 3
    },
    'Velachery': {
        name: 'Apollo OMR Branch',
        inventory: ['Hospital', 'Blood'],
        distance: 22, waitTime: 15, availability: 5
    },
    'Taramani': {
        name: 'VHS Institute',
        inventory: ['Organ'],
        distance: 24, waitTime: 50, availability: 2
    },
    'Adyar': {
        name: 'Fortis Malar Hospital',
        inventory: ['Hospital', 'Organ', 'Blood'],
        distance: 20, waitTime: 10, availability: 5
    },
    'Perambur': {
        name: 'Railway Hospital Unit',
        inventory: ['Organ'],
        distance: 25, waitTime: 5, availability: 1
    }
};

// --- LOCAL DONORS DATA (360° SEARCH) --- //
// Dummy data representing individuals/small clinics around the selected node
const DEFAULT_LOCAL_DONORS = {
    'Chengalpattu': [
        { id: '1', name: 'Arun K.', detail: 'O+ Volunteer', distance: '0.5 km', type: 'Blood', coords: [12.6859, 79.9858] },
        { id: '2', name: 'City Blood Bank', detail: 'General Supply', distance: '1.2 km', type: 'Blood', coords: [12.6780, 79.9910] }
    ],
    'Guduvancheri': [
        { id: '3', name: 'Suresh M.', detail: 'A- Donor', distance: '0.3 km', type: 'Blood', coords: [12.8450, 80.0510] },
        { id: '4', name: 'Local Clinic', detail: 'First Aid', distance: '0.9 km', type: 'Hospital', coords: [12.8400, 80.0590] }
    ],
    'Tambaram': [
        { id: '5', name: 'Lions Club Bank', detail: 'Blood Reserves', distance: '0.4 km', type: 'Blood', coords: [12.9280, 80.1130] },
        { id: '6', name: 'Rajesh V.', detail: 'Organ Pledge', distance: '1.5 km', type: 'Organ', coords: [12.9200, 80.1050] },
        { id: '7', name: 'Tambaram Care', detail: 'Small Clinic', distance: '2.1 km', type: 'Hospital', coords: [12.9210, 80.1150] }
    ],
    'Chromepet': [
        { id: '8', name: 'Karthik S.', detail: 'B+ Donor', distance: '0.8 km', type: 'Blood', coords: [12.9536, 80.1424] }
    ],
    'Trisulam': [
        { id: '9', name: 'Airport Medical', detail: 'ER Setup', distance: '0.1 km', type: 'Hospital', coords: [12.9820, 80.1710] }
    ],
    'Guindy': [
        { id: '10', name: 'Ramesh Foundation', detail: 'Organ Net', distance: '1.2 km', type: 'Organ', coords: [13.0087, 80.2226] }
    ],
    'Velachery': [
        { id: '11', name: 'Anita B.', detail: 'AB- Donor', distance: '0.9 km', type: 'Blood', coords: [12.9774, 80.2226] },
        { id: '12', name: 'Community Care', detail: 'First Aid', distance: '1.6 km', type: 'Hospital', coords: [12.9734, 80.2186] }
    ],
    'Taramani': [
        { id: '13', name: 'Tech Park Blood Drive', detail: 'Mixed O/A/B', distance: '0.2 km', type: 'Blood', coords: [12.9883, 80.2412] }
    ],
    'Adyar': [
        { id: '14', name: 'Bhavani R.', detail: 'Kidney Match', distance: '1.1 km', type: 'Organ', coords: [13.0032, 80.2585] }
    ],
    'Perambur': [
        { id: '15', name: 'Priya S.', detail: 'B+ Donor', distance: '1.1 km', type: 'Blood', coords: [13.1120, 80.2400] },
        { id: '16', name: 'Jeevan Bank', detail: 'Eye/Organ', distance: '0.6 km', type: 'Organ', coords: [13.1070, 80.2480] }
    ]
};

// --- DATA PERSISTENCE INIT --- //
let localDonorsDatabase = {};

function initDatabase() {
    const storedData = localStorage.getItem('mediflow_local_donors');
    if (storedData) {
        localDonorsDatabase = JSON.parse(storedData);
    } else {
        localDonorsDatabase = Object.assign({}, DEFAULT_LOCAL_DONORS);
        saveDatabase();
    }
}

function saveDatabase() {
    localStorage.setItem('mediflow_local_donors', JSON.stringify(localDonorsDatabase));
}


// --- AI SEARCH ALGORITHMS --- //

function initMap() {
    map = L.map('map', {
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        touchZoom: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    let latLngsArr = [];
    for (const [loc, coords] of Object.entries(locationCoords)) {
        let marker = L.marker(coords).addTo(map)
            .bindPopup(`<b>${loc} Node</b><br>${resourceDatabase[loc].name}`);
        mapMarkers[loc] = marker;
        latLngsArr.push(coords);
    }
    
    // Auto-fit perfectly to the 5 nodes
    if (latLngsArr.length > 0) {
        let bounds = L.latLngBounds(latLngsArr);
        map.fitBounds(bounds, { padding: [40, 40] });
    }
    
    // Draw default graph edges connecting locations
    for (const [node, neighbors] of Object.entries(locationGraph)) {
        for (const neighbor of neighbors) {
             L.polyline([locationCoords[node], locationCoords[neighbor]], {
                 color: '#cbd5e1',
                 weight: 2,
                 opacity: 0.5,
                 dashArray: '5, 5'
             }).addTo(map);
        }
    }
}

function drawPathOnMap(pathArray, color) {
    if (!pathArray || pathArray.length === 0) return;
    
    let latlngs = pathArray.map(node => locationCoords[node]);
    
    // Draw actual colored path
    const line = L.polyline(latlngs, {
        color: color,
        weight: 5,
        opacity: 0.8
    }).addTo(map);
    
    // Draw animated dash effect to simulate "traveling direction"
    const decorator = L.polyline(latlngs, {
        color: 'white',
        weight: 2,
        dashArray: '5, 15',
        opacity: 0.9
    }).addTo(map);
    
    mapPolylines.push(line);
    mapPolylines.push(decorator);
}

function clearPaths() {
    mapPolylines.forEach(p => map.removeLayer(p));
    mapPolylines = [];
    localDonorMarkers.forEach(m => map.removeLayer(m));
    localDonorMarkers = [];
}

// Distance Helper: Calculates geographic distance along a node path in km
function calculatePathDistance(pathArray) {
    if (!pathArray || pathArray.length <= 1) return 0;
    let totalDist = 0;
    // Simple rough lat/lng cartesian distance multiplier for demo (or haversine)
    for (let i = 0; i < pathArray.length - 1; i++) {
        let coords1 = locationCoords[pathArray[i]];
        let coords2 = locationCoords[pathArray[i+1]];
        // Approximate Haversine for India region
        let dLat = (coords2[0] - coords1[0]) * 111; 
        let dLon = (coords2[1] - coords1[1]) * 111;
        totalDist += Math.sqrt(dLat*dLat + dLon*dLon);
    }
    return Math.max(1, Math.round(totalDist * 10) / 10);
}

// 1. Breadth-First Search (BFS) - Finds Nearest
function findNearest(startNode, requestedNeed) {
    let queue = [ [startNode] ]; // Stores paths instead of just nodes
    let visited = new Set();
    
    while (queue.length > 0) {
        let currentPath = queue.shift();
        let currentNode = currentPath[currentPath.length - 1];
        
        if (!visited.has(currentNode)) {
            visited.add(currentNode);
            
            // Check if current node has what we need
            let nodeData = resourceDatabase[currentNode];
            if (nodeData.inventory.includes(requestedNeed)) {
                return { location: currentNode, data: nodeData, path: currentPath };
            }
            
            // Add neighbors to queue
            let neighbors = locationGraph[currentNode] || [];
            for (let neighbor of neighbors) {
                if (!visited.has(neighbor)) {
                    queue.push([...currentPath, neighbor]); // Build path
                }
            }
        }
    }
    return null; // Not found
}

// 2. Depth-First Search (DFS) - Finds Deep/Alternative Match
function findAlternative(node, requestedNeed, visited = new Set(), resultsArray = [], currentPath = []) {
    visited.add(node);
    
    // Copy path to safely branch out
    let path = [...currentPath, node];
    
    let nodeData = resourceDatabase[node];
    if (nodeData.inventory.includes(requestedNeed)) {
        resultsArray.push({ location: node, data: nodeData, path: path });
    }
    
    let neighbors = locationGraph[node] || [];
    for (let neighbor of neighbors) {
        if (!visited.has(neighbor)) {
            findAlternative(neighbor, requestedNeed, visited, resultsArray, path);
        }
    }
    
    return resultsArray.length > 0 ? resultsArray[resultsArray.length - 1] : null;
}

// Helper to quickly route to cost-based decision
function getShortestPath(start, target) {
    if (start === target) return [start];
    let queue = [ [start] ];
    let visited = new Set();
    while (queue.length > 0) {
        let path = queue.shift();
        let node = path[path.length - 1];
        if (!visited.has(node)) {
            visited.add(node);
            if (node === target) return path;
            for (let n of locationGraph[node] || []) queue.push([...path, n]);
        }
    }
    return [start, target];
}

// 3. Cost-Based Search - Finds the objectively best option
function findBestOverall(startNode, requestedNeed, urgency) {
    let allMatches = [];
    
    // Determine the precise paths to all matches first
    for (let node in resourceDatabase) {
        if (resourceDatabase[node].inventory.includes(requestedNeed)) {
             let path = getShortestPath(startNode, node);
             let distance = calculatePathDistance(path);
             allMatches.push({ location: node, data: resourceDatabase[node], path: path, routeDistance: distance });
        }
    }
    
    if (allMatches.length === 0) return null;
    
    let sortedMatches = allMatches.sort((a, b) => {
        let costA, costB;
        if (urgency === 'high') {
             // Urgent: Care heavily about wait time and exact route distance
             costA = a.routeDistance*2 + a.data.waitTime*3 - a.data.availability;
             costB = b.routeDistance*2 + b.data.waitTime*3 - b.data.availability;
        } else if (urgency === 'low') {
             // Low urgency: Care massively about availability/readiness score
             costA = a.routeDistance + a.data.waitTime - (a.data.availability * 20); 
             costB = b.routeDistance + b.data.waitTime - (b.data.availability * 20);
        } else {
             // Medium (Default)
             costA = a.routeDistance + a.data.waitTime - (a.data.availability * 5); 
             costB = b.routeDistance + b.data.waitTime - (b.data.availability * 5);
        }
        
        a.calculatedCost = Math.round(costA);
        b.calculatedCost = Math.round(costB);
        return costA - costB;
    });
    
    let bestMatch = sortedMatches[0];
    return bestMatch;
}

// --- DOM AND UI INTEGRATION --- //

document.addEventListener('DOMContentLoaded', () => {
    initDatabase();
    initMap();
    
    // --- APP STATE --- //
    // To allow persistence through state
    window.currentStartLocation = '';
    window.currentNeed = '';
    
    const form = document.getElementById('search-form');
    const resultsContainer = document.getElementById('results-container');
    const btnText = document.querySelector('.btn-text');
    const loader = document.getElementById('search-loader');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let startLocation = document.getElementById('location').value;
        let need = document.getElementById('need').value;
        let urgencyInputs = document.querySelectorAll('input[name="urgency"]:checked');
        let urgency = urgencyInputs.length > 0 ? urgencyInputs[0].value : 'medium';
        
        // Save state for patient manager
        window.currentStartLocation = startLocation;
        window.currentNeed = need;
        
        // Show loading state
        btnText.classList.add('hidden');
        loader.classList.remove('hidden');
        resultsContainer.classList.add('hidden');
        
        // Artificial delay for "computation" feel
        setTimeout(() => {
            executeSearch(startLocation, need, urgency);
            btnText.classList.remove('hidden');
            loader.classList.add('hidden');
            resultsContainer.classList.remove('hidden');
            // Scroll to results smoothly
            resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 1200);
    });

    // --- PATIENT MANAGER LOGIC --- //
    const toggleBtn = document.getElementById('toggle-patient-mgr');
    const managerPanel = document.getElementById('patient-manager-panel');
    const addPatientBtn = document.getElementById('add-patient-btn');

    toggleBtn.addEventListener('click', () => {
        managerPanel.classList.toggle('hidden');
        toggleBtn.innerText = managerPanel.classList.contains('hidden') ? '+ Manage Patients' : '- Close Panel';
    });

    addPatientBtn.addEventListener('click', () => {
        if (!window.currentStartLocation) return alert("Please run a search first to set your location.");
        
        const name = document.getElementById('new-patient-name').value;
        const details = document.getElementById('new-patient-detail').value;
        const type = document.getElementById('new-patient-type').value;

        if (!name) return alert("Please enter a name");

        // Add dummy distance and slight coordinate offset around the selected location
        let baseCoords = locationCoords[window.currentStartLocation];
        let newCoords = [
            baseCoords[0] + (Math.random() - 0.5) * 0.005,
            baseCoords[1] + (Math.random() - 0.5) * 0.005
        ];

        let newPatient = {
            id: Date.now().toString(), // Simple unique ID
            name: name,
            detail: details || 'Recently Added',
            distance: '0.1 km',
            type: type,
            coords: newCoords
        };

        if (!localDonorsDatabase[window.currentStartLocation]) {
             localDonorsDatabase[window.currentStartLocation] = [];
        }
        
        localDonorsDatabase[window.currentStartLocation].push(newPatient);
        saveDatabase(); // Persist State
        
        // Clear fields
        document.getElementById('new-patient-name').value = '';
        document.getElementById('new-patient-detail').value = '';

        // Re-render local search
        renderLocalSearch(window.currentStartLocation, window.currentNeed);
    });
});

function executeSearch(startLocation, need, urgency) {
    // Clear previous paths and markers
    clearPaths();
    
    // 0. Execute 360 Local Search
    renderLocalSearch(startLocation, need);
    
    // 1. Execute BFS
    const bfsResultObj = findNearest(startLocation, need);
    if (bfsResultObj) bfsResultObj.routeDistance = calculatePathDistance(bfsResultObj.path);
    renderCard('bfs-result', bfsResultObj, 'Shortest Path Hops');
    if (bfsResultObj) drawPathOnMap(bfsResultObj.path, '#4338ca'); // Blue for BFS
    
    // 2. Execute DFS
    const dfsResultObj = findAlternative(startLocation, need);
    if (dfsResultObj) dfsResultObj.routeDistance = calculatePathDistance(dfsResultObj.path);
    renderCard('dfs-result', dfsResultObj, 'Deep Network Dive');
    if (dfsResultObj) drawPathOnMap(dfsResultObj.path, '#be185d'); // Pink for DFS
    
    // 3. Execute Cost Based
    const costResultObj = findBestOverall(startLocation, need, urgency);
    renderCard('cost-result', costResultObj, `Calculated Cost: ${costResultObj ? costResultObj.calculatedCost : 'N/A'} (Urgency: ${urgency.toUpperCase()})`);
    if (costResultObj) drawPathOnMap(costResultObj.path, '#047857'); // Green for Cost
}

function renderCard(elementId, resultObj, metaLabel) {
    const container = document.getElementById(elementId);
    
    if (!resultObj) {
        container.innerHTML = `
            <div class="result-item">
                <div class="result-name">No Match Found</div>
                <p style="color:var(--text-muted);font-size:0.9rem;">No resources available in the network.</p>
            </div>
        `;
        return;
    }
    
    const { location, data, path, routeDistance } = resultObj;
    
    // Create arrowed path strong
    let pathString = path ? path.join(' ➔ ') : location;
    
    // Calculate travel times based on exact route distance
    let finalDist = routeDistance || data.distance; // fallback just in case
    let carTime = Math.ceil((finalDist / 40) * 60); // Assuming 40 km/h
    let bikeTime = Math.ceil((finalDist / 30) * 60); // Assuming 30 km/h
    let busTime = Math.ceil((finalDist / 20) * 60); // Assuming 20 km/h
    
    container.innerHTML = `
        <div class="result-item">
            <div class="result-name">${data.name}</div>
            <div class="result-stat">📌 <strong>Location Node:</strong> ${location}</div>
        </div>
        
        <div class="result-item">
            <div class="result-stat" style="margin-bottom: 0.75rem;">🛣️ <strong>Travel Route:</strong> <span style="color:var(--primary); font-size:0.85rem">${pathString}</span></div>
            <div class="result-stat">🚗 <strong>Travel Distance:</strong> ${finalDist} km</div>
            <div class="result-stat">⏱ <strong>Hospital Wait Time:</strong> ${data.waitTime} mins</div>
            <div class="result-stat">⭐ <strong>Readiness Score:</strong> ${data.availability}/5</div>
        </div>

        <div class="result-item" style="background:#f1f5f9; padding:0.75rem; border-radius:8px; margin-top:0.5rem;">
            <div style="font-size:0.8rem; font-weight:600; text-transform:uppercase; color:var(--text-muted); margin-bottom:0.25rem;">Estimated Travel Times:</div>
            <div style="display:flex; justify-content:space-between; font-size:0.85rem;">
                <span>🚘 Car: <strong>${carTime}m</strong></span>
                <span>🛵 Bike: <strong>${bikeTime}m</strong></span>
                <span>🚌 Bus: <strong>${busTime}m</strong></span>
            </div>
        </div>
        
        <div style="margin-top:1rem; padding-top:1rem; border-top: 1px dashed #e2e8f0; font-size: 0.85rem; color: var(--primary); font-family: monospace; font-weight: 600;">
            > RESULT METADATA: ${metaLabel}
        </div>
    `;
}

function renderLocalSearch(startLocation, need) {
    const grid = document.getElementById('local-donors-grid');
    grid.innerHTML = ''; // reset
    
    let localMatches = localDonorsDatabase[startLocation] || [];
    
    // Filter purely for requested need (optional, or we can show all local items)
    let filteredMatches = localMatches.filter(donor => donor.type === need || need === 'Hospital'); 
    
    if (filteredMatches.length === 0) {
        grid.innerHTML = `<div style="color:var(--text-muted); padding: 1rem;">No immediate local individuals found for ${need}. Proceeding to AI Hospital Routing below...</div>`;
        return;
    }
    
    filteredMatches.forEach((donor, index) => {
        // Ensure ID exists for deleting
        if (!donor.id) donor.id = 'donor_' + index;

        // Create UI Card
        let el = document.createElement('div');
        el.style.background = 'white';
        el.style.padding = '1rem';
        el.style.borderRadius = '8px';
        el.style.border = '1px solid #e2e8f0';
        el.style.position = 'relative';
        
        el.innerHTML = `
            <button onclick="deletePatient('${startLocation}', '${donor.id}')" style="position:absolute; top:8px; right:8px; background:transparent; border:none; color:var(--urgency-high); font-weight:bold; cursor:pointer;" title="Remove Patient">✖</button>
            <div style="font-weight:700; color:var(--text-main); font-size:1.1rem; padding-right:1rem;">👤 ${donor.name}</div>
            <div style="font-size:0.85rem; color:var(--primary); font-weight:600; margin-bottom:0.5rem;">${donor.detail}</div>
            <div style="font-size:0.85rem; color:var(--text-muted);">📍 ${donor.distance} away</div>
        `;
        grid.appendChild(el);
        
        // Drop Marker on Map (Using distinct icon styling if possible, or standard)
        let customIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: var(--urgency-low); width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7]
        });
        
        let marker = L.marker(donor.coords, {icon: customIcon}).addTo(map)
            .bindPopup(`<b>Local Match</b><br>${donor.name} (${donor.detail})`);
            
        localDonorMarkers.push(marker);
    });
}

function deletePatient(locationContext, patientId) {
    // Confirm dialogue
    if (!confirm("Are you sure you want to remove this patient/donor record?")) return;

    // Filter out the requested id
    let dbArray = localDonorsDatabase[locationContext] || [];
    localDonorsDatabase[locationContext] = dbArray.filter(d => d.id !== patientId);
    
    saveDatabase(); // Persist State
    
    // Refresh visual view
    if (window.currentStartLocation && window.currentNeed) {
        clearPaths(); // Optional: clears map so markers reset cleanly
        renderLocalSearch(window.currentStartLocation, window.currentNeed);
        // Note: clearing paths also clears AI routes, so we may want to just re-run search entirely if needed, 
        // but for simplicity, we just rerender local UI. The user can hit 'run search' again for routes.
    }
}
