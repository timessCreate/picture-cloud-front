<template>
  <div class="about">
    <h1>关于易图</h1>

    <div class="content">
      <div class="section">
        <h2>项目介绍</h2>
        <p>
          易图是一个简单易用的图片托管和分享平台。我们致力于为用户提供最便捷的图片存储和分享服务。
        </p>
      </div>

      <div class="section features">
        <h2>核心功能</h2>
        <div class="feature-list">
          <div class="feature">
            <CloudUploadOutlined class="icon" />
            <h3>快速上传</h3>
            <p>支持拖拽上传、复制粘贴等多种上传方式</p>
          </div>
          <div class="feature">
            <LinkOutlined class="icon" />
            <h3>便捷分享</h3>
            <p>一键生成分享链接，支持多种引用格式</p>
          </div>
          <div class="feature">
            <SafetyCertificateOutlined class="icon" />
            <h3>安全存储</h3>
            <p>采用先进的加密技术，确保您的图片安全</p>
          </div>
        </div>
      </div>

      <div class="section contact">
        <h2>联系我们</h2>
        <div class="contact-info">
          <p>
            <GithubOutlined /> GitHub:
            <a href="https://github.com/timessCreate" target="_blank">timessCreate</a>
          </p>
          <p><MailOutlined /> 邮箱: example@example.com</p>
        </div>
      </div>

      <div class="section version">
        <h2>版本信息</h2>
        <p>当前版本: v1.0.0</p>
        <p>最后更新: 2024-03-20</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  CloudUploadOutlined,
  LinkOutlined,
  SafetyCertificateOutlined,
  GithubOutlined,
  MailOutlined,
} from '@ant-design/icons-vue'
</script>

<style scoped>
.about {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  text-align: center;
  color: #1890ff;
  margin-bottom: 3rem;
  font-size: 2.5rem;
}

.section {
  margin-bottom: 3rem;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #333;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #1890ff;
  padding-bottom: 0.5rem;
  display: inline-block;
}

.feature-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.feature {
  text-align: center;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  transition: transform 0.3s;
}

.feature:hover {
  transform: translateY(-5px);
}

.icon {
  font-size: 2.5rem;
  color: #1890ff;
  margin-bottom: 1rem;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-info a {
  color: #1890ff;
  text-decoration: none;
}

.contact-info a:hover {
  text-decoration: underline;
}

.version {
  text-align: center;
  background: #f8f9fa;
}

@media (max-width: 768px) {
  .about {
    padding: 1rem;
  }

  .feature-list {
    grid-template-columns: 1fr;
  }
}
</style>
