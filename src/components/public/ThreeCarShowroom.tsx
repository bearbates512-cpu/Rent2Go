import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { soundFX } from '../../utils/soundEffects.ts';
import {
  Rotate3d,
  Zap,
  Palette,
  Lightbulb,
  Gauge,
  Sliders,
  Maximize2,
  Sparkles,
  Eye,
  Camera,
  Layers
} from 'lucide-react';

interface ThreeCarShowroomProps {
  onBookCar?: (bodyType: string) => void;
}

type BodyType = 'sedan' | 'suv' | 'hatchback' | 'van';

export const ThreeCarShowroom: React.FC<ThreeCarShowroomProps> = ({ onBookCar }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [bodyType, setBodyType] = useState<BodyType>('sedan');
  const [carColor, setCarColor] = useState<string>('#ffffff'); // Default: Pearl White
  const [headlightsOn, setHeadlightsOn] = useState<boolean>(true);
  const [underglowOn, setUnderglowOn] = useState<boolean>(true);
  const [speedMode, setSpeedMode] = useState<'idle' | 'cruise' | 'turbo'>('cruise');
  const [isRotating, setIsRotating] = useState<boolean>(true);

  // References to dynamic Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const carGroupRef = useRef<THREE.Group | null>(null);
  const wheelsRef = useRef<THREE.Mesh[]>([]);
  const roadMeshRef = useRef<THREE.Mesh | null>(null);
  const linesGroupRef = useRef<THREE.Group | null>(null);
  const headlightBeamRef = useRef<THREE.SpotLight | null>(null);
  const underglowLightRef = useRef<THREE.PointLight | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);

  // Interaction tracking for mouse drag rotation
  const isDraggingRef = useRef<boolean>(false);
  const prevMouseXRef = useRef<number>(0);
  const rotationVelocityRef = useRef<number>(0.005);
  const targetRotationYRef = useRef<number>(-0.4);

  // Setup Three.js Scene
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 460;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x071324, 0.025);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 2.2, 6.8);
    camera.lookAt(0, 0.5, 0);
    cameraRef.current = camera;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // 3. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    // Key Studio Light
    const mainLight = new THREE.DirectionalLight(0xfff5e6, 2.5);
    mainLight.position.set(5, 8, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    scene.add(mainLight);

    // Cyan/Blue Cyber Fill Light
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
    fillLight.position.set(-6, 4, -3);
    scene.add(fillLight);

    // Warm Gold Rim Accent Light
    const rimLight = new THREE.DirectionalLight(0xf5b301, 2.0);
    rimLight.position.set(0, 5, -6);
    scene.add(rimLight);

    // Headlight Spotlights
    const spot1 = new THREE.SpotLight(0xe0f2fe, 5.0, 15, Math.PI / 6, 0.4, 1.0);
    spot1.position.set(0.65, 0.55, 1.8);
    spot1.target.position.set(0.65, 0, 8);
    scene.add(spot1);
    scene.add(spot1.target);

    const spot2 = new THREE.SpotLight(0xe0f2fe, 5.0, 15, Math.PI / 6, 0.4, 1.0);
    spot2.position.set(-0.65, 0.55, 1.8);
    spot2.target.position.set(-0.65, 0, 8);
    scene.add(spot2);
    scene.add(spot2.target);
    headlightBeamRef.current = spot1;

    // Neon Underglow Point Light
    const underglow = new THREE.PointLight(0xf5b301, 3.5, 3.5);
    underglow.position.set(0, 0.15, 0);
    scene.add(underglow);
    underglowLightRef.current = underglow;

    // 4. Moving Highway Ground & Road Lines
    const roadGeo = new THREE.PlaneGeometry(16, 40);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x091422,
      roughness: 0.7,
      metalness: 0.2
    });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.y = 0;
    road.receiveShadow = true;
    scene.add(road);
    roadMeshRef.current = road;

    // Road Grid / Lane Markers
    const linesGroup = new THREE.Group();
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xf5b301, transparent: true, opacity: 0.6 });
    for (let z = -20; z <= 20; z += 3.5) {
      const lineGeo = new THREE.PlaneGeometry(0.12, 1.8);
      const lineMesh = new THREE.Mesh(lineGeo, lineMat);
      lineMesh.rotation.x = -Math.PI / 2;
      lineMesh.position.set(0, 0.01, z);
      linesGroup.add(lineMesh);

      // Side lane markers
      const side1 = new THREE.Mesh(lineGeo, new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35 }));
      side1.rotation.x = -Math.PI / 2;
      side1.position.set(-2.8, 0.01, z);
      linesGroup.add(side1);

      const side2 = side1.clone();
      side2.position.set(2.8, 0.01, z);
      linesGroup.add(side2);
    }
    scene.add(linesGroup);
    linesGroupRef.current = linesGroup;

    // 5. 3D Particle Stars / Speed Dust
    const particleCount = 200;
    const partGeo = new THREE.BufferGeometry();
    const partPositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      partPositions[i] = (Math.random() - 0.5) * 18;
      partPositions[i + 1] = Math.random() * 5 + 0.2;
      partPositions[i + 2] = (Math.random() - 0.5) * 25;
    }
    partGeo.setAttribute('position', new THREE.BufferAttribute(partPositions, 3));
    const partMat = new THREE.PointsMaterial({
      color: 0xf5b301,
      size: 0.06,
      transparent: true,
      opacity: 0.6
    });
    const particles = new THREE.Points(partGeo, partMat);
    scene.add(particles);
    particlesRef.current = particles;

    // 6. Assemble Procedural 3D Vehicle Model Group
    buildCarModel(scene, bodyType, carColor);

    // 7. Animation Frame Loop
    let reqId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const speed = speedMode === 'turbo' ? 22 : speedMode === 'cruise' ? 12 : 2;

      // Animate road lines backwards to simulate forward driving
      if (linesGroupRef.current) {
        linesGroupRef.current.children.forEach(line => {
          line.position.z += speed * delta;
          if (line.position.z > 20) {
            line.position.z = -20;
          }
        });
      }

      // Rotate wheels
      wheelsRef.current.forEach(wheel => {
        wheel.rotation.x += speed * delta * 1.5;
      });

      // Subtle realistic suspension vibration & rumble
      if (carGroupRef.current) {
        if (speedMode !== 'idle') {
          carGroupRef.current.position.y = 0.08 + Math.sin(clock.getElapsedTime() * 20) * 0.008;
          carGroupRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 10) * 0.004;
        } else {
          carGroupRef.current.position.y = 0.08;
          carGroupRef.current.rotation.z = 0;
        }

        // Auto-rotation or smooth damping toward target
        if (isRotating && !isDraggingRef.current) {
          targetRotationYRef.current += 0.004;
        }
        carGroupRef.current.rotation.y += (targetRotationYRef.current - carGroupRef.current.rotation.y) * 0.1;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight || 460;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Function to build/rebuild the 3D car model based on body type and paint color
  const buildCarModel = (scene: THREE.Scene, type: BodyType, colorHex: string) => {
    // Remove existing car
    if (carGroupRef.current) {
      scene.remove(carGroupRef.current);
      carGroupRef.current.traverse(obj => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(m => m.dispose());
          } else {
            mesh.material?.dispose();
          }
        }
      });
    }

    const carGroup = new THREE.Group();
    carGroup.position.set(0, 0.08, 0);
    carGroup.rotation.y = targetRotationYRef.current;
    carGroupRef.current = carGroup;
    wheelsRef.current = [];

    // Metallic Car Paint Material with Clearcoat
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(colorHex),
      metalness: 0.85,
      roughness: 0.2,
      clearcoat: 0.6,
      clearcoatRoughness: 0.15
    });

    // Dark Trim / Carbon Fiber Material
    const trimMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      metalness: 0.5,
      roughness: 0.6
    });

    // Tinted Glass Material
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.82
    });

    // Chrome Material (Grille, Exhaust)
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.95,
      roughness: 0.1
    });

    // Headlight / Taillight materials
    const headlightMat = new THREE.MeshStandardMaterial({
      color: 0xe0f2fe,
      emissive: 0x38bdf8,
      emissiveIntensity: headlightsOn ? 3.0 : 0.2
    });

    const taillightMat = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      emissive: 0xef4444,
      emissiveIntensity: 2.5
    });

    // Dimensions based on type
    const isSUV = type === 'suv';
    const isVan = type === 'van';
    const isHatch = type === 'hatchback';

    const baseLength = isVan ? 4.2 : isSUV ? 4.0 : isHatch ? 3.3 : 3.8;
    const baseWidth = isVan ? 1.8 : isSUV ? 1.85 : isHatch ? 1.6 : 1.75;
    const chassisHeight = isSUV ? 0.65 : isVan ? 0.8 : isHatch ? 0.48 : 0.45;
    const cabinHeight = isVan ? 1.1 : isSUV ? 0.8 : isHatch ? 0.62 : 0.6;
    const groundClearance = isSUV ? 0.4 : isVan ? 0.35 : 0.28;

    // 1. Lower Chassis (Main Body)
    const chassisGeo = new THREE.BoxGeometry(baseWidth, chassisHeight, baseLength);
    const chassis = new THREE.Mesh(chassisGeo, bodyMat);
    chassis.position.y = groundClearance + chassisHeight / 2;
    chassis.castShadow = true;
    chassis.receiveShadow = true;
    carGroup.add(chassis);

    // 2. Cabin / Greenhouse (Upper Body)
    const cabinLength = isVan ? baseLength * 0.75 : baseLength * 0.55;
    const cabinWidth = baseWidth * 0.9;
    const cabinGeo = new THREE.BoxGeometry(cabinWidth, cabinHeight, cabinLength);
    const cabin = new THREE.Mesh(cabinGeo, glassMat);
    cabin.position.set(0, chassis.position.y + chassisHeight / 2 + cabinHeight / 2 - 0.05, isVan ? 0.2 : -0.2);
    cabin.castShadow = true;
    carGroup.add(cabin);

    // Roof Top Shell
    const roofGeo = new THREE.BoxGeometry(cabinWidth * 0.96, 0.08, cabinLength * 0.96);
    const roof = new THREE.Mesh(roofGeo, bodyMat);
    roof.position.set(0, cabin.position.y + cabinHeight / 2, cabin.position.z);
    carGroup.add(roof);

    // If SUV, add roof rails & bullbar
    if (isSUV) {
      const railGeo = new THREE.BoxGeometry(0.06, 0.08, cabinLength * 0.85);
      const rail1 = new THREE.Mesh(railGeo, chromeMat);
      rail1.position.set(-cabinWidth * 0.44, roof.position.y + 0.07, cabin.position.z);
      const rail2 = rail1.clone();
      rail2.position.x = cabinWidth * 0.44;
      carGroup.add(rail1);
      carGroup.add(rail2);

      // Bullbar front bumper
      const bullbarGeo = new THREE.BoxGeometry(baseWidth * 0.8, 0.3, 0.15);
      const bullbar = new THREE.Mesh(bullbarGeo, chromeMat);
      bullbar.position.set(0, groundClearance + 0.2, baseLength / 2 + 0.1);
      carGroup.add(bullbar);
    }

    // 3. Front Radiator Grille
    const grilleGeo = new THREE.BoxGeometry(baseWidth * 0.65, 0.22, 0.08);
    const grille = new THREE.Mesh(grilleGeo, chromeMat);
    grille.position.set(0, groundClearance + chassisHeight * 0.5, baseLength / 2 + 0.02);
    carGroup.add(grille);

    // 4. Headlights (Dual LED Projectors)
    const hlGeo = new THREE.BoxGeometry(0.35, 0.14, 0.08);
    const hlLeft = new THREE.Mesh(hlGeo, headlightMat);
    hlLeft.position.set(baseWidth * 0.36, groundClearance + chassisHeight * 0.6, baseLength / 2 + 0.02);
    const hlRight = hlLeft.clone();
    hlRight.position.x = -baseWidth * 0.36;
    carGroup.add(hlLeft);
    carGroup.add(hlRight);

    // 5. Taillight Bar (Modern continuous LED strip)
    const tlGeo = new THREE.BoxGeometry(baseWidth * 0.85, 0.1, 0.06);
    const tl = new THREE.Mesh(tlGeo, taillightMat);
    tl.position.set(0, groundClearance + chassisHeight * 0.65, -baseLength / 2 - 0.02);
    carGroup.add(tl);

    // 6. Dual Exhaust Pipes
    const exGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.15, 12);
    const ex1 = new THREE.Mesh(exGeo, chromeMat);
    ex1.rotation.x = Math.PI / 2;
    ex1.position.set(baseWidth * 0.3, groundClearance + 0.08, -baseLength / 2 - 0.05);
    const ex2 = ex1.clone();
    ex2.position.x = -baseWidth * 0.3;
    carGroup.add(ex1);
    carGroup.add(ex2);

    // 7. Side Mirrors
    const mirrorGeo = new THREE.BoxGeometry(0.2, 0.1, 0.12);
    const mirrorL = new THREE.Mesh(mirrorGeo, bodyMat);
    mirrorL.position.set(baseWidth / 2 + 0.12, chassis.position.y + chassisHeight / 2 + 0.1, cabin.position.z + cabinLength / 2 - 0.1);
    const mirrorR = mirrorL.clone();
    mirrorR.position.x = -(baseWidth / 2 + 0.12);
    carGroup.add(mirrorL);
    carGroup.add(mirrorR);

    // 8. 4 Detailed Rotating Wheels
    const wheelRadius = isSUV ? 0.38 : isVan ? 0.35 : 0.32;
    const wheelThickness = isSUV ? 0.28 : 0.24;
    const wheelX = baseWidth / 2;
    const frontZ = baseLength * 0.32;
    const rearZ = -baseLength * 0.32;
    const wheelY = wheelRadius;

    const tireGeo = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelThickness, 24);
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.9, metalness: 0.1 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.9, roughness: 0.2 });

    const wheelPositions = [
      { x: wheelX, y: wheelY, z: frontZ },
      { x: -wheelX, y: wheelY, z: frontZ },
      { x: wheelX, y: wheelY, z: rearZ },
      { x: -wheelX, y: wheelY, z: rearZ }
    ];

    wheelPositions.forEach(pos => {
      const wheelAssembly = new THREE.Mesh(tireGeo, tireMat);
      wheelAssembly.rotation.z = Math.PI / 2;
      wheelAssembly.position.set(pos.x, pos.y, pos.z);
      wheelAssembly.castShadow = true;

      // Rim Center Hubcap
      const rimGeo = new THREE.CylinderGeometry(wheelRadius * 0.65, wheelRadius * 0.65, wheelThickness * 1.02, 12);
      const rim = new THREE.Mesh(rimGeo, rimMat);
      wheelAssembly.add(rim);

      carGroup.add(wheelAssembly);
      wheelsRef.current.push(wheelAssembly);
    });

    scene.add(carGroup);
  };

  // React to BodyType and Color changes
  useEffect(() => {
    if (sceneRef.current) {
      buildCarModel(sceneRef.current, bodyType, carColor);
    }
  }, [bodyType, carColor]);

  // React to Headlights Toggle
  useEffect(() => {
    if (headlightBeamRef.current) {
      headlightBeamRef.current.intensity = headlightsOn ? 5.0 : 0;
    }
  }, [headlightsOn]);

  // React to Underglow Toggle
  useEffect(() => {
    if (underglowLightRef.current) {
      underglowLightRef.current.intensity = underglowOn ? 3.5 : 0;
    }
  }, [underglowOn]);

  // Mouse drag handlers for full 360 degree 3D rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    prevMouseXRef.current = e.clientX;
    setIsRotating(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - prevMouseXRef.current;
    targetRotationYRef.current += deltaX * 0.008;
    prevMouseXRef.current = e.clientX;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Color Presets
  const colorPresets = [
    { name: 'Pearl White (Grande/Fortuner)', hex: '#ffffff' },
    { name: 'Obsidian Black (Civic RS/Prado)', hex: '#0f172a' },
    { name: 'Silver Metallic (Yaris)', hex: '#94a3b8' },
    { name: 'Desert Gold (Signature)', hex: '#d97706' },
    { name: 'Royal Crimson', hex: '#991b1b' }
  ];

  const bodyDescriptions: Record<BodyType, { name: string; engine: string; seats: string; desc: string }> = {
    sedan: {
      name: 'Toyota Corolla Altis Grande / Civic RS',
      engine: '1.8L Dual VVT-i / 1.5L VTEC Turbo',
      seats: '5 Seats · Chilled AC',
      desc: 'Aerodynamic sedan body with sport alloy wheels, chrome grille, and executive ride comfort.'
    },
    suv: {
      name: 'Toyota Fortuner Legender / Prado TX 4x4',
      engine: '2.8L Sigma 4x4 / 4.0L V6',
      seats: '7 Seats · Heavy Duty',
      desc: 'High ground clearance, aggressive bullbar styling, roof cargo rails, and all-terrain suspension.'
    },
    hatchback: {
      name: 'Suzuki Alto VXL / Cultus AGS',
      engine: '660cc - 1000cc Eco Power',
      seats: '4-5 Seats · 22+ KM/L',
      desc: 'Compact agile footprint, ultra-efficient fuel economy, and smooth automatic transmission.'
    },
    van: {
      name: 'Toyota Hiace Grand Cabin 14-Seater',
      engine: '3.0L Diesel Turbo Intercooler',
      seats: '14 Passengers · High Roof',
      desc: 'Long wheelbase executive van with dual AC blowers and massive luggage storage for family tours.'
    }
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-radial from-[#10243E] via-[#091729] to-[#050D18] border border-cyan-500/30 shadow-2xl shadow-cyan-950/60 p-4 sm:p-6 select-none flex flex-col justify-between">
      {/* 3D WebGL Canvas Layer */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing"
      >
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* 360 Drag Prompt Overlay */}
        <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
          <div className="px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-cyan-400/40 text-cyan-300 font-mono text-[11px] font-bold flex items-center gap-1.5 shadow-md">
            <Rotate3d className="w-3.5 h-3.5 animate-spin" />
            <span>3D WEBGL STUDIO · DRAG 360°</span>
          </div>
        </div>

        {/* HUD Quick Camera & Animation Controls */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            onClick={() => {
              soundFX.playClick();
              setIsRotating(!isRotating);
            }}
            className={`p-2 rounded-xl backdrop-blur-md border text-xs font-mono font-bold transition-all ${
              isRotating
                ? 'bg-amber-500/20 text-amber-300 border-amber-400/50'
                : 'bg-black/60 text-slate-400 border-white/10 hover:text-white'
            }`}
            title="Toggle Auto 360 Rotation"
          >
            <Rotate3d className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              setHeadlightsOn(!headlightsOn);
            }}
            className={`p-2 rounded-xl backdrop-blur-md border text-xs font-mono font-bold transition-all ${
              headlightsOn
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50'
                : 'bg-black/60 text-slate-400 border-white/10 hover:text-white'
            }`}
            title="Toggle Xenon Headlights"
          >
            <Lightbulb className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              setUnderglowOn(!underglowOn);
            }}
            className={`p-2 rounded-xl backdrop-blur-md border text-xs font-mono font-bold transition-all ${
              underglowOn
                ? 'bg-amber-500/20 text-amber-300 border-amber-400/50'
                : 'bg-black/60 text-slate-400 border-white/10 hover:text-white'
            }`}
            title="Toggle Neon Underglow"
          >
            <Zap className="w-4 h-4" />
          </button>
        </div>

        {/* Live Speed Drive Mode Selector */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 z-10">
          <span className="text-[10px] font-mono text-slate-400 px-2 py-1 rounded-md bg-black/60 backdrop-blur-xs">
            SPEED:
          </span>
          {(['idle', 'cruise', 'turbo'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => {
                soundFX.playClick();
                setSpeedMode(mode);
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase font-bold transition-all cursor-pointer ${
                speedMode === mode
                  ? 'bg-amber-500 text-[#0B1F3A] shadow-md shadow-amber-500/20'
                  : 'bg-black/60 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Active Car Info Badge */}
        <div className="absolute bottom-3 right-3 text-end pointer-events-none">
          <span className="px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-cyan-400/30 text-white font-mono text-xs font-bold block">
            {bodyDescriptions[bodyType].name}
          </span>
        </div>
      </div>

      {/* Control Console: Model Switcher & Paint Finishes */}
      <div className="mt-4 pt-4 border-t border-white/10 space-y-3.5">
        {/* Model Switcher Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider me-1">
              Select 3D Model:
            </span>
            {(['sedan', 'suv', 'hatchback', 'van'] as BodyType[]).map(type => (
              <button
                key={type}
                onClick={() => {
                  soundFX.playClick();
                  setBodyType(type);
                }}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold uppercase transition-all cursor-pointer ${
                  bodyType === type
                    ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-[#0B1F3A] shadow-md shadow-amber-500/20'
                    : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Color Finish Picker */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Paint:</span>
            <div className="flex items-center gap-1.5">
              {colorPresets.map(preset => (
                <button
                  key={preset.hex}
                  onClick={() => {
                    soundFX.playClick();
                    setCarColor(preset.hex);
                  }}
                  title={preset.name}
                  style={{ backgroundColor: preset.hex }}
                  className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                    carColor === preset.hex
                      ? 'border-amber-400 scale-125 shadow-md shadow-amber-400/50'
                      : 'border-slate-500 hover:scale-110'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Selected Vehicle Specs Bar */}
        <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white font-mono">{bodyDescriptions[bodyType].name}</span>
              <span className="text-[10px] text-amber-400 font-mono">[{bodyDescriptions[bodyType].seats}]</span>
            </div>
            <p className="text-[11px] text-slate-400">{bodyDescriptions[bodyType].desc}</p>
          </div>

          <button
            onClick={() => {
              soundFX.playScan();
              if (onBookCar) onBookCar(bodyType);
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#F5B301] hover:bg-amber-400 text-[#0B1F3A] text-xs font-black shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 text-[#0B1F3A]" />
            <span>Book This 3D Model</span>
          </button>
        </div>
      </div>
    </div>
  );
};
