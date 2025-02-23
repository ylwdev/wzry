/**
 * v-down-drag
 * 按下拖拽
 */

import { Directive } from "vue";

interface ElType extends HTMLElement {
  /** 鼠标按下事件 */
  _mouseDown: (e: MouseEvent | TouchEvent) => void;
  /** 鼠标移动事件 */
  _mouseMove: (e: MouseEvent | TouchEvent) => void;
  /** 鼠标抬起事件 */
  _mouseUp: (e: MouseEvent | TouchEvent) => void;
}

const vDownDrag: Directive<ElType> = {
  mounted(el) {
    const dragData = {
      isDragging: false,
      startX: 0,
      startY: 0,
      left: 0,
      top: 0,
    };

    const time = el.style.transitionDuration;

    const handleMouseDown = (event: MouseEvent | TouchEvent) => {
      el.style.transitionDuration = "0s";
      dragData.isDragging = true;

      if (event instanceof MouseEvent) {
        dragData.startX = event.pageX;
        dragData.startY = event.pageY;
      } else if (event instanceof TouchEvent) {
        dragData.startX = event.touches[0].pageX;
        dragData.startY = event.touches[0].pageY;
      }

      dragData.left = el.offsetLeft;
      dragData.top = el.offsetTop;
    };

    const handleMouseMove = (event: MouseEvent | TouchEvent) => {
      if (!dragData.isDragging) return;

      let offsetX: number;
      let offsetY: number;

      if (event instanceof MouseEvent) {
        offsetX = event.pageX - dragData.startX;
        offsetY = event.pageY - dragData.startY;
      } else if (event instanceof TouchEvent) {
        offsetX = event.touches[0].pageX - dragData.startX;
        offsetY = event.touches[0].pageY - dragData.startY;
      } else {
        offsetX = 0;
        offsetY = 0;
      }

      const left = dragData.left + offsetX;
      const top = dragData.top + offsetY;

      // 获取屏幕尺寸
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      // 计算元素最大可移动范围
      const maxLeft = screenWidth - el.offsetWidth;
      const maxTop = screenHeight - el.offsetHeight;

      // 限制元素不超出屏幕
      const newLeft = Math.max(0, Math.min(maxLeft, left));
      const newTop = Math.max(0, Math.min(maxTop, top));

      // 更新元素位置
      el.style.left = `${newLeft}px`;
      el.style.top = `${newTop}px`;
    };

    const handleMouseUp = () => {
      el.style.transitionDuration = time;
      dragData.isDragging = false;
    };

    // 将事件挂载到DOM上
    el._mouseDown = handleMouseDown;
    el._mouseMove = handleMouseMove;
    el._mouseUp = handleMouseUp;

    // 监听鼠标事件
    window.addEventListener("mousedown", el._mouseDown);
    window.addEventListener("mousemove", el._mouseMove);
    window.addEventListener("mouseup", el._mouseUp);

    // 监听触摸事件
    window.addEventListener("touchstart", el._mouseDown);
    window.addEventListener("touchmove", el._mouseMove);
    window.addEventListener("touchend", el._mouseUp);
  },
  unmounted(el) {
    // 移除鼠标事件
    window.removeEventListener("mousedown", el._mouseDown);
    window.removeEventListener("mousemove", el._mouseMove);
    window.removeEventListener("mouseup", el._mouseUp);

    // 移除触摸事件
    window.removeEventListener("touchstart", el._mouseDown);
    window.removeEventListener("touchmove", el._mouseMove);
    window.removeEventListener("touchend", el._mouseUp);
  },
};

export { vDownDrag };
