import * as THREE from 'three';

/**
 * Zero Vortex WebGL Background Simulation
 * An interactive celestial black hole accretion disk with gravitational particle physics.
 * Tuned to deep cosmic violet and luminous purple tones.
 */
export class CanvasScene {
  constructor(canvasContainerId) {
    this.container = document.getElementById(canvasContainerId);
    if (!this.container) return;

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.time = 0;
    this.isDetailMode = false;

    // Interactive parameters
    this.interactiveParams = {
      param1: 2.0, // Singularity Pull / Gravity Mass
      param2: 1.4, // Vortex Swirl Twist
      param3: 1.1  // Orbit Speed
    };

    this.init();
    this.createZeroVortex();
    this.setupEvents();
    this.animate();
  }

  init() {
    this.scene = new THREE.Scene();
    // Deep cosmic violet fog
    this.scene.fog = new THREE.FogExp2(0x080312, 0.012);

    this.camera = new THREE.PerspectiveCamera(60, this.width / this.height, 0.1, 1000);
    this.camera.position.set(0, -6, 42);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({
      powerPreference: "high-performance",
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x080312, 1);

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // Ambient light
    this.ambientLight = new THREE.AmbientLight(0xc084fc, 0.6);
    this.scene.add(this.ambientLight);

    // Center Singularity Point Light
    this.centerLight = new THREE.PointLight(0xd8b4fe, 3.5, 90);
    this.centerLight.position.set(0, 0, 8);
    this.scene.add(this.centerLight);
  }

  createZeroVortex() {
    this.vortexGroup = new THREE.Group();

    // 1. Accretion Particle Streams (4,500 orbital stars)
    const count = 4500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const particles = [];

    // Color gradient palette: deep violet, vibrant purple, electric lilac, white core
    const palette = [
      new THREE.Color(0x3b0764), // deep purple
      new THREE.Color(0x7c3aed), // electric violet
      new THREE.Color(0xa855f7), // luminous magenta-purple
      new THREE.Color(0xc084fc), // bright lilac
      new THREE.Color(0xf5f3ff)  // core starlight
    ];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      // Exponential distribution: higher density near event horizon
      const radius = Math.pow(Math.random(), 1.8) * 36 + 3.2;
      const speed = (0.25 + (1 / (radius + 0.5)) * 3.8) * 0.016;
      const verticalSpread = (Math.random() - 0.5) * (radius * 0.18 + 0.4);

      particles.push({
        angle,
        radius,
        baseRadius: radius,
        speed,
        baseY: verticalSpread,
        y: verticalSpread,
        pulseOffset: Math.random() * Math.PI * 2
      });

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = verticalSpread;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      // Color based on radial distance
      const normalizedDist = Math.min(Math.max((radius - 3.2) / 36, 0), 1);
      const colorIdx = Math.min(Math.floor(normalizedDist * palette.length), palette.length - 1);
      const c = palette[colorIdx];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom glowing circle particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.2, 'rgba(192, 132, 252, 0.9)');
    grad.addColorStop(0.5, 'rgba(124, 58, 237, 0.4)');
    grad.addColorStop(1, 'rgba(8, 3, 18, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(32, 32, 32, 0, Math.PI * 2);
    ctx.fill();
    const particleTexture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 2.2,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      depthWrite: false
    });

    const pointsMesh = new THREE.Points(geometry, material);
    this.vortexGroup.add(pointsMesh);

    // 2. Glowing Event Horizon Accretion Rings
    this.rings = [];
    const ringRadii = [
      { inner: 3.1, outer: 3.4, opacity: 0.75, color: 0xc084fc },
      { inner: 4.8, outer: 5.1, opacity: 0.45, color: 0xa855f7 },
      { inner: 8.5, outer: 8.7, opacity: 0.25, color: 0x7c3aed },
      { inner: 13.5, outer: 13.7, opacity: 0.15, color: 0x6d28d9 }
    ];

    ringRadii.forEach((r) => {
      const ringGeo = new THREE.RingGeometry(r.inner, r.outer, 80);
      const ringMat = new THREE.MeshBasicMaterial({
        color: r.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: r.opacity,
        blending: THREE.AdditiveBlending
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      this.vortexGroup.add(ring);
      this.rings.push(ring);
    });

    // 3. Central Singularity Sphere (Void Core)
    const coreGeo = new THREE.SphereGeometry(2.9, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x05010a
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    this.vortexGroup.add(coreMesh);

    // Tilt the accretion disk to dramatic perspective
    this.vortexGroup.rotation.x = 0.95;
    this.vortexGroup.position.set(4, 2, 0);

    this.particlesData = {
      positions,
      particles,
      geometry,
      count
    };

    this.scene.add(this.vortexGroup);
  }

  updateParams(newParams) {
    this.interactiveParams = { ...this.interactiveParams, ...newParams };
  }

  setDetailView(isDetail) {
    this.isDetailMode = isDetail;
    this.targetCameraZ = isDetail ? 28 : 42;
    this.targetCameraY = isDetail ? -2 : -6;
    this.targetCameraX = isDetail ? 0 : 2;
    this.targetGroupTilt = isDetail ? 0.7 : 0.95;
  }

  setupEvents() {
    window.addEventListener('resize', () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = e.clientX - this.width / 2;
      this.mouse.targetY = e.clientY - this.height / 2;
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.mouse.targetX = e.touches[0].clientX - this.width / 2;
        this.mouse.targetY = e.touches[0].clientY - this.height / 2;
      }
    }, { passive: true });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    this.time += 0.016;

    // Smooth inertia mouse lerp
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.04;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.04;

    // Smooth camera target transition
    if (this.targetCameraZ !== undefined) {
      this.camera.position.z += (this.targetCameraZ - this.camera.position.z) * 0.06;
    }
    if (this.targetCameraY !== undefined) {
      this.camera.position.y += (this.targetCameraY - this.camera.position.y) * 0.06;
    }
    if (this.targetCameraX !== undefined) {
      this.camera.position.x += (this.targetCameraX - this.camera.position.x) * 0.06;
    }

    // Interactive parameters
    const gravityMass = this.interactiveParams.param1 || 2.0;
    const swirlTwist = this.interactiveParams.param2 || 1.4;
    const orbitSpeed = this.interactiveParams.param3 || 1.1;

    // Update Zero Vortex particles
    if (this.particlesData) {
      const { positions, particles, geometry, count } = this.particlesData;
      const mouseInfluenceX = this.mouse.x * 0.003;
      const mouseInfluenceY = this.mouse.y * 0.003;

      for (let i = 0; i < count; i++) {
        const p = particles[i];
        p.angle += p.speed * orbitSpeed * gravityMass;

        // Swirling spiral radial harmonics
        const r = p.radius + Math.sin(this.time * 1.5 + p.pulseOffset) * 0.4 * swirlTwist;

        positions[i * 3] = Math.cos(p.angle) * r;
        positions[i * 3 + 1] = p.baseY + Math.sin(this.time * 2.2 + p.angle * 2) * 0.6;
        positions[i * 3 + 2] = Math.sin(p.angle) * r;
      }
      geometry.attributes.position.needsUpdate = true;

      // Group subtle mouse reaction & tilt
      const targetTilt = this.targetGroupTilt !== undefined ? this.targetGroupTilt : 0.95;
      this.vortexGroup.rotation.x = targetTilt + mouseInfluenceY * 0.2;
      this.vortexGroup.rotation.y = this.time * 0.04 * orbitSpeed + mouseInfluenceX * 0.2;
      this.vortexGroup.rotation.z = Math.sin(this.time * 0.4) * 0.05;
    }

    // Rings slow counter-oscillation
    if (this.rings) {
      this.rings.forEach((ring, idx) => {
        ring.rotation.z += (idx % 2 === 0 ? 0.002 : -0.002) * orbitSpeed;
      });
    }

    this.renderer.render(this.scene, this.camera);
  }
}
