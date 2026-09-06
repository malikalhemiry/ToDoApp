import {
  CancelledError,
  InfiniteQueryObserver,
  Mutation,
  MutationCache,
  MutationObserver,
  QueriesObserver,
  Query,
  QueryCache,
  QueryClient,
  QueryObserver,
  dataTagErrorSymbol,
  dataTagSymbol,
  defaultScheduler,
  defaultShouldDehydrateMutation,
  defaultShouldDehydrateQuery,
  dehydrate,
  environmentManager,
  focusManager,
  hashKey,
  hydrate,
  isCancelledError,
  isServer,
  keepPreviousData,
  matchMutation,
  matchQuery,
  noop,
  notifyManager,
  onlineManager,
  partialMatchKey,
  provideAngularQuery,
  provideQueryClient,
  provideTanStackQuery,
  queryFeature,
  replaceEqualDeep,
  shouldThrowError,
  skipToken,
  streamedQuery,
  timeoutManager,
  unsetMarker
} from "./chunk-P7T6ORBV.js";
import {
  DestroyRef,
  InjectionToken,
  Injector,
  NgZone,
  VERSION,
  assertInInjectionContext,
  computed,
  core_exports,
  effect,
  inject,
  runInInjectionContext,
  signal,
  untracked
} from "./chunk-PE7S7WW7.js";
import "./chunk-RSS3ODKE.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-653SOEEV.js";

// node_modules/@tanstack/angular-query-experimental/query-options.mjs
function queryOptions(options) {
  return options;
}

// node_modules/@tanstack/angular-query-experimental/mutation-options.mjs
function mutationOptions(options) {
  return options;
}

// node_modules/@tanstack/angular-query-experimental/infinite-query-options.mjs
function infiniteQueryOptions(options) {
  return options;
}

// node_modules/@tanstack/angular-query-experimental/signal-proxy.mjs
function signalProxy(inputSignal) {
  const internalState = {};
  return new Proxy(internalState, {
    get(target, prop) {
      const computedField = target[prop];
      if (computedField) return computedField;
      const targetField = untracked(inputSignal)[prop];
      if (typeof targetField === "function") return targetField;
      return target[prop] = computed(() => inputSignal()[prop]);
    },
    has(_, prop) {
      return !!untracked(inputSignal)[prop];
    },
    ownKeys() {
      return Reflect.ownKeys(untracked(inputSignal));
    },
    getOwnPropertyDescriptor() {
      return {
        enumerable: true,
        configurable: true
      };
    }
  });
}

// node_modules/@tanstack/angular-query-experimental/inject-is-restoring.mjs
var IS_RESTORING = new InjectionToken("", {
  // Default value when not provided
  factory: () => signal(false).asReadonly()
});
function injectIsRestoring(options) {
  !(options == null ? void 0 : options.injector) && assertInInjectionContext(injectIsRestoring);
  const injector = (options == null ? void 0 : options.injector) ?? inject(Injector);
  return injector.get(IS_RESTORING);
}
function provideIsRestoring(isRestoring) {
  return {
    provide: IS_RESTORING,
    useValue: isRestoring
  };
}

// node_modules/@tanstack/angular-query-experimental/pending-tasks-compat.mjs
var PENDING_TASKS = new InjectionToken(
  "PENDING_TASKS",
  {
    factory: () => {
      const token = Reflect.get(core_exports, "PendingTasks");
      const svc = token ? inject(token, { optional: true }) : null;
      return {
        add: svc ? () => svc.add() : () => noop
      };
    }
  }
);

// node_modules/@tanstack/angular-query-experimental/create-base-query.mjs
function createBaseQuery(optionsFn, Observer) {
  const ngZone = inject(NgZone);
  const pendingTasks = inject(PENDING_TASKS);
  const queryClient = inject(QueryClient);
  const isRestoring = injectIsRestoring();
  const defaultedOptionsSignal = computed(() => {
    const defaultedOptions = queryClient.defaultQueryOptions(optionsFn());
    defaultedOptions._optimisticResults = isRestoring() ? "isRestoring" : "optimistic";
    return defaultedOptions;
  });
  const observerSignal = (() => {
    let instance = null;
    return computed(() => {
      return instance || (instance = new Observer(queryClient, defaultedOptionsSignal()));
    });
  })();
  const optimisticResultSignal = computed(
    () => observerSignal().getOptimisticResult(defaultedOptionsSignal())
  );
  const resultFromSubscriberSignal = signal(null);
  effect(
    (onCleanup) => {
      const observer = observerSignal();
      const defaultedOptions = defaultedOptionsSignal();
      untracked(() => {
        observer.setOptions(defaultedOptions);
      });
      onCleanup(() => {
        ngZone.run(() => resultFromSubscriberSignal.set(null));
      });
    },
    {
      // Set allowSignalWrites to support Angular < v19
      // Set to undefined to avoid warning on newer versions
      allowSignalWrites: VERSION.major < "19" || void 0
    }
  );
  effect((onCleanup) => {
    const observer = observerSignal();
    let pendingTaskRef = null;
    const unsubscribe = isRestoring() ? () => void 0 : untracked(
      () => ngZone.runOutsideAngular(() => {
        return observer.subscribe(
          notifyManager.batchCalls((state) => {
            ngZone.run(() => {
              if (state.fetchStatus === "fetching" && !pendingTaskRef) {
                pendingTaskRef = pendingTasks.add();
              }
              if (state.fetchStatus === "idle" && pendingTaskRef) {
                pendingTaskRef();
                pendingTaskRef = null;
              }
              if (state.isError && !state.isFetching && shouldThrowError(observer.options.throwOnError, [
                state.error,
                observer.getCurrentQuery()
              ])) {
                ngZone.onError.emit(state.error);
                throw state.error;
              }
              resultFromSubscriberSignal.set(state);
            });
          })
        );
      })
    );
    onCleanup(() => {
      if (pendingTaskRef) {
        pendingTaskRef();
        pendingTaskRef = null;
      }
      unsubscribe();
    });
  });
  return signalProxy(
    computed(() => {
      const subscriberResult = resultFromSubscriberSignal();
      const optimisticResult = optimisticResultSignal();
      const result = subscriberResult ?? optimisticResult;
      const observer = observerSignal();
      const originalRefetch = result.refetch;
      return __spreadProps(__spreadValues({}, result), {
        refetch: ((...args) => {
          observer.setOptions(defaultedOptionsSignal());
          return originalRefetch(...args);
        })
      });
    })
  );
}

// node_modules/@tanstack/angular-query-experimental/inject-infinite-query.mjs
function injectInfiniteQuery(injectInfiniteQueryFn, options) {
  !(options == null ? void 0 : options.injector) && assertInInjectionContext(injectInfiniteQuery);
  const injector = (options == null ? void 0 : options.injector) ?? inject(Injector);
  return runInInjectionContext(
    injector,
    () => createBaseQuery(
      injectInfiniteQueryFn,
      InfiniteQueryObserver
    )
  );
}

// node_modules/@tanstack/angular-query-experimental/inject-is-fetching.mjs
function injectIsFetching(filters, options) {
  !(options == null ? void 0 : options.injector) && assertInInjectionContext(injectIsFetching);
  const injector = (options == null ? void 0 : options.injector) ?? inject(Injector);
  const destroyRef = injector.get(DestroyRef);
  const ngZone = injector.get(NgZone);
  const queryClient = injector.get(QueryClient);
  const cache = queryClient.getQueryCache();
  let isFetching = queryClient.isFetching(filters);
  const result = signal(isFetching);
  const unsubscribe = ngZone.runOutsideAngular(
    () => cache.subscribe(
      notifyManager.batchCalls(() => {
        const newIsFetching = queryClient.isFetching(filters);
        if (isFetching !== newIsFetching) {
          isFetching = newIsFetching;
          ngZone.run(() => {
            result.set(isFetching);
          });
        }
      })
    )
  );
  destroyRef.onDestroy(unsubscribe);
  return result;
}

// node_modules/@tanstack/angular-query-experimental/inject-is-mutating.mjs
function injectIsMutating(filters, options) {
  !(options == null ? void 0 : options.injector) && assertInInjectionContext(injectIsMutating);
  const injector = (options == null ? void 0 : options.injector) ?? inject(Injector);
  const destroyRef = injector.get(DestroyRef);
  const ngZone = injector.get(NgZone);
  const queryClient = injector.get(QueryClient);
  const cache = queryClient.getMutationCache();
  let isMutating = queryClient.isMutating(filters);
  const result = signal(isMutating);
  const unsubscribe = ngZone.runOutsideAngular(
    () => cache.subscribe(
      notifyManager.batchCalls(() => {
        const newIsMutating = queryClient.isMutating(filters);
        if (isMutating !== newIsMutating) {
          isMutating = newIsMutating;
          ngZone.run(() => {
            result.set(isMutating);
          });
        }
      })
    )
  );
  destroyRef.onDestroy(unsubscribe);
  return result.asReadonly();
}

// node_modules/@tanstack/angular-query-experimental/inject-mutation.mjs
function injectMutation(injectMutationFn, options) {
  !(options == null ? void 0 : options.injector) && assertInInjectionContext(injectMutation);
  const injector = (options == null ? void 0 : options.injector) ?? inject(Injector);
  const ngZone = injector.get(NgZone);
  const pendingTasks = injector.get(PENDING_TASKS);
  const queryClient = injector.get(QueryClient);
  const optionsSignal = computed(injectMutationFn);
  const observerSignal = (() => {
    let instance = null;
    return computed(() => {
      return instance || (instance = new MutationObserver(queryClient, optionsSignal()));
    });
  })();
  const mutateFnSignal = computed(() => {
    const observer = observerSignal();
    return (variables, mutateOptions) => {
      observer.mutate(variables, mutateOptions).catch(noop);
    };
  });
  const resultFromInitialOptionsSignal = computed(() => {
    const observer = observerSignal();
    return observer.getCurrentResult();
  });
  const resultFromSubscriberSignal = signal(null);
  effect(
    () => {
      const observer = observerSignal();
      const observerOptions = optionsSignal();
      untracked(() => {
        observer.setOptions(observerOptions);
      });
    },
    {
      injector
    }
  );
  effect(
    (onCleanup) => {
      const observer = observerSignal();
      let pendingTaskRef = null;
      untracked(() => {
        const unsubscribe = ngZone.runOutsideAngular(
          () => observer.subscribe(
            notifyManager.batchCalls((state) => {
              ngZone.run(() => {
                if (state.isPending && !pendingTaskRef) {
                  pendingTaskRef = pendingTasks.add();
                }
                if (!state.isPending && pendingTaskRef) {
                  pendingTaskRef();
                  pendingTaskRef = null;
                }
                if (state.isError && shouldThrowError(observer.options.throwOnError, [state.error])) {
                  ngZone.onError.emit(state.error);
                  throw state.error;
                }
                resultFromSubscriberSignal.set(state);
              });
            })
          )
        );
        onCleanup(() => {
          if (pendingTaskRef) {
            pendingTaskRef();
            pendingTaskRef = null;
          }
          unsubscribe();
        });
      });
    },
    {
      injector
    }
  );
  const resultSignal = computed(() => {
    const resultFromSubscriber = resultFromSubscriberSignal();
    const resultFromInitialOptions = resultFromInitialOptionsSignal();
    const result = resultFromSubscriber ?? resultFromInitialOptions;
    return __spreadProps(__spreadValues({}, result), {
      mutate: mutateFnSignal(),
      mutateAsync: result.mutate
    });
  });
  return signalProxy(resultSignal);
}

// node_modules/@tanstack/angular-query-experimental/inject-mutation-state.mjs
function getResult(mutationCache, options) {
  return mutationCache.findAll(options.filters).map(
    (mutation) => options.select ? options.select(mutation) : mutation.state
  );
}
function injectMutationState(injectMutationStateFn = () => ({}), options) {
  !(options == null ? void 0 : options.injector) && assertInInjectionContext(injectMutationState);
  const injector = (options == null ? void 0 : options.injector) ?? inject(Injector);
  const destroyRef = injector.get(DestroyRef);
  const ngZone = injector.get(NgZone);
  const queryClient = injector.get(QueryClient);
  const mutationCache = queryClient.getMutationCache();
  const resultFromOptionsSignal = computed(() => {
    return [
      getResult(mutationCache, injectMutationStateFn()),
      performance.now()
    ];
  });
  const resultFromSubscriberSignal = signal(
    null
  );
  const effectiveResultSignal = computed(() => {
    const optionsResult = resultFromOptionsSignal();
    const subscriberResult = resultFromSubscriberSignal();
    return subscriberResult && subscriberResult[1] > optionsResult[1] ? subscriberResult[0] : optionsResult[0];
  });
  const unsubscribe = ngZone.runOutsideAngular(
    () => mutationCache.subscribe(
      notifyManager.batchCalls(() => {
        const [lastResult] = effectiveResultSignal();
        const nextResult = replaceEqualDeep(
          lastResult,
          getResult(mutationCache, injectMutationStateFn())
        );
        if (lastResult !== nextResult) {
          ngZone.run(() => {
            resultFromSubscriberSignal.set([nextResult, performance.now()]);
          });
        }
      })
    )
  );
  destroyRef.onDestroy(unsubscribe);
  return effectiveResultSignal;
}

// node_modules/@tanstack/angular-query-experimental/inject-query.mjs
function injectQuery(injectQueryFn, options) {
  !(options == null ? void 0 : options.injector) && assertInInjectionContext(injectQuery);
  return runInInjectionContext(
    (options == null ? void 0 : options.injector) ?? inject(Injector),
    () => createBaseQuery(injectQueryFn, QueryObserver)
  );
}

// node_modules/@tanstack/angular-query-experimental/inject-query-client.mjs
function injectQueryClient(injectOptions = {}) {
  return (injectOptions.injector ?? inject(Injector)).get(QueryClient);
}
export {
  CancelledError,
  InfiniteQueryObserver,
  Mutation,
  MutationCache,
  MutationObserver,
  QueriesObserver,
  Query,
  QueryCache,
  QueryClient,
  QueryObserver,
  dataTagErrorSymbol,
  dataTagSymbol,
  defaultScheduler,
  defaultShouldDehydrateMutation,
  defaultShouldDehydrateQuery,
  dehydrate,
  environmentManager,
  streamedQuery as experimental_streamedQuery,
  focusManager,
  hashKey,
  hydrate,
  infiniteQueryOptions,
  injectInfiniteQuery,
  injectIsFetching,
  injectIsMutating,
  injectIsRestoring,
  injectMutation,
  injectMutationState,
  injectQuery,
  injectQueryClient,
  isCancelledError,
  isServer,
  keepPreviousData,
  matchMutation,
  matchQuery,
  mutationOptions,
  noop,
  notifyManager,
  onlineManager,
  partialMatchKey,
  provideAngularQuery,
  provideIsRestoring,
  provideQueryClient,
  provideTanStackQuery,
  queryFeature,
  queryOptions,
  replaceEqualDeep,
  shouldThrowError,
  skipToken,
  timeoutManager,
  unsetMarker
};
//# sourceMappingURL=@tanstack_angular-query-experimental.js.map
