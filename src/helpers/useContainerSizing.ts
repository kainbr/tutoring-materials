import { onMounted, provide, ref } from "vue";

export default function (props: { isEditor: boolean }) {
  // Content sizing
  const container = ref<HTMLInputElement | null>(null);
  const width = ref(0);
  const height = ref(0);
  const editorContainerClasses = ref([props.isEditor ? "overflow-y-auto h-full" : ""]);

  provide("height", height);
  provide("width", width);

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

  return {
    container,
    width,
    height,
    editorContainerClasses,
  };
}
