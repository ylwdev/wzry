<script setup lang="ts">
import { ref, watch } from "vue";

import { AudioStore } from "@/store";

interface Props {
  /** 按钮大小 */
  size?: string;
  /** 是否完整提交 */
  finish?: boolean;
  /** 提交状态 */
  modelValue: number;
}

const $props = withDefaults(defineProps<Props>(), {
  size: "3.125rem",
  modelValue: 0,
});
const $emit = defineEmits<{
  commit: [];
  "update:modelValue": [v: number];
}>();

const $audioStore = AudioStore();

/** 显示纸飞机 */
const show_up = ref(true);

/* 提交 */
const commit = () => {
  $emit("update:modelValue", 1);
  setTimeout(() => {
    show_up.value = false;
    $emit("commit");
  }, 750);
  $audioStore.play("pj83");
};

watch(
  () => $props.modelValue,
  (v) => {
    if (v === 0) {
      show_up.value = true;
    }
  },
);
</script>

<template>
  <div
    class="lib-commit-btn"
    :style="{
      width: size,
      height: size,
    }"
    @click="commit"
  >
    <img v-show="show_up" class="up" :class="{ move: modelValue === 1 }" src="./img/fabu.svg" />
    <transition name="fade">
      <img
        v-show="!show_up && modelValue === 1 && !finish"
        class="rotate"
        src="./img/loading.svg"
      />
    </transition>
    <transition name="bounce">
      <img v-show="finish" src="./img/success.svg" />
    </transition>
  </div>
</template>

<style scoped lang="less">
@import url("./index.less");
</style>
