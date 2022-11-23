import { onMounted, provide, ref } from "vue";

import type { Ref } from "vue";

export type InjectedContainerDimensions = {
  container: Ref<Element | null>;
  width: Ref<number>;
  height: Ref<number>;
  scrollTop: Ref<number>;
  scrollLeft: Ref<number>;
  editorContainerClasses: Ref<string[]>;
};

export default function (props: { isEditor: boolean }): InjectedContainerDimensions {
  const container = ref<Element | null>(null);
  const width = ref(0);
  const height = ref(0);
  const scrollTop = ref(0);
  const scrollLeft = ref(0);
  const editorContainerClasses = ref([props.isEditor ? "overflow-y-auto h-full" : ""]);

  onMounted(() => {
    const ro = new ResizeObserver(() => {
      height.value = container?.value?.clientHeight || 0;
      width.value = container?.value?.clientWidth || 0;

      editorContainerClasses.value = [
        props.isEditor ? "overflow-y-auto h-full" : "",
        width.value < 500 ? "prose-sm" : "",
        width.value >= 500 && width.value < 900 ? "prose-base" : "",
        width.value >= 900 ? "prose-lg" : "",
      ];
    });
    if (!!container.value) {
      ro.observe(container.value);
      const parentContainer = container.value.parentElement as Element;
      parentContainer.addEventListener("scroll", scrollEvent);
      scrollTop.value = parentContainer.scrollTop || 0;
      scrollLeft.value = parentContainer.scrollLeft || 0;
    }
  });

  const scrollEvent = () => {
    if (!!container.value) {
      const parentContainer = container.value.parentElement as Element;
      scrollTop.value = parentContainer.scrollTop || 0;
      scrollLeft.value = parentContainer.scrollLeft || 0;
    }
  };

  provide("containerDimensions", {
    height,
    width,
    scrollTop,
    scrollLeft,
  });

  return {
    container,
    width,
    height,
    scrollTop,
    scrollLeft,
    editorContainerClasses,
  };
}
