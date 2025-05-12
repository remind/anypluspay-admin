<script>
export default {
  props: {
    html: {
      type: String,
      required: true,
    },
  },
  updated() {
    // 确保在 DOM 更新后执行脚本
    this.executeScripts();
  },
  methods: {
    executeScripts() {
      // 获取容器内的所有 script 标签
      const scripts = this.$refs.htmlContainer.querySelectorAll('script');

      scripts.forEach((script) => {
        const newScript = document.createElement('script');
        newScript.textContent = script.textContent; // 复制脚本内容
        document.body.append(newScript); // 执行脚本
        script.remove(); // 移除已经执行过的 script 标签，防止重复执行
      });
    },
  },
};
</script>

<template>
  <div v-html="html" ref="htmlContainer"></div>
</template>
