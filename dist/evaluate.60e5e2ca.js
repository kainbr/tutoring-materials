const r = function(t, n) {
  switch (t.name) {
    case "click-one-correct":
      const c = t.solution.filter((e) => e.value).map((e) => e.id);
      for (const e of n.answer.clickedRegions)
        if (c.includes(e))
          return !0;
      return !1;
  }
  return !1;
}, o = function(t, n) {
  return {};
};
export {
  r as evaluate,
  o as getFacts
};
