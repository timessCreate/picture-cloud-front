<template>
  <div class="donate">
    <h1>支持我们</h1>

    <div class="content">
      <div class="section intro">
        <h2>为什么需要捐赠</h2>
        <p>
          易图是一个完全免费的开源项目，我们致力于为用户提供最好的图片托管服务。
          您的捐赠将帮助我们：
        </p>
        <ul>
          <li><ThunderboltOutlined class="list-icon" /> 维持服务器运营</li>
          <li><ToolOutlined class="list-icon" /> 开发新功能</li>
          <li><BugOutlined class="list-icon" /> 修复问题</li>
          <li><CloudUploadOutlined class="list-icon" /> 提升服务质量</li>
        </ul>
      </div>

      <div class="section donate-methods">
        <h2>捐赠方式</h2>
        <div class="methods-grid">
          <a-card class="method-card">
            <template #cover>
              <img alt="微信支付" src="../assets/wechat-qr.png" />
            </template>
            <template #actions>
              <WechatOutlined style="color: #07c160" />
              <span>微信支付</span>
            </template>
          </a-card>

          <a-card class="method-card">
            <template #cover>
              <img alt="支付宝" src="../assets/alipay-qr.png" />
            </template>
            <template #actions>
              <AlipayCircleOutlined style="color: #1677ff" />
              <span>支付宝</span>
            </template>
          </a-card>
        </div>
      </div>

      <div class="section sponsors">
        <h2>赞助者名单</h2>
        <div class="sponsor-list">
          <a-list :grid="{ gutter: 16, column: 1 }">
            <a-list-item v-for="(sponsor, index) in sponsors" :key="index">
              <a-card class="sponsor-card">
                <template #avatar>
                  <img class="sponsor-avatar" :alt="sponsor.name" :src="sponsor.avatar" />
                </template>
                <a-card-meta :title="sponsor.name">
                  <template #description>
                    <div class="sponsor-info">
                      <span class="amount">{{ sponsor.amount }}</span>
                      <span class="sponsor-date">{{ sponsor.date }}</span>
                    </div>
                  </template>
                </a-card-meta>
              </a-card>
            </a-list-item>
          </a-list>
        </div>
      </div>

      <div class="section contact">
        <h2>联系方式</h2>
        <p>如果您在捐赠过程中遇到任何问题，请通过以下方式联系我们：</p>
        <div class="contact-info">
          <p><MailOutlined /> 邮箱：example@example.com</p>
          <p><WechatOutlined /> 微信：your_wechat_id</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ThunderboltOutlined,
  ToolOutlined,
  BugOutlined,
  CloudUploadOutlined,
  WechatOutlined,
  AlipayCircleOutlined,
  MailOutlined,
} from '@ant-design/icons-vue'
import { ref } from 'vue'

const sponsors = ref([
  {
    name: '张三',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    amount: '￥100',
    date: '2024-03-20',
  },
  {
    name: '李四',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    amount: '￥50',
    date: '2024-03-19',
  },
  {
    name: '王五',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    amount: '￥200',
    date: '2024-03-18',
  },
])
</script>

<style scoped>
.donate {
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

.intro ul {
  list-style: none;
  padding: 0;
  margin-top: 1.5rem;
}

.intro li {
  margin: 1rem 0;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
}

.list-icon {
  margin-right: 0.5rem;
  color: #1890ff;
}

.methods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.method-card {
  text-align: center;
  transition: transform 0.3s;
}

.method-card:hover {
  transform: translateY(-5px);
}

.method-card img {
  width: 200px;
  height: 200px;
  object-fit: cover;
  margin: 1rem auto;
}

.sponsor-list {
  margin-top: 2rem;
}

.sponsor-card {
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.sponsor-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 16px;
}

.sponsor-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.amount {
  color: #1890ff;
  font-weight: bold;
}

.sponsor-date {
  color: #999;
  font-size: 0.9rem;
}

.contact-info {
  margin-top: 1.5rem;
}

.contact-info p {
  margin: 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .donate {
    padding: 1rem;
  }

  .methods-grid {
    grid-template-columns: 1fr;
  }
}
</style>
