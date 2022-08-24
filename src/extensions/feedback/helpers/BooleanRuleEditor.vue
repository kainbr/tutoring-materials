<template>
  <span class="px-1">
    <select
      :value="rule.operation"
      class="bg-transparent cursor-pointer appearance-none"
      @change="$emit('update:rule', { ...rule, operation: $event.target.value })"
    >
      <option value="equal">
        {{
          !!condition.options.equalLabel
            ? $t(condition.options.equalLabel)
            : $t("global.condition.boolean.label-equal")
        }}
      </option>
    </select>
  </span>

  <span>
    <select
      :value="rule.value"
      class="bg-transparent cursor-pointer appearance-none"
      @change="$emit('update:rule', { ...rule, value: $event.target.value })"
    >
      <option :value="true">
        {{
          !!condition.options.trueLabel
            ? $t(condition.options.trueLabel)
            : $t("global.condition.boolean.label-true")
        }}
      </option>
      <option :value="false">
        {{
          !!condition.options.falseLabel
            ? $t(condition.options.falseLabel)
            : $t("global.condition.boolean.label-false")
        }}
      </option>
    </select>
  </span>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import type { PropType } from "vue";
import type { BooleanEventRule, EventCondition } from "@/extensions/feedback/types";

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
});
</script>
