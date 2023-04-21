<template>
    <h2>在线预览</h2>
    <iframe class="container" :src="props.url"></iframe>
</template>
<script lang="ts" setup>
const props = defineProps({
    url: {
      type: String,
      required: true
    }
})
console.log(props.url)
</script>

<style scoped>
.container {
    margin: 10px auto;
    width: 80%;
    background-color: #151617;
    border-radius: 8px;
    height: 480px;
}
</style>
