<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import _debounce from "lodash/debounce";
import { onActivated, onDeactivated } from "vue";

import SavorToolbar from "./components/SavorToolbar/index.vue";
import { useWaterfallResponsive } from "./hooks/useWaterfallResponsive";

import { vBlurLoad } from "@/directives";
import { $bus, $tool } from "@/utils";
import { AtlasStore, AudioStore } from "@/store";
import { FilterSidebar, KBackTop } from "@/components/business";
import { LibWaterfall } from "@/components/common";

defineOptions({
  name: "Savor",
});

const $audioStore = AudioStore();
const { setScroll, loadMore, getAtlasList } = AtlasStore();
const { show_list, scroll, finish, loading } = storeToRefs(AtlasStore());

const waterfallRef = ref<InstanceType<typeof LibWaterfall>>();

const { count } = useWaterfallResponsive();

/** 当前悬浮的英雄id */
const hero_id = ref(0);
/** 是否显示返回顶部 */
const back_top = ref(false);

getAtlasList();

const debounceUpdateSizePosition = _debounce(() => {
  waterfallRef.value?.updateSizePosition();
}, 500);
const debounceWatchImgLoad = _debounce(() => {
  waterfallRef.value?.watchImgLoad();
}, 500);

/* 当前高亮的图片id */
const handleRelated = (e: Event, id: number, poster: string, blur: string) => {
  hero_id.value = id;
  new Image().src = blur;
  poster && new $tool.ScaleFLIPImage(e, poster, blur);
};

/* 加载更多 */
const onLoadMore = () => {
  loadMore();
  debounceWatchImgLoad();
};

const debounceScroll = _debounce((v: number) => {
  setScroll(v);
}, 250);
/* 滚动触发 */
const onScroll = (v: number) => {
  back_top.value = v > 250;
  debounceScroll(v);
};

/* 返回顶部 */
const onBackTop = () => {
  waterfallRef.value?.setPosition(0, true);
};

onActivated(() => {
  $audioStore.play("gz76");
  debounceUpdateSizePosition();
  waterfallRef.value?.setPosition(scroll.value);
  $bus.on("update-waterfall", debounceUpdateSizePosition);
  $bus.on("watch-waterfall", debounceWatchImgLoad);
});

onDeactivated(() => {
  $bus.off("update-waterfall");
  $bus.off("watch-waterfall");
});
</script>

<template>
  <div class="savor">
    <div class="savor-main">
      <SavorToolbar />
      <KBackTop :active="back_top" @back-top="onBackTop" />

      <LibWaterfall
        v-if="show_list.length"
        ref="waterfallRef"
        :count="count"
        :loading="loading"
        :finish="finish"
        :scroll-top="scroll"
        @load-more="onLoadMore"
        @scroll="onScroll"
      >
        <div
          v-for="item in show_list"
          :key="item.poster"
          class="atlas-card"
          :class="{
            active: hero_id === item.id,
          }"
          @mouseenter="handleRelated($event, item.id, '', item.posterBlur)"
          @mouseup="handleRelated($event, item.id, item.posterBig, item.posterBlur)"
          @touchstart="handleRelated($event, item.id, '', item.posterBlur)"
          @mouseleave="hero_id = 0"
        >
          <div v-if="item.type === 'HERO'" class="hero-name">
            {{ item.name }}
          </div>
          <div v-if="item.type === 'SKIN'" class="skin-name">
            {{ item.name }}
          </div>
          <img
            v-blurLoad="item.cover"
            class="blur"
            :src="item.coverBlur"
            alt=""
            @dragstart.prevent
          />
        </div>
      </LibWaterfall>
    </div>

    <!--右侧职业分类侧边栏-->
    <transition name="sidebar" appear>
      <FilterSidebar type="atlas" />
    </transition>
  </div>
</template>

<style scoped lang="less">
@import url("./index.less");
</style>
