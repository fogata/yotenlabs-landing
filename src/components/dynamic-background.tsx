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
  canvas.width = 96;
  canvas.height = 128;

  const context = canvas.getContext("2d");
  if (!context) {
    return null;
  }

  const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "rgba(251, 191, 36, 0.95)");
  gradient.addColorStop(0.5, "rgba(245, 158, 11, 0.88)");
  gradient.addColorStop(1, "rgba(217, 119, 6, 0.9)");

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

  context.strokeStyle = "rgba(120, 53, 15, 0.32)";
  context.lineWidth = 2.2;
  context.beginPath();
  context.moveTo(canvas.width * 0.5, canvas.height * 0.1);
  context.lineTo(canvas.width * 0.5, canvas.height * 0.92);
  context.stroke();

  context.lineWidth = 1.25;
  context.beginPath();
  context.moveTo(canvas.width * 0.5, canvas.height * 0.34);
  context.lineTo(canvas.width * 0.68, canvas.height * 0.48);
  context.moveTo(canvas.width * 0.5, canvas.height * 0.5);
  context.lineTo(canvas.width * 0.32, canvas.height * 0.64);
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

    const leafCount = window.innerWidth < 768 ? 24 : 40;

    const geometry = new THREE.PlaneGeometry(0.3, 0.42);
    const material = new THREE.MeshBasicMaterial({
      map: leafTexture,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      side: THREE.DoubleSide,
      vertexColors: true,
    });

    const leaves = new THREE.InstancedMesh(geometry, material, leafCount);
    scene.add(leaves);

    const amberPalette = ["#fbbf24", "#f59e0b", "#fcd34d", "#d97706"];

    const positionsX = new Float32Array(leafCount);
    const positionsY = new Float32Array(leafCount);
    const positionsZ = new Float32Array(leafCount);
    const scales = new Float32Array(leafCount);
    const fallSpeeds = new Float32Array(leafCount);
    const swaySpeeds = new Float32Array(leafCount);
    const swayPhases = new Float32Array(leafCount);
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
      positionsX[index] = (Math.random() - 0.5) * horizontalBound * 2;
      positionsY[index] = initial
        ? (Math.random() * 2 - 1) * verticalBound
        : verticalBound + Math.random() * 0.65;
      positionsZ[index] = -2.8 + Math.random() * 3.9;

      const depthFactor = THREE.MathUtils.clamp(
        THREE.MathUtils.mapLinear(positionsZ[index], -2.8, 1.1, 0, 1),
        0,
        1,
      );

      scales[index] = 0.75 + depthFactor * 0.95;
      fallSpeeds[index] = 0.14 + depthFactor * 0.36;
      swaySpeeds[index] = 0.5 + Math.random() * 0.8;
      swayPhases[index] = Math.random() * Math.PI * 2;
      swayAmount[index] = 0.22 + depthFactor * 0.22;
      spinX[index] = 0.35 + Math.random() * 0.7;
      spinY[index] = 0.15 + Math.random() * 0.45;
      spinZ[index] = (Math.random() - 0.5) * 1.35;
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
        Math.sin(elapsedTime * 0.22) * 0.18 + Math.sin(elapsedTime * 0.71) * 0.08;

      for (let i = 0; i < leafCount; i += 1) {
        positionsY[i] -= fallSpeeds[i] * delta * motionFactor;

        const sway =
          Math.sin(elapsedTime * swaySpeeds[i] + swayPhases[i]) * swayAmount[i];
        const x = positionsX[i] + (sway + gust) * motionFactor;

        rotationsX[i] += spinX[i] * delta * motionFactor;
        rotationsY[i] += spinY[i] * delta * motionFactor;
        rotationsZ[i] += spinZ[i] * delta * motionFactor;

        tempObject.position.set(x, positionsY[i], positionsZ[i]);
        tempObject.rotation.set(
          rotationsX[i] + Math.sin(elapsedTime * 1.3 + swayPhases[i]) * 0.2,
          rotationsY[i],
          rotationsZ[i],
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
      <div className="dynamic-noise" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,11,0.14)_0%,rgba(9,9,11,0.68)_38%,rgba(9,9,11,0.97)_100%)]" />
    </div>
  );
}
