<script lang="ts">
  export let start = 0;
  export let end = 1;
  let leftHandle: HTMLDivElement;
  let sliderBody: HTMLDivElement;
  let slider: HTMLDivElement;

  function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }

  function draggable(node: HTMLElement) {
    let x: number;
    let y: number;
    function handleMousedown(rawEvent: MouseEvent | TouchEvent) {
      let event =
        rawEvent.type === "touchstart"
          ? (rawEvent as TouchEvent).touches[0]
          : (rawEvent as MouseEvent);

      x = event.clientX;
      y = event.clientY;
      node.dispatchEvent(
        new CustomEvent("dragstart", {
          detail: { x, y },
        }),
      );
      window.addEventListener("mousemove", handleMousemove);
      window.addEventListener("mouseup", handleMouseup);
      window.addEventListener("touchmove", handleMousemove);
      window.addEventListener("touchend", handleMouseup);
    }
    function handleMousemove(rawEvent: MouseEvent | TouchEvent) {
      let event =
        rawEvent.type === "touchmove"
          ? (rawEvent as TouchEvent).changedTouches[0]
          : (rawEvent as MouseEvent);

      const dx = event.clientX - x;
      const dy = event.clientY - y;
      x = event.clientX;
      y = event.clientY;
      node.dispatchEvent(
        new CustomEvent("dragmove", {
          detail: { x, y, dx, dy },
        }),
      );
    }
    function handleMouseup(rawEvent: MouseEvent | TouchEvent) {
      let event =
        rawEvent.type === "touchend"
          ? (rawEvent as TouchEvent).touches[0]
          : (rawEvent as MouseEvent);

      x = event.clientX;
      y = event.clientY;
      node.dispatchEvent(
        new CustomEvent("dragend", {
          detail: { x, y },
        }),
      );
      window.removeEventListener("mousemove", handleMousemove);
      window.removeEventListener("mouseup", handleMouseup);
      window.removeEventListener("touchmove", handleMousemove);
      window.removeEventListener("touchend", handleMouseup);
    }
    node.addEventListener("mousedown", handleMousedown);
    node.addEventListener("touchstart", handleMousedown);
    return {
      destroy() {
        node.removeEventListener("mousedown", handleMousedown);
        node.removeEventListener("touchstart", handleMousedown);
      },
    };
  }
  function setHandlePosition(which: string) {
    return function (evt: Event & { detail: { x: number } }) {
      const { left, right } = slider.getBoundingClientRect();
      const parentWidth = right - left;
      const p = Math.min(Math.max((evt.detail.x - left) / parentWidth, 0), 1);
      if (which === "start") {
        start = p;
        end = Math.max(end, p);
      } else {
        start = Math.min(p, start);
        end = p;
      }
    };
  }
  function setHandlesFromBody(evt: DragEvent & { detail: { dx: number } }) {
    const { width } = sliderBody.getBoundingClientRect();
    const { left, right } = slider.getBoundingClientRect();
    const parentWidth = right - left;
    const leftHandleLeft = leftHandle.getBoundingClientRect().left;
    const pxStart = clamp(
      leftHandleLeft + evt.detail.dx - left,
      0,
      parentWidth - width,
    );
    const pxEnd = clamp(pxStart + width, width, parentWidth);
    const pStart = pxStart / parentWidth;
    const pEnd = pxEnd / parentWidth;
    start = pStart;
    end = pEnd;
  }
</script>

<div class="double-range-container">
  <div class="slider" bind:this={slider}>
    <div
      class="sliderBody"
      bind:this={sliderBody}
      use:draggable
      on:dragmove|preventDefault|stopPropagation={setHandlesFromBody}
      style="
				left: {100 * start}%;
				right: {100 * (1 - end)}%;
			"
    ></div>
    <div
      class="handle"
      bind:this={leftHandle}
      data-which="start"
      use:draggable
      on:dragmove|preventDefault|stopPropagation={setHandlePosition("start")}
      style="
				left: {100 * start}%
			"
    ></div>
    <div
      class="handle"
      data-which="end"
      use:draggable
      on:dragmove|preventDefault|stopPropagation={setHandlePosition("end")}
      style="
				left: {100 * end}%
			"
    ></div>
  </div>
</div>

<style>
  .double-range-container {
    width: 100%;
    height: 20px;
    user-select: none;
    box-sizing: border-box;
    white-space: nowrap;
  }
  .slider {
    position: relative;
    width: 100%;
    height: 6px;
    top: 50%;
    transform: translate(0, -50%);
    background-color: #e2e2e2;
    box-shadow:
      inset 0 7px 10px -5px #000,
      inset 0 -1px 0px 0px #9c9c9c;
    border-radius: 1px;
  }
  .handle {
    position: absolute;
    top: 50%;
    width: 0;
    height: 0;
  }
  .handle:after {
    content: " ";
    box-sizing: border-box;
    position: absolute;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    background-color: #fdfdfd;
    border: 1px solid #7b7b7b;
    transform: translate(-50%, -50%);
  }
  /* .handle[data-which="end"]:after{
		transform: translate(-100%, -50%);
	} */
  .handle:active:after {
    background-color: #ddd;
    z-index: 9;
  }
  .sliderBody {
    top: 0;
    position: absolute;
    background-color: rgb(var(--color-primary-500));
    bottom: 0;
  }
</style>
