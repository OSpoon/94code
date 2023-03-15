---
page: true
title: 第9页
aside: false
---
<script setup>
import Page from "./.vitepress/theme/components/Page.vue";
import { useData } from "vitepress";
const { theme } = useData();
const posts = theme.value.posts.slice(80,90)
</script>
<Page :posts="posts" :pageCurrent="9" :pagesNum="9" />