const o = function(t, s) {
  switch (t.name) {
    case "all-match":
      return JSON.stringify(
        t.solution.sort((r, e) => r.source > e.source ? 1 : e.source > r.source ? -1 : 0)
      ) === JSON.stringify(
        s.answer.sort((r, e) => r.source > e.source ? 1 : e.source > r.source ? -1 : 0)
      );
  }
  return !1;
}, u = function(t, s) {
  return {};
};
export {
  o as evaluate,
  u as getFacts
};
