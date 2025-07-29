import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("pages/home.tsx"),
  route('coin-counting', "pages/coin-counting.tsx")
] satisfies RouteConfig;
