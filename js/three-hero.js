/* ============================================================
   LaLume — Three.js Hero Scene
   Golden particle field + rotating rings + glowing orbs
   ============================================================ */

(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  // ── Setup ─────────────────────────────────────────────────
  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.z = 6;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // ── Particle Sprite Texture ───────────────────────────────
  function makeSprite(size, innerColor, outerColor) {
    const c   = document.createElement('canvas');
    c.width   = size;
    c.height  = size;
    const ctx = c.getContext('2d');
    const g   = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
    g.addColorStop(0,   innerColor);
    g.addColorStop(0.4, outerColor);
    g.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(c);
  }

  const spriteGold  = makeSprite(64, 'rgba(255,230,140,1)',   'rgba(201,169,110,0.5)');
  const spriteSoft  = makeSprite(128,'rgba(240,208,120,0.9)', 'rgba(180,140,70,0.1)');

  // ── Main Particle Field ───────────────────────────────────
  const PARTICLE_COUNT = 1800;
  const positions      = new Float32Array(PARTICLE_COUNT * 3);
  const colors         = new Float32Array(PARTICLE_COUNT * 3);
  const speeds         = new Float32Array(PARTICLE_COUNT);
  const phases         = new Float32Array(PARTICLE_COUNT);

  const goldPalette = [
    [1.00, 0.90, 0.55],   // bright gold
    [0.80, 0.66, 0.43],   // warm gold
    [0.95, 0.82, 0.50],   // light gold
    [0.70, 0.55, 0.28],   // deep gold
    [1.00, 0.97, 0.80],   // near white gold
  ];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const spread = 18;
    positions[i*3]     = (Math.random() - 0.5) * spread;
    positions[i*3 + 1] = (Math.random() - 0.5) * spread;
    positions[i*3 + 2] = (Math.random() - 0.5) * 8;

    const col = goldPalette[Math.floor(Math.random() * goldPalette.length)];
    colors[i*3]     = col[0];
    colors[i*3 + 1] = col[1];
    colors[i*3 + 2] = col[2];

    speeds[i]  = 0.002 + Math.random() * 0.004;
    phases[i]  = Math.random() * Math.PI * 2;
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

  const particleMat = new THREE.PointsMaterial({
    size:          0.10,
    vertexColors:  true,
    transparent:   true,
    opacity:       0.85,
    map:           spriteGold,
    blending:      THREE.AdditiveBlending,
    depthWrite:    false,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // ── Secondary Dust Field (smaller/dimmer) ─────────────────
  const DUST_COUNT  = 600;
  const dustPos     = new Float32Array(DUST_COUNT * 3);
  const dustSpeeds  = new Float32Array(DUST_COUNT);

  for (let i = 0; i < DUST_COUNT; i++) {
    dustPos[i*3]     = (Math.random() - 0.5) * 22;
    dustPos[i*3 + 1] = (Math.random() - 0.5) * 22;
    dustPos[i*3 + 2] = (Math.random() - 0.5) * 6;
    dustSpeeds[i]    = 0.001 + Math.random() * 0.002;
  }

  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));

  const dustMat = new THREE.PointsMaterial({
    size:       0.04,
    color:      new THREE.Color(0.9, 0.78, 0.5),
    transparent: true,
    opacity:    0.35,
    blending:   THREE.AdditiveBlending,
    depthWrite: false,
  });

  const dust = new THREE.Points(dustGeo, dustMat);
  scene.add(dust);

  // ── Glowing Orbs ─────────────────────────────────────────
  function makeOrb(radius, color, opacity) {
    const geo = new THREE.SphereGeometry(radius, 32, 32);
    const mat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    return new THREE.Mesh(geo, mat);
  }

  const orbs = [];

  const orbData = [
    { r: 0.4, color: 0xC9A96E, op: 0.08, x:  2.5, y:  1.2, z: -1 },
    { r: 0.6, color: 0xDFC08A, op: 0.06, x: -3.0, y: -0.8, z: -2 },
    { r: 0.3, color: 0xF0D080, op: 0.10, x:  0.5, y: -2.0, z:  0 },
    { r: 0.8, color: 0xB8963E, op: 0.04, x: -1.5, y:  2.5, z: -3 },
    { r: 0.25,color: 0xFFE88A, op: 0.12, x:  3.5, y: -1.5, z:  1 },
  ];

  orbData.forEach(d => {
    const orb = makeOrb(d.r, d.color, d.op);
    orb.position.set(d.x, d.y, d.z);
    scene.add(orb);
    orbs.push({ mesh: orb, ...d, originX: d.x, originY: d.y });
  });

  // ── Rotating Rings ────────────────────────────────────────
  function makeRing(innerR, outerR, color, opacity) {
    const geo = new THREE.RingGeometry(innerR, outerR, 64);
    const mat = new THREE.MeshBasicMaterial({
      color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    return new THREE.Mesh(geo, mat);
  }

  const ring1 = makeRing(2.2, 2.25, 0xC9A96E, 0.12);
  ring1.rotation.x = Math.PI / 4;
  scene.add(ring1);

  const ring2 = makeRing(3.5, 3.53, 0xDFC08A, 0.06);
  ring2.rotation.x = -Math.PI / 3;
  ring2.rotation.z = Math.PI / 6;
  scene.add(ring2);

  const ring3 = makeRing(1.4, 1.43, 0xF0D080, 0.09);
  ring3.rotation.x = Math.PI / 6;
  ring3.rotation.y = Math.PI / 4;
  scene.add(ring3);

  // ── Mouse Parallax ────────────────────────────────────────
  let mouse      = { x: 0, y: 0 };
  let targetCam  = { x: 0, y: 0 };

  window.addEventListener('mousemove', e => {
    mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouse.y = (e.clientY / window.innerHeight - 0.5) * -2;
  });

  // ── Animation Loop ────────────────────────────────────────
  let time = 0;

  function animate() {
    requestAnimationFrame(animate);
    time += 0.008;

    // Camera parallax
    targetCam.x += (mouse.x * 0.6 - targetCam.x) * 0.04;
    targetCam.y += (mouse.y * 0.4 - targetCam.y) * 0.04;
    camera.position.x = targetCam.x;
    camera.position.y = targetCam.y;
    camera.lookAt(scene.position);

    // Drift particles upward with sine wobble
    const pos = particleGeo.attributes.position.array;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i*3 + 1] += speeds[i];
      pos[i*3]     += Math.sin(time + phases[i]) * 0.0008;

      if (pos[i*3 + 1] > 9)  pos[i*3 + 1] = -9;
      if (pos[i*3 + 1] < -9) pos[i*3 + 1] =  9;
    }
    particleGeo.attributes.position.needsUpdate = true;

    // Drift dust downward
    const dp = dustGeo.attributes.position.array;
    for (let i = 0; i < DUST_COUNT; i++) {
      dp[i*3 + 1] -= dustSpeeds[i];
      if (dp[i*3 + 1] < -11) dp[i*3 + 1] = 11;
    }
    dustGeo.attributes.position.needsUpdate = true;

    // Rotate rings
    ring1.rotation.z += 0.002;
    ring2.rotation.z -= 0.0015;
    ring3.rotation.z += 0.003;
    ring3.rotation.x += 0.001;

    // Pulse orbs
    orbs.forEach((o, i) => {
      const pulse = Math.sin(time * 0.8 + i * 1.3) * 0.5 + 0.5;
      o.mesh.material.opacity = o.op * (0.6 + pulse * 0.8);
      o.mesh.position.y = o.originY + Math.sin(time * 0.5 + i) * 0.3;
      o.mesh.position.x = o.originX + Math.cos(time * 0.3 + i) * 0.2;
    });

    // Slowly drift particle system as a whole
    particles.rotation.y = time * 0.03;
    dust.rotation.y      = -time * 0.015;

    renderer.render(scene, camera);
  }

  animate();

  // ── Resize Handler ────────────────────────────────────────
  function onResize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  window.addEventListener('resize', onResize);

})();
