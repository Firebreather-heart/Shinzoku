import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const AnimatedHeartLogo = () => {
  const heartRef = useRef(null);
  const spearsRef = useRef(null);
  const bloodDropsRef = useRef(null);
  const goldPoolRef = useRef(null);

  useEffect(() => {
    // Pulsing Heart Animation
    gsap.to(heartRef.current, {
      scale: 1.1,
      repeat: -1,
      yoyo: true,
      duration: 1,
      ease: "power1.inOut",
    });

    // Spears Slight Motion
    gsap.to(spearsRef.current, {
      rotate: "1deg",
      repeat: -1,
      yoyo: true,
      duration: 2,
      ease: "sine.inOut",
    });

    // Blood Drip Animation with gold transformation
    if (bloodDropsRef.current) {
      const bloodDrops = Array.from(bloodDropsRef.current.children);
      
      // Initialize gold pool
      gsap.set(goldPoolRef.current, { 
        scaleX: 0.7, 
        scaleY: 0.2, 
        opacity: 0.8 
      });
      
      bloodDrops.forEach((drop, index) => {
        // Initial state
        gsap.set(drop, { scaleY: 0.3, opacity: 0 });
        
        // Create timeline for each drop
        const tl = gsap.timeline({ repeat: -1, delay: index * 0.7 });
        tl.to(drop, { opacity: 1, duration: 0.3 })
          .to(drop, { 
            scaleY: 1.5, 
            duration: 1.2, 
            ease: "sine.in" 
          })
          .to(drop, { 
            y: 30, 
            opacity: 0, 
            duration: 0.5,
            ease: "power1.in" 
          }, "-=0.3")
          .to(drop, { 
            y: 0, 
            scaleY: 0.3, 
            duration: 0 
          })
          // Gold pool grows with each drop
          .to(goldPoolRef.current, {
            scaleX: "+=0.05",
            scaleY: "+=0.05",
            duration: 0.3,
            ease: "bounce.out"
          }, "-=0.5")
          .to(goldPoolRef.current, {
            scaleX: "-=0.02",
            scaleY: "-=0.02",
            duration: 0.2
          });
      });
      
      // Continuous subtle gold shimmer
      gsap.to(goldPoolRef.current, {
        filter: "brightness(1.2)",
        repeat: -1,
        yoyo: true,
        duration: 1.5,
        ease: "sine.inOut"
      });
    }
  }, []);

  return (
    <div className="relative flex justify-center items-center w-40 h-40">
      {/* Spear shafts (behind heart) */}
      <div ref={spearsRef} className="absolute w-full h-full pointer-events-none z-10">
        {/* First spear shaft - from top left to bottom right */}
        <div className="absolute w-1 h-36 bg-gradient-to-b from-gray-300 to-gray-700 rotate-45 top-2 left-12">
          {/* Sword handle */}
          <div className="absolute -top-4 -left-1 w-3 h-5 bg-gradient-to-b from-amber-800 to-yellow-700 rounded-sm">
            {/* Sword guard */}
            <div className="absolute top-4 -left-1.5 w-6 h-1 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600"></div>
          </div>
        </div>
        
        {/* Second spear shaft - from top right to bottom left */}
        <div className="absolute w-1 h-36 bg-gradient-to-b from-gray-300 to-gray-700 -rotate-45 top-2 right-12">
          {/* Sword handle */}
          <div className="absolute -top-4 -right-1 w-3 h-5 bg-gradient-to-b from-amber-800 to-yellow-700 rounded-sm">
            {/* Sword guard */}
            <div className="absolute top-4 -right-1.5 w-6 h-1 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600"></div>
          </div>
        </div>
      </div>

      {/* Heart - middle layer */}
      <div
        ref={heartRef}
        className="w-24 h-24 relative flex justify-center items-center shadow-lg z-20"
      >
        <span className="text-5xl">❤️</span>
      </div>

      {/* Wound marks where spears pierce heart */}
      <div className="absolute w-2 h-2 bg-red-900 rounded-full top-16 left-[42%] z-30"></div>
      <div className="absolute w-2 h-2 bg-red-900 rounded-full top-16 right-[42%] z-30"></div>

      {/* Dripping Blood */}
      <div ref={bloodDropsRef} className="absolute top-24 flex gap-3 z-40">
        <div className="w-1.5 h-3 bg-red-700 rounded-full drop-shadow-md origin-top"></div>
        <div className="w-1.5 h-3 bg-red-700 rounded-full drop-shadow-md origin-top"></div>
        <div className="w-1.5 h-3 bg-red-700 rounded-full drop-shadow-md origin-top"></div>
      </div>
      
      {/* Gold pool forming at bottom - made wider */}
      <div 
        ref={goldPoolRef} 
        className="absolute bottom-3 w-20 h-3 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 rounded-full shadow-lg opacity-80 z-30 origin-center"
      ></div>
    </div>
  );
};

export default AnimatedHeartLogo;