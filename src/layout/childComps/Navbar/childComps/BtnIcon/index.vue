<script setup lang="ts">
import { ref, onMounted } from "vue";

import { VersionStore } from "@/store";
import { SettingDialog, UpdateLog, Todo } from "@/components/business";

const $versionStore = VersionStore();

/** 是否显示设置弹窗 */
const show_setting = ref(false);
/** 是否显示日志弹窗 */
const show_update = ref(false);
/** 是否显示任务清单 */
const show_todo = ref(false);

onMounted(() => {
  setTimeout(() => {
    show_update.value = true;
  }, 3000);
});
</script>

<template>
  <div class="btn-icon">
    <!-- 按钮 -->
    <i class="iconfont wzry-setting" title="设置" @click="show_setting = true" />
    <i
      class="iconfont wzry-gengxinrizhi"
      title="更新日志"
      @click="$versionStore.setShowLog(true)"
    />
    <i class="iconfont wzry-todo" title="计划清单" @click="show_todo = true" />

    <!-- 设置弹窗 -->
    <teleport to="body">
      <SettingDialog v-if="show_setting" v-model="show_setting" />
    </teleport>

    <!-- 任务清单 -->
    <teleport to="body">
      <Todo v-if="show_todo" v-model="show_todo" />
    </teleport>

    <!-- 更新日志 -->
    <teleport to="body">
      <UpdateLog v-if="$versionStore.show_update && show_update" />
    </teleport>
  </div>
</template>

<style scoped lang="less">
@import url("./index.less");
</style>
