"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useTheme } from "next-themes";
import gsap from "gsap";

export default function ShaderBackground() {
  const { theme } = useTheme();
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Cleanup existing renderer if any
    if (rendererRef.current) {
      rendererRef.current.dispose();
      rendererRef.current = null;
    }

    // **Scene & Camera Setup**
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(theme === "light" ? "#ffffff" : "#000000");

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5); // Start inside the network

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;
    canvasRef.current.appendChild(renderer.domElement);

    // **Orbit Controls**
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 1;
    controls.maxDistance = 10;

    // **Particle and Line Setup**
    const maxPoints = 200; // Reduced to avoid clutter
    const maxConnections = 300; // Reduced to avoid clutter
    const segmentsPerCurve = 200; // Reduced for performance and clarity
    const maxLineSegments = maxConnections * segmentsPerCurve;

    const pointGeometry = new THREE.BufferGeometry();
    const pointPositions = new Float32Array(maxPoints * 3);
    const pointOpacities = new Float32Array(maxPoints);
    const pointColors = new Float32Array(maxPoints * 3);
    pointGeometry.setAttribute("position", new THREE.BufferAttribute(pointPositions, 3));
    pointGeometry.setAttribute("opacity", new THREE.BufferAttribute(pointOpacities, 1));
    pointGeometry.setAttribute("color", new THREE.BufferAttribute(pointColors, 3));
    const pointMaterial = new THREE.PointsMaterial({
      size: 0.15, // Increased for visibility
      transparent: true,
      vertexColors: true,
    });
    const points = new THREE.Points(pointGeometry, pointMaterial);
    scene.add(points);

    // **Custom Shader for Neon Lines**
    const lineVertexShader = `
      precision mediump float;
      attribute vec3 color;
      attribute float opacity;
      varying vec3 vColor;
      varying float vOpacity;
      void main() {
        vColor = color;
        vOpacity = opacity;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = 3.0;
      }
    `;

    const lineFragmentShader = `
      precision mediump float;
      varying vec3 vColor;
      varying float vOpacity;
      void main() {
        float dist = length(2.0 * gl_PointCoord - 1.0);
        float alpha = vOpacity * smoothstep(0.5, 0.3, dist);
        gl_FragColor = vec4(vColor * 2.0, alpha); // Increased intensity for visibility
      }
    `;

    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(maxLineSegments * 6);
    const lineOpacities = new Float32Array(maxLineSegments);
    const lineColors = new Float32Array(maxLineSegments * 6);
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute("opacity", new THREE.BufferAttribute(lineOpacities, 1));
    lineGeometry.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));
    const lineMaterial = new THREE.ShaderMaterial({
      vertexShader: lineVertexShader,
      fragmentShader: lineFragmentShader,
      transparent: true,
      depthWrite: true,
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // **Network Management**
    let pointCount = 0;
    let connectionCount = 0;
    const existingPoints = new Set();
    const connections = [];

    const networkSize = Math.max(window.innerWidth, window.innerHeight) / 40;

    // Function to generate control points based on shape type
    function getControlPoint(startPos, endPos, shapeType) {
      const midX = (startPos[0] + endPos[0]) / 2;
      const midY = (startPos[1] + endPos[1]) / 2;
      const midZ = (startPos[2] + endPos[2]) / 2;
      const dist = Math.sqrt(
        Math.pow(endPos[0] - startPos[0], 2) +
        Math.pow(endPos[1] - startPos[1], 2) +
        Math.pow(endPos[2] - startPos[2], 2)
      );
      const offset = dist * 0.2; // Reduced offset for less chaotic shapes

      switch (shapeType) {
        case "spiral":
          return [
            midX + offset * Math.cos(time * 0.1),
            midY + offset * Math.sin(time * 0.1),
            midZ + offset * (Math.random() - 0.5),
          ];
        case "circle":
          return [
            midX + offset * Math.cos(Math.PI / 2),
            midY + offset * Math.sin(Math.PI / 2),
            midZ,
          ];
        case "wave":
          return [
            midX + offset * Math.sin(time * 0.1),
            midY + offset * Math.cos(time * 0.1),
            midZ + offset * (Math.random() - 0.5),
          ];
        default:
          return [
            midX + (Math.random() - 0.5) * networkSize * 0.2,
            midY + (Math.random() - 0.5) * networkSize * 0.2,
            midZ + (Math.random() - 0.5) * networkSize * 0.2,
          ];
      }
    }

    function quadraticBezier(t, p0, p1, p2) {
      const u = 1 - t;
      const tt = t * t;
      const uu = u * u;
      const x = uu * p0[0] + 2 * u * t * p1[0] + tt * p2[0];
      const y = uu * p0[1] + 2 * u * t * p1[1] + tt * p2[1];
      const z = uu * p0[2] + 2 * u * t * p1[2] + tt * p2[2];
      return [x, y, z];
    }

    function addPoint() {
      if (pointCount >= maxPoints) {
        pointCount = 0;
        connectionCount = 0;
        existingPoints.clear();
        connections.length = 0;
      }

      const x = (Math.random() - 0.5) * networkSize;
      const y = (Math.random() - 0.5) * networkSize;
      const z = (Math.random() - 0.5) * networkSize;
      const index = pointCount * 3;
      pointPositions[index] = x;
      pointPositions[index + 1] = y;
      pointPositions[index + 2] = z;
      pointOpacities[pointCount] = 1.0;

      const basePointColor = theme === "light" ? [1.0, 0.0, 1.0] : [0.5, 0.5, 1.0]; // Magenta for light, soft blue for dark
      pointColors[index] = basePointColor[0];
      pointColors[index + 1] = basePointColor[1];
      pointColors[index + 2] = basePointColor[2];

      if (pointCount > 0) {
        const maxConnectionsPerPoint = 1;
        let connectionsMade = 0;
        while (connectionsMade < maxConnectionsPerPoint && Math.random() > 0.3) { // Reduced connection frequency
          const randomIndex = Math.floor(Math.random() * pointCount);
          if (randomIndex !== pointCount) {
            const startPos = [
              pointPositions[randomIndex * 3],
              pointPositions[randomIndex * 3 + 1],
              pointPositions[randomIndex * 3 + 2],
            ];
            const endPos = [x, y, z];
            const shapeTypes = ["spiral", "circle", "wave", "default"];
            const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
            const controlPos = getControlPoint(startPos, endPos, shapeType);

            for (let s = 0; s < segmentsPerCurve; s++) {
              const t1 = s / segmentsPerCurve;
              const t2 = (s + 1) / segmentsPerCurve;
              const pos1 = quadraticBezier(t1, startPos, controlPos, endPos);
              const pos2 = quadraticBezier(t2, startPos, controlPos, endPos);

              const lineIndex = (connectionCount * segmentsPerCurve + s) * 6;
              linePositions[lineIndex] = pos1[0];
              linePositions[lineIndex + 1] = pos1[1];
              linePositions[lineIndex + 2] = pos1[2];
              linePositions[lineIndex + 3] = pos2[0];
              linePositions[lineIndex + 4] = pos2[1];
              linePositions[lineIndex + 5] = pos2[2];
              lineOpacities[connectionCount * segmentsPerCurve + s] = 1.0;

              const t = time + t1 * 2.0 + pos1[0] * 0.1;
              const neonStartColor = theme === "light"
                ? [
                    1.0 + 0.5 * Math.sin(t), // Magenta to lime
                    0.0 + 0.5 * Math.cos(t),
                    0.0,
                  ]
                : [
                    0.5 + 0.5 * Math.sin(t), // Red (for pink/purple)
                    0.3 + 0.3 * Math.cos(t + 1.0), // Green (for cyan/green)
                    0.7 + 0.3 * Math.sin(t + 2.0), // Blue (for blue/purple)
                  ];
              const neonEndColor = theme === "light"
                ? [
                    0.0 + 0.5 * Math.cos(t + 0.5), // Lime
                    1.0 + 0.5 * Math.sin(t + 0.5),
                    0.0,
                  ]
                : [
                    0.3 + 0.3 * Math.cos(t + 0.5), // Red
                    0.5 + 0.5 * Math.sin(t + 1.5), // Green
                    0.2 + 0.2 * Math.cos(t + 2.5), // Blue
                  ];
              for (let j = 0; j < 3; j++) {
                lineColors[lineIndex + j] = neonStartColor[j];
                lineColors[lineIndex + 3 + j] = neonEndColor[j];
              }
            }

            connections.push(connectionCount);
            connectionCount++;
            connectionsMade++;
            console.log(`Added connection ${connectionCount - 1}, shape: ${shapeType}, segments: ${segmentsPerCurve}`);
          }
        }
      }

      pointCount++;
      pointGeometry.attributes.position.needsUpdate = true;
      pointGeometry.attributes.opacity.needsUpdate = true;
      pointGeometry.attributes.color.needsUpdate = true;
      lineGeometry.attributes.position.needsUpdate = true;
      lineGeometry.attributes.opacity.needsUpdate = true;
      lineGeometry.attributes.color.needsUpdate = true;
    }

    // **Animation Loop with Fade-Out and Color Animation**
    let animationFrameId;
    let time = 0;
    function animate() {
      animationFrameId = requestAnimationFrame(animate);

      // Further reduce speed of point addition
      if (Math.random() > 0.98) { // Changed from 0.9 to 0.98 for slower formation
        addPoint();
      }

      for (let i = 0; i < pointCount; i++) {
        pointOpacities[i] -= 0.002; // Slower fade for points
        if (pointOpacities[i] < 0) pointOpacities[i] = 0;
      }
      for (let i = 0; i < connectionCount * segmentsPerCurve; i++) {
        lineOpacities[i] -= 0.0002; // Very slow fade for lines
        if (lineOpacities[i] < 0) lineOpacities[i] = 0;
      }

      for (let i = 0; i < pointCount; i++) {
        const index = i * 3;
        const x = pointPositions[index];
        const y = pointPositions[index + 1];
        const z = pointPositions[index + 2];
        const t = time + x * 0.1 + y * 0.1 + z * 0.1;
        const baseColor = theme === "light"
          ? [1.0 + 0.3 * Math.sin(t), 0.0, 1.0 + 0.2 * Math.cos(t)] // Magenta
          : [0.5 + 0.3 * Math.sin(t), 0.5 + 0.3 * Math.cos(t), 1.0]; // Dynamic blue/purple
        pointColors[index] = baseColor[0];
        pointColors[index + 1] = baseColor[1];
        pointColors[index + 2] = baseColor[2];
      }
      for (let i = 0; i < connectionCount * segmentsPerCurve; i++) {
        const index = i * 6;
        const tAlongCurve = (i % segmentsPerCurve) / segmentsPerCurve;
        const tWithMovement = time + tAlongCurve * 2.0 + linePositions[index] * 0.1;
        const neonStartColor = theme === "light"
          ? [
              1.0 + 0.5 * Math.sin(tWithMovement),
              0.0 + 0.5 * Math.cos(tWithMovement),
              0.0,
            ]
          : [
              0.5 + 0.5 * Math.sin(tWithMovement), // Red (for pink/purple)
              0.3 + 0.3 * Math.cos(tWithMovement + 1.0), // Green (for cyan/green)
              0.7 + 0.3 * Math.sin(tWithMovement + 2.0), // Blue (for blue/purple)
            ];
        const neonEndColor = theme === "light"
          ? [
              0.0 + 0.5 * Math.cos(tWithMovement + 0.5),
              1.0 + 0.5 * Math.sin(tWithMovement + 0.5),
              0.0,
            ]
          : [
              0.3 + 0.3 * Math.cos(tWithMovement + 0.5),
              0.5 + 0.5 * Math.sin(tWithMovement + 1.5),
              0.2 + 0.2 * Math.cos(tWithMovement + 2.5),
            ];
        for (let j = 0; j < 3; j++) {
          lineColors[index + j] = neonStartColor[j];
          lineColors[index + 3 + j] = neonEndColor[j];
        }
      }

      pointMaterial.opacity = Math.max(...pointOpacities);
      lineMaterial.opacity = Math.max(...lineOpacities);

      pointGeometry.attributes.color.needsUpdate = true;
      lineGeometry.attributes.color.needsUpdate = true;
      pointGeometry.attributes.opacity.needsUpdate = true;
      lineGeometry.attributes.opacity.needsUpdate = true;

      time += 0.02;
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    // **Camera Animation (Random Movement Between Points)**
    function animateCamera() {
      const duration = 5;

      function moveCamera() {
        if (pointCount === 0) {
          setTimeout(moveCamera, 1000);
          return;
        }

        const randomIndex = Math.floor(Math.random() * pointCount);
        const targetPos = new THREE.Vector3(
          pointPositions[randomIndex * 3],
          pointPositions[randomIndex * 3 + 1],
          pointPositions[randomIndex * 3 + 2]
        );

        const offset = new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2
        );
        const cameraPos = targetPos.clone().add(offset);

        gsap.to(camera.position, {
          x: cameraPos.x,
          y: cameraPos.y,
          z: cameraPos.z,
          duration,
          ease: "power2.inOut",
          onUpdate: () => {
            const lookAtIndex = Math.floor(Math.random() * pointCount);
            const lookAtPos = new THREE.Vector3(
              pointPositions[lookAtIndex * 3],
              pointPositions[lookAtIndex * 3 + 1],
              pointPositions[lookAtIndex * 3 + 2]
            );
            camera.lookAt(lookAtPos);
          },
          onComplete: () => {
            setTimeout(moveCamera, 1000);
          },
        });
      }

      moveCamera();
    }
    animateCamera();

    // **Resize Handling**
    const handleResize = () => {
      if (rendererRef.current) {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      }
    };

    window.addEventListener("resize", handleResize);

    // **Cleanup**
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      renderer.dispose();
      rendererRef.current = null;
      scene.clear();
      if (canvasRef.current) {
        canvasRef.current.innerHTML = "";
      }
    };
  }, [theme]);

  return <div ref={canvasRef} className="absolute inset-0 w-full h-full overflow-hidden z-0" />;
}