import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";

// ==========================================
// DEFAULTS
// ==========================================

const DEFAULT_SLIDES = [
  {
    title: "Minimal <br/>Essentials",
    status: "FW24 Collection",
    image: "/outfy_slide_one.png",
  },
  {
    title: "Draped <br/>Elegance",
    status: "Signature Line",
    image: "/outfy_slide_two.png",
  },
  {
    title: "Modern <br/>Silhouette",
    status: "New Arrival",
    image: "/outfy_slide_three.png",
  },
];

// ==========================================
// SHADERS
// ==========================================

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D currentImage;
  uniform sampler2D nextImage;
  uniform float dispFactor;

  void main() {
    vec2 uv = vUv;
    float intensity = 0.6;
    vec4 orig1 = texture2D(currentImage, uv);
    vec4 orig2 = texture2D(nextImage, uv);
    
    vec4 _currentImage = texture2D(currentImage, vec2(uv.x, uv.y + dispFactor * (orig2 * intensity)));
    vec4 _nextImage = texture2D(nextImage, vec2(uv.x, uv.y + (1.0 - dispFactor) * (orig1 * intensity)));

    gl_FragColor = mix(_currentImage, _nextImage, dispFactor);
  }
`;

export default function ImageSlider({
  slides = DEFAULT_SLIDES,
  autoPlay = true,
  interval = 5000,
  className = "",
  accentColor = "#ef4444",
  showPagination = true,
}) {
  const mountRef = useRef(null);
  const titleRef = useRef(null);
  const statusRef = useRef(null);

  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const materialRef = useRef(null);
  const texturesRef = useRef([]);
  const animationFrameRef = useRef(0);

  const [activeIndex, setActiveIndex] = useState(0);
  const [displayTextIndex, setDisplayTextIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  // 1. INITIALIZATION & TEXTURE LOADING
  useEffect(() => {
    if (!mountRef.current || !slides.length) return;

    const parent = mountRef.current;
    let width = parent.clientWidth;
    let height = parent.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.OrthographicCamera(
      width / -2,
      width / 2,
      height / 2,
      height / -2,
      1,
      1000,
    );
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    parent.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const loader = new THREE.TextureLoader();
    loader.crossOrigin = "anonymous";

    const promises = slides.map((slide) => {
      return new Promise((resolve) => {
        loader.load(slide.image, (tex) => {
          tex.magFilter = THREE.LinearFilter;
          tex.minFilter = THREE.LinearFilter;
          resolve(tex);
        });
      });
    });

    Promise.all(promises).then((loadedTextures) => {
      texturesRef.current = loadedTextures;

      const material = new THREE.ShaderMaterial({
        uniforms: {
          dispFactor: { value: 0.0 },
          currentImage: { value: loadedTextures[0] },
          nextImage: { value: loadedTextures[0] },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
      });
      materialRef.current = material;

      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(width, height),
        material,
      );
      scene.add(mesh);
      setLoading(false);
    });

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      if (rendererRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, camera);
      }
    };
    animate();

    const handleResize = () => {
      if (!parent) return;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      renderer.setSize(w, h);
      camera.left = w / -2;
      camera.right = w / 2;
      camera.top = h / 2;
      camera.bottom = h / -2;
      // Also stretch the mesh size nicely
      scene.children.forEach((child) => {
        if (child.isMesh) {
          child.geometry.dispose();
          child.geometry = new THREE.PlaneGeometry(w, h);
        }
      });
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameRef.current);
      renderer.dispose();
      if (parent.contains(renderer.domElement))
        parent.removeChild(renderer.domElement);
    };
  }, [slides]);

  // 2. ANIMATION SYNC
  useEffect(() => {
    if (loading || !materialRef.current || texturesRef.current.length === 0)
      return;

    const material = materialRef.current;
    const nextTexture = texturesRef.current[activeIndex];

    setIsAnimating(true);
    material.uniforms.nextImage.value = nextTexture;

    const tl = gsap.timeline();

    // Start text fade out
    tl.to([titleRef.current, statusRef.current], {
      y: -20,
      opacity: 0,
      duration: 0.4,
      ease: "power2.in",
      stagger: 0.05,
      onComplete: () => {
        setDisplayTextIndex(activeIndex);
      },
    });

    // WebGL Image Transition
    gsap.to(material.uniforms.dispFactor, {
      duration: 1.4,
      value: 1,
      ease: "expo.inOut",
      onComplete: () => {
        material.uniforms.currentImage.value = nextTexture;
        material.uniforms.dispFactor.value = 0.0;
        setIsAnimating(false);
      },
    });

    // Fade text back in
    tl.fromTo(
      [titleRef.current, statusRef.current],
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power2.out", stagger: 0.1 },
      "-=0.4",
    );
  }, [activeIndex, loading]);

  // 3. AUTOPLAY EFFECT
  useEffect(() => {
    if (!autoPlay || isAnimating || loading) return;
    const timer = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, interval);
    return () => clearTimeout(timer);
  }, [activeIndex, autoPlay, isAnimating, loading, interval, slides.length]);

  return (
    <div
      className={`relative w-full h-full bg-[#0a0a0a] border-none overflow-hidden text-white font-sans ${className}`}
    >
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Jost:wght@200;300;400&display=swap");
      `}</style>

      <div
        className={`absolute inset-0 z-[100] bg-black flex items-center justify-center transition-opacity duration-1000 ${loading ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <div className="w-12 h-px bg-white/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-white animate-[loading_1.5s_infinite]" />
        </div>
      </div>

      <main className="relative w-full h-full flex flex-col justify-end pb-20 px-8 md:px-20 lg:px-32">
        <div ref={mountRef} className="absolute inset-0 z-0" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

        <div className="relative z-20 w-full max-w-5xl mb-12">
          <div className="flex items-center gap-6 mb-10">
            <span className="h-px w-16 bg-white/40" />
            <span className="text-[11px] font-light uppercase tracking-[0.6em] text-white/70">
              Exclusive Collection
            </span>
          </div>

          <h1
            ref={titleRef}
            className="font-['Jost',sans-serif] text-5xl md:text-7xl lg:text-[7rem] font-light uppercase tracking-[0.1em] leading-[1.1] mb-12"
            dangerouslySetInnerHTML={{
              __html: slides[displayTextIndex]?.title || "",
            }}
          />

          <div
            ref={statusRef}
            className="text-[12px] uppercase font-light tracking-[0.7em] border-l-[1px] pl-6 ml-1"
            style={{ color: accentColor, borderColor: accentColor }}
          >
            {slides[displayTextIndex]?.status}
          </div>
        </div>

        {/* Vertical Pagination */}
        {showPagination && (
          <div className="absolute bottom-20 right-8 md:right-20 z-20 flex flex-col gap-8">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className="group flex items-center justify-end gap-4 outline-none cursor-pointer"
                disabled={isAnimating}
              >
                <span
                  className={`text-[10px] font-bold tracking-widest transition-all duration-500 ${activeIndex === i ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}`}
                >
                  0{i + 1}
                </span>
                <div
                  className={`h-px transition-all duration-700 bg-white ${activeIndex === i ? "w-12" : "w-4 bg-white/20 group-hover:bg-white/60"}`}
                />
              </button>
            ))}
          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
