import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js';

// Get references to our DOM elements
const loadingScreen = document.getElementById('loading-screen');
const sidebar = document.getElementById('sidebar');
const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
const sidebarMainContent = document.getElementById('sidebar-main-content');
const sidebarDetailsView = document.getElementById('sidebar-details-view');
const backToMainBtn = document.getElementById('back-to-main-btn');
const infoBox = document.getElementById('info-box');
const statsPanel = document.getElementById('stats-panel');
const searchBox = document.getElementById('search-box');
const topicFilter = document.getElementById('topic-filter');
const togglePathBtn = document.getElementById('toggle-path-btn');
const mainContent = document.getElementById('main-content');

// --- AI feature elements ---
const languageInput = document.getElementById('language-input');
const getCodeBtn = document.getElementById('get-code-btn');
const aiLoading = document.getElementById('ai-loading');

// --- Modal elements ---
const codeModal = document.getElementById('code-modal');
const modalCodeOutput = document.getElementById('modal-code-output');
const closeModalBtn = document.getElementById('close-modal-btn');

let currentProblemName = null; // Variable to store the current problem name

// 1. Scene, Camera, and Renderer Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 50, 100);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg-canvas'),
    antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// 2. Lighting and Controls
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Group for interactive stars
const interactiveStarsGroup = new THREE.Group();
scene.add(interactiveStarsGroup);

let journeyPath = null, cameraTarget = null, isAnimatingCamera = false;

// Function to create the Sun
function addSun() {
    const sunLight = new THREE.DirectionalLight(0xffffff, 2);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);
    const textureLoader = new THREE.TextureLoader();
    const textureFlare0 = textureLoader.load("https://cdn.jsdelivr.net/npm/three@0.157.0/examples/textures/lensflare/lensflare0.png");
    const textureFlare3 = textureLoader.load("https://cdn.jsdelivr.net/npm/three@0.157.0/examples/textures/lensflare/lensflare3.png");
    const lensflare = new Lensflare();
    lensflare.addElement(new LensflareElement(textureFlare0, 700, 0, sunLight.color));
    sunLight.add(lensflare);
}

// Function to create the SPIRAL GALAXY
function addGalaxy() {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ size: 0.1, vertexColors: true, transparent: true, opacity: 0.7, sizeAttenuation: true });
    const starVertices = [], starColors = [];
    const baseColor = new THREE.Color("#FFFFFF"), accentColor = new THREE.Color("#ADD8E6");
    const galaxyParams = { count: 30000, radius: 150, branches: 4, spin: 1.5, randomness: 0.5, randomnessPower: 3 };
    for (let i = 0; i < galaxyParams.count; i++) {
        const radius = Math.random() * galaxyParams.radius;
        const spinAngle = radius * galaxyParams.spin;
        const branchAngle = (i % galaxyParams.branches) / galaxyParams.branches * Math.PI * 2;
        const randomX = Math.pow(Math.random(), galaxyParams.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * galaxyParams.randomness * radius;
        const randomY = Math.pow(Math.random(), galaxyParams.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * galaxyParams.randomness * 0.2;
        const randomZ = Math.pow(Math.random(), galaxyParams.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * galaxyParams.randomness * radius;
        const x = Math.cos(branchAngle + spinAngle) * radius + randomX, y = randomY, z = Math.sin(branchAngle + spinAngle) * radius + randomZ;
        starVertices.push(x, y, z);
        const color = baseColor.clone().lerp(accentColor, Math.random() * 0.2);
        starColors.push(color.r, color.g, color.b);
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    starGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));
    const galaxy = new THREE.Points(starGeometry, starMaterial);
    window.galaxy = galaxy;
    scene.add(galaxy);
}

// 3. Raycaster for Click Detection
const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2();

function onPointerClick(event) {
    if (isAnimatingCamera) return;

    // Don't trigger star clicks if the click is on the sidebar
    if (sidebar.contains(event.target)) return;


    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(interactiveStarsGroup.children);
    if (intersects.length > 0) {
        const clickedStar = intersects[0].object;
        const dayData = clickedStar.userData;

        // --- Updated InfoBox and AI logic ---
        currentProblemName = dayData.problems[0].name;
        languageInput.value = '';

        infoBox.innerHTML = `<h3>Day ${dayData.day}</h3><ul>${dayData.problems.map(p => `<li><div class="problem-details"><div class="planet-title">Planet Name:</div><a href="${p.link}" class="gfg-link" target="_blank">${p.name} ${p.emojis.join(' ')}</a><a href="${p.twitterPostLink}" class="twitter-link" target="_blank">View Post on 𝕏</a></div><span class="difficulty ${p.difficulty.toLowerCase()}">${p.difficulty}</span></li>`).join('')}</ul> <p class="notes">${dayData.problems[0].notes || ''}</p>`;

        sidebarMainContent.style.display = 'none';
        sidebarDetailsView.style.display = 'block';

        // Open sidebar on mobile when a star is clicked
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('collapsed');
        }
    }
}
window.addEventListener('click', onPointerClick);


// 4. Main Initialization Function
async function init() {
    const response = await fetch('/api/journey-data');
    const journeyData = await response.json();
    const numBranches = 4;
    const allTopics = new Set();

    journeyData.forEach((day, i) => {
        const geometry = new THREE.SphereGeometry(1.5, 30, 30);
        const material = new THREE.MeshStandardMaterial({ color: day.color, emissive: day.color, emissiveIntensity: 3, transparent: true });
        const star = new THREE.Mesh(geometry, material);
        const branchIndex = i % numBranches;
        const branchAngle = (branchIndex / numBranches) * Math.PI * 2;
        const distanceFromCenter = 20 + Math.random() * 100;

        const spinAngle = distanceFromCenter * 0.05;

        const x = Math.cos(branchAngle + spinAngle) * distanceFromCenter;
        const y = (Math.random() - 0.5) * 5;
        const z = Math.sin(branchAngle + spinAngle) * distanceFromCenter;
        star.position.set(x, y, z);
        star.userData = day;

        star.userData.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.02
        );

        interactiveStarsGroup.add(star);
        day.problems[0].topics.forEach(topic => allTopics.add(topic));
    });

    allTopics.forEach(topic => {
        const option = document.createElement('option');
        option.value = topic;
        option.innerText = topic;
        topicFilter.appendChild(option);
    });

    const points = interactiveStarsGroup.children.slice().sort((a, b) => a.userData.day - b.userData.day).map(star => star.position);
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00f6ff, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending });
    journeyPath = new THREE.Line(lineGeometry, lineMaterial);
    journeyPath.visible = false;
    scene.add(journeyPath);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/space.jpg', function(texture) {
        scene.background = texture;
    });

    const stats = { easy: 0, medium: 0, hard: 0 };
    const topics = {};
    journeyData.forEach(day => {
        const problem = day.problems[0];
        stats[problem.difficulty.toLowerCase()]++;
        problem.topics.forEach(topic => { topics[topic] = (topics[topic] || 0) + 1; });
    });
    const topTopic = Object.entries(topics).sort((a, b) => b[1] - a[1])[0];
    statsPanel.innerHTML = `<h3>Journey Statistics</h3><p>Total Problems: <span>${journeyData.length}</span></p><p>Easy: <span>${stats.easy}</span></p><p>Medium: <span>${stats.medium}</span></p><p>Hard: <span>${stats.hard}</span></p><p>Top Topic: <span>${topTopic[0]} (${topTopic[1]})</span></p>`;

    loadingScreen.style.opacity = '0';
    loadingScreen.addEventListener('transitionend', () => loadingScreen.remove());
    addSun();
    addGalaxy();

    // Set initial sidebar state for mobile
    if (window.innerWidth <= 768) {
        sidebar.classList.add('collapsed');
    }
}

function panCameraTo(targetObject) {
    isAnimatingCamera = true;
    const offset = new THREE.Vector3(0, 5, 20);
    cameraTarget = targetObject.position.clone().add(offset);
    controls.target.copy(targetObject.position);
}

function highlightStars(filterText, filterType) {
    let singleMatch = null;
    let matchCount = 0;
    const isFilterEmpty = filterText === '';
    interactiveStarsGroup.children.forEach(star => {
        const problem = star.userData.problems[0];
        let isMatch = isFilterEmpty || (filterType === 'topic' ? problem.topics.includes(filterText) : problem.name.toLowerCase().includes(filterText.toLowerCase()));
        star.material.opacity = isMatch ? 1.0 : 0.15;
        if(isMatch) matchCount++;
        if (isMatch && filterType === 'search') singleMatch = star;
    });
    if (matchCount === 1 && singleMatch) {
        panCameraTo(singleMatch);
    } else {
        isAnimatingCamera = false;
        cameraTarget = null;
        controls.target.set(0,0,0);
    }
}

// 5. Animation Loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();

    if (isAnimatingCamera && cameraTarget) {
        camera.position.lerp(cameraTarget, 0.05);
        if (camera.position.distanceTo(cameraTarget) < 0.1) {
            isAnimatingCamera = false;
            cameraTarget = null;
        }
    } else if (controls.enabled) {
        const time = Date.now() * 0.0005;
        camera.position.x = Math.sin(time * 0.1) * 100;
        camera.position.z = Math.cos(time * 0.1) * 100;
        camera.lookAt(scene.position);
    }

    const pulseTime = Date.now() * 0.001;
    interactiveStarsGroup.children.forEach(star => {
        star.position.add(star.userData.velocity);
        if (star.position.length() > 120) {
            star.position.negate();
        }
        if(star.material.opacity > 0.5) {
             const scale = 1 + Math.sin(pulseTime + star.position.x) * 0.1;
             star.scale.set(scale, scale, scale);
        }
    });
    if (window.galaxy) {
        window.galaxy.rotation.y += 0.0003;
    }
    renderer.render(scene, camera);
}


// --- Function to fetch code from backend ---
async function fetchCodeSolution() {
    const language = languageInput.value;
    if (!language || !currentProblemName) {
        alert("Please enter a language and select a problem.");
        return;
    }

    aiLoading.style.display = 'block';

    try {
        const response = await fetch('/api/get-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                problem_name: currentProblemName,
                language: language,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.code_solution) {
            modalCodeOutput.textContent = data.code_solution;
        } else if (data.error) {
            modalCodeOutput.textContent = `Error: ${data.error}`;
        }
        codeModal.style.display = 'block'; // Show modal with content
    } catch (error) {
        modalCodeOutput.textContent = `An error occurred: ${error.message}`;
        codeModal.style.display = 'block'; // Show modal with error
    } finally {
        aiLoading.style.display = 'none';
    }
}


// 6. Handling Window Resizing & Event Listeners
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

searchBox.addEventListener('input', (e) => highlightStars(e.target.value, 'search'));
topicFilter.addEventListener('change', (e) => highlightStars(e.target.value, 'topic'));
togglePathBtn.addEventListener('click', () => {
    journeyPath.visible = !journeyPath.visible;
    togglePathBtn.innerText = journeyPath.visible ? 'Hide Journey Path' : 'Show Journey Path';
});
sidebarToggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    if (window.innerWidth > 768) {
        mainContent.classList.toggle('sidebar-collapsed');
    }
});
backToMainBtn.addEventListener('click', () => {
    sidebarDetailsView.style.display = 'none';
    sidebarMainContent.style.display = 'block';
});
getCodeBtn.addEventListener('click', fetchCodeSolution);

// --- Modal event listeners ---
closeModalBtn.addEventListener('click', () => {
    codeModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target == codeModal) {
        codeModal.style.display = 'none';
    }
});


// Kick everything off!
init();
animate();
