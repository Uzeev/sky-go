"use client";

import { useEffect, useRef, useState } from "react";

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [restartKey, setRestartKey] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let planeY = canvas.height / 2;
    const planeSpeed = 5;
    let obstacles: { x: number; y: number; w: number; h: number; spriteIndex: number }[] = [];
    let clouds: { x: number; y: number; w: number; h: number; spriteIndex: number }[] = [];
    let isGameOver = false;

    // Load images
    const bgImg = new Image();
    bgImg.src = "/sky-bg.png";

    const planeImg = new Image();
    planeImg.src = "/plane.png";

    const rockSprites = ["/rock1.png", "/rock2.png", "/rock3.png", "/meteor.png"].map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

    const cloudSprites = ["/cloud1.png", "/cloud2.png", "/cloud3.png"].map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowUp") planeY -= planeSpeed;
      if (e.key === "ArrowDown") planeY += planeSpeed;
    }

    window.addEventListener("keydown", handleKeyDown);

    const spawnObstacle = setInterval(() => {
      if (!isGameOver) {
        obstacles.push({
          x: canvas.width,
          y: Math.random() * (canvas.height - 50),
          w: 32,
          h: 32,
          spriteIndex: Math.floor(Math.random() * rockSprites.length),
        });
      }
    }, 2000);

    const spawnCloud = setInterval(() => {
      clouds.push({
        x: canvas.width,
        y: Math.random() * (canvas.height - 60),
        w: 50,
        h: 30,
        spriteIndex: Math.floor(Math.random() * cloudSprites.length),
      });
    }, 3000);

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

      // Clouds
      clouds.forEach((cloud, i) => {
        cloud.x -= 1;
        const sprite = cloudSprites[cloud.spriteIndex];
        ctx.drawImage(sprite, cloud.x, cloud.y, cloud.w, cloud.h);
        if (cloud.x + cloud.w < 0) clouds.splice(i, 1);
      });

      // Plane
      ctx.drawImage(planeImg, 50, planeY, 40, 40);

      // Obstacles
      obstacles.forEach((obs, i) => {
        obs.x -= 2 + level;
        const sprite = rockSprites[obs.spriteIndex];
        ctx.drawImage(sprite, obs.x, obs.y, obs.w, obs.h);

        // Collision detection
        const planeX = 50;
        const planeW = 40;
        const planeH = 40;

        const hitbox = {
  x: obs.x + 6,
  y: obs.y + 6,
  w: obs.w - 12,
  h: obs.h - 12,
};

const collided =
  planeX < hitbox.x + hitbox.w &&
  planeX + planeW > hitbox.x &&
  planeY < hitbox.y + hitbox.h &&
  planeY + planeH > hitbox.y;          

        if (collided) {
          isGameOver = true;
          setGameOver(true);
          return;
        }

        // Passed obstacle
        if (obs.x + obs.w < 0) {
          setScore((s) => s + 1);
          obstacles.splice(i, 1);
          if ((score + 1) % 5 === 0) setLevel((l) => l + 1);
        }
      });

      if (!isGameOver) requestAnimationFrame(draw);
    }

    draw();

    return () => {
      clearInterval(spawnObstacle);
      clearInterval(spawnCloud);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [level, restartKey]);

  function handleRestart() {
    setScore(0);
    setLevel(1);
    setGameOver(false);
    setRestartKey((k) => k + 1);
  }

  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} width={600} height={400} />
      <p>Score: {score} | Level: {level}</p>
      {gameOver && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-red-600 font-bold">Game Over!</p>
          <button
            onClick={handleRestart}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
}
