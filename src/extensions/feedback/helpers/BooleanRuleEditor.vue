<template>
  <span class="px-1">
    <select
      :value="rule.operation"
      class="bg-transparent cursor-pointer appearance-none"
      @change="updateOperation"
    >
      <option value="equal">
        {{ equalLabel }}
      </option>
    </select>
  </span>

  <span>
    <select
      :value="rule.value"
      class="bg-transparent cursor-pointer appearance-none"
      @change="updateValue"
    >
      <option :value="true">
        {{ trueLabel }}
      </option>
      <option :value="false">
        {{ falseLabel }}
      </option>
    </select>
  </span>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import type { PropType } from "vue";
import type {
  BooleanConditionOptions,
  BooleanEventRule,
  EventCondition,
} from "@/extensions/feedback/types";

export default defineComponent({
  name: "BooleanRuleEditor",

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
    updateOperation($event: Event) {
      this.$emit("update:rule", {
        ...this.rule,
        operation: ($event.target as HTMLSelectElement).value,
      });
    },
    updateValue($event: Event) {
      this.$emit("update:rule", {
        ...this.rule,
        value: ($event.target as HTMLSelectElement).value,
      });
    },
  },
});
</script>
