<script setup lang="ts">
import { vAnimateNumber, vBlurLoad, vMaskGradient } from "@/directives";

interface Props {
  data: Epigraph.Data;
}

defineProps<Props>();
</script>

<template>
  <div
    v-maskGradient="{
      color: 'rgb(62 123 194)',
      start: '-50%',
      end: '50%',
      rotate: '345deg',
    }"
    class="epigraph-card"
  >
    <img v-blurLoad="data.img" class="blur" :src="data.imgBlur" alt="" />
    <div class="box">
      <div class="name">5级铭文:{{ data.name }}</div>
      <div class="attr">
        <div v-for="(item, index) in data.effect" :key="index" class="type">
          {{ item.type }}+<span
            v-animate-number="{
              num: item.num,
              decimalPlaces: 1,
            }"
          ></span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
@import url("./index.less");
</style>
