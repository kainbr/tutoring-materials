<template>
  <Combobox
    :model-value="{ value: trigger.event }"
    class="px-2"
    @update:model-value="
      editor.commands.updateEventTrigger(trigger, {
        event: $event?.name,
      })
    "
  >
    <div>
      <ComboboxButton class="cursor-pointer">
        <span
          v-if="
            editor.storage.feedback.eventOptions.find((option) => option.name === trigger.event)
              ?.name
          "
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
        >
          {{
            $t(
              "global.event.type-" +
                (editor.storage.feedback.eventOptions.find(
                  (option) => option.name === trigger.event
                )?.name || "missing-label")
            )
          }}
        </span>
        <span
          v-else
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
        >
          {{ $t("editor.trigger.builder-select-event") }}
        </span>
      </ComboboxButton>

      <transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ComboboxOptions
          class="absolute z-50 max-h-60 w-fit overflow-auto rounded-md bg-white py-1 text-xs shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <div class="p-1">
            <ComboboxInput
              class="w-full w-52 border-none py-2 pl-3 text-xs leading-5 text-gray-900 focus:ring-0"
              @change="eventQuery = $event.target.value"
            />
          </div>

          <ComboboxOption
            v-for="option in filteredEventOptions"
            :key="option"
            v-slot="{ active, selected }"
            :value="option"
            as="template"
          >
            <li
              :class="[
                active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
                'relative w-full cursor-default select-none py-2 pl-4 pr-4',
              ]"
            >
              <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">{{
                $t("global.event.type-" + option.name)
              }}</span>
            </li>
          </ComboboxOption>
        </ComboboxOptions>
      </transition>
    </div>
  </Combobox>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/vue";
import type { PropType } from "vue";
import type { Editor } from "@tiptap/vue-3";
import type { EventTrigger } from "@/extensions/feedback/types";
import type { EventOption } from "@/extensions/feedback/types";

export default defineComponent({
  name: "EventSelector",

  components: {
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxOptions,
    ComboboxOption,
  },

  props: {
    editor: {
      type: Object as PropType<Editor>,
      required: true,
    },
    trigger: {
      type: Object as PropType<EventTrigger>,
      default: null,
    },
  },

  emits: ["update:event"],

  data() {
    return {
      eventQuery: "",
    };
  },

  computed: {
    filteredEventOptions() {
      return this.eventQuery === ""
        ? this.editor.storage.feedback.eventOptions
        : this.editor.storage.feedback.eventOptions.filter((option: EventOption) =>
            this.$t("global.event-type-" + option.name)
              .toLowerCase()
              .replace(/\s+/g, "")
              .includes(this.eventQuery.toLowerCase().replace(/\s+/g, ""))
          );
    },
  },
});
</script>
