---
page: true
title: 第4页
aside: false
---
<script setup>
import Page from "./.vitepress/theme/components/Page.vue";
import { useData } from "vitepress";
const { theme } = useData();
const posts = theme.value.posts.slice(30,40)
</script>
<Page :posts="posts" :pageCurrent="4" :pagesNum="9" />