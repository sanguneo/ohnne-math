import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("pages/home.tsx"),
  route('coin-counting', "pages/coin-counting.tsx"),
  route('splitting-combining', "pages/splitting-combining.tsx"),
  route('time-learning', "pages/time-learning.tsx"),
  route('add-sub', "pages/add-sub.tsx"),
  route('shape-transform', "pages/shape-transform.tsx"),
  route('nonogram', "pages/nonogram.tsx"),

] satisfies RouteConfig;
