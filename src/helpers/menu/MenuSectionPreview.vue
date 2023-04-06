<template>
  <div class="flex w-full h-full items-center justify-end mb-2 px-2 gap-x-2">
    <button
      class="hover:bg-black hover:fill-white hover:text-white focus:outline-none
                font-medium rounded-lg text-sm p-1 pr-2 text-center inline-flex items-center
                disabled:opacity-10"
      type="button" @click="$emit('reset:state')"
    >
      <IconRefresh class="mx-1 h-4 w-4 text-gray-400" />
      {{ $t("preview.button-reset-task") }}
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import IconRefresh from "@/helpers/icons/IconRefresh.vue";

export default defineComponent({
  name: "MenuSectionTypography",

  emits: ["reset:state", "update:is-preview"],

  components: {
    IconRefresh
  }

});
</script>
