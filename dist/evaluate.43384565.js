const l = function(e, n) {
  switch (console.log("evaluate gaps", e, n), e.name) {
    case "all-match":
      return e.solution.every((a) => {
        var s, u;
        const r = (s = n.answer.find((t) => t.id === a.id)) == null ? void 0 : s.value;
        return r ? !!((u = a.options.find((t) => t.id === r)) != null && u.value) : !1;
      });
  }
  return !1;
}, o = function(e, n) {
  return {};
};
export {
  l as evaluate,
  o as getFacts
};
