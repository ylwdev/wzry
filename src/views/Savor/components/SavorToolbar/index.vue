<script setup lang="ts">
import { ref, onUnmounted } from "vue";
import { storeToRefs } from "pinia";

import { AtlasStore } from "@/store";
import { $bus } from "@/utils";
import { FilterGender, FilterTool, KInput } from "@/components/business";

const { sortType, filterGender, searchAtlas } = AtlasStore();
const { sort_type } = storeToRefs(AtlasStore());

const sort_types = [
  { label: "正序", value: "正序" },
  { label: "倒序", value: "倒序" },
];

/** 搜索值 */
const search_value = ref("");
/** 性别排序 */
const gender = ref<Gender>(0);
/** 记录展开状态 */
const select_status = ref(false);

/* 正序/倒序 */
const onSortType = (v: string | number) => {
  sortType(v as string);
};

/* 设置性别 */
const handerSetGender = (type: Gender) => {
  gender.value = type;
  filterGender(type);
};

/** 搜索皮肤 */
const handSearch = () => {
  searchAtlas(search_value.value);
};

/** 设置下拉状态 */
const handleSelectStatus = () => {
  select_status.value = !select_status.value;
};

$bus.on("mouseup", (e) => {
  const el = (e as MouseEvent).target as HTMLElement;

  //如果点击的不是下拉菜单，则隐藏
  if (!el.className.includes("select-filter")) {
    select_status.value = false;
  }
});

onUnmounted(() => {
  $bus.off("mouseup");
});
</script>

<template>
  <div class="savor-toolbar">
    <div class="filter-select">
      <!-- 正序/倒序 -->
      <FilterTool
        :status="select_status"
        :sort-text="sort_type"
        :data="sort_types"
        @click="handleSelectStatus"
        @select="onSortType"
      />
    </div>

    <!-- 只看性别 -->
    <FilterGender @change="handerSetGender" />

    <!-- 搜索 -->
    <KInput v-model="search_value" placeholder="英雄/皮肤" @input="handSearch" />
  </div>
</template>

<style scoped lang="less">
@import url("./index.less");
</style>
