<script setup lang="ts">
import { ref, computed, onUnmounted } from "vue";
import { storeToRefs } from "pinia";

import RegLogin from "./childComps/RegLogin/index.vue";
import Notice from "./childComps/Notice/index.vue";
import ReadMe from "./childComps/ReadMe/index.vue";
import Team from "./childComps/Team/index.vue";
import ToolBar from "./childComps/ToolBar/index.vue";
import DownLoad from "./childComps/DownLoad/index.vue";

import { SettingStore } from "@/store";
import { $bus, $concise, $tip, $tool } from "@/utils";
import { KVideo } from "@/components/business";

const { config } = storeToRefs(SettingStore());

const { getImgLink, getVideoLink } = $concise;

const toolbarRef = ref<InstanceType<typeof ToolBar>>();

/** 显示公告 */
const show_notice = ref(true);
/** 显示README */
const show_readme = ref(false);
/** 显示开黑 */
const show_team = ref(false);
/** 数据下载完成 */
const finish = ref(false);

/* 隐藏注册登录盒子 */
const hideRegLogin = computed(() => !finish.value || show_notice.value || show_team.value);

/**
 * 点击右上角工具栏
 * @param v 点击工具栏的静音、README、公告按钮类型
 */
const onToolType = (v: string) => {
  show_readme.value = v === "readme";
  show_notice.value = v === "notice";
  show_team.value = v === "team";
};

/* 关闭公告触发 */
const onCloseNotice = () => {
  if (!(toolbarRef.value && toolbarRef.value.el)) return;
  const toolbarFocus = new $tool.FocusElement(toolbarRef.value.el);

  $tip({
    text: "9f5m",
    align: "right-bottom",
    createFn: () => {
      toolbarFocus.focus();
    },
    btnFn: () => {
      toolbarFocus.blur();
    },
  });
};

onUnmounted(() => {
  $bus.off("resize");
});
</script>

<template>
  <div class="login">
    <div class="login__logo">
      <img :src="getImgLink('logo')" alt="" />
    </div>

    <!-- 登录注册盒子 -->
    <RegLogin v-if="finish" :class="{ 'hide-reg-login': hideRegLogin }" />

    <!-- 工具栏 -->
    <ToolBar ref="toolbarRef" :notice="finish" @clicks="onToolType" />

    <!-- PC端视频背景 -->
    <KVideo :link="getVideoLink('login_bg')" :muted="config.muted" />

    <!-- 公告 -->
    <Notice v-if="show_notice && finish" v-model="show_notice" @close="onCloseNotice" />

    <!-- README -->
    <ReadMe v-if="show_readme" v-model="show_readme" />

    <!-- 开黑 -->
    <Team v-if="show_team" v-model="show_team" />

    <!-- 下载进度 -->
    <DownLoad v-if="!finish" v-model:finish="finish" />
  </div>
</template>

<style scoped lang="less">
@import url("./index.less");
</style>
