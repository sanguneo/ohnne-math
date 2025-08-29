import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("pages/home.tsx"),
  route("math", "pages/math/layout.tsx", [
    index("pages/math/index.tsx"),
    route("coin-counting", "pages/math/coin-counting.tsx"),
    route("splitting-combining", "pages/math/splitting-combining.tsx"),
    route("time-learning", "pages/math/time-learning.tsx"),
    route("add-sub", "pages/math/add-sub.tsx"),
    route("shape-transform", "pages/math/shape-transform.tsx"),
    route("nonogram", "pages/math/nonogram.tsx"),
  ]),
  route("english", "pages/english/layout.tsx", [
    index("pages/english/index.tsx"),
    route("word-quiz", "pages/english/word-quiz.tsx"),
    route("learned-words", "pages/english/learned-words.tsx"),
  ]),
] satisfies RouteConfig;
