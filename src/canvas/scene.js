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

    // Interactive parameters (calibrated to smooth, elegant idle speeds)
    this.interactiveParams = {
      param1: 2.0, // Singularity Pull / Gravity Mass
      param2: 1.4, // Vortex Swirl Twist
      param3: 0.6  // Orbit Speed (reduced to 50-60% of previous 1.1 for calm idle rotation)
    };

    this.init();
    this.createZeroVortex();
    this.setupEvents();
    this.animate();
  }

  init() {
    this.scene = new THREE.Scene();
    // Removed fog to guarantee 100% crystal-clear, sharp, unblurred particles and contrast

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
    this.ambientLight = new THREE.AmbientLight(0xc084fc, 0.8);
    this.scene.add(this.ambientLight);

    // Center Singularity Point Light
    this.centerLight = new THREE.PointLight(0xd8b4fe, 3.5, 90);
    this.centerLight.position.set(0, 0, 8);
    this.scene.add(this.centerLight);
  }

  createZeroVortex() {
    this.vortexGroup = new THREE.Group();

    // 1. Accretion Particle Streams (4,500 crystal-clear orbital stars)
    const count = 4500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const particles = [];

    // Vivid high-contrast palette: crisp starlight violet, lilac, lavender, and diamond white
    const palette = [
      new THREE.Color(0x8b5cf6), // electric violet
      new THREE.Color(0xa855f7), // luminous magenta-purple
      new THREE.Color(0xc084fc), // bright lilac
      new THREE.Color(0xe9d5ff), // crisp bright lavender
      new THREE.Color(0xffffff)  // pure brilliant diamond starlight
    ];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      // Exponential distribution: higher density near event horizon
      const radius = Math.pow(Math.random(), 1.8) * 36 + 3.2;
      // Base particle speed (calibrated to 50-60% of original)
      const speed = (0.25 + (1 / (radius + 0.5)) * 3.8) * 0.009;
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

    // Razor-sharp, solid starlight dot texture with subpixel anti-aliased edge
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 64, 64);

    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.78, '#ffffff');
    grad.addColorStop(0.92, 'rgba(255, 255, 255, 0.9)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(32, 32, 30, 0, Math.PI * 2);
    ctx.fill();

    const particleTexture = new THREE.CanvasTexture(canvas);
    particleTexture.generateMipmaps = true;
    particleTexture.minFilter = THREE.LinearMipmapLinearFilter;
    particleTexture.magFilter = THREE.LinearFilter;

    // Pinpoint particle size (0.55) + alphaTest for razor-sharp clarity without fuzzy blur
    const material = new THREE.PointsMaterial({
      size: 0.55,
      sizeAttenuation: true,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      depthWrite: false,
      alphaTest: 0.05
    });

    const pointsMesh = new THREE.Points(geometry, material);
    this.vortexGroup.add(pointsMesh);

    // 2. Glowing Event Horizon Accretion Rings (high segment count for crisp circular geometry)
    this.rings = [];
    const ringRadii = [
      { inner: 3.1, outer: 3.3, opacity: 0.85, color: 0xc084fc },
      { inner: 4.8, outer: 4.95, opacity: 0.6, color: 0xa855f7 },
      { inner: 8.5, outer: 8.62, opacity: 0.35, color: 0x7c3aed },
      { inner: 13.5, outer: 13.6, opacity: 0.2, color: 0x6d28d9 }
    ];

    ringRadii.forEach((r) => {
      const ringGeo = new THREE.RingGeometry(r.inner, r.outer, 180);
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
    const coreGeo = new THREE.SphereGeometry(2.9, 48, 48);
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
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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

    // Interactive parameters (calibrated to ~50-60% of original speed)
    const gravityMass = this.interactiveParams.param1 || 2.0;
    const swirlTwist = this.interactiveParams.param2 || 1.4;
    const orbitSpeed = this.interactiveParams.param3 !== undefined ? this.interactiveParams.param3 : 0.6;

    // Update Zero Vortex particles
    if (this.particlesData) {
      const { positions, particles, geometry, count } = this.particlesData;
      const mouseInfluenceX = this.mouse.x * 0.003;
      const mouseInfluenceY = this.mouse.y * 0.003;

      for (let i = 0; i < count; i++) {
        const p = particles[i];
        p.angle += p.speed * orbitSpeed * gravityMass;

        // Swirling spiral radial harmonics (calm, elegant breathing)
        const r = p.radius + Math.sin(this.time * 0.9 + p.pulseOffset) * 0.4 * swirlTwist;

        positions[i * 3] = Math.cos(p.angle) * r;
        positions[i * 3 + 1] = p.baseY + Math.sin(this.time * 1.2 + p.angle * 2) * 0.5;
        positions[i * 3 + 2] = Math.sin(p.angle) * r;
      }
      geometry.attributes.position.needsUpdate = true;

      // Group subtle mouse reaction & tilt
      const targetTilt = this.targetGroupTilt !== undefined ? this.targetGroupTilt : 0.95;
      this.vortexGroup.rotation.x = targetTilt + mouseInfluenceY * 0.2;
      // Idle group rotation reduced to 50% (0.02 vs 0.04)
      this.vortexGroup.rotation.y = this.time * 0.02 * orbitSpeed + mouseInfluenceX * 0.2;
      this.vortexGroup.rotation.z = Math.sin(this.time * 0.2) * 0.035;
    }

    // Rings slow counter-oscillation reduced to 50% (0.001 vs 0.002)
    if (this.rings) {
      this.rings.forEach((ring, idx) => {
        ring.rotation.z += (idx % 2 === 0 ? 0.001 : -0.001) * orbitSpeed;
      });
    }

    this.renderer.render(this.scene, this.camera);
  }
}
