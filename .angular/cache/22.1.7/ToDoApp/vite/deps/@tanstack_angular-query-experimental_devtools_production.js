import { et as isDevMode } from "./core-z4K6ZEEv.js";
import { A as ENVIRONMENT_INITIALIZER, D as DestroyRef, Sr as inject, U as InjectionToken, W as Injector, bn as effect, c as computed, rt as PLATFORM_ID } from "./_resource-chunk-DEorg4q9.js";
import { u as isPlatformBrowser } from "./common-B_bdXkSU.js";
import { A as noop, a as QueryClient, g as onlineManager, i as queryFeature } from "./providers-D9LPZtY1.js";
//#region node_modules/@tanstack/angular-query-experimental/devtools/with-devtools.mjs
var DEVTOOLS_PROVIDED = new InjectionToken("", { factory: () => ({ isProvided: false }) });
var DEVTOOLS_OPTIONS_SIGNAL = new InjectionToken("");
var withDevtools = (withDevtoolsFn, options = {}) => queryFeature("Devtools", [{
	provide: DEVTOOLS_OPTIONS_SIGNAL,
	useFactory: (...deps) => computed(() => (withDevtoolsFn == null ? void 0 : withDevtoolsFn(...deps)) ?? {}),
	deps: options.deps || []
}, {
	provide: ENVIRONMENT_INITIALIZER,
	multi: true,
	useFactory: () => {
		const devtoolsProvided = inject(DEVTOOLS_PROVIDED);
		if (!isPlatformBrowser(inject(PLATFORM_ID)) || devtoolsProvided.isProvided) return noop;
		devtoolsProvided.isProvided = true;
		let injectorIsDestroyed = false;
		inject(DestroyRef).onDestroy(() => injectorIsDestroyed = true);
		return () => {
			const injectedClient = inject(QueryClient, { optional: true });
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
				if (!client) throw new Error("No QueryClient found");
				return client;
			};
			const destroyDevtools = () => {
				devtools?.unmount();
				el?.remove();
				devtools = null;
			};
			effect(() => {
				const shouldLoadTools = shouldLoadToolsSignal();
				const { client, position, errorTypes, buttonPosition, initialIsOpen, theme } = devtoolsOptions();
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
				import("./dev-C2dJLwcu.js").then((queryDevtools) => {
					if (injectorIsDestroyed) return;
					devtools = new queryDevtools.TanstackQueryDevtools({
						...devtoolsOptions(),
						client: getResolvedQueryClient(),
						queryFlavor: "Angular Query",
						version: "5",
						onlineManager
					});
					el = document.body.appendChild(document.createElement("div"));
					el.classList.add("tsqd-parent-container");
					devtools.mount(el);
					destroyRef.onDestroy(destroyDevtools);
				}).catch((error) => {
					console.error("Install @tanstack/query-devtools or reinstall without --omit=optional.", error);
				});
			}, { injector });
		};
	}
}]);
//#endregion
export { withDevtools };
