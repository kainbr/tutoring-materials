<template>
  <!-- Global notification live region, render this permanently at the end of the document -->
  <div
    aria-live="assertive"
    class="inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start"
  >
    <div class="w-full flex flex-col items-center space-y-4 sm:items-end">
      <notification-component
        v-for="notificationScaffold in notificationScaffolds"
        :key="notificationScaffold"
        :scaffold="notificationScaffold"
        :editor="editor"
      ></notification-component>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NotificationComponent from "@/scaffolds/notification/NotificationComponent.vue";
import type { PropType } from "vue";
import type { Editor } from "@tiptap/vue-3";
import type { Scaffold } from "@/types";

export default defineComponent({
  name: "NotificationContainerComponent",

  components: { NotificationComponent },

  props: {
    editor: {
      type: Object as PropType<Editor>,
      required: true,
    },
  },

  data() {
    return {
      stateStore: this.editor.storage.document.stateStore(),
    };
  },

  computed: {
    notificationScaffolds() {
      return this.stateStore.scaffolds.filter((s: Scaffold) => s.type === "scaffold-notification");
    },
  },
});
</script>
