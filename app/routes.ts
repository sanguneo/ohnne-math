import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("pages/home.tsx"),
  route('coin-counting', "pages/coin-counting.tsx"),
  route('splitting-combining', "pages/splitting-combining.tsx"),
  route('time-learning', "pages/time-learning.tsx"),

] satisfies RouteConfig;
