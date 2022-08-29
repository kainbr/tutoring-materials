/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { EventFacts, EventRule } from "@/extensions/feedback/types";

export function checkRules(rule: EventRule, facts: EventFacts): boolean {
  if (!facts.hasOwnProperty(rule.fact)) {
    return false;
  }

  const factValue = facts[rule.fact];
  const ruleValue = rule.value;

  switch (rule.operation) {
    case "smaller":
      // @ts-ignore
      return factValue < ruleValue;
    case "smaller-equal":
      // @ts-ignore
      return factValue <= ruleValue;
    case "equal":
      return factValue == ruleValue;
    case "unequal":
      return factValue != ruleValue;
    case "greater-equal":
      // @ts-ignore
      return factValue >= ruleValue;
    case "greater":
      // @ts-ignore
      return factValue > ruleValue;
    default:
      return false;
  }
}
