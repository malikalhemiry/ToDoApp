import {
  QueryClient,
  noop,
  onlineManager,
  queryFeature
} from "./chunk-P7T6ORBV.js";
import {
  isPlatformBrowser
} from "./chunk-73FL5ETQ.js";
import "./chunk-XKXH575N.js";
import {
  DestroyRef,
  ENVIRONMENT_INITIALIZER,
  InjectionToken,
  Injector,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  isDevMode
} from "./chunk-PE7S7WW7.js";
import "./chunk-RSS3ODKE.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-653SOEEV.js";

// node_modules/@tanstack/angular-query-experimental/devtools/with-devtools.mjs
var DEVTOOLS_PROVIDED = new InjectionToken("", {
  factory: () => ({
    isProvided: false
  })
});
var DEVTOOLS_OPTIONS_SIGNAL = new InjectionToken("");
var withDevtools = (withDevtoolsFn, options = {}) => queryFeature("Devtools", [
  {
    provide: DEVTOOLS_OPTIONS_SIGNAL,
    useFactory: (...deps) => computed(() => (withDevtoolsFn == null ? void 0 : withDevtoolsFn(...deps)) ?? {}),
    deps: options.deps || []
  },
  {
    // Do not use provideEnvironmentInitializer while Angular < v19 is supported
    provide: ENVIRONMENT_INITIALIZER,
    multi: true,
    useFactory: () => {
      const devtoolsProvided = inject(DEVTOOLS_PROVIDED);
      if (!isPlatformBrowser(inject(PLATFORM_ID)) || devtoolsProvided.isProvided)
        return noop;
      devtoolsProvided.isProvided = true;
      let injectorIsDestroyed = false;
      inject(DestroyRef).onDestroy(() => injectorIsDestroyed = true);
      return () => {
        const injectedClient = inject(QueryClient, {
          optional: true
        });
        const destroyRef = inject(DestroyRef);
        const devtoolsOptions = inject(DEVTOOLS_OPTIONS_SIGNAL);
        const injector = inject(Injector);
        let devtools = null;
        let el = null;
        const shouldLoadToolsSignal = computed(() => {
          const { loadDevtools } = devtoolsOptions();
          return typeof loadDevtools === "boolean" ? loadDevtools : isDevMode();
        });
        const getResolvedQueryClient = () => {
          const client = devtoolsOptions().client ?? injectedClient;
          if (!client) {
            throw new Error("No QueryClient found");
          }
          return client;
        };
        const destroyDevtools = () => {
          devtools == null ? void 0 : devtools.unmount();
          el == null ? void 0 : el.remove();
          devtools = null;
        };
        effect(
          () => {
            const shouldLoadTools = shouldLoadToolsSignal();
            const {
              client,
              position,
              errorTypes,
              buttonPosition,
              initialIsOpen,
              theme
            } = devtoolsOptions();
            if (!shouldLoadTools) {
              devtools && destroyDevtools();
              return;
            }
            if (devtools) {
              client && devtools.setClient(client);
              position && devtools.setPosition(position);
              errorTypes && devtools.setErrorTypes(errorTypes);
              buttonPosition && devtools.setButtonPosition(buttonPosition);
              typeof initialIsOpen === "boolean" && devtools.setInitialIsOpen(initialIsOpen);
              theme && devtools.setTheme(theme);
              return;
            }
            import("./dev-EGJBXEBE.js").then((queryDevtools) => {
              if (injectorIsDestroyed) return;
              devtools = new queryDevtools.TanstackQueryDevtools(__spreadProps(__spreadValues({}, devtoolsOptions()), {
                client: getResolvedQueryClient(),
                queryFlavor: "Angular Query",
                version: "5",
                onlineManager
              }));
              el = document.body.appendChild(document.createElement("div"));
              el.classList.add("tsqd-parent-container");
              devtools.mount(el);
              destroyRef.onDestroy(destroyDevtools);
            }).catch((error) => {
              console.error(
                "Install @tanstack/query-devtools or reinstall without --omit=optional.",
                error
              );
            });
          },
          { injector }
        );
      };
    }
  }
]);
export {
  withDevtools
};
//# sourceMappingURL=@tanstack_angular-query-experimental_devtools_production.js.map
