const u = function(n, a) {
  switch (n.name) {
    case "all-match":
      return n.solution.every((t) => {
        var e;
        return t.value === ((e = a.answer.find((r) => r.id === t.id)) == null ? void 0 : e.value);
      });
  }
  return !1;
}, c = function(n, a) {
  return {
    ...a.answer.reduce((t, e) => ({ ...t, [e.id + "-selected"]: e.value }), {})
  };
};
export {
  u as evaluate,
  c as getFacts
};
