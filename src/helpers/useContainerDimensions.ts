import { onMounted, provide, ref } from "vue";

import type { Ref } from "vue";

export type InjectedContainerDimensions = {
  container: Ref<HTMLInputElement | null>;
  width: Ref<number>;
  height: Ref<number>;
  editorContainerClasses: Ref<string[]>;
};

export default function (props: { isEditor: boolean }): InjectedContainerDimensions {
  const container = ref<HTMLInputElement | null>(null);
  const width = ref(0);
  const height = ref(0);
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
    if (container.value) {
      ro.observe(container.value);
    }
  });

  provide("containerDimensions", {
    height,
    width,
  });

  return {
    container,
    width,
    height,
    editorContainerClasses,
  };
}
