"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const MOTION_MEDIA_QUERY = "(prefers-reduced-motion: reduce)";

type MotionPreference = {
  addEventListener: (type: "change", listener: (event: MediaQueryListEvent) => void) => void;
  matches: boolean;
  removeEventListener: (type: "change", listener: (event: MediaQueryListEvent) => void) => void;
};

function createNodeTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;

  const context = canvas.getContext("2d");
  if (!context) {
    return null;
  }

  const glow = context.createRadialGradient(
    canvas.width * 0.5,
    canvas.height * 0.5,
    2,
    canvas.width * 0.5,
    canvas.height * 0.5,
    canvas.width * 0.48,
  );
  glow.addColorStop(0, "rgba(255, 255, 255, 0.96)");
  glow.addColorStop(0.2, "rgba(177, 197, 255, 0.82)");
  glow.addColorStop(0.52, "rgba(0, 81, 195, 0.38)");
  glow.addColorStop(1, "rgba(0, 81, 195, 0)");

  context.fillStyle = glow;
  context.fillRect(0, 0, canvas.width, canvas.height);

  return new THREE.CanvasTexture(canvas);
}

export function DynamicBackground() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mountElement = mountRef.current;

    if (!mountElement) {
      return;
    }

    let rafId = 0;
    let disposed = false;

    const reduceMotionMedia: MotionPreference =
      typeof window.matchMedia === "function"
        ? window.matchMedia(MOTION_MEDIA_QUERY)
        : {
            matches: false,
            addEventListener: () => {},
            removeEventListener: () => {},
          };

    let shouldReduceMotion = reduceMotionMedia.matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 6.4);

    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.className = "three-canvas";
    mountElement.appendChild(renderer.domElement);

    const nodeTexture = createNodeTexture();

    if (!nodeTexture) {
      renderer.dispose();
      mountElement.removeChild(renderer.domElement);
      return;
    }

    nodeTexture.colorSpace = THREE.SRGBColorSpace;

    const nodeCount = window.innerWidth < 768 ? 42 : 72;

    const geometry = new THREE.PlaneGeometry(0.18, 0.18);
    const material = new THREE.MeshBasicMaterial({
      map: nodeTexture,
      transparent: true,
      opacity: 0.78,
      depthWrite: false,
      side: THREE.DoubleSide,
      vertexColors: true,
    });

    const nodes = new THREE.InstancedMesh(geometry, material, nodeCount);
    scene.add(nodes);

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x2f6fff,
      transparent: true,
      opacity: 0.16,
    });
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(nodeCount * 2 * 3);
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    scene.add(lines);

    const bluePalette = ["#b1c5ff", "#7fa4ff", "#0051c3", "#d7e0ff"];

    const positionsX = new Float32Array(nodeCount);
    const positionsY = new Float32Array(nodeCount);
    const positionsZ = new Float32Array(nodeCount);
    const basePositionsX = new Float32Array(nodeCount);
    const basePositionsY = new Float32Array(nodeCount);
    const scales = new Float32Array(nodeCount);
    const orbitSpeeds = new Float32Array(nodeCount);
    const orbitPhases = new Float32Array(nodeCount);
    const driftAmounts = new Float32Array(nodeCount);

    const tempObject = new THREE.Object3D();
    let horizontalBound = 3.8;
    const verticalBound = 3.2;

    const resetNode = (index: number) => {
      basePositionsX[index] = (Math.random() - 0.5) * horizontalBound * 2;
      basePositionsY[index] = (Math.random() - 0.5) * verticalBound * 2;
      positionsX[index] = basePositionsX[index];
      positionsY[index] = basePositionsY[index];
      positionsZ[index] = -2.8 + Math.random() * 3.9;

      const depthFactor = THREE.MathUtils.clamp(
        THREE.MathUtils.mapLinear(positionsZ[index], -2.8, 1.1, 0, 1),
        0,
        1,
      );

      scales[index] = 0.7 + depthFactor * 1.35;
      orbitSpeeds[index] = 0.12 + Math.random() * 0.28;
      orbitPhases[index] = Math.random() * Math.PI * 2;
      driftAmounts[index] = 0.04 + depthFactor * 0.18;

      const color = new THREE.Color(bluePalette[Math.floor(Math.random() * bluePalette.length)]);
      nodes.setColorAt(index, color);
    };

    for (let i = 0; i < nodeCount; i += 1) {
      resetNode(i);
    }

    nodes.instanceMatrix.needsUpdate = true;
    if (nodes.instanceColor) {
      nodes.instanceColor.needsUpdate = true;
    }

    const updateBounds = () => {
      horizontalBound = 2.5 * camera.aspect + 1.1;
    };

    const resize = () => {
      if (!mountElement || disposed) {
        return;
      }

      const width = mountElement.clientWidth;
      const height = mountElement.clientHeight;

      if (width === 0 || height === 0) {
        return;
      }

      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      updateBounds();
    };

    let observer: ResizeObserver | null = null;

    if (typeof window.ResizeObserver === "function") {
      observer = new window.ResizeObserver(resize);
      observer.observe(mountElement);
    } else {
      window.addEventListener("resize", resize);
    }

    resize();

    const clock = new THREE.Clock();
    let elapsedTime = 0;

    const animate = () => {
      if (disposed) {
        return;
      }

      const delta = Math.min(clock.getDelta(), 0.05);
      elapsedTime += delta;
      const motionFactor = shouldReduceMotion ? 0.18 : 1;

      for (let i = 0; i < nodeCount; i += 1) {
        const phase = elapsedTime * orbitSpeeds[i] + orbitPhases[i];

        positionsX[i] = basePositionsX[i] + Math.sin(phase) * driftAmounts[i] * motionFactor;
        positionsY[i] = basePositionsY[i] + Math.cos(phase * 0.8) * driftAmounts[i] * motionFactor;

        tempObject.position.set(positionsX[i], positionsY[i], positionsZ[i]);
        tempObject.rotation.set(0, 0, phase * 0.4);
        tempObject.scale.setScalar(scales[i]);
        tempObject.updateMatrix();

        nodes.setMatrixAt(i, tempObject.matrix);

        const next = (i + 7) % nodeCount;
        const offset = i * 6;
        linePositions[offset] = positionsX[i];
        linePositions[offset + 1] = positionsY[i];
        linePositions[offset + 2] = positionsZ[i] - 0.12;
        linePositions[offset + 3] = positionsX[next];
        linePositions[offset + 4] = positionsY[next];
        linePositions[offset + 5] = positionsZ[next] - 0.12;
      }

      nodes.instanceMatrix.needsUpdate = true;
      lineGeometry.attributes.position.needsUpdate = true;
      if (nodes.instanceColor) {
        nodes.instanceColor.needsUpdate = true;
      }

      renderer.render(scene, camera);
      rafId = window.requestAnimationFrame(animate);
    };

    animate();

    const handleMotionPreference = (event: MediaQueryListEvent) => {
      shouldReduceMotion = event.matches;
    };

    reduceMotionMedia.addEventListener("change", handleMotionPreference);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(rafId);
      reduceMotionMedia.removeEventListener("change", handleMotionPreference);
      observer?.disconnect();
      window.removeEventListener("resize", resize);

      geometry.dispose();
      material.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      nodeTexture.dispose();
      renderer.dispose();

      if (mountElement.contains(renderer.domElement)) {
        mountElement.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div ref={mountRef} className="absolute inset-0" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(177,197,255,0.055)_1px,transparent_1px),linear-gradient(180deg,rgba(177,197,255,0.045)_1px,transparent_1px)] bg-[size:72px_72px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_14%,rgba(0,81,195,0.28),transparent_28%),radial-gradient(circle_at_78%_12%,rgba(177,197,255,0.16),transparent_24%),radial-gradient(circle_at_58%_48%,rgba(0,81,195,0.12),transparent_34%)]" />
      <div className="dynamic-noise" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,14,14,0.08)_0%,rgba(19,19,19,0.74)_42%,rgba(14,14,14,0.98)_100%)]" />
    </div>
  );
}
