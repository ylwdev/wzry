/**
 * v-typewriterMultiple
 * 多行打字机
 * 注：只能使用v-html填充内容，否则会使用上一次的文本
 */
import type { Directive, DirectiveBinding } from "vue";

interface ElType extends HTMLElement {
  timer1: NodeJS.Timeout;
  timer2: NodeJS.Timeout;
  /** 开始输出 */
  startOutput: (el: ElType, v: DirectiveBinding<Params>) => void;
}

interface Params {
  /** 打字结束后触发 */
  callback?: () => void;
  /** 频率 ms/字 */
  speed?: number;
  /** 延迟多少毫秒触发 */
  delay?: number;
}

const vTypewriterMultiple: Directive<ElType, Params> = {
  mounted(el, binding) {
    el.startOutput = (el, binding) => {
      const { callback, speed = 100, delay } = binding.value || {};
      const say = el.innerHTML;
      el.innerHTML = "";
      clearTimeout(el.timer2);
      el.timer2 = setTimeout(
        () => {
          /** 用于累加遍历字符串 */
          let num = 0,
            /** 用于输出在屏幕上 */
            text = "";
          fn();
          function fn() {
            clearInterval(el.timer1);
            el.timer1 = setInterval(() => {
              if (num >= say.length) {
                clearInterval(el.timer1);
                callback && callback();
                return;
              }
              text += say[num];
              el.innerHTML = text;
              num++;
            }, speed);
          }
        },
        delay === undefined ? 750 : 0,
      );
    };
    el.startOutput(el, binding);
  },
};

export { vTypewriterMultiple };
