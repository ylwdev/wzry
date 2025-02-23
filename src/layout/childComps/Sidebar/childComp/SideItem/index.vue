<script setup lang="ts">
import { reactive, ref, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";

import SideItem from "./index.vue";

import { CollapseStore, AudioStore } from "@/store";
import { $concise } from "@/utils";

interface RouteFormat {
  /** 路由路径 */
  path: string;
  /** 路由标题 */
  title: string;
  /** 路由元素 */
  meta: { title: string };
  /** 子路由 */
  children: RouteFormat[] | null;
  /** 层级 */
  zIndex: number;
}

interface Props {
  route: any;
  coord: number;
}

const $props = defineProps<Props>();
const $emit = defineEmits<{
  coord: [v: number];
}>();

const $router = useRouter();
const $route = useRoute();
const $collapseStore = CollapseStore();
const $audioStore = AudioStore();

const { getImgLink } = $concise;

/** 设置子菜单与上级菜单水平间隔 */
const textStyle = `padding-left: ${0.5 * $props.route.zIndex}em !important;`;

const menuItemRef = ref<HTMLElement>();

/** 用于父级菜单专属 */
const show = ref(false);
/** 父级菜单专属用于生成子菜单 */
const routes = reactive<RouteFormat[]>([]);

//当前路由如果等于props路由，则父级菜单自动展开，前提当前组件为父级菜单
show.value = $route.path.includes($props.route.path);

nextTick(() => {
  setTimeout(() => {
    if (!show.value || !menuItemRef.value) return;
    show.value && $emit("coord", menuItemRef.value.getBoundingClientRect().top);
  }, 2000);
});

//如果当前路由存在子路由，则添加进子菜单用于循环生成
if (show.value && $props.route.children) routes.push(...$props.route.children);

/* 点击后触发 */
const fn = () => {
  show.value = !show.value;

  if (window.innerWidth < 960) {
    $collapseStore.setCollapse(true);
  }

  //如果当前组件没有子路由，则直接跳转
  if (!$props.route.children) {
    $router.push($props.route.path);
    return;
  } /* 如果父级菜单已经展开，则添加子路由去生成子菜单 */ else if (show.value) {
    routes.push(...$props.route.children);
  } /* 否则移除子菜单 */ else {
    routes.length = 0;
  }
  $audioStore.play();
};

/* 递归判断当前路由如果等于某个父级菜单的子路由，则父级菜单自动展开，暂时不需要 */
//const sidebarActive = (routes: Route) => {
// if (routes.children && routes.children.length) {
//   routes.children.forEach((item) => {
//     if (item.path === $route.path) {
//       fn();
//       sidebarActive(item);
//     }
//   });
// }
//};

//sidebarActive($props.route);

/* 发送坐标 */
const handleCoord = (e: Event) => {
  const el = e.target as HTMLElement;
  const coord = el.getBoundingClientRect().top;

  if ($props.route.title === "系统管理") {
    if (show.value && $props.coord > coord) {
      $emit("coord", 0);
    } else {
      $emit("coord", $props.coord);
    }
  } else {
    $emit("coord", coord);
  }
};

const handleChildCoord = (v: number) => {
  $emit("coord", v);
};
</script>

<template>
  <div v-if="route" class="menu" :class="{ collapse: $collapseStore.collapse }">
    <div
      ref="menuItemRef"
      class="menu-item"
      :style="textStyle"
      :class="{
        active: route.path === $route.path,
      }"
      @click="handleCoord($event), fn()"
    >
      <!-- 图标 -->
      <i class="iconfont" :class="route.meta.icon" />

      <!-- 文字 -->
      <span class="name">{{ $t(route.title) }}</span>

      <!-- 下拉箭头 -->
      <img
        v-if="route.children"
        class="arrow"
        :class="{ 'arrow-active': show }"
        :src="getImgLink('arrow')"
        alt=""
      />
    </div>

    <!-- 二级菜单 -->
    <div v-if="route.children">
      <transition-group name="menu-list" appear>
        <SideItem
          v-for="(r, i) in routes"
          :key="r.path"
          :route="r"
          :style="{ transitionDelay: (routes.length - i) * 0.05 + 's' }"
          :coord="coord"
          @coord="handleChildCoord"
        />
      </transition-group>
    </div>
  </div>
</template>

<style scoped lang="less">
@import url("./index.less");
</style>
