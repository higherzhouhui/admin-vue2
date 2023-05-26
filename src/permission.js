import router from "./router";

import store from "./store";

import { Message } from "element-ui";

import NProgress from "nprogress"; // progress bar

import "nprogress/nprogress.css"; // progress bar style

import { getToken } from "@/utils/auth"; // get token from cookie

import { emptyS, nullS, listCompareBy } from "@/utils/tools";

import getPageTitle from "@/utils/get-page-title";

NProgress.configure({
  showSpinner: false,
}); // NProgress Configuration

const whiteList = ["/login", "/auth-redirect"]; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start();

  // set page title
  document.title = getPageTitle(to.meta.title);

  // determine whether the user has logged in
  const hasToken = getToken();

  if (hasToken) {
    if (to.path === "/login") {
      // if is logged in, redirect to the home page
      next({
        path: "/",
      });
      NProgress.done();
    } else {
      // 清除掉 dynamicRoutes
      const hasRoutes =
        store.getters.dynamicRoutes && store.getters.dynamicRoutes.length > 0;
      if (hasRoutes) {
        next();
      } else {
        try {
          const { routes } = await store.dispatch("user/getInfo");

          // 根节点
          var rootRoutes = [];
          for (let item of routes) {
            if (item.pid <= 0) {
              rootRoutes.push({
                id: item.id || 0,
                sort: item.sort || 0,
                path: emptyS(`${item.uri}`) ? null : `/${item.uri}`,
                component: () => import("@/layout"),
                redirect: emptyS(`${item.redirect}`)
                  ? "noRedirect"
                  : `${item.redirect}`,
                hidden: (item.hidden || 0) === 0 ? false : true,
                alwaysShow: true,
                meta: {
                  title: emptyS(`${item.name}`) ? null : `${item.name}`,
                  icon: emptyS(`${item.icon}`) ? null : `${item.icon}`,
                },
                children: [],
              });
            }
          }

          // 子节点
          for (let item of routes) {
            if (item.pid > 0) {
              // 在根节点表中查询是否存在对应的根节点
              for (let rt of rootRoutes) {
                if (item.pid === rt.id) {
                  // 注意：数据库里 "\"代表2个"\\"
                  rt.children.push({
                    pid: item.pid || 0,
                    sort: item.sort || 0,
                    path: emptyS(`${item.uri}`) ? null : `${item.uri}`,
                    name: emptyS(`${item.pageKey}`) ? null : `${item.pageKey}`,
                    // component: () => import(`@/views/${item.uri}`),
                    component: (resolve) =>
                      require([`@/views/${item.uri}`], resolve),
                    hidden: (item.hidden || 0) === 0 ? false : true,
                    meta: {
                      title: emptyS(`${item.name}`) ? null : `${item.name}`,
                      icon: emptyS(`${item.icon}`) ? null : `${item.icon}`,
                      noCache: (item.noCache || 0) === 0 ? false : true,
                    },
                  });
                  break;
                }
              }
            }
          }

          // 排序
          for (let route of rootRoutes) {
            // child 排序
            if (route.children && route.children.length > 0) {
              route.children = route.children.sort(listCompareBy("sort"));
            }
          }
          const sortRootRoutes = rootRoutes.sort(listCompareBy("sort"));

          // 获取动态路由
          const accessRoutes = await store.dispatch(
            "permission/getDynamicRoutes",
            sortRootRoutes
          );
          // dynamically add accessible routes
          router.options.routes = accessRoutes;
          router.addRoutes(accessRoutes);

          next({ ...to, replace: true });
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch("user/resetToken");
          Message.error(error || "Has Error");
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next();
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
