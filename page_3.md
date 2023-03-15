---
page: true
title: 第3页
aside: false
---
<script setup>
import Page from "./.vitepress/theme/components/Page.vue";
import { useData } from "vitepress";
const { theme } = useData();
const posts = theme.value.posts.slice(20,30)
</script>
<Page :posts="posts" :pageCurrent="3" :pagesNum="9" />