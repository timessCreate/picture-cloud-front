<template>
  <div class="home">
    <h1>欢迎来到易图</h1>
    <div class="feature-grid">
      <div class="feature-item">
        <h3>图片上传</h3>
        <p>轻松上传和管理您的图片</p>
      </div>
      <div class="feature-item">
        <h3>图片分享</h3>
        <p>便捷分享您的图片给他人</p>
      </div>
      <div class="feature-item">
        <h3>在线浏览</h3>
        <p>随时随地查看您的图片</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  padding: 2rem;
  text-align: center;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.feature-item {
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #1890ff;
  margin-bottom: 2rem;
}

h3 {
  color: #333;
  margin-bottom: 1rem;
}

p {
  color: #666;
}
</style>
