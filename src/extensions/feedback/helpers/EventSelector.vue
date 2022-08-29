<template>
  <span class="text-sm py-0.5">
    {{ $t("editor.trigger.builder-if") }}
  </span>

  <Combobox
    :model-value="{
      value: {
        event: trigger.event,
        parent: trigger.parent,
      },
    }"
    class="px-2"
    @update:model-value="$emit('update:event', $event)"
  >
    <span>
      <!-- Visible button -->
      <ComboboxButton class="cursor-pointer">
        <span
          v-if="selectedEvent"
          class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
        >
          <LabelComponent :label="selectedEvent.label" />
        </span>
        <span
          v-else
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
        >
          {{ $t("editor.trigger.builder-select-event") }}
        </span>
      </ComboboxButton>

      <!-- Dropdown -->
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
            v-slot="{ active, selected }"
            :key="option.parent + '-' + option.name"
            :value="option"
            as="template"
          >
            <li
              :class="[
                active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
                'relative w-full cursor-default select-none py-2 pl-4 pr-4',
              ]"
            >
              <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                <LabelComponent :label="option.label" />
              </span>
            </li>
          </ComboboxOption>
        </ComboboxOptions>
      </transition>
    </span>
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
import type { EventTrigger } from "@/extensions/feedback/types";
import type { EventOption } from "@/extensions/feedback/types";
import LabelComponent from "@/helpers/LabelComponent.vue";

export default defineComponent({
  name: "EventSelector",

  components: {
    LabelComponent,
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxOptions,
    ComboboxOption,
  },

  props: {
    events: {
      type: Array as PropType<EventOption[]>,
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
    filteredEventOptions(): EventOption[] {
      return this.eventQuery === ""
        ? this.events
        : this.events.filter((option: EventOption) =>
            (!!option.label.message ? this.$t(option.label.message) : option.name)
              .toLowerCase()
              .replace(/\s+/g, "")
              .includes(this.eventQuery.toLowerCase().replace(/\s+/g, ""))
          );
    },
    selectedEvent(): EventOption | undefined {
      return this.events.find((option: EventOption) => option.name === this.trigger.event);
    },
  },

  /*
  watch: {
    events(newEvents) {
      const event = newEvents.find(
        (e: EventOption) => e.name === this.trigger.event && e.parent === this.trigger.parent
      );
      if (!event) {
        this.$emit("update:event", {
          name: null,
          parent: null,
        });
      }
    },
  },

   */
});
</script>
