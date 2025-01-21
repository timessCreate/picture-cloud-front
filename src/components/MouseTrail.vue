<template>
  <div id="trail-container"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const particles: HTMLDivElement[] = []

// 创建粒子
const createParticle = (x: number, y: number) => {
  const particle = document.createElement('div')
  particle.classList.add('mouse-particle')
  particle.style.left = `${x}px`
  particle.style.top = `${y}px`
  particle.style.backgroundColor = getRandomColor()
  const container = document.getElementById('trail-container')
  if (container) {
    container.appendChild(particle)
    particles.push(particle)

    setTimeout(() => {
      particle.classList.add('fade')
      particle.addEventListener('animationend', () => {
        particle.remove()
        const index = particles.indexOf(particle)
        if (index > -1) {
          particles.splice(index, 1)
        }
      })
    }, 50)
  }
}

// 获取随机颜色
const getRandomColor = () => {
  const colors = [
    '#ff7675',
    '#74b9ff',
    '#55efc4',
    '#ffeaa7',
    '#fd79a8',
    '#81ecec',
    '#00cec9'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// 鼠标移动处理
const handleMouseMove = (e: MouseEvent) => {
  requestAnimationFrame(() => {
    createParticle(e.clientX, e.clientY)
  })
}

// 清理粒子
const cleanupParticles = () => {
  particles.forEach(particle => {
    if (particle.classList.contains('fade')) {
      particle.remove()
      const index = particles.indexOf(particle)
      if (index > -1) {
        particles.splice(index, 1)
      }
    }
  })
}

// 组件挂载时添加事件监听
onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
  const cleanupInterval = setInterval(cleanupParticles, 1000)

  // 清理定时器
  onUnmounted(() => {
    window.removeEventListener('mousemove', handleMouseMove)
    clearInterval(cleanupInterval)
    // 清理所有剩余粒子
    particles.forEach(particle => particle.remove())
    particles.length = 0
  })
})
</script>

<style>
#trail-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 99999 !important;
  overflow: hidden;
}

.mouse-particle {
  position: fixed;
  width: 5px;
  height: 5px;
  background-color: #fff;
  border-radius: 50%;
  opacity: 1;
  transform: translate(-50%, -50%);
  pointer-events: none;
  mix-blend-mode: screen;
  z-index: 99999 !important;
}

@keyframes fadeOut {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.3);
  }
}

.mouse-particle.fade {
  animation: fadeOut 0.5s ease-out forwards;
}
</style>
