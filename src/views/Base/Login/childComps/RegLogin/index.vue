<script setup lang="ts">
import { ref, computed, onUnmounted } from "vue";

import LoginBox from "./childComps/LoginBox/index.vue";
import RegBox from "./childComps/RegBox/index.vue";
import SelectInto from "./childComps/SelectInto/index.vue";

import { API_USER } from "@/api";
import { SettingStore, AudioStore, DeviceStore } from "@/store";
import { vParticle } from "@/directives";
import { $concise, $tool } from "@/utils";

const $settingStore = SettingStore();
const $audioStore = AudioStore();
const $deviceStore = DeviceStore();

const RegLoginRef = ref<HTMLElement>();
/** 注册及登录状态下要显示的输入框及按钮 */
const is_reg = ref("");
/** 用户表单 */
const reg_form = ref<User>();

const { getImgLink } = $concise;

API_USER.userList().then((res) => {
  if (res.length) {
    is_reg.value = "登录";
  }
});

/** 登录、注册的组件切换 */
const component = computed(() => {
  return is_reg.value === "登录" ? LoginBox : is_reg.value === "注册" ? RegBox : SelectInto;
});

/* 重新选择登录还是注册 */
const handleBack = () => {
  is_reg.value = "";
  $audioStore.play("p60v");
};

/**
 * 进入方式，用于切换注册和登录组件
 * @param v 注册或登录
 */
const onIntoType = (v: unknown) => {
  is_reg.value = v as string;
};

/**
 * 注册成功
 * @param form 注册成功的表单
 */
const onRegSuccess = (form: unknown) => {
  is_reg.value = "登录";
  reg_form.value = form as User;
};

/* 视差动画(如果为移动端或为safari浏览器则取消) */
if (!$tool.isPhone || $deviceStore.browser_name === "safari") {
  const parallax = new $tool.Parallax((x: number, y: number) => {
    if (!RegLoginRef.value) return;
    RegLoginRef.value.style.transform = `translate(-50%, -50%) rotateX(${y * 10}deg) rotateY(${
      -x * 10
    }deg)`;
  });

  const fn = (e: MouseEvent) => {
    $tool.throttleInstant(() => parallax.move(e), 50);
  };

  window.addEventListener("mousemove", fn);
  onUnmounted(() => {
    window.removeEventListener("mousemove", fn);
  });
}
</script>

<template>
  <div ref="RegLoginRef" class="reg-login">
    <!-- 左上角重新选择 -->
    <div v-show="is_reg" class="reg-login__back" @click="handleBack">
      <i class="iconfont wzry-fanhui back" />
      <span class="text">重新选择</span>
    </div>

    <!-- logo -->
    <div
      v-particle="{
        down: true,
        color: '#e8cc7d',
        lock: true,
        enable: $settingStore.config.particle,
      }"
      class="reg-login__logo"
    >
      <img class="logo" :src="getImgLink('login_logo')" alt="logo" />
    </div>

    <!-- 标题 -->
    <div class="reg-login__title">
      {{ is_reg === "" ? "Welcome" : is_reg }}
    </div>

    <!-- 组件切换 -->
    <component :is="component" :user-info="reg_form" @into="onIntoType" @success="onRegSuccess" />
  </div>
</template>

<style scoped lang="less">
@import url("./index.less");
</style>
