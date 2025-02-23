<script setup lang="ts">
import { reactive } from "vue";

import { useViewHide } from "@/views/System/hooks/useViewHide";
import { heroDefault } from "@/default";
import { API_HERO } from "@/api";
import { $loading } from "@/utils";
import {
  FormInput,
  FormLabel,
  FormSelect,
  KRange,
  ManageMask,
  ReleaseConfirm,
  SelectImg,
} from "@/components/business";

const $emit = defineEmits<{
  "update:modelValue": [v: boolean];
}>();

const attr: Partial<Record<keyof Hero.Data, string>> = {
  survival: "生存能力",
  attack: "攻击伤害",
  effect: "技能效果",
  difficulty: "上手难度",
};

const info: [string, string, keyof Hero.Data][] = [
  ["阵营", "campType", "camp"],
  ["定位", "locationType", "location"],
  ["时期", "periodType", "period"],
  ["种族", "raceType", "race"],
];

const { status, show, form_data, finish, onConfirmSave, onConfirmRemove } = useViewHide<Hero.Data>(
  $emit,
  "add_hero",
);

/** 类型列表 */
const type_list: Record<string, General[]> = reactive({
  campType: [],
  locationType: [],
  periodType: [],
  professionType: [],
  specialtyType: [],
  raceType: [],
});

//根据英雄总数设置id
API_HERO.getHeroName().then((res) => {
  form_data.value!.id = res.length + 1;
});

//判断是否存在缓存
form_data.value ??= heroDefault();

/* 延迟显示 */
$loading.close();
setTimeout(async () => {
  type_list.campType = await API_HERO.getCampType();
  type_list.raceType = await API_HERO.getRaceType();
  type_list.locationType = await API_HERO.getLocationType();
  type_list.periodType = await API_HERO.getPeriodType();
  type_list.professionType = await API_HERO.getProfessionType();
  type_list.specialtyType = await API_HERO.getSpecialtyType();
  show.value = true;
}, 1000);

/* 发布 */
const onCommit = async () => {};
</script>

<template>
  <ManageMask
    class="content"
    :show="show"
    :styles="{
      flexDirection: 'column',
      alignItems: 'center',
    }"
  >
    <!-- 英雄名、代号、身高 -->
    <div v-if="form_data" class="flex-box">
      <FormInput v-model="form_data.name" label="英雄名" required />
      <FormInput v-model="form_data.gender" label="性别" required placeholder="男/女" />
      <FormInput v-model="form_data.mark" label="代号" required />
      <FormInput v-model="form_data.height" label="身高" />
      <FormInput v-model="form_data.identity" label="身份" placeholder="多个身份/分隔" />
    </div>

    <!-- 选择器相关 -->
    <div v-if="form_data" class="flex-box">
      <FormSelect
        v-for="(v, k) in info"
        :key="k"
        v-model="form_data[v[2]]"
        :label="v[0]"
        :data="type_list[v[1]]"
        :value="form_data[v[2]]"
      />
    </div>

    <!-- 职业 -->
    <FormSelect
      v-if="form_data"
      v-model="form_data.profession"
      :data="type_list.professionType"
      :value="form_data.profession"
      label="职业"
      multi
    />

    <!-- 特长 -->
    <FormSelect
      v-if="form_data"
      v-model="form_data.specialty"
      :data="type_list.specialtyType"
      :value="form_data.specialty"
      label="特长"
      multi
    />

    <!-- 属性相关 -->
    <div v-if="form_data" class="flex-box">
      <FormLabel v-for="(v, k) in attr" :key="k" :label="v" label-width="12.5rem">
        <KRange
          v-model="form_data[k]"
          :text="form_data[k] + '%'"
          track-color="var(--theme-el-color-four)"
        />
      </FormLabel>
    </div>

    <!-- 设置头像&海报 -->
    <div v-if="form_data" class="flex-box">
      <FormLabel label-width="18.125rem" label="头像&封面&&海报">
        <SelectImg v-model="form_data.headImg" title="头像" />
        <SelectImg v-model="form_data.cover" type="height" title="封面" />
        <SelectImg v-model="form_data.poster" type="width" title="海报" />
      </FormLabel>
    </div>

    <!-- 发布确认 -->
    <ReleaseConfirm
      v-model:status="status"
      :finish="finish"
      @commit="onCommit"
      @confirm="onConfirmSave"
      @cancel="onConfirmRemove"
    />
  </ManageMask>
</template>

<style scoped lang="less">
@import url("./index.less");
</style>
