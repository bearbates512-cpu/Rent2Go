import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Play, Pause, Globe, Compass, Shield } from 'lucide-react';

interface AnimatedEarthBackgroundProps {
  className?: string;
  variant?: 'hero' | 'fullscreen';
  showControls?: boolean;
}

export const AnimatedEarthBackground: React.FC<AnimatedEarthBackgroundProps> = ({
  className = '',
  variant = 'hero',
  showControls = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [scrimOpacity, setScrimOpacity] = useState<number>(0.35);
  const [controlsOpen, setControlsOpen] = useState<boolean>(false);
  const [activeSpeed, setActiveSpeed] = useState<number>(1);

  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;
  const activeSpeedRef = useRef(activeSpeed);
  activeSpeedRef.current = activeSpeed;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detect software WebGL as mandated by threejs skill
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 650;

    // Scene
    const scene = new THREE.Scene();

    // Camera positioned straight, looking forward
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 16);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Helper: lat/lon to 3D Sphere Vector
    const latLongToVector3 = (lat: number, lon: number, radius: number): THREE.Vector3 => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    // Soft round star sprite texture to eliminate square pixels
    const createStarSprite = (): THREE.CanvasTexture => {
      const c = document.createElement('canvas');
      c.width = 32;
      c.height = 32;
      const ctx = c.getContext('2d')!;
      const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      g.addColorStop(0, 'rgba(255, 255, 255, 1)');
      g.addColorStop(0.3, 'rgba(255, 240, 200, 0.8)');
      g.addColorStop(0.7, 'rgba(100, 200, 255, 0.3)');
      g.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 32, 32);
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    // Procedural High-Fidelity Earth Map
    const createEarthTexture = (): THREE.CanvasTexture => {
      const canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d')!;

      // Deep vibrant ocean with gradient
      const oceanGrad = ctx.createLinearGradient(0, 0, 0, 1024);
      oceanGrad.addColorStop(0, '#0a2342');
      oceanGrad.addColorStop(0.25, '#123765');
      oceanGrad.addColorStop(0.5, '#194982');
      oceanGrad.addColorStop(0.75, '#123765');
      oceanGrad.addColorStop(1, '#07182e');
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, 0, 2048, 1024);

      // Lat/Lon grid with cyber glow
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.2)';
      for (let y = 0; y <= 1024; y += 64) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(2048, y);
        ctx.stroke();
      }
      for (let x = 0; x <= 2048; x += 64) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 1024);
        ctx.stroke();
      }

      // Landmass Continents with rich gold & emerald styling
      ctx.fillStyle = '#1e5246';
      ctx.strokeStyle = '#F5B301';
      ctx.lineWidth = 3;

      const continents = [
        // Eurasia & South Asia (featuring Pakistan, Indus, Middle East)
        [
          [920, 260], [980, 210], [1120, 190], [1280, 180], [1440, 230], [1560, 300],
          [1620, 400], [1560, 480], [1460, 500], [1380, 460], [1320, 480],
          // South Asia peninsula & Pakistan
          [1280, 520], [1250, 480], [1235, 435], [1210, 410], [1170, 430],
          [1120, 390], [1060, 340], [980, 350], [920, 300]
        ],
        // Africa
        [
          [960, 390], [1070, 380], [1140, 430], [1150, 540], [1120, 660],
          [1060, 750], [990, 720], [940, 600], [920, 470], [940, 410]
        ],
        // North America
        [
          [280, 230], [400, 190], [520, 210], [570, 280], [530, 370],
          [470, 440], [410, 430], [360, 340], [300, 300], [260, 250]
        ],
        // South America
        [
          [450, 470], [530, 500], [570, 580], [530, 720], [470, 780],
          [430, 710], [420, 590], [430, 500]
        ],
        // Australia
        [
          [1530, 630], [1640, 620], [1690, 690], [1650, 780], [1550, 760], [1500, 690]
        ]
      ];

      continents.forEach(poly => {
        ctx.beginPath();
        ctx.moveTo(poly[0][0], poly[0][1]);
        for (let i = 1; i < poly.length; i++) {
          ctx.lineTo(poly[i][0], poly[i][1]);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });

      // City Lights & Motorways
      ctx.fillStyle = '#FFE57F';
      ctx.shadowColor = '#F5B301';
      ctx.shadowBlur = 10;

      const primaryCities = [
        // Pakistan Hubs: Sadiqabad / Rahim Yar Khan, Karachi, Lahore, Islamabad, Multan, Faisalabad
        { x: 1238, y: 432, r: 8, label: 'Sadiqabad' },
        { x: 1222, y: 462, r: 7, label: 'Karachi' },
        { x: 1258, y: 418, r: 7, label: 'Lahore' },
        { x: 1248, y: 398, r: 6, label: 'Islamabad' },
        { x: 1242, y: 422, r: 6, label: 'Multan' },
        { x: 1250, y: 412, r: 5, label: 'Faisalabad' },
        // Middle East Transit Hubs
        { x: 1140, y: 445, r: 6, label: 'Dubai' },
        { x: 1100, y: 458, r: 5, label: 'Riyadh' }
      ];

      primaryCities.forEach(c => {
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Motorway N-5 / M-5 Highway Line
      ctx.strokeStyle = '#F5B301';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(1222, 462);
      ctx.lineTo(1230, 450);
      ctx.lineTo(1238, 432); // Sadiqabad
      ctx.lineTo(1242, 422); // Multan
      ctx.lineTo(1258, 418); // Lahore
      ctx.lineTo(1248, 398); // Islamabad
      ctx.stroke();

      // Sparkling Towns
      ctx.fillStyle = '#FFF59D';
      for (let i = 0; i < 400; i++) {
        const rx = 950 + Math.random() * 650;
        const ry = 220 + Math.random() * 380;
        ctx.beginPath();
        ctx.arc(rx, ry, Math.random() * 2 + 0.8, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return texture;
    };

    // Earth Group
    const earthGroup = new THREE.Group();
    earthGroup.rotation.z = (23.5 * Math.PI) / 180;
    earthGroup.rotation.x = 0.2;
    // Initial rotation: Subcontinent facing camera
    earthGroup.rotation.y = -1.25;

    // Position Earth on right side of screen for desktop
    const isDesktop = width >= 1024;
    earthGroup.position.set(isDesktop ? 4.8 : 0, isDesktop ? 0.3 : 0, 0);
    scene.add(earthGroup);

    const earthRadius = isDesktop ? 5.8 : 5.0;
    const earthGeo = new THREE.SphereGeometry(earthRadius, 64, 64);
    const earthTex = createEarthTexture();

    const earthMat = new THREE.MeshStandardMaterial({
      map: earthTex,
      roughness: 0.45,
      metalness: 0.25,
      emissive: new THREE.Color(0x0e2f57),
      emissiveIntensity: 0.65
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthGroup.add(earthMesh);

    // Glowing Atmosphere Halo (Electric Cyan to Warm Gold Corona)
    const atmosphereGeo = new THREE.SphereGeometry(earthRadius * 1.18, 48, 48);
    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.66 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
          vec3 atmosphereColor = mix(vec3(0.05, 0.85, 1.0), vec3(0.96, 0.70, 0.05), intensity * 0.45);
          gl_FragColor = vec4(atmosphereColor, intensity * 0.95);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    earthGroup.add(atmosphereMesh);

    // Inner Rim Glow
    const rimHaloGeo = new THREE.SphereGeometry(earthRadius * 1.025, 48, 48);
    const rimHaloMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.55 - dot(vNormal, vec3(0, 0, 1.0)), 1.8);
          gl_FragColor = vec4(0.2, 0.8, 1.0, intensity * 0.6);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
      transparent: true,
      depthWrite: false
    });
    const rimHaloMesh = new THREE.Mesh(rimHaloGeo, rimHaloMat);
    earthGroup.add(rimHaloMesh);

    // Soft Circular Starfield
    const starCount = isSoftwareGl ? 350 : 700;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      const radius = 28 + Math.random() * 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i3 + 1] = radius * Math.cos(phi);
      starPositions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

      const colorType = Math.random();
      if (colorType > 0.65) {
        starColors[i3] = 0.96; starColors[i3 + 1] = 0.75; starColors[i3 + 2] = 0.1; // Gold
      } else if (colorType > 0.35) {
        starColors[i3] = 0.2; starColors[i3 + 1] = 0.85; starColors[i3 + 2] = 1.0; // Cyan
      } else {
        starColors[i3] = 1.0; starColors[i3 + 1] = 1.0; starColors[i3 + 2] = 1.0; // White
      }
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starSprite = createStarSprite();
    const starMat = new THREE.PointsMaterial({
      size: 1.4,
      map: starSprite,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);

    // Gold & Cyan Orbital Rings
    const orbitRingGeo = new THREE.RingGeometry(earthRadius * 1.35, earthRadius * 1.37, 80);
    const orbitRingMat = new THREE.MeshBasicMaterial({
      color: 0xF5B301,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4
    });
    const orbitRing = new THREE.Mesh(orbitRingGeo, orbitRingMat);
    orbitRing.rotation.x = Math.PI / 2.3;
    orbitRing.rotation.y = 0.2;
    earthGroup.add(orbitRing);

    const orbitRing2Geo = new THREE.RingGeometry(earthRadius * 1.55, earthRadius * 1.565, 80);
    const orbitRing2Mat = new THREE.MeshBasicMaterial({
      color: 0x00E5FF,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3
    });
    const orbitRing2 = new THREE.Mesh(orbitRing2Geo, orbitRing2Mat);
    orbitRing2.rotation.x = Math.PI / 1.7;
    orbitRing2.rotation.y = -0.4;
    earthGroup.add(orbitRing2);

    // Sadiqabad Pin & Radar Pulse Beacon
    const sadiqabadCoords = { lat: 28.3069, lon: 70.1308, name: 'Sadiqabad Hub' };
    const pStart = latLongToVector3(sadiqabadCoords.lat, sadiqabadCoords.lon, earthRadius);

    const pinGroup = new THREE.Group();
    const pinGeo = new THREE.SphereGeometry(0.24, 16, 16);
    const pinMat = new THREE.MeshBasicMaterial({ color: 0xF5B301 });
    const pinMesh = new THREE.Mesh(pinGeo, pinMat);
    pinMesh.position.copy(pStart);
    pinGroup.add(pinMesh);

    const beaconRingGeo = new THREE.RingGeometry(0.26, 0.45, 32);
    const beaconRingMat = new THREE.MeshBasicMaterial({
      color: 0xF5B301,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95
    });
    const beaconRing = new THREE.Mesh(beaconRingGeo, beaconRingMat);
    beaconRing.position.copy(pStart.clone().multiplyScalar(1.01));
    beaconRing.lookAt(pStart.clone().multiplyScalar(2));
    pinGroup.add(beaconRing);

    earthGroup.add(pinGroup);

    // Flight and Travel Arcs
    const destinations = [
      { lat: 24.8607, lon: 67.0011, name: 'Karachi Port Hub' },
      { lat: 31.5204, lon: 74.3587, name: 'Lahore Airport' },
      { lat: 33.6844, lon: 73.0479, name: 'Islamabad Federal' },
      { lat: 30.1575, lon: 71.5249, name: 'Multan Metro' },
      { lat: 28.4212, lon: 70.2989, name: 'Rahim Yar Khan Hub' },
      { lat: 25.2048, lon: 55.2708, name: 'Dubai Global Terminal' }
    ];

    interface RouteArc {
      curve: THREE.QuadraticBezierCurve3;
      mesh: THREE.Line;
      photon: THREE.Mesh;
    }
    const routeArcs: RouteArc[] = [];
    const photonGeo = new THREE.SphereGeometry(0.18, 12, 12);

    destinations.forEach((dest, idx) => {
      const pEnd = latLongToVector3(dest.lat, dest.lon, earthRadius);
      const midPoint = pStart.clone().lerp(pEnd, 0.5);
      const loftHeight = 1.35 + pStart.distanceTo(pEnd) * 0.18;
      midPoint.normalize().multiplyScalar(earthRadius + loftHeight);

      const curve = new THREE.QuadraticBezierCurve3(pStart, midPoint, pEnd);
      const curvePoints = curve.getPoints(45);
      const curveGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
      const curveMat = new THREE.LineBasicMaterial({
        color: idx % 2 === 0 ? 0xF5B301 : 0x00E5FF,
        transparent: true,
        opacity: 0.85
      });
      const arcMesh = new THREE.Line(curveGeo, curveMat);
      earthGroup.add(arcMesh);

      // Destination endpoint
      const destDotGeo = new THREE.SphereGeometry(0.18, 12, 12);
      const destDotMat = new THREE.MeshBasicMaterial({ color: 0x00E5FF });
      const destDot = new THREE.Mesh(destDotGeo, destDotMat);
      destDot.position.copy(pEnd);
      earthGroup.add(destDot);

      // Photon
      const photonMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
      const photon = new THREE.Mesh(photonGeo, photonMat);
      photon.position.copy(pStart);
      earthGroup.add(photon);

      routeArcs.push({ curve, mesh: arcMesh, photon });
    });

    // Lights
    const ambientLight = new THREE.AmbientLight(0x204a75, 2.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xFFF2D6, 3.6);
    sunLight.position.set(12, 6, 14);
    scene.add(sunLight);

    const cyanRimLight = new THREE.DirectionalLight(0x00E5FF, 2.2);
    cyanRimLight.position.set(-16, -6, -8);
    scene.add(cyanRimLight);

    const goldAccentLight = new THREE.DirectionalLight(0xF5B301, 1.5);
    goldAccentLight.position.set(0, 14, 8);
    scene.add(goldAccentLight);

    // Interaction
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevX = x;
      prevY = y;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = x - prevX;
      const deltaY = y - prevY;
      earthGroup.rotation.y += deltaX * 0.005;
      earthGroup.rotation.x += deltaY * 0.005;
      prevX = x;
      prevY = y;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const cEl = container;
    cEl.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    cEl.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 650;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);

      const desktopNow = w >= 1024;
      earthGroup.position.set(desktopNow ? 4.8 : 0, desktopNow ? 0.3 : 0, 0);
    };
    window.addEventListener('resize', onResize);

    // Loop
    let frameId = 0;
    const clock = new THREE.Clock();
    let beaconScale = 1;
    let beaconDir = 1;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 50);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const animate = () => {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      if (isPlayingRef.current) {
        const speed = activeSpeedRef.current;
        if (!isDragging) {
          earthGroup.rotation.y += delta * 0.16 * speed;
        }

        starPoints.rotation.y += delta * 0.012;
        orbitRing.rotation.z += delta * 0.06 * speed;
        orbitRing2.rotation.z -= delta * 0.05 * speed;

        // Pulse beacon
        beaconScale += delta * 1.8 * beaconDir;
        if (beaconScale >= 2.4) beaconDir = -1;
        if (beaconScale <= 0.8) beaconDir = 1;
        beaconRing.scale.set(beaconScale, beaconScale, 1);
        (beaconRing.material as THREE.MeshBasicMaterial).opacity = Math.max(0.15, 1.0 - (beaconScale - 0.8) / 1.6);

        // Travelling photons
        routeArcs.forEach((arc, i) => {
          const arcSpeed = 0.35 + i * 0.04;
          const prog = (time * arcSpeed * speed + i * 0.22) % 1;
          const pt = arc.curve.getPointAt(prog);
          arc.photon.position.copy(pt);
          const pMat = arc.photon.material as THREE.MeshBasicMaterial;
          pMat.color.setHex(prog > 0.85 ? 0x00E5FF : 0xFFFFFF);
        });
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(animate);
      } else {
        frameId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', onResize);
      cEl.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      cEl.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);

      earthGeo.dispose();
      earthMat.dispose();
      earthTex.dispose();
      atmosphereGeo.dispose();
      atmosphereMat.dispose();
      rimHaloGeo.dispose();
      rimHaloMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      starSprite.dispose();
      orbitRingGeo.dispose();
      orbitRingMat.dispose();
      orbitRing2Geo.dispose();
      orbitRing2Mat.dispose();
      pinGeo.dispose();
      pinMat.dispose();
      beaconRingGeo.dispose();
      beaconRingMat.dispose();
      photonGeo.dispose();

      routeArcs.forEach(r => {
        r.mesh.geometry.dispose();
        (r.mesh.material as THREE.Material).dispose();
        (r.photon.material as THREE.Material).dispose();
      });

      renderer.dispose();
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className={`relative overflow-hidden ${variant === 'fullscreen' ? 'fixed inset-0 z-0' : 'absolute inset-0'} ${className}`}>
      {/* 3D WebGL Rotating Earth */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing select-none"
        title="Interactive 3D Earth - Drag to Rotate"
      />

      {/* Balanced Radial Scrim: keeps text on left 100% crisp, while right globe glows radiantly */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(ellipse at 78% 45%, rgba(11, 31, 58, ${scrimOpacity * 0.1}) 0%, rgba(11, 31, 58, ${scrimOpacity * 0.6}) 45%, rgba(11, 31, 58, ${Math.min(0.96, scrimOpacity * 1.1)}) 80%)`
        }}
      />

      {/* Atmospheric Horizon Gradient at Bottom */}
      <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#0B1F3A] via-[#0B1F3A]/80 to-transparent pointer-events-none" />

      {/* Controls Pill */}
      {showControls && (
        <div className="absolute top-4 end-4 z-20 flex flex-col items-end gap-2 text-xs select-none">
          <div className="inline-flex items-center gap-1.5 p-1 rounded-full bg-[#0B1F3A]/90 backdrop-blur-md border border-white/20 shadow-xl text-white">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-full hover:bg-white/10 active:scale-95 transition-all text-[#F5B301]"
              title={isPlaying ? 'Pause Earth Orbit' : 'Resume Earth Orbit'}
              aria-label={isPlaying ? 'Pause Earth Orbit' : 'Resume Earth Orbit'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            <div className="h-4 w-px bg-white/20 mx-0.5" />

            <div className="flex items-center gap-1.5 px-2 py-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[11px] font-bold text-slate-100 tracking-wider">
                Sadiqabad 3D Orbit
              </span>
            </div>

            <button
              onClick={() => setControlsOpen(!controlsOpen)}
              className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[#F5B301] font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 transition-all"
            >
              <Compass className="w-3 h-3" />
              <span>{controlsOpen ? 'Close' : '3D Radar'}</span>
            </button>
          </div>

          {/* Expanded Drawer */}
          {controlsOpen && (
            <div className="p-3.5 rounded-2xl bg-[#0B1F3A]/95 backdrop-blur-xl border border-white/20 shadow-2xl text-white space-y-3 w-72 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-bold text-xs text-[#F5B301] flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  Live Fleet Radar 3D
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  GPS Active
                </span>
              </div>

              {/* Orbit Speed */}
              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span>Rotation Speed</span>
                  <span className="font-mono font-bold text-[#F5B301]">{activeSpeed}x</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[0.5, 1, 2].map(spd => (
                    <button
                      key={spd}
                      onClick={() => setActiveSpeed(spd)}
                      className={`py-1 rounded-lg text-[10px] font-bold transition-all border ${
                        activeSpeed === spd
                          ? 'bg-[#F5B301] text-[#0B1F3A] border-[#F5B301]'
                          : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {spd === 0.5 ? 'Calm' : spd === 1 ? 'Normal' : 'Fast'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scrim Contrast Slider */}
              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span>Background Dimmer</span>
                  <span className="font-mono font-bold text-[#F5B301]">{Math.round(scrimOpacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.85"
                  step="0.05"
                  value={scrimOpacity}
                  onChange={e => setScrimOpacity(parseFloat(e.target.value))}
                  className="w-full accent-[#F5B301] h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* Transit Hubs */}
              <div className="space-y-1.5 pt-1 border-t border-white/10">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                  Connected Rental Hubs
                </span>
                <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                  <div className="flex items-center gap-1.5 text-amber-300 bg-amber-950/40 px-2 py-1 rounded-lg border border-amber-500/30">
                    <span className="w-2 h-2 rounded-full bg-[#F5B301]" />
                    <span className="font-bold">Sadiqabad HQ</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-cyan-300 bg-cyan-950/40 px-2 py-1 rounded-lg border border-cyan-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>Karachi Port</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300 bg-white/5 px-2 py-1 rounded-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>Lahore Airport</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300 bg-white/5 px-2 py-1 rounded-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>Islamabad Metro</span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 bg-white/5 p-2 rounded-xl flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Drag Earth to rotate in 3D orbit.</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
