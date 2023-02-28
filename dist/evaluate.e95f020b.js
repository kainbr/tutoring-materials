const u = function(e, t) {
  switch (e.name) {
    case "all-match":
      return e.solution.every((n) => {
        var a;
        return n.value === ((a = t.answer.find((r) => r.id === n.id)) == null ? void 0 : a.value);
      });
  }
  return !1;
}, s = function(e, t) {
  return {};
};
export {
  u as evaluate,
  s as getFacts
};
