"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const MOTION_MEDIA_QUERY = "(prefers-reduced-motion: reduce)";

type MotionPreference = {
  addEventListener: (type: "change", listener: (event: MediaQueryListEvent) => void) => void;
  matches: boolean;
  removeEventListener: (type: "change", listener: (event: MediaQueryListEvent) => void) => void;
};

function createLeafTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 160;

  const context = canvas.getContext("2d");
  if (!context) {
    return null;
  }

  const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "rgba(254, 240, 138, 0.98)");
  gradient.addColorStop(0.2, "rgba(251, 191, 36, 0.96)");
  gradient.addColorStop(0.62, "rgba(249, 115, 22, 0.92)");
  gradient.addColorStop(1, "rgba(185, 28, 28, 0.92)");

  context.fillStyle = gradient;
  context.beginPath();
  context.moveTo(canvas.width * 0.5, canvas.height * 0.06);
  context.bezierCurveTo(
    canvas.width * 0.9,
    canvas.height * 0.22,
    canvas.width * 0.92,
    canvas.height * 0.7,
    canvas.width * 0.5,
    canvas.height * 0.96,
  );
  context.bezierCurveTo(
    canvas.width * 0.08,
    canvas.height * 0.7,
    canvas.width * 0.1,
    canvas.height * 0.22,
    canvas.width * 0.5,
    canvas.height * 0.06,
  );
  context.closePath();
  context.fill();

  const sheen = context.createRadialGradient(
    canvas.width * 0.44,
    canvas.height * 0.28,
    4,
    canvas.width * 0.5,
    canvas.height * 0.42,
    canvas.width * 0.34,
  );
  sheen.addColorStop(0, "rgba(255, 251, 235, 0.78)");
  sheen.addColorStop(0.45, "rgba(254, 215, 170, 0.18)");
  sheen.addColorStop(1, "rgba(255, 255, 255, 0)");

  context.fillStyle = sheen;
  context.fill();

  context.strokeStyle = "rgba(120, 53, 15, 0.38)";
  context.lineWidth = 2.6;
  context.beginPath();
  context.moveTo(canvas.width * 0.5, canvas.height * 0.1);
  context.lineTo(canvas.width * 0.5, canvas.height * 0.92);
  context.stroke();

  context.lineWidth = 1.4;
  context.beginPath();
  context.moveTo(canvas.width * 0.5, canvas.height * 0.34);
  context.lineTo(canvas.width * 0.68, canvas.height * 0.48);
  context.moveTo(canvas.width * 0.5, canvas.height * 0.5);
  context.lineTo(canvas.width * 0.32, canvas.height * 0.64);
  context.stroke();

  context.strokeStyle = "rgba(255, 251, 235, 0.26)";
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(canvas.width * 0.46, canvas.height * 0.18);
  context.quadraticCurveTo(
    canvas.width * 0.58,
    canvas.height * 0.44,
    canvas.width * 0.42,
    canvas.height * 0.78,
  );
  context.stroke();

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

    const leafTexture = createLeafTexture();

    if (!leafTexture) {
      renderer.dispose();
      mountElement.removeChild(renderer.domElement);
      return;
    }

    leafTexture.colorSpace = THREE.SRGBColorSpace;

    const leafCount = window.innerWidth < 768 ? 34 : 56;

    const geometry = new THREE.PlaneGeometry(0.34, 0.48);
    const material = new THREE.MeshBasicMaterial({
      map: leafTexture,
      transparent: true,
      opacity: 0.96,
      depthWrite: false,
      side: THREE.DoubleSide,
      vertexColors: true,
    });

    const leaves = new THREE.InstancedMesh(geometry, material, leafCount);
    scene.add(leaves);

    const amberPalette = [
      "#fde68a",
      "#fbbf24",
      "#fb923c",
      "#f97316",
      "#ef4444",
      "#fcd34d",
    ];

    const positionsX = new Float32Array(leafCount);
    const positionsY = new Float32Array(leafCount);
    const positionsZ = new Float32Array(leafCount);
    const basePositionsX = new Float32Array(leafCount);
    const scales = new Float32Array(leafCount);
    const fallSpeeds = new Float32Array(leafCount);
    const swaySpeeds = new Float32Array(leafCount);
    const swayPhases = new Float32Array(leafCount);
    const driftSpeeds = new Float32Array(leafCount);
    const driftOffsets = new Float32Array(leafCount);
    const bobSpeeds = new Float32Array(leafCount);
    const bobAmounts = new Float32Array(leafCount);
    const spinX = new Float32Array(leafCount);
    const spinY = new Float32Array(leafCount);
    const spinZ = new Float32Array(leafCount);
    const rotationsX = new Float32Array(leafCount);
    const rotationsY = new Float32Array(leafCount);
    const rotationsZ = new Float32Array(leafCount);
    const swayAmount = new Float32Array(leafCount);

    const tempObject = new THREE.Object3D();
    let horizontalBound = 3.8;
    const verticalBound = 3.2;

    const resetLeaf = (index: number, initial = false) => {
      const respawnFromLeft = Math.random() > 0.5 ? 1 : -1;
      basePositionsX[index] = initial
        ? (Math.random() - 0.5) * horizontalBound * 2
        : respawnFromLeft * (horizontalBound * 0.72 + Math.random() * horizontalBound * 0.38);
      positionsX[index] = basePositionsX[index];
      positionsY[index] = initial
        ? (Math.random() * 2 - 1) * verticalBound
        : verticalBound + Math.random() * 0.65;
      positionsZ[index] = -2.8 + Math.random() * 3.9;

      const depthFactor = THREE.MathUtils.clamp(
        THREE.MathUtils.mapLinear(positionsZ[index], -2.8, 1.1, 0, 1),
        0,
        1,
      );

      scales[index] = 0.66 + depthFactor * 1.12;
      fallSpeeds[index] = 0.2 + depthFactor * 0.48;
      swaySpeeds[index] = 0.72 + Math.random() * 1.2;
      swayPhases[index] = Math.random() * Math.PI * 2;
      swayAmount[index] = 0.26 + depthFactor * 0.34;
      driftSpeeds[index] = 0.12 + Math.random() * 0.3;
      driftOffsets[index] = Math.random() * Math.PI * 2;
      bobSpeeds[index] = 1.2 + Math.random() * 1.7;
      bobAmounts[index] = 0.04 + depthFactor * 0.12;
      spinX[index] = 0.5 + Math.random() * 1.1;
      spinY[index] = 0.2 + Math.random() * 0.75;
      spinZ[index] = (Math.random() - 0.5) * 2;
      rotationsX[index] = Math.random() * Math.PI;
      rotationsY[index] = Math.random() * Math.PI * 2;
      rotationsZ[index] = Math.random() * Math.PI * 2;

      const color = new THREE.Color(amberPalette[Math.floor(Math.random() * amberPalette.length)]);
      leaves.setColorAt(index, color);
    };

    for (let i = 0; i < leafCount; i += 1) {
      resetLeaf(i, true);
    }

    leaves.instanceMatrix.needsUpdate = true;
    if (leaves.instanceColor) {
      leaves.instanceColor.needsUpdate = true;
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
      const gust =
        Math.sin(elapsedTime * 0.22) * 0.24 +
        Math.sin(elapsedTime * 0.68) * 0.12 +
        Math.sin(elapsedTime * 1.4) * 0.05;

      for (let i = 0; i < leafCount; i += 1) {
        positionsY[i] -= fallSpeeds[i] * delta * motionFactor;

        const sway =
          Math.sin(elapsedTime * swaySpeeds[i] + swayPhases[i]) * swayAmount[i];
        const drift =
          Math.cos(elapsedTime * driftSpeeds[i] + driftOffsets[i]) *
          (0.08 + scales[i] * 0.04);
        const lift =
          Math.sin(elapsedTime * bobSpeeds[i] + swayPhases[i] * 0.7) * bobAmounts[i];
        const x = basePositionsX[i] + (sway + gust + drift) * motionFactor;

        rotationsX[i] += spinX[i] * delta * motionFactor;
        rotationsY[i] += spinY[i] * delta * motionFactor;
        rotationsZ[i] += spinZ[i] * delta * motionFactor;

        tempObject.position.set(x, positionsY[i] + lift * motionFactor, positionsZ[i]);
        tempObject.rotation.set(
          rotationsX[i] + Math.sin(elapsedTime * 1.6 + swayPhases[i]) * 0.28,
          rotationsY[i] + Math.cos(elapsedTime * 1.1 + driftOffsets[i]) * 0.12,
          rotationsZ[i] + Math.sin(elapsedTime * 0.85 + swayPhases[i]) * 0.18,
        );
        tempObject.scale.setScalar(scales[i]);
        tempObject.updateMatrix();

        leaves.setMatrixAt(i, tempObject.matrix);

        if (positionsY[i] < -verticalBound - 0.75) {
          resetLeaf(i);
        }
      }

      leaves.instanceMatrix.needsUpdate = true;
      if (leaves.instanceColor) {
        leaves.instanceColor.needsUpdate = true;
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
      leafTexture.dispose();
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(254,215,170,0.16),transparent_28%),radial-gradient(circle_at_78%_10%,rgba(251,191,36,0.14),transparent_24%),radial-gradient(circle_at_58%_42%,rgba(249,115,22,0.08),transparent_32%)]" />
      <div className="dynamic-noise" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,11,0.14)_0%,rgba(9,9,11,0.68)_38%,rgba(9,9,11,0.97)_100%)]" />
    </div>
  );
}
