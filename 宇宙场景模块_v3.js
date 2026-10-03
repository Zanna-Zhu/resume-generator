// ============ Three.js 宇宙场景模块 v3 ============
// 目标：更密集的星系链、更强的纵深层次、更真实的宇宙场
(function() {
    'use strict';

    let scene, camera, renderer, controls;
    let galaxies = {};
    let planets = [];
    let backgroundStars, midStars, nebulaParticles, cosmicDust, distantGalaxies;
    let isInitialized = false;
    let animationId = null;
    let targetCameraPos = null;
    let targetLookAt = null;
    let cameraAnimating = false;
    let cameraAnimProgress = 0;
    let cameraAnimStart = null;
    let cameraAnimDuration = 1500;
    let cameraStartPos = null;
    let cameraStartTarget = null;
    let raycaster, mouse;
    let currentCategory = 'all';
    let clock;
    let galaxyBridges = [];
    let shootingStars = [];

    const GALAXY_PALETTE = {
        cyan: { color: '#4ecdc4', main: true },
        red: { color: '#ff6b6b', main: true },
        gold: { color: '#ffd93d', main: true },
        purple: { color: '#a88bff', main: true },
        pink: { color: '#ff6b9d', main: false },
        blue: { color: '#45b7d1', main: false },
        amber: { color: '#f9ca24', main: false },
        violet: { color: '#be6bff', main: false },
        coral: { color: '#ff7979', main: false },
        teal: { color: '#7ed6df', main: false },
        mint: { color: '#7bed9f', main: false },
        orange: { color: '#ffa502', main: false },
        rose: { color: '#ff4757', main: false },
        indigo: { color: '#686de0', main: false },
        lime: { color: '#badc58', main: false },
        peach: { color: '#f0932b', main: false }
    };

    const galaxyConfigs = {
        // 主星系：承载成长经历
        education: { color: GALAXY_PALETTE.cyan.color, label: '🎓 教育', radius: 9.0, arms: 4, particles: 3500, isMain: true, bloom: 1.0 },
        intern: { color: GALAXY_PALETTE.red.color, label: '💼 实习', radius: 8.2, arms: 5, particles: 3000, isMain: true, bloom: 1.0 },
        practice: { color: GALAXY_PALETTE.gold.color, label: '🌐 实践', radius: 7.2, arms: 4, particles: 2600, isMain: true, bloom: 1.0 },
        campus: { color: GALAXY_PALETTE.purple.color, label: '🏛️ 校园', radius: 6.5, arms: 3, particles: 2800, isMain: true, bloom: 1.0 },
        // 装饰星系
        deco1: { color: GALAXY_PALETTE.pink.color, label: '✨ 星云α', radius: 4.6, arms: 3, particles: 1100, isMain: false, bloom: 0.75 },
        deco2: { color: GALAXY_PALETTE.blue.color, label: '✨ 星云β', radius: 5.4, arms: 4, particles: 1400, isMain: false, bloom: 0.85 },
        deco3: { color: GALAXY_PALETTE.amber.color, label: '✨ 星云γ', radius: 3.4, arms: 2, particles: 700, isMain: false, bloom: 0.6 },
        deco4: { color: GALAXY_PALETTE.violet.color, label: '✨ 星云δ', radius: 4.9, arms: 5, particles: 1200, isMain: false, bloom: 0.78 },
        deco5: { color: GALAXY_PALETTE.coral.color, label: '✨ 星云ε', radius: 3.8, arms: 3, particles: 900, isMain: false, bloom: 0.65 },
        deco6: { color: GALAXY_PALETTE.teal.color, label: '✨ 星云ζ', radius: 5.8, arms: 4, particles: 1600, isMain: false, bloom: 0.88 },
        deco7: { color: GALAXY_PALETTE.mint.color, label: '✨ 星云η', radius: 2.9, arms: 2, particles: 550, isMain: false, bloom: 0.5 },
        deco8: { color: GALAXY_PALETTE.orange.color, label: '✨ 星云θ', radius: 4.1, arms: 3, particles: 800, isMain: false, bloom: 0.62 },
        deco9: { color: GALAXY_PALETTE.rose.color, label: '✨ 星云ι', radius: 4.7, arms: 4, particles: 1300, isMain: false, bloom: 0.72 },
        deco10: { color: GALAXY_PALETTE.indigo.color, label: '✨ 星云κ', radius: 3.6, arms: 3, particles: 850, isMain: false, bloom: 0.6 },
        deco11: { color: GALAXY_PALETTE.lime.color, label: '✨ 星云λ', radius: 5.0, arms: 4, particles: 1150, isMain: false, bloom: 0.7 },
        deco12: { color: GALAXY_PALETTE.peach.color, label: '✨ 星云μ', radius: 3.2, arms: 2, particles: 650, isMain: false, bloom: 0.55 },
        deco13: { color: GALAXY_PALETTE.pink.color, label: '✨ 星云ν', radius: 4.4, arms: 3, particles: 1000, isMain: false, bloom: 0.68 },
        deco14: { color: GALAXY_PALETTE.blue.color, label: '✨ 星云ξ', radius: 3.9, arms: 4, particles: 880, isMain: false, bloom: 0.64 },
        deco15: { color: GALAXY_PALETTE.violet.color, label: '✨ 星云ο', radius: 4.2, arms: 3, particles: 950, isMain: false, bloom: 0.66 },
        deco16: { color: GALAXY_PALETTE.teal.color, label: '✨ 星云π', radius: 5.2, arms: 5, particles: 1250, isMain: false, bloom: 0.74 },
        deco17: { color: GALAXY_PALETTE.amber.color, label: '✨ 星云ρ', radius: 3.5, arms: 2, particles: 720, isMain: false, bloom: 0.58 },
        deco18: { color: GALAXY_PALETTE.coral.color, label: '✨ 星云σ', radius: 4.0, arms: 3, particles: 820, isMain: false, bloom: 0.62 }
    };

    // 星系链：沿大幅 S 形 3D 曲线分布，y/z 强烈错落
    const chainPath = [
        { cat: 'deco1', x: -68, z: 18, y: 8, scale: 0.55 },
        { cat: 'deco2', x: -62, z: 12, y: 5, scale: 0.75 },
        { cat: 'deco3', x: -56, z: 5, y: -2, scale: 0.45 },
        { cat: 'deco4', x: -50, z: -1, y: -6, scale: 0.6 },
        { cat: 'education', x: -44, z: -6, y: -1, scale: 1.0 },
        { cat: 'deco5', x: -38, z: -10, y: 4, scale: 0.5 },
        { cat: 'deco6', x: -32, z: -12, y: 7, scale: 0.7 },
        { cat: 'deco7', x: -26, z: -11, y: -4, scale: 0.4 },
        { cat: 'deco8', x: -20, z: -7, y: -8, scale: 0.55 },
        { cat: 'intern', x: -14, z: -2, y: -1, scale: 1.0 },
        { cat: 'deco9', x: -8, z: 3, y: 5, scale: 0.5 },
        { cat: 'deco10', x: -2, z: 6, y: 8, scale: 0.65 },
        { cat: 'deco11', x: 4, z: 7, y: -5, scale: 0.4 },
        { cat: 'deco12', x: 10, z: 5, y: -9, scale: 0.5 },
        { cat: 'practice', x: 16, z: 0, y: -1, scale: 1.0 },
        { cat: 'deco13', x: 22, z: -5, y: 4, scale: 0.6 },
        { cat: 'deco14', x: 28, z: -8, y: 7, scale: 0.45 },
        { cat: 'deco15', x: 34, z: -7, y: -4, scale: 0.5 },
        { cat: 'deco16', x: 40, z: -3, y: -8, scale: 0.7 },
        { cat: 'campus', x: 46, z: 3, y: -1, scale: 1.0 },
        { cat: 'deco17', x: 52, z: 9, y: 5, scale: 0.5 },
        { cat: 'deco18', x: 58, z: 14, y: -3, scale: 0.55 }
    ];

    var pathMap = {};
    chainPath.forEach(function(item, idx) {
        var uniqueKey = item.cat + '_' + idx;
        item.uniqueKey = uniqueKey;
        pathMap[uniqueKey] = item;
    });

    const galaxyPositions = {};
    const galaxyScales = {};
    chainPath.forEach(function(item) {
        galaxyPositions[item.uniqueKey] = { x: item.x, z: item.z, y: item.y || 0 };
        galaxyScales[item.uniqueKey] = item.scale;
    });

    const mainGalaxyKeys = chainPath
        .filter(function(item) { return galaxyConfigs[item.cat].isMain; })
        .map(function(item) { return item.uniqueKey; });

    var galaxySizeFactors = {};
    chainPath.forEach(function(item) { galaxySizeFactors[item.uniqueKey] = 1.0; });

    function initUniverse() {
        if (isInitialized) {
            resetCamera();
            return;
        }

        const container = document.getElementById('universe-container');
        if (!container) {
            console.error('[Universe] 未找到容器元素');
            return;
        }

        if (typeof THREE === 'undefined') {
            container.innerHTML = '<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;color:rgba(255,255,255,0.6);font-family:sans-serif;text-align:center;padding:2rem;"><div style="font-size:3rem;margin-bottom:1rem;">🌌</div><div style="font-size:1.1rem;margin-bottom:0.5rem;">3D 宇宙加载中...</div><div style="font-size:0.8rem;opacity:0.6;">请确保网络畅通，刷新页面重试</div></div>';
            return;
        }

        try {
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x020208);
            scene.fog = new THREE.FogExp2(0x020208, 0.0045);

            const aspect = container.clientWidth / container.clientHeight;
            camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 2500);
            camera.position.set(0, 40, 130);

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.7;
            container.appendChild(renderer.domElement);

            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.minDistance = 3;
            controls.maxDistance = 300;
            controls.target.set(0, 0, 0);
            controls.update();

            raycaster = new THREE.Raycaster();
            mouse = new THREE.Vector2();
            clock = new THREE.Clock();

            createBackgroundStars();
            createMidStars();
            createNebula();
            createCosmicDust();
            createGalaxies();
            createDistantGalaxies();
            createGalaxyBridges();
            createShootingStars();
            createPlanets();
            addAmbientLight();
            createSizeControlPanel();

            renderer.domElement.addEventListener('click', onCanvasClick);

            console.log('[Universe] 宇宙场景初始化完成，星系数量:', chainPath.length);
        } catch (e) {
            console.error('[Universe] 初始化失败:', e);
            container.innerHTML = '<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;color:rgba(255,255,255,0.6);font-family:sans-serif;text-align:center;padding:2rem;"><div style="font-size:3rem;margin-bottom:1rem;">⚠️</div><div style="font-size:1.1rem;margin-bottom:0.5rem;">3D 场景加载失败</div><div style="font-size:0.8rem;opacity:0.6;">请刷新页面或检查浏览器是否支持 WebGL</div></div>';
            return;
        }

        const resizeHandler = function() {
            const w = container.clientWidth;
            const h = container.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener('resize', resizeHandler);

        document.querySelectorAll('.universe-nav-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                focusGalaxy(this.dataset.cat);
            });
        });

        isInitialized = true;

        var loadingEl = document.getElementById('universe-loading');
        if (loadingEl) {
            loadingEl.style.opacity = '0';
            setTimeout(function() { if (loadingEl.parentNode) loadingEl.parentNode.removeChild(loadingEl); }, 500);
        }

        animate();

        setTimeout(function() {
            const hint = document.querySelector('.universe-hint');
            if (hint) hint.style.opacity = '1';
        }, 2000);
    }

    // ============ 远景星空 ============
    function createBackgroundStars() {
        const count = 18000;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const radius = 250 + Math.random() * 800;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.cos(phi);
            positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

            const brightness = 0.15 + Math.random() * 0.55;
            const tint = Math.random();
            if (tint < 0.18) {
                colors[i3] = brightness * 0.55; colors[i3+1] = brightness * 0.7; colors[i3+2] = brightness;
            } else if (tint < 0.36) {
                colors[i3] = brightness; colors[i3+1] = brightness * 0.75; colors[i3+2] = brightness * 0.55;
            } else if (tint < 0.58) {
                colors[i3] = brightness; colors[i3+1] = brightness; colors[i3+2] = brightness;
            } else if (tint < 0.78) {
                colors[i3] = brightness * 0.85; colors[i3+1] = brightness * 0.6; colors[i3+2] = brightness * 0.95;
            } else {
                colors[i3] = brightness * 0.6; colors[i3+1] = brightness * 0.9; colors[i3+2] = brightness * 0.75;
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.55,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            sizeAttenuation: true
        });

        backgroundStars = new THREE.Points(geometry, material);
        scene.add(backgroundStars);
    }

    // ============ 中景星空 ============
    function createMidStars() {
        const count = 9000;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const radius = 40 + Math.random() * 240;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.cos(phi);
            positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

            const brightness = 0.3 + Math.random() * 0.7;
            const tint = Math.random();
            if (tint < 0.2) {
                colors[i3] = brightness * 0.65; colors[i3+1] = brightness * 0.8; colors[i3+2] = brightness;
            } else if (tint < 0.4) {
                colors[i3] = brightness; colors[i3+1] = brightness * 0.78; colors[i3+2] = brightness * 0.6;
            } else if (tint < 0.65) {
                colors[i3] = brightness; colors[i3+1] = brightness; colors[i3+2] = brightness;
            } else {
                colors[i3] = brightness * 0.85; colors[i3+1] = brightness * 0.65; colors[i3+2] = brightness * 0.95;
            }
            sizes[i] = 0.2 + Math.random() * 1.6;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            size: 0.22,
            vertexColors: true,
            transparent: true,
            opacity: 0.85,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            sizeAttenuation: true
        });

        midStars = new THREE.Points(geometry, material);
        scene.add(midStars);
    }

    // ============ 星云雾气（沿星系链分布） ============
    function createNebula() {
        const count = 5000;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const nebulaColors = [
            [0.15, 0.05, 0.38], [0.03, 0.12, 0.45], [0.28, 0.05, 0.24],
            [0.04, 0.28, 0.38], [0.38, 0.05, 0.14], [0.12, 0.04, 0.3],
            [0.03, 0.2, 0.28], [0.22, 0.08, 0.45]
        ];

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            // 70% 沿链分布，30% 全局随机
            let cx, cy, cz;
            if (Math.random() < 0.7) {
                const segIdx = Math.floor(Math.random() * (chainPath.length - 1));
                const a = chainPath[segIdx];
                const b = chainPath[segIdx + 1];
                const t = Math.random();
                cx = a.x + (b.x - a.x) * t;
                cy = (a.y || 0) + ((b.y || 0) - (a.y || 0)) * t;
                cz = a.z + (b.z - a.z) * t;
            } else {
                cx = (Math.random() - 0.5) * 160;
                cy = (Math.random() - 0.5) * 60;
                cz = (Math.random() - 0.5) * 160;
            }
            const spread = 18 + Math.random() * 22;
            positions[i3] = cx + (Math.random() - 0.5) * spread;
            positions[i3 + 1] = cy + (Math.random() - 0.5) * spread * 0.6;
            positions[i3 + 2] = cz + (Math.random() - 0.5) * spread;

            const nc = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
            const alpha = 0.05 + Math.random() * 0.16;
            colors[i3] = nc[0] * alpha;
            colors[i3 + 1] = nc[1] * alpha;
            colors[i3 + 2] = nc[2] * alpha;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 4.0,
            vertexColors: true,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            opacity: 0.42,
            sizeAttenuation: true
        });

        nebulaParticles = new THREE.Points(geometry, material);
        scene.add(nebulaParticles);
    }

    // ============ 宇宙尘埃 ============
    function createCosmicDust() {
        const count = 12000;
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            // 60% 沿链，40% 全局
            if (Math.random() < 0.6) {
                const item = chainPath[Math.floor(Math.random() * chainPath.length)];
                const spread = 35;
                positions[i3] = item.x + (Math.random() - 0.5) * spread;
                positions[i3 + 1] = (item.y || 0) + (Math.random() - 0.5) * spread * 0.5;
                positions[i3 + 2] = item.z + (Math.random() - 0.5) * spread;
            } else {
                positions[i3] = (Math.random() - 0.5) * 450;
                positions[i3 + 1] = (Math.random() - 0.5) * 220;
                positions[i3 + 2] = (Math.random() - 0.5) * 450;
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: 0x777799,
            size: 0.06,
            transparent: true,
            opacity: 0.22,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            sizeAttenuation: true
        });

        cosmicDust = new THREE.Points(geometry, material);
        scene.add(cosmicDust);
    }

    // ============ 星系 ============
    function createGalaxies() {
        chainPath.forEach(function(item) {
            const cat = item.cat;
            const config = galaxyConfigs[cat];
            const pos = galaxyPositions[item.uniqueKey];
            const scale = galaxyScales[item.uniqueKey];
            const galaxy = createGalaxySystem(config, pos, scale, item.uniqueKey);
            galaxies[item.uniqueKey] = galaxy;
            scene.add(galaxy.group);
        });
    }

    function createGalaxySystem(config, pos, scale, uniqueKey) {
        const group = new THREE.Group();
        group.position.set(pos.x, pos.y || 0, pos.z);

        const baseScale = scale || 1.0;
        group.scale.set(baseScale, baseScale, baseScale);

        const color = new THREE.Color(config.color);
        const count = config.particles;
        const arms = config.arms;
        const radius = config.radius;

        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const armAngle = (i % arms) * (Math.PI * 2 / arms);
            const dist = Math.random() * radius;
            const spiralAngle = dist * 0.8 + armAngle;
            const spread = (1 - dist / radius) * 0.38 + 0.07;

            const x = Math.cos(spiralAngle) * dist + (Math.random() - 0.5) * spread;
            const z = Math.sin(spiralAngle) * dist + (Math.random() - 0.5) * spread;
            const y = (Math.random() - 0.5) * spread * 0.5;

            positions[i3] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;

            const brightness = 0.35 + Math.random() * 0.65;
            const fade = 1 - dist / radius;
            colors[i3] = color.r * brightness * fade;
            colors[i3 + 1] = color.g * brightness * fade;
            colors[i3 + 2] = color.b * brightness * fade;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.15,
            vertexColors: true,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            opacity: 0.92,
            sizeAttenuation: true
        });

        const points = new THREE.Points(geometry, material);
        group.add(points);

        // 星系核心发光
        const coreSize = config.isMain ? 0.75 : 0.38;
        const glowGeo = new THREE.SphereGeometry(coreSize, 22, 22);
        const glowMat = new THREE.MeshBasicMaterial({
            color: config.color,
            transparent: true,
            opacity: config.isMain ? 0.78 : 0.58,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const glow = new THREE.Mesh(glowGeo, glowMat);
        group.add(glow);

        // 星系盘光晕
        const ringGeo = new THREE.RingGeometry(radius * 0.72, radius * 1.28, 60);
        const ringMat = new THREE.MeshBasicMaterial({
            color: config.color,
            transparent: true,
            opacity: config.isMain ? 0.12 : 0.07,
            side: THREE.DoubleSide,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        group.add(ring);

        return {
            group: group,
            points: points,
            glow: glow,
            ring: ring,
            rotationSpeed: 0.05 + Math.random() * 0.1,
            cat: config.isMain ? Object.keys(galaxyConfigs).find(function(k) { return galaxyConfigs[k] === config; }) : null,
            baseScale: baseScale,
            uniqueKey: uniqueKey
        };
    }

    // ============ 远景小星系（增强宇宙密度） ============
    function createDistantGalaxies() {
        const colors = Object.values(GALAXY_PALETTE).map(function(p) { return new THREE.Color(p.color); });
        const group = new THREE.Group();

        for (let i = 0; i < 28; i++) {
            let x, y, z, tooClose;
            let attempts = 0;
            do {
                tooClose = false;
                x = (Math.random() - 0.5) * 420;
                y = (Math.random() - 0.5) * 180;
                z = (Math.random() - 0.5) * 420;
                for (let j = 0; j < chainPath.length; j++) {
                    const p = chainPath[j];
                    const dx = x - p.x;
                    const dy = y - (p.y || 0);
                    const dz = z - p.z;
                    if (Math.sqrt(dx*dx + dy*dy + dz*dz) < 55) {
                        tooClose = true;
                        break;
                    }
                }
                attempts++;
            } while (tooClose && attempts < 30);

            const color = colors[Math.floor(Math.random() * colors.length)];
            const radius = 2.2 + Math.random() * 2.5;
            const count = 350 + Math.floor(Math.random() * 400);
            const arms = 2 + Math.floor(Math.random() * 3);
            const scale = 0.2 + Math.random() * 0.35;

            const positions = new Float32Array(count * 3);
            const gColors = new Float32Array(count * 3);

            for (let k = 0; k < count; k++) {
                const k3 = k * 3;
                const armAngle = (k % arms) * (Math.PI * 2 / arms);
                const dist = Math.random() * radius;
                const spiralAngle = dist * 0.9 + armAngle;
                const spread = (1 - dist / radius) * 0.25 + 0.04;
                positions[k3] = Math.cos(spiralAngle) * dist + (Math.random() - 0.5) * spread;
                positions[k3 + 1] = (Math.random() - 0.5) * spread * 0.4;
                positions[k3 + 2] = Math.sin(spiralAngle) * dist + (Math.random() - 0.5) * spread;
                const fade = 1 - dist / radius;
                gColors[k3] = color.r * fade * 0.7;
                gColors[k3 + 1] = color.g * fade * 0.7;
                gColors[k3 + 2] = color.b * fade * 0.7;
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(gColors, 3));

            const material = new THREE.PointsMaterial({
                size: 0.12,
                vertexColors: true,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                opacity: 0.55,
                sizeAttenuation: true
            });

            const pts = new THREE.Points(geometry, material);
            const g = new THREE.Group();
            g.add(pts);
            g.position.set(x, y, z);
            g.scale.set(scale, scale, scale);
            g.rotation.z = Math.random() * Math.PI;
            g.rotation.x = (Math.random() - 0.5) * 0.5;
            group.add(g);
        }

        distantGalaxies = group;
        scene.add(distantGalaxies);
    }

    // ============ 星系桥（连接链上相邻星系） ============
    function createGalaxyBridges() {
        for (var i = 0; i < chainPath.length - 1; i++) {
            var from = chainPath[i];
            var to = chainPath[i + 1];
            var fromPos = new THREE.Vector3(from.x, from.y || 0, from.z);
            var toPos = new THREE.Vector3(to.x, to.y || 0, to.z);

            var bridgeCount = 380;
            var positions = new Float32Array(bridgeCount * 3);
            var colors = new Float32Array(bridgeCount * 3);

            for (var j = 0; j < bridgeCount; j++) {
                var t = Math.random();
                var j3 = j * 3;
                var point = new THREE.Vector3().lerpVectors(fromPos, toPos, t);
                var spread = 2.4;
                point.x += (Math.random() - 0.5) * spread;
                point.y += (Math.random() - 0.5) * spread;
                point.z += (Math.random() - 0.5) * spread;

                positions[j3] = point.x;
                positions[j3 + 1] = point.y;
                positions[j3 + 2] = point.z;

                var fromColor = new THREE.Color(galaxyConfigs[from.cat].color);
                var toColor = new THREE.Color(galaxyConfigs[to.cat].color);
                var c = fromColor.clone().lerp(toColor, t);
                var alpha = 0.2 + Math.random() * 0.4;
                colors[j3] = c.r * alpha;
                colors[j3 + 1] = c.g * alpha;
                colors[j3 + 2] = c.b * alpha;
            }

            var geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            var material = new THREE.PointsMaterial({
                size: 0.11,
                vertexColors: true,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                opacity: 0.5,
                sizeAttenuation: true
            });

            var bridge = new THREE.Points(geometry, material);
            scene.add(bridge);
            galaxyBridges.push(bridge);
        }
    }

    // ============ 流星 ============
    function createShootingStars() {
        for (var i = 0; i < 12; i++) {
            var geometry = new THREE.BufferGeometry();
            var positions = new Float32Array(20 * 3);
            for (var j = 0; j < 20; j++) {
                positions[j * 3] = 0;
                positions[j * 3 + 1] = 0;
                positions[j * 3 + 2] = 0;
            }
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

            var material = new THREE.LineBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0,
                blending: THREE.AdditiveBlending
            });

            var line = new THREE.Line(geometry, material);
            scene.add(line);

            shootingStars.push({
                line: line,
                active: false,
                life: 0,
                maxLife: 0,
                pos: new THREE.Vector3(),
                vel: new THREE.Vector3()
            });
        }
    }

    function updateShootingStars() {
        shootingStars.forEach(function(s) {
            if (!s.active) {
                if (Math.random() < 0.006) {
                    s.active = true;
                    s.life = 0;
                    s.maxLife = 40 + Math.random() * 45;
                    s.pos.set(
                        (Math.random() - 0.5) * 180,
                        30 + Math.random() * 40,
                        (Math.random() - 0.5) * 100 - 50
                    );
                    s.vel.set(
                        (Math.random() - 0.5) * 2.0 - 0.6,
                        -0.6 - Math.random() * 0.7,
                        (Math.random() - 0.5) * 1.2 + 0.6
                    );
                }
            } else {
                var positions = s.line.geometry.attributes.position.array;
                for (var i = 19; i > 0; i--) {
                    positions[i * 3] = positions[(i - 1) * 3];
                    positions[i * 3 + 1] = positions[(i - 1) * 3 + 1];
                    positions[i * 3 + 2] = positions[(i - 1) * 3 + 2];
                }
                s.pos.add(s.vel);
                positions[0] = s.pos.x;
                positions[1] = s.pos.y;
                positions[2] = s.pos.z;
                s.line.geometry.attributes.position.needsUpdate = true;
                s.line.material.opacity = 0.65 * (1 - s.life / s.maxLife);
                s.life++;
                if (s.life > s.maxLife) {
                    s.active = false;
                    s.line.material.opacity = 0;
                }
            }
        });
    }

    // ============ 行星（成长经历） ============
    function createPlanets() {
        const events = collectAllEvents();

        events.forEach(function(evt, i) {
            const cat = evt.cat;
            const config = galaxyConfigs[cat];
            var galaxyItem = chainPath.find(function(item) { return item.cat === cat && galaxyConfigs[item.cat].isMain; });
            var uniqueKey = galaxyItem ? galaxyItem.uniqueKey : chainPath[0].uniqueKey;
            const pos = galaxyPositions[uniqueKey];
            const color = new THREE.Color(catColors[cat]);

            const orbitRadius = 2.0 + Math.random() * (config.radius * 0.68);
            const orbitAngle = Math.random() * Math.PI * 2;
            const orbitSpeed = 0.12 + Math.random() * 0.22;
            const yOffset = (Math.random() - 0.5) * 2.2;
            const planetSize = 0.28 + Math.random() * 0.24;

            const geo = new THREE.SphereGeometry(planetSize, 18, 18);
            const mat = new THREE.MeshPhongMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: 0.4,
                shininess: 40,
                transparent: true,
                opacity: 0.94
            });
            const mesh = new THREE.Mesh(geo, mat);

            // 行星光晕
            const glowGeo = new THREE.SphereGeometry(planetSize * 2.6, 18, 18);
            const glowMat = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.2,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            const glowMesh = new THREE.Mesh(glowGeo, glowMat);
            mesh.add(glowMesh);

            // 轨道环
            const ringGeo = new THREE.RingGeometry(planetSize * 1.8, planetSize * 2.4, 20);
            const ringMat = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.22,
                side: THREE.DoubleSide,
                depthWrite: false
            });
            const ringMesh = new THREE.Mesh(ringGeo, ringMat);
            ringMesh.rotation.x = Math.PI / 2.5;
            mesh.add(ringMesh);

            // === 成长经历高亮光束柱 ===
            var beamGroup = new THREE.Group();
            var beamGeo = new THREE.CylinderGeometry(0.025, 0.1, 2.4, 8);
            var beamMat = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.55,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            var beam = new THREE.Mesh(beamGeo, beamMat);
            beam.position.y = 1.2;
            beamGroup.add(beam);

            var tipGlowGeo = new THREE.SphereGeometry(0.12, 10, 10);
            var tipGlowMat = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.75,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            var tipGlow = new THREE.Mesh(tipGlowGeo, tipGlowMat);
            tipGlow.position.y = 2.4;
            beamGroup.add(tipGlow);

            var crossGlowGeo = new THREE.SphereGeometry(0.07, 8, 8);
            var crossGlowMat = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.35,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            var crossGlow = new THREE.Mesh(crossGlowGeo, crossGlowMat);
            crossGlow.scale.set(1, 4, 1);
            crossGlow.position.y = 1.2;
            beamGroup.add(crossGlow);

            var crossGlow2 = crossGlow.clone();
            crossGlow2.scale.set(4, 1, 1);
            crossGlow2.position.y = 1.2;
            beamGroup.add(crossGlow2);

            mesh.add(beamGroup);

            // 标签精灵
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 64;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'rgba(0,0,0,0)';
            ctx.fillRect(0, 0, 256, 64);
            ctx.fillStyle = 'rgba(255,255,255,0.85)';
            ctx.font = '20px "Noto Sans SC", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const label = evt.title.length > 8 ? evt.title.substring(0, 8) + '..' : evt.title;
            ctx.fillText(label, 128, 32);

            const texture = new THREE.CanvasTexture(canvas);
            const spriteMat = new THREE.SpriteMaterial({
                map: texture,
                transparent: true,
                opacity: 0.75,
                depthWrite: false
            });
            const sprite = new THREE.Sprite(spriteMat);
            sprite.scale.set(2.2, 0.55, 1);
            sprite.position.y = planetSize * 3.8 + 1.3;

            const planet = {
                mesh: mesh,
                sprite: sprite,
                beamGroup: beamGroup,
                eventIndex: i,
                cat: cat,
                orbitRadius: orbitRadius,
                orbitAngle: orbitAngle,
                orbitSpeed: orbitSpeed,
                yOffset: yOffset,
                galaxyPos: pos,
                rotationSpeed: 0.5 + Math.random() * 0.5,
                isHovered: false
            };

            updatePlanetPosition(planet, 0);

            scene.add(mesh);
            scene.add(sprite);

            planets.push(planet);
        });
    }

    function updatePlanetPosition(planet, time) {
        const angle = planet.orbitAngle + time * planet.orbitSpeed;
        const x = Math.cos(angle) * planet.orbitRadius;
        const z = Math.sin(angle) * planet.orbitRadius;
        const y = planet.yOffset + Math.sin(time * 0.5 + planet.orbitAngle) * 0.4;

        planet.mesh.position.set(
            planet.galaxyPos.x + x,
            y,
            planet.galaxyPos.z + z
        );
        planet.sprite.position.copy(planet.mesh.position);
        planet.sprite.position.y += 1.1;
    }

    // ============ 大小控制面板 ============
    function createSizeControlPanel() {
        var oldPanel = document.getElementById('size-control-panel');
        if (oldPanel) oldPanel.parentNode.removeChild(oldPanel);

        var panel = document.createElement('div');
        panel.id = 'size-control-panel';
        panel.style.cssText = 'position:absolute;left:16px;top:50%;transform:translateY(-50%);z-index:25;background:rgba(8,8,22,0.88);backdrop-filter:blur(18px);border:1px solid rgba(255,255,255,0.1);border-radius:14px;padding:14px;width:210px;color:rgba(255,255,255,0.8);font-family:Quicksand,\'Noto Sans SC\',sans-serif;font-size:0.72rem;transition:opacity 0.4s,transform 0.4s;opacity:0;transform:translateY(-50%) translateX(-20px);max-height:80vh;overflow-y:auto;';

        var title = document.createElement('div');
        title.textContent = '⚙ 星系大小';
        title.style.cssText = 'font-size:0.78rem;font-weight:500;margin-bottom:10px;color:rgba(255,255,255,0.6);letter-spacing:1px;';
        panel.appendChild(title);

        var toggleBtn = document.createElement('button');
        toggleBtn.textContent = '✕';
        toggleBtn.style.cssText = 'position:absolute;top:8px;right:10px;background:none;border:none;color:rgba(255,255,255,0.4);cursor:pointer;font-size:0.8rem;padding:2px;';
        toggleBtn.onclick = function() {
            panel.style.opacity = '0';
            panel.style.transform = 'translateY(-50%) translateX(-20px)';
            panel.style.pointerEvents = 'none';
        };
        panel.appendChild(toggleBtn);

        var mainGroup = document.createElement('div');
        mainGroup.style.cssText = 'margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.06);';
        var mainLabel = document.createElement('div');
        mainLabel.textContent = '🌟 主星系';
        mainLabel.style.cssText = 'font-size:0.62rem;color:rgba(255,255,255,0.35);margin-bottom:6px;letter-spacing:1px;';
        mainGroup.appendChild(mainLabel);

        var decoGroup = document.createElement('div');
        var decoLabel = document.createElement('div');
        decoLabel.textContent = '✨ 装饰星云';
        decoLabel.style.cssText = 'font-size:0.62rem;color:rgba(255,255,255,0.35);margin-bottom:6px;letter-spacing:1px;';
        decoGroup.appendChild(decoLabel);

        var labelMap = {};
        chainPath.forEach(function(item) {
            labelMap[item.uniqueKey] = galaxyConfigs[item.cat].label;
        });

        chainPath.forEach(function(item) {
            var uniqueKey = item.uniqueKey;
            var isMain = galaxyConfigs[item.cat].isMain;
            var row = document.createElement('div');
            row.style.cssText = 'display:flex;align-items:center;gap:6px;margin-bottom:5px;';

            var label = document.createElement('span');
            label.textContent = labelMap[uniqueKey];
            label.style.cssText = 'flex:0 0 70px;font-size:0.62rem;color:rgba(255,255,255,0.55);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';

            var slider = document.createElement('input');
            slider.type = 'range';
            slider.min = 0.2;
            slider.max = 3.0;
            slider.step = 0.05;
            slider.value = 1.0;
            slider.style.cssText = 'flex:1;height:3px;accent-color:' + galaxyConfigs[item.cat].color + ';cursor:pointer;';

            var valDisplay = document.createElement('span');
            valDisplay.textContent = '1.0';
            valDisplay.style.cssText = 'flex:0 0 26px;text-align:right;font-size:0.58rem;color:rgba(255,255,255,0.45);';

            slider.oninput = function() {
                var v = parseFloat(this.value);
                valDisplay.textContent = v.toFixed(1);
                galaxySizeFactors[uniqueKey] = v;
                if (galaxies[uniqueKey]) {
                    var g = galaxies[uniqueKey];
                    g.group.scale.set(g.baseScale * v, g.baseScale * v, g.baseScale * v);
                }
            };

            row.appendChild(label);
            row.appendChild(slider);
            row.appendChild(valDisplay);

            if (isMain) {
                mainGroup.appendChild(row);
            } else {
                decoGroup.appendChild(row);
            }
        });

        panel.appendChild(mainGroup);
        panel.appendChild(decoGroup);

        var btnRow = document.createElement('div');
        btnRow.style.cssText = 'display:flex;gap:4px;margin-top:8px;';

        var resetBtn = document.createElement('button');
        resetBtn.textContent = '重置';
        resetBtn.style.cssText = 'flex:1;padding:4px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.1);border-radius:6px;color:rgba(255,255,255,0.6);cursor:pointer;font-size:0.65rem;';
        resetBtn.onclick = function() {
            Object.keys(galaxySizeFactors).forEach(function(k) {
                galaxySizeFactors[k] = 1.0;
                if (galaxies[k]) {
                    var g = galaxies[k];
                    g.group.scale.set(g.baseScale, g.baseScale, g.baseScale);
                }
            });
            panel.querySelectorAll('input[type="range"]').forEach(function(s) {
                s.value = '1.0';
                s.nextElementSibling.textContent = '1.0';
            });
        };
        btnRow.appendChild(resetBtn);

        var showAllBtn = document.createElement('button');
        showAllBtn.textContent = '全景';
        showAllBtn.style.cssText = 'flex:1;padding:4px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.1);border-radius:6px;color:rgba(255,255,255,0.6);cursor:pointer;font-size:0.65rem;';
        showAllBtn.onclick = function() { resetCamera(); };
        btnRow.appendChild(showAllBtn);

        panel.appendChild(btnRow);

        var container = document.getElementById('universe-container');
        if (container) {
            container.appendChild(panel);
            setTimeout(function() {
                panel.style.opacity = '1';
                panel.style.transform = 'translateY(-50%) translateX(0)';
                panel.style.pointerEvents = 'auto';
            }, 1500);
        }
    }

    // ============ 环境光 ============
    function addAmbientLight() {
        const ambient = new THREE.AmbientLight(0x222244, 0.55);
        scene.add(ambient);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.75);
        dirLight.position.set(10, 30, 20);
        scene.add(dirLight);

        const pointLight = new THREE.PointLight(0x4488ff, 0.45, 80);
        pointLight.position.set(0, 15, 0);
        scene.add(pointLight);

        // 在主星系位置放置彩色氛围光
        chainPath.filter(function(item) { return galaxyConfigs[item.cat].isMain; }).forEach(function(item) {
            var pl = new THREE.PointLight(galaxyConfigs[item.cat].color, 0.45, 60);
            pl.position.set(item.x, 5, item.z);
            scene.add(pl);
        });
    }

    // ============ 交互 ============
    function onCanvasClick(event) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        const meshes = planets.map(function(p) { return p.mesh; });
        const intersects = raycaster.intersectObjects(meshes, true);

        if (intersects.length > 0) {
            const hit = intersects[0].object;
            let rootMesh = hit;
            while (rootMesh.parent && meshes.indexOf(rootMesh) === -1) {
                rootMesh = rootMesh.parent;
            }
            for (let i = 0; i < planets.length; i++) {
                if (planets[i].mesh === rootMesh) {
                    showPlanetDetail(planets[i].eventIndex);
                    break;
                }
            }
        }
    }

    function showPlanetDetail(index) {
        const events = collectAllEvents();
        const evt = events[index];
        if (!evt) return;

        universeCurrentEventIndex = index;

        const panel = document.getElementById('planet-detail-panel');
        if (!panel) return;

        document.getElementById('detail-cat').textContent = catNames[evt.cat] || evt.cat;
        document.getElementById('detail-cat').style.background = catColors[evt.cat] || '#888';
        document.getElementById('detail-time').textContent = evt.timeLabel || '';
        document.getElementById('detail-title').textContent = evt.title || '';
        document.getElementById('detail-role').textContent = evt.role || '';
        document.getElementById('detail-role').style.background = catColors[evt.cat] || '#888';

        var subtitleEl = document.getElementById('detail-subtitle');
        if (evt.cat === 'education') {
            subtitleEl.textContent = [evt.school, evt.major, evt.degree].filter(Boolean).join(' · ') || '';
            subtitleEl.style.display = subtitleEl.textContent ? 'block' : 'none';
        } else {
            subtitleEl.textContent = '';
            subtitleEl.style.display = 'none';
        }

        var descEl = document.getElementById('detail-desc');
        var descLabel = document.querySelector('.planet-detail-desc-label');
        if (evt.desc && evt.desc.trim()) {
            descEl.innerHTML = descToListItems(evt.desc);
            descLabel.style.display = 'block';
            descEl.style.display = 'block';
        } else {
            descEl.innerHTML = '';
            descLabel.style.display = 'none';
            descEl.style.display = 'none';
        }

        refreshDetailPhotos(index);

        const uploadInput = document.getElementById('detail-photo-input');
        if (uploadInput) {
            uploadInput.onchange = function(e) {
                handleGrowthImageUpload(e, index);
            };
        }

        panel.classList.add('show');
    }

    // ============ 相机控制 ============
    function animateCamera(targetPos, targetLook, duration) {
        targetCameraPos = targetPos.clone();
        targetLookAt = targetLook ? targetLook.clone() : new THREE.Vector3(0, 0, 0);
        cameraAnimating = true;
        cameraAnimProgress = 0;
        cameraAnimStart = null;
        cameraAnimDuration = duration || 1500;
        cameraStartPos = camera.position.clone();
        cameraStartTarget = controls.target.clone();
    }

    function resetCamera() {
        animateCamera(
            new THREE.Vector3(0, 40, 130),
            new THREE.Vector3(0, 0, 0),
            1400
        );
    }

    function focusGalaxy(cat) {
        currentCategory = cat;

        document.querySelectorAll('.universe-nav-btn').forEach(function(btn) {
            btn.classList.toggle('active', btn.dataset.cat === cat);
        });

        if (cat === 'all') {
            resetCamera();
            return;
        }

        var item = chainPath.find(function(i) { return i.cat === cat && galaxyConfigs[i.cat].isMain; });
        if (!item) return;
        var pos = galaxyPositions[item.uniqueKey];
        var config = galaxyConfigs[cat];
        var baseScale = galaxyScales[item.uniqueKey] || 1.0;
        var sizeFactor = galaxySizeFactors[item.uniqueKey] || 1.0;
        var effectiveRadius = config.radius * baseScale * sizeFactor;
        var targetPos = new THREE.Vector3(pos.x * 0.2, effectiveRadius * 0.42 + 6, effectiveRadius * 1.9 + 18);
        var targetLook = new THREE.Vector3(pos.x, pos.y || 0, pos.z);

        animateCamera(targetPos, targetLook, 1500);
    }

    // ============ 动画循环 ============
    function animate() {
        animationId = requestAnimationFrame(animate);

        const time = clock.getElapsedTime();

        if (backgroundStars) {
            backgroundStars.rotation.y += 0.00003;
            backgroundStars.rotation.x += 0.00001;
        }

        if (midStars) {
            midStars.rotation.y += 0.00006;
        }

        if (nebulaParticles) {
            nebulaParticles.rotation.y += 0.0001;
        }

        if (cosmicDust) {
            cosmicDust.rotation.y += 0.00003;
        }

        if (distantGalaxies) {
            distantGalaxies.rotation.y += 0.00004;
        }

        Object.keys(galaxies).forEach(function(key) {
            const g = galaxies[key];
            g.group.rotation.y += 0.0015 * g.rotationSpeed;
        });

        planets.forEach(function(p) {
            updatePlanetPosition(p, time);
            p.mesh.rotation.x += 0.008 * p.rotationSpeed;
            p.mesh.rotation.y += 0.015 * p.rotationSpeed;

            const glow = p.mesh.children[0];
            if (glow && glow.material) {
                glow.material.opacity = 0.12 + Math.sin(time * 2 + p.orbitAngle) * 0.06;
            }

            if (p.beamGroup) {
                var beam = p.beamGroup.children[0];
                if (beam && beam.material) {
                    beam.material.opacity = 0.35 + Math.sin(time * 1.5 + p.orbitAngle) * 0.35;
                }
                var tip = p.beamGroup.children[1];
                if (tip && tip.material) {
                    tip.material.opacity = 0.5 + Math.sin(time * 2.5 + p.orbitAngle) * 0.45;
                }
                p.beamGroup.rotation.y += 0.025;
            }
        });

        updateShootingStars();

        if (cameraAnimating) {
            if (!cameraAnimStart) cameraAnimStart = time;
            const elapsed = (time - cameraAnimStart) * 1000;
            cameraAnimProgress = Math.min(elapsed / cameraAnimDuration, 1);

            const t = 1 - Math.pow(1 - cameraAnimProgress, 3);

            camera.position.lerpVectors(cameraStartPos, targetCameraPos, t);
            controls.target.lerpVectors(cameraStartTarget, targetLookAt, t);

            if (cameraAnimProgress >= 1) {
                cameraAnimating = false;
                camera.position.copy(targetCameraPos);
                controls.target.copy(targetLookAt);
            }
        }

        controls.update();
        renderer.render(scene, camera);
    }

    // 公共API
    window.__universeModule = {
        initUniverse: initUniverse,
        focusGalaxy: focusGalaxy
    };
})();
