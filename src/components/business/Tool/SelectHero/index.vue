<script setup lang="ts">
import { ref, watch } from "vue";

import FormSelect from "@/components/business/Form/FormSelect/index.vue";
import { API_HERO } from "@/api";

interface Props {
  /** 英雄id */
  modelValue: number;
  /** 禁用 */
  disabled?: boolean;
}

const $props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  disabled: false,
});
const $emit = defineEmits<{
  "update:modelValue": [v: number];
}>();

/** 英雄名称 */
const hero_name = ref("");
/** 英雄id */
const id = ref(0);
/** 获取英雄基础列表 */
const hero_list = ref<General[]>([]);

/* 获取英雄基础列表 */
API_HERO.getHeroName().then((res) => {
  hero_list.value = res;

  //查找当前id的英雄名
  hero_name.value = hero_list.value.find((item) => item.id === $props.modelValue)?.name || "";
});

/* 选择英雄后触发 */
const selectHero = (id: string | number | unknown[]) => {
  if (typeof id !== "number") return;
  $emit("update:modelValue", id);
};

watch(
  () => $props.modelValue,
  (v) => {
    id.value = v;
  },
);
</script>

<template>
  <div class="select-hero">
    <FormSelect
      id
      v-model="id"
      label="指派英雄"
      :data="hero_list"
      :value="hero_name"
      :disabled="disabled"
      required
      @update:model-value="selectHero"
    />
  </div>
</template>
