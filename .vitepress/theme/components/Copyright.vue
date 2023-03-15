<template>
    <div class="site-footer">
        Powered by <a class="vitepress" target="_blank" href="//github.com/OSpoon">前端小鑫同学</a>
        Record No <a class="vitepress" target="_blank" href="//beian.miit.gov.cn/">晋ICP备15003329号-3</a><br />
        MIT Licensed | Copyright © 2023-2024 <a class="vitepress" :href="website">{{ webTitle }}</a>
    </div>
</template>
<script lang="ts" setup>
import { useData } from 'vitepress'

const { site, theme } = useData()
const website = theme.value.website
const webTitle = site.value.title
</script>

<style>
.site-footer {
    color: #888;
    text-align: center;
    font-size: 0.75rem;
    width: 100%;
    padding: 15px 0;
    overflow: auto;
}
.vitepress {
    color: var(--vp-c-text-1);
    font-weight: 700;
}
</style>
