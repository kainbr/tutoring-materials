<template>
  <div class="flex flex-row gap-1">
    <Listbox>
      <ListboxButton>
        <span v-if="rule.operation === 'equal'">
          {{ equalLabel }}
        </span>
        <span v-if="rule.operation === 'unequal'">
          {{ unequalLabel }}
        </span>
      </ListboxButton>
      <ListboxOptions
        class="absolute mt-1 px-2 w-auto overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
      >
        <ListboxOption class="cursor-pointer select-none" @click="updateOperation('equal')">
          <span>{{ equalLabel }}</span>
        </ListboxOption>
        <ListboxOption class="cursor-pointer select-none" @click="updateOperation('unequal')">
          <span>{{ unequalLabel }}</span>
        </ListboxOption>
      </ListboxOptions>
    </Listbox>

    <Listbox>
      <ListboxButton>
        <span v-if="rule.value === true">
          {{ trueLabel }}
        </span>
        <span v-if="rule.value === false">
          {{ falseLabel }}
        </span>
      </ListboxButton>
      <ListboxOptions
        class="absolute mt-1 px-2 py-1 w-auto overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
      >
        <ListboxOption class="cursor-pointer select-none" @click="updateValue(true)">
          <span>{{ trueLabel }}</span>
        </ListboxOption>
        <ListboxOption class="cursor-pointer select-none" @click="updateValue(false)">
          <span>{{ falseLabel }}</span>
        </ListboxOption>
      </ListboxOptions>
    </Listbox>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/vue";

import type { PropType } from "vue";
import type {
  BooleanConditionOptions,
  BooleanEventRule,
  EventCondition,
} from "@/extensions/feedback/types";

export default defineComponent({
  name: "BooleanRuleEditor",

  components: {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
  },

  props: {
    rule: {
      type: Object as PropType<BooleanEventRule>,
      required: true,
    },
    condition: {
      type: Object as PropType<EventCondition>,
      required: true,
    },
  },

  emits: ["update:rule"],

  computed: {
    equalLabel() {
      return this.$t(
        (this.condition.options as BooleanConditionOptions)?.equalLabel ||
          "global.condition.boolean.label-equal"
      );
    },
    unequalLabel() {
      return this.$t(
        (this.condition.options as BooleanConditionOptions)?.unequalLabel ||
          "global.condition.boolean.label-unequal"
      );
    },
    trueLabel() {
      return this.$t(
        (this.condition.options as BooleanConditionOptions)?.trueLabel ||
          "global.condition.boolean.label-true"
      );
    },
    falseLabel() {
      return this.$t(
        (this.condition.options as BooleanConditionOptions)?.falseLabel ||
          "global.condition.boolean.label-false"
      );
    },
  },

  methods: {
    updateOperation(operation: string) {
      this.$emit("update:rule", {
        ...this.rule,
        operation,
      });
    },
    updateValue(value: boolean) {
      this.$emit("update:rule", {
        ...this.rule,
        value,
      });
    },
  },
});
</script>
