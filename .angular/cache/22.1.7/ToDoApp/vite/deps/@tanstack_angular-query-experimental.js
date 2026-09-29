import { M as core_exports } from "./core-z4K6ZEEv.js";
import { D as DestroyRef, Ft as assertInInjectionContext, Sr as inject, U as InjectionToken, Vi as signal, W as Injector, _ as untracked, bn as effect, c as computed, et as NgZone, pt as VERSION, wi as runInInjectionContext } from "./_resource-chunk-DEorg4q9.js";
import { A as noop, B as timeoutManager, C as addToEnd, D as keepPreviousData, E as isValidTimeout, F as resolveStaleTime, H as Subscribable, I as shallowEqualObjects, L as shouldThrowError, M as replaceData, N as replaceEqualDeep, O as matchMutation, P as resolveQueryBoolean, R as skipToken, S as addConsumeAwareSignal, T as isServer, V as focusManager, _ as defaultScheduler, a as QueryClient, b as tryResolveSync, c as Mutation, d as fetchState, f as hasNextPage, g as onlineManager, h as isCancelledError, i as queryFeature, j as partialMatchKey, k as matchQuery, l as getDefaultState, m as CancelledError, n as provideQueryClient, o as QueryCache, p as hasPreviousPage, r as provideTanStackQuery, s as MutationCache, t as provideAngularQuery, u as Query, v as notifyManager, w as hashKey, x as environmentManager, y as pendingThenable, z as timeUntilStale } from "./providers-D9LPZtY1.js";
//#region node_modules/@tanstack/query-core/build/modern/hydration.js
function defaultTransformerFn(data) {
	return data;
}
function dehydrateMutation(mutation) {
	return {
		mutationKey: mutation.options.mutationKey,
		state: mutation.state,
		...mutation.options.scope && { scope: mutation.options.scope },
		...mutation.meta && { meta: mutation.meta }
	};
}
function dehydrateQuery(query, serializeData, shouldRedactErrors) {
	const dehydratePromise = () => {
		const promise = query.promise?.then(serializeData).catch((error) => {
			if (!shouldRedactErrors(error)) return Promise.reject(error);
			console.error(`A query that was dehydrated as pending ended up rejecting. [${query.queryHash}]: ${error}; The error will be redacted in production builds`);
			return Promise.reject(/* @__PURE__ */ new Error("redacted"));
		});
		promise?.catch(noop);
		return promise;
	};
	return {
		dehydratedAt: Date.now(),
		state: {
			...query.state,
			...query.state.data !== void 0 && { data: serializeData(query.state.data) }
		},
		queryKey: query.queryKey,
		queryHash: query.queryHash,
		...query.state.status === "pending" && { promise: dehydratePromise() },
		...query.meta && { meta: query.meta },
		...query.queryType && { queryType: query.queryType }
	};
}
function defaultShouldDehydrateMutation(mutation) {
	return mutation.state.isPaused;
}
function defaultShouldDehydrateQuery(query) {
	return query.state.status === "success";
}
function defaultShouldRedactErrors(_) {
	return true;
}
function dehydrate(client, options = {}) {
	const filterMutation = options.shouldDehydrateMutation ?? client.getDefaultOptions().dehydrate?.shouldDehydrateMutation ?? defaultShouldDehydrateMutation;
	const mutations = client.getMutationCache().getAll().flatMap((mutation) => filterMutation(mutation) ? [dehydrateMutation(mutation)] : []);
	const filterQuery = options.shouldDehydrateQuery ?? client.getDefaultOptions().dehydrate?.shouldDehydrateQuery ?? defaultShouldDehydrateQuery;
	const shouldRedactErrors = options.shouldRedactErrors ?? client.getDefaultOptions().dehydrate?.shouldRedactErrors ?? defaultShouldRedactErrors;
	const serializeData = options.serializeData ?? client.getDefaultOptions().dehydrate?.serializeData ?? defaultTransformerFn;
	return {
		mutations,
		queries: client.getQueryCache().getAll().flatMap((query) => filterQuery(query) ? [dehydrateQuery(query, serializeData, shouldRedactErrors)] : [])
	};
}
function hydrate(client, dehydratedState, options) {
	if (typeof dehydratedState !== "object" || dehydratedState === null) return;
	const mutationCache = client.getMutationCache();
	const queryCache = client.getQueryCache();
	const deserializeData = options?.defaultOptions?.deserializeData ?? client.getDefaultOptions().hydrate?.deserializeData ?? defaultTransformerFn;
	const mutations = dehydratedState.mutations || [];
	const queries = dehydratedState.queries || [];
	mutations.forEach(({ state, ...mutationOptions }) => {
		mutationCache.build(client, {
			...client.getDefaultOptions().hydrate?.mutations,
			...options?.defaultOptions?.mutations,
			...mutationOptions
		}, state);
	});
	queries.forEach(({ queryKey, state, queryHash, meta, promise, dehydratedAt, queryType }) => {
		const syncData = promise ? tryResolveSync(promise) : void 0;
		const rawData = state.data === void 0 ? syncData?.data : state.data;
		const data = rawData === void 0 ? rawData : deserializeData(rawData);
		let query = queryCache.get(queryHash);
		const existingQueryIsPending = query?.state.status === "pending";
		const existingQueryIsFetching = query?.state.fetchStatus === "fetching";
		if (query) {
			const hasNewerSyncData = syncData && dehydratedAt !== void 0 && dehydratedAt > query.state.dataUpdatedAt;
			if (state.dataUpdatedAt > query.state.dataUpdatedAt || hasNewerSyncData) {
				const { fetchStatus: _ignored, ...serializedState } = state;
				query.setState({
					...serializedState,
					data,
					...state.status === "pending" && data !== void 0 && {
						status: "success",
						dataUpdatedAt: dehydratedAt ?? Date.now(),
						...!existingQueryIsFetching && { fetchStatus: "idle" }
					}
				});
			}
		} else query = queryCache.build(client, {
			...client.getDefaultOptions().hydrate?.queries,
			...options?.defaultOptions?.queries,
			queryKey,
			queryHash,
			meta,
			_type: queryType
		}, {
			...state,
			data,
			fetchStatus: "idle",
			status: state.status === "pending" && data !== void 0 ? "success" : state.status,
			...state.status === "pending" && data !== void 0 && { dataUpdatedAt: dehydratedAt ?? Date.now() }
		});
		if (promise && !syncData && !existingQueryIsPending && !existingQueryIsFetching && (dehydratedAt === void 0 || dehydratedAt > query.state.dataUpdatedAt)) query.fetch(void 0, { initialPromise: Promise.resolve(promise).then(deserializeData) }).catch(noop);
	});
}
//#endregion
//#region node_modules/@tanstack/query-core/build/modern/queryObserver.js
var QueryObserver = class extends Subscribable {
	constructor(client, options) {
		super();
		this.options = options;
		this.#client = client;
		this.#selectError = null;
		this.#currentThenable = pendingThenable();
		this.bindMethods();
		this.setOptions(options);
	}
	#client;
	#currentQuery = void 0;
	#currentQueryInitialState = void 0;
	#currentResult = void 0;
	#currentResultState;
	#currentResultOptions;
	#currentThenable;
	#selectError;
	#selectFn;
	#selectResult;
	#lastQueryWithDefinedData;
	#staleTimeoutId;
	#refetchIntervalId;
	#currentRefetchInterval;
	#trackedProps = /* @__PURE__ */ new Set();
	bindMethods() {
		this.refetch = this.refetch.bind(this);
	}
	onSubscribe() {
		if (this.listeners.size === 1) {
			this.#currentQuery.addObserver(this);
			if (shouldFetchOnMount(this.#currentQuery, this.options)) this.#executeFetch();
			else this.updateResult();
			this.#updateTimers();
		}
	}
	onUnsubscribe() {
		if (!this.hasListeners()) this.destroy();
	}
	shouldFetchOnReconnect() {
		return shouldFetchOn(this.#currentQuery, this.options, this.options.refetchOnReconnect);
	}
	shouldFetchOnWindowFocus() {
		return shouldFetchOn(this.#currentQuery, this.options, this.options.refetchOnWindowFocus);
	}
	destroy() {
		this.listeners = /* @__PURE__ */ new Set();
		this.#clearStaleTimeout();
		this.#clearRefetchInterval();
		this.#currentQuery.removeObserver(this);
	}
	setOptions(options) {
		const prevOptions = this.options;
		const prevQuery = this.#currentQuery;
		this.options = this.#client.defaultQueryOptions(options);
		if (this.options.enabled !== void 0 && typeof this.options.enabled !== "boolean" && typeof this.options.enabled !== "function" && typeof resolveQueryBoolean(this.options.enabled, this.#currentQuery) !== "boolean") throw new Error("Expected enabled to be a boolean or a callback that returns a boolean");
		this.#updateQuery();
		this.#currentQuery.setOptions(this.options);
		if (prevOptions._defaulted && !shallowEqualObjects(this.options, prevOptions)) this.#client.getQueryCache().notify({
			type: "observerOptionsUpdated",
			query: this.#currentQuery,
			observer: this
		});
		const mounted = this.hasListeners();
		if (mounted && shouldFetchOptionally(this.#currentQuery, prevQuery, this.options, prevOptions)) this.#executeFetch();
		this.updateResult();
		if (mounted && (this.#currentQuery !== prevQuery || resolveQueryBoolean(this.options.enabled, this.#currentQuery) !== resolveQueryBoolean(prevOptions.enabled, this.#currentQuery) || resolveStaleTime(this.options.staleTime, this.#currentQuery) !== resolveStaleTime(prevOptions.staleTime, this.#currentQuery))) this.#updateStaleTimeout();
		const nextRefetchInterval = this.#computeRefetchInterval();
		if (mounted && (this.#currentQuery !== prevQuery || resolveQueryBoolean(this.options.enabled, this.#currentQuery) !== resolveQueryBoolean(prevOptions.enabled, this.#currentQuery) || nextRefetchInterval !== this.#currentRefetchInterval)) this.#updateRefetchInterval(nextRefetchInterval);
	}
	getOptimisticResult(options) {
		const query = this.#client.getQueryCache().build(this.#client, options);
		const result = this.createResult(query, options);
		if (shouldAssignObserverCurrentProperties(this, result)) {
			this.#currentResult = result;
			this.#currentResultOptions = this.options;
			this.#currentResultState = this.#currentQuery.state;
		}
		return result;
	}
	getCurrentResult() {
		return this.#currentResult;
	}
	trackResult(result, onPropTracked) {
		return new Proxy(result, { get: (target, key) => {
			this.trackProp(key);
			onPropTracked?.(key);
			if (key === "promise") {
				this.trackProp("data");
				if (!this.options.experimental_prefetchInRender && this.#currentThenable.status === "pending") this.#currentThenable.reject(/* @__PURE__ */ new Error("experimental_prefetchInRender feature flag is not enabled"));
			}
			return Reflect.get(target, key);
		} });
	}
	trackProp(key) {
		this.#trackedProps.add(key);
	}
	getCurrentQuery() {
		return this.#currentQuery;
	}
	refetch({ ...options } = {}) {
		return this.fetch({ ...options });
	}
	fetchOptimistic(options) {
		const defaultedOptions = this.#client.defaultQueryOptions(options);
		const query = this.#client.getQueryCache().build(this.#client, defaultedOptions);
		return query.fetch().then(() => this.createResult(query, defaultedOptions));
	}
	fetch(fetchOptions) {
		return this.#executeFetch({
			...fetchOptions,
			cancelRefetch: fetchOptions.cancelRefetch ?? true
		}).then(() => {
			this.updateResult();
			return this.#currentResult;
		});
	}
	#executeFetch(fetchOptions) {
		this.#updateQuery();
		let promise = this.#currentQuery.fetch(this.options, fetchOptions);
		if (!fetchOptions?.throwOnError) promise = promise.catch(noop);
		return promise;
	}
	#updateStaleTimeout() {
		this.#clearStaleTimeout();
		const staleTime = resolveStaleTime(this.options.staleTime, this.#currentQuery);
		if (environmentManager.isServer() || this.#currentResult.isStale || !isValidTimeout(staleTime)) return;
		const timeout = timeUntilStale(this.#currentResult.dataUpdatedAt, staleTime) + 1;
		this.#staleTimeoutId = timeoutManager.setTimeout(() => {
			if (!this.#currentResult.isStale) this.updateResult();
		}, timeout);
	}
	#computeRefetchInterval() {
		return (typeof this.options.refetchInterval === "function" ? this.options.refetchInterval(this.#currentQuery) : this.options.refetchInterval) ?? false;
	}
	#updateRefetchInterval(nextInterval) {
		this.#clearRefetchInterval();
		this.#currentRefetchInterval = nextInterval;
		if (environmentManager.isServer() || resolveQueryBoolean(this.options.enabled, this.#currentQuery) === false || !isValidTimeout(this.#currentRefetchInterval) || this.#currentRefetchInterval === 0) return;
		this.#refetchIntervalId = timeoutManager.setInterval(() => {
			if (this.options.refetchIntervalInBackground || focusManager.isFocused()) this.#executeFetch();
		}, this.#currentRefetchInterval);
	}
	#updateTimers() {
		this.#updateStaleTimeout();
		this.#updateRefetchInterval(this.#computeRefetchInterval());
	}
	#clearStaleTimeout() {
		if (this.#staleTimeoutId !== void 0) {
			timeoutManager.clearTimeout(this.#staleTimeoutId);
			this.#staleTimeoutId = void 0;
		}
	}
	#clearRefetchInterval() {
		if (this.#refetchIntervalId !== void 0) {
			timeoutManager.clearInterval(this.#refetchIntervalId);
			this.#refetchIntervalId = void 0;
		}
	}
	createResult(query, options) {
		const prevQuery = this.#currentQuery;
		const prevOptions = this.options;
		const prevResult = this.#currentResult;
		const prevResultState = this.#currentResultState;
		const prevResultOptions = this.#currentResultOptions;
		const queryInitialState = query !== prevQuery ? query.state : this.#currentQueryInitialState;
		const { state } = query;
		let newState = { ...state };
		let isPlaceholderData = false;
		let data;
		if (options._optimisticResults) {
			const mounted = this.hasListeners();
			const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
			const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);
			if (fetchOnMount || fetchOptionally) newState = {
				...newState,
				...fetchState(state.data, query.options)
			};
			if (options._optimisticResults === "isRestoring") newState.fetchStatus = "idle";
		}
		let { error, errorUpdatedAt, status } = newState;
		data = newState.data;
		let skipSelect = false;
		if (options.placeholderData !== void 0 && data === void 0 && status === "pending") {
			let placeholderData;
			if (prevResult?.isPlaceholderData && options.placeholderData === prevResultOptions?.placeholderData) {
				placeholderData = prevResult.data;
				skipSelect = true;
			} else placeholderData = typeof options.placeholderData === "function" ? options.placeholderData(this.#lastQueryWithDefinedData?.state.data, this.#lastQueryWithDefinedData) : options.placeholderData;
			if (placeholderData !== void 0) {
				status = "success";
				data = replaceData(prevResult?.data, placeholderData, options);
				isPlaceholderData = true;
			}
		}
		if (options.select && data !== void 0 && !skipSelect) if (prevResult && data === prevResultState?.data && options.select === this.#selectFn) data = this.#selectResult;
		else try {
			this.#selectFn = options.select;
			data = options.select(data);
			data = replaceData(prevResult?.data, data, options);
			this.#selectResult = data;
			this.#selectError = null;
		} catch (selectError) {
			this.#selectError = selectError;
		}
		if (this.#selectError) {
			error = this.#selectError;
			data = this.#selectResult;
			errorUpdatedAt = Date.now();
			status = "error";
		}
		const isFetching = newState.fetchStatus === "fetching";
		const isPending = status === "pending";
		const isError = status === "error";
		const isLoading = isPending && isFetching;
		const hasData = data !== void 0;
		const nextResult = {
			status,
			fetchStatus: newState.fetchStatus,
			isPending,
			isSuccess: status === "success",
			isError,
			isInitialLoading: isLoading,
			isLoading,
			data,
			dataUpdatedAt: newState.dataUpdatedAt,
			error,
			errorUpdatedAt,
			failureCount: newState.fetchFailureCount,
			failureReason: newState.fetchFailureReason,
			errorUpdateCount: newState.errorUpdateCount,
			isFetched: query.isFetched(),
			isFetchedAfterMount: newState.dataUpdateCount > queryInitialState.dataUpdateCount || newState.errorUpdateCount > queryInitialState.errorUpdateCount,
			isFetching,
			isRefetching: isFetching && !isPending,
			isLoadingError: isError && !hasData,
			isPaused: newState.fetchStatus === "paused",
			isPlaceholderData,
			isRefetchError: isError && hasData,
			isStale: isStale(query, options),
			refetch: this.refetch,
			promise: this.#currentThenable,
			isEnabled: resolveQueryBoolean(options.enabled, query) !== false
		};
		if (this.options.experimental_prefetchInRender) {
			const hasResultData = nextResult.data !== void 0;
			const isErrorWithoutData = nextResult.status === "error" && !hasResultData;
			const finalizeThenableIfPossible = (thenable) => {
				if (isErrorWithoutData) thenable.reject(nextResult.error);
				else if (hasResultData) thenable.resolve(nextResult.data);
			};
			const recreateThenable = () => {
				const pending = this.#currentThenable = nextResult.promise = pendingThenable();
				finalizeThenableIfPossible(pending);
			};
			const prevThenable = this.#currentThenable;
			switch (prevThenable.status) {
				case "pending":
					if (query.queryHash === prevQuery.queryHash) finalizeThenableIfPossible(prevThenable);
					break;
				case "fulfilled":
					if (isErrorWithoutData || nextResult.data !== prevThenable.value) recreateThenable();
					break;
				case "rejected":
					if (!isErrorWithoutData || nextResult.error !== prevThenable.reason) recreateThenable();
					break;
			}
		}
		return nextResult;
	}
	updateResult() {
		const prevResult = this.#currentResult;
		const nextResult = this.createResult(this.#currentQuery, this.options);
		this.#currentResultState = this.#currentQuery.state;
		this.#currentResultOptions = this.options;
		if (this.#currentResultState.data !== void 0) this.#lastQueryWithDefinedData = this.#currentQuery;
		if (shallowEqualObjects(nextResult, prevResult)) return;
		this.#currentResult = nextResult;
		const shouldNotifyListeners = () => {
			if (!prevResult) return true;
			const { notifyOnChangeProps } = this.options;
			const notifyOnChangePropsValue = typeof notifyOnChangeProps === "function" ? notifyOnChangeProps() : notifyOnChangeProps;
			if (notifyOnChangePropsValue === "all" || !notifyOnChangePropsValue && !this.#trackedProps.size) return true;
			const includedProps = new Set(notifyOnChangePropsValue ?? this.#trackedProps);
			if (this.options.throwOnError) includedProps.add("error");
			return Object.keys(this.#currentResult).some((key) => {
				const typedKey = key;
				return this.#currentResult[typedKey] !== prevResult[typedKey] && includedProps.has(typedKey);
			});
		};
		this.#notify({ listeners: shouldNotifyListeners() });
	}
	#updateQuery() {
		const query = this.#client.getQueryCache().build(this.#client, this.options);
		if (query === this.#currentQuery) return;
		const prevQuery = this.#currentQuery;
		this.#currentQuery = query;
		this.#currentQueryInitialState = query.state;
		if (this.hasListeners()) {
			prevQuery?.removeObserver(this);
			query.addObserver(this);
		}
	}
	onQueryUpdate() {
		this.updateResult();
		if (this.hasListeners()) this.#updateTimers();
	}
	#notify(notifyOptions) {
		notifyManager.batch(() => {
			if (notifyOptions.listeners) this.listeners.forEach((listener) => {
				listener(this.#currentResult);
			});
			this.#client.getQueryCache().notify({
				query: this.#currentQuery,
				type: "observerResultsUpdated"
			});
		});
	}
};
function shouldLoadOnMount(query, options) {
	return resolveQueryBoolean(options.enabled, query) !== false && query.state.data === void 0 && !(query.state.status === "error" && resolveQueryBoolean(options.retryOnMount, query) === false);
}
function shouldFetchOnMount(query, options) {
	return shouldLoadOnMount(query, options) || query.state.data !== void 0 && shouldFetchOn(query, options, options.refetchOnMount);
}
function shouldFetchOn(query, options, field) {
	if (resolveQueryBoolean(options.enabled, query) !== false && resolveStaleTime(options.staleTime, query) !== "static") {
		const value = typeof field === "function" ? field(query) : field;
		return value === "always" || value !== false && isStale(query, options);
	}
	return false;
}
function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
	return (query !== prevQuery || resolveQueryBoolean(prevOptions.enabled, query) === false) && (!options.suspense || query.state.status !== "error") && isStale(query, options);
}
function isStale(query, options) {
	return resolveQueryBoolean(options.enabled, query) !== false && query.isStaleByTime(resolveStaleTime(options.staleTime, query));
}
function shouldAssignObserverCurrentProperties(observer, optimisticResult) {
	if (!shallowEqualObjects(observer.getCurrentResult(), optimisticResult)) return true;
	return false;
}
//#endregion
//#region node_modules/@tanstack/query-core/build/modern/infiniteQueryObserver.js
var InfiniteQueryObserver = class extends QueryObserver {
	constructor(client, options) {
		super(client, options);
	}
	bindMethods() {
		super.bindMethods();
		this.fetchNextPage = this.fetchNextPage.bind(this);
		this.fetchPreviousPage = this.fetchPreviousPage.bind(this);
	}
	setOptions(options) {
		options._type = "infinite";
		super.setOptions(options);
	}
	getOptimisticResult(options) {
		options._type = "infinite";
		return super.getOptimisticResult(options);
	}
	fetchNextPage(options) {
		return this.fetch({
			...options,
			meta: { fetchMore: { direction: "forward" } }
		});
	}
	fetchPreviousPage(options) {
		return this.fetch({
			...options,
			meta: { fetchMore: { direction: "backward" } }
		});
	}
	createResult(query, options) {
		const { state } = query;
		const parentResult = super.createResult(query, options);
		const { isFetching, isRefetching, isError, isRefetchError } = parentResult;
		const fetchDirection = state.fetchMeta?.fetchMore?.direction;
		const isFetchNextPageError = isError && fetchDirection === "forward";
		const isFetchingNextPage = isFetching && fetchDirection === "forward";
		const isFetchPreviousPageError = isError && fetchDirection === "backward";
		const isFetchingPreviousPage = isFetching && fetchDirection === "backward";
		return {
			...parentResult,
			fetchNextPage: this.fetchNextPage,
			fetchPreviousPage: this.fetchPreviousPage,
			hasNextPage: hasNextPage(options, state.data),
			hasPreviousPage: hasPreviousPage(options, state.data),
			isFetchNextPageError,
			isFetchingNextPage,
			isFetchPreviousPageError,
			isFetchingPreviousPage,
			isRefetchError: isRefetchError && !isFetchNextPageError && !isFetchPreviousPageError,
			isRefetching: isRefetching && !isFetchingNextPage && !isFetchingPreviousPage
		};
	}
};
//#endregion
//#region node_modules/@tanstack/query-core/build/modern/mutationObserver.js
var MutationObserver = class extends Subscribable {
	#client;
	#currentResult = void 0;
	#currentMutation;
	#mutateOptions;
	constructor(client, options) {
		super();
		this.#client = client;
		this.setOptions(options);
		this.bindMethods();
		this.#updateResult();
	}
	bindMethods() {
		this.mutate = this.mutate.bind(this);
		this.reset = this.reset.bind(this);
	}
	setOptions(options) {
		const prevOptions = this.options;
		this.options = this.#client.defaultMutationOptions(options);
		if (!shallowEqualObjects(this.options, prevOptions)) this.#client.getMutationCache().notify({
			type: "observerOptionsUpdated",
			mutation: this.#currentMutation,
			observer: this
		});
		if (prevOptions?.mutationKey && this.options.mutationKey && hashKey(prevOptions.mutationKey) !== hashKey(this.options.mutationKey)) this.reset();
		else if (this.#currentMutation?.state.status === "pending") this.#currentMutation.setOptions(this.options);
	}
	onUnsubscribe() {
		if (!this.hasListeners()) this.#currentMutation?.removeObserver(this);
	}
	onMutationUpdate(action) {
		this.#updateResult();
		this.#notify(action);
	}
	getCurrentResult() {
		return this.#currentResult;
	}
	reset() {
		this.#currentMutation?.removeObserver(this);
		this.#currentMutation = void 0;
		this.#updateResult();
		this.#notify();
	}
	mutate(variables, options) {
		this.#mutateOptions = options;
		this.#currentMutation?.removeObserver(this);
		this.#currentMutation = this.#client.getMutationCache().build(this.#client, this.options);
		this.#currentMutation.addObserver(this);
		return this.#currentMutation.execute(variables);
	}
	#updateResult() {
		const state = this.#currentMutation?.state ?? getDefaultState();
		this.#currentResult = {
			...state,
			isPending: state.status === "pending",
			isSuccess: state.status === "success",
			isError: state.status === "error",
			isIdle: state.status === "idle",
			mutate: this.mutate,
			reset: this.reset
		};
	}
	#notify(action) {
		notifyManager.batch(() => {
			if (this.#mutateOptions && this.hasListeners()) {
				const variables = this.#currentResult.variables;
				const onMutateResult = this.#currentResult.context;
				const context = {
					client: this.#client,
					meta: this.options.meta,
					mutationKey: this.options.mutationKey
				};
				if (action?.type === "success") {
					try {
						this.#mutateOptions.onSuccess?.(action.data, variables, onMutateResult, context);
					} catch (e) {
						Promise.reject(e);
					}
					try {
						this.#mutateOptions.onSettled?.(action.data, null, variables, onMutateResult, context);
					} catch (e) {
						Promise.reject(e);
					}
				} else if (action?.type === "error") {
					try {
						this.#mutateOptions.onError?.(action.error, variables, onMutateResult, context);
					} catch (e) {
						Promise.reject(e);
					}
					try {
						this.#mutateOptions.onSettled?.(void 0, action.error, variables, onMutateResult, context);
					} catch (e) {
						Promise.reject(e);
					}
				}
			}
			this.listeners.forEach((listener) => {
				listener(this.#currentResult);
			});
		});
	}
};
//#endregion
//#region node_modules/@tanstack/query-core/build/modern/queriesObserver.js
function difference(array1, array2) {
	const excludeSet = new Set(array2);
	return array1.filter((x) => !excludeSet.has(x));
}
function replaceAt(array, index, value) {
	const copy = array.slice(0);
	copy[index] = value;
	return copy;
}
var QueriesObserver = class extends Subscribable {
	#client;
	#result;
	#queries;
	#options;
	#observers;
	#combinedResult;
	#lastCombine;
	#lastResult;
	#lastQueryHashes;
	#observerMatches = [];
	constructor(client, queries, options) {
		super();
		this.#client = client;
		this.#options = options;
		this.#queries = [];
		this.#observers = [];
		this.#result = [];
		this.setQueries(queries);
	}
	onSubscribe() {
		if (this.listeners.size === 1) this.#observers.forEach((observer) => {
			observer.subscribe((result) => {
				this.#onUpdate(observer, result);
			});
		});
	}
	onUnsubscribe() {
		if (!this.listeners.size) this.destroy();
	}
	destroy() {
		this.listeners = /* @__PURE__ */ new Set();
		this.#observers.forEach((observer) => {
			observer.destroy();
		});
	}
	setQueries(queries, options) {
		this.#queries = queries;
		this.#options = options;
		{
			const queryHashes = queries.map((query) => this.#client.defaultQueryOptions(query).queryHash);
			if (new Set(queryHashes).size !== queryHashes.length) console.warn("[QueriesObserver]: Duplicate Queries found. This might result in unexpected behavior.");
		}
		notifyManager.batch(() => {
			const prevObservers = this.#observers;
			const newObserverMatches = this.#findMatchingObservers(this.#queries);
			newObserverMatches.forEach((match) => match.observer.setOptions(match.defaultedQueryOptions));
			const newObservers = newObserverMatches.map((match) => match.observer);
			const newResult = newObservers.map((observer) => observer.getCurrentResult());
			const hasLengthChange = prevObservers.length !== newObservers.length;
			const hasIndexChange = newObservers.some((observer, index) => observer !== prevObservers[index]);
			const hasStructuralChange = hasLengthChange || hasIndexChange;
			const hasResultChange = hasStructuralChange ? true : newResult.some((result, index) => {
				const prev = this.#result[index];
				return !prev || !shallowEqualObjects(result, prev);
			});
			if (!hasStructuralChange && !hasResultChange) return;
			if (hasStructuralChange) {
				this.#observerMatches = newObserverMatches;
				this.#observers = newObservers;
			}
			this.#result = newResult;
			if (!this.hasListeners()) return;
			if (hasStructuralChange) {
				difference(prevObservers, newObservers).forEach((observer) => {
					observer.destroy();
				});
				difference(newObservers, prevObservers).forEach((observer) => {
					observer.subscribe((result) => {
						this.#onUpdate(observer, result);
					});
				});
			}
			this.#notify();
		});
	}
	getCurrentResult() {
		return this.#result;
	}
	getQueries() {
		return this.#observers.map((observer) => observer.getCurrentQuery());
	}
	getObservers() {
		return this.#observers;
	}
	getOptimisticResult(queries, combine) {
		const matches = this.#findMatchingObservers(queries);
		const result = matches.map((match) => match.observer.getOptimisticResult(match.defaultedQueryOptions));
		const queryHashes = matches.map((match) => match.defaultedQueryOptions.queryHash);
		return [
			result,
			(r) => {
				return this.#combineResult(r ?? result, combine, queryHashes);
			},
			() => {
				return this.#trackResult(result, matches);
			}
		];
	}
	#trackResult(result, matches) {
		return matches.map((match, index) => {
			const observerResult = result[index];
			return !match.defaultedQueryOptions.notifyOnChangeProps ? match.observer.trackResult(observerResult, (accessedProp) => {
				matches.forEach((m) => {
					m.observer.trackProp(accessedProp);
				});
			}) : observerResult;
		});
	}
	#combineResult(input, combine, queryHashes) {
		if (combine) {
			const lastHashes = this.#lastQueryHashes;
			const queryHashesChanged = queryHashes !== void 0 && lastHashes !== void 0 && (lastHashes.length !== queryHashes.length || queryHashes.some((hash, i) => hash !== lastHashes[i]));
			if (!this.#combinedResult || this.#result !== this.#lastResult || queryHashesChanged || combine !== this.#lastCombine) {
				this.#lastCombine = combine;
				this.#lastResult = this.#result;
				if (queryHashes !== void 0) this.#lastQueryHashes = queryHashes;
				this.#combinedResult = replaceEqualDeep(this.#combinedResult, combine(input));
			}
			return this.#combinedResult;
		}
		return input;
	}
	#shouldSkipCombine() {
		return this.#options?.combine !== void 0 && this.#observers.some((observer, index) => {
			return observer.options.suspense && this.#result[index]?.data === void 0;
		});
	}
	#findMatchingObservers(queries) {
		const prevObserversMap = /* @__PURE__ */ new Map();
		this.#observers.forEach((observer) => {
			const key = observer.options.queryHash;
			if (!key) return;
			const previousObservers = prevObserversMap.get(key);
			if (previousObservers) previousObservers.push(observer);
			else prevObserversMap.set(key, [observer]);
		});
		const observers = [];
		queries.forEach((options) => {
			const defaultedOptions = this.#client.defaultQueryOptions(options);
			const observer = prevObserversMap.get(defaultedOptions.queryHash)?.shift() ?? new QueryObserver(this.#client, defaultedOptions);
			observers.push({
				defaultedQueryOptions: defaultedOptions,
				observer
			});
		});
		return observers;
	}
	#onUpdate(observer, result) {
		const index = this.#observers.indexOf(observer);
		if (index !== -1) {
			this.#result = replaceAt(this.#result, index, result);
			this.#notify();
		}
	}
	#notify() {
		if (this.hasListeners()) {
			const newTracked = this.#trackResult(this.#result, this.#observerMatches);
			const shouldSkipCombine = this.#shouldSkipCombine();
			const previousResult = this.#combinedResult;
			const newResult = shouldSkipCombine ? previousResult : this.#combineResult(newTracked, this.#options?.combine);
			if (shouldSkipCombine || previousResult !== newResult) notifyManager.batch(() => {
				this.listeners.forEach((listener) => {
					listener(this.#result);
				});
			});
		}
	}
};
//#endregion
//#region node_modules/@tanstack/query-core/build/modern/streamedQuery.js
function streamedQuery({ streamFn, refetchMode = "reset", reducer = (items, chunk) => addToEnd(items, chunk), initialValue = [] }) {
	return async (context) => {
		const query = context.client.getQueryCache().find({
			queryKey: context.queryKey,
			exact: true
		});
		const isRefetch = !!query && query.isFetched();
		if (isRefetch && refetchMode === "reset") query.setState({
			...query.resetState,
			fetchStatus: "fetching"
		});
		let result = initialValue;
		let cancelled = false;
		const stream = await streamFn(addConsumeAwareSignal({
			client: context.client,
			meta: context.meta,
			queryKey: context.queryKey,
			pageParam: context.pageParam,
			direction: context.direction
		}, () => context.signal, () => cancelled = true));
		const isReplaceRefetch = isRefetch && refetchMode === "replace";
		for await (const chunk of stream) {
			if (cancelled) break;
			if (isReplaceRefetch) result = reducer(result, chunk);
			else context.client.setQueryData(context.queryKey, (prev) => reducer(prev === void 0 ? initialValue : prev, chunk));
		}
		if (isReplaceRefetch && !cancelled) context.client.setQueryData(context.queryKey, result);
		return context.client.getQueryData(context.queryKey) ?? initialValue;
	};
}
//#endregion
//#region node_modules/@tanstack/query-core/build/modern/types.js
var dataTagSymbol = /* @__PURE__ */ Symbol("dataTagSymbol");
var dataTagErrorSymbol = /* @__PURE__ */ Symbol("dataTagErrorSymbol");
var unsetMarker = /* @__PURE__ */ Symbol("unsetMarker");
//#endregion
//#region node_modules/@tanstack/angular-query-experimental/query-options.mjs
function queryOptions(options) {
	return options;
}
//#endregion
//#region node_modules/@tanstack/angular-query-experimental/mutation-options.mjs
function mutationOptions(options) {
	return options;
}
//#endregion
//#region node_modules/@tanstack/angular-query-experimental/infinite-query-options.mjs
function infiniteQueryOptions(options) {
	return options;
}
//#endregion
//#region node_modules/@tanstack/angular-query-experimental/signal-proxy.mjs
function signalProxy(inputSignal) {
	return new Proxy({}, {
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
//#endregion
//#region node_modules/@tanstack/angular-query-experimental/inject-is-restoring.mjs
var IS_RESTORING = new InjectionToken("", { factory: () => signal(false).asReadonly() });
function injectIsRestoring(options) {
	!(options == null ? void 0 : options.injector) && assertInInjectionContext(injectIsRestoring);
	return ((options == null ? void 0 : options.injector) ?? inject(Injector)).get(IS_RESTORING);
}
function provideIsRestoring(isRestoring) {
	return {
		provide: IS_RESTORING,
		useValue: isRestoring
	};
}
//#endregion
//#region node_modules/@tanstack/angular-query-experimental/pending-tasks-compat.mjs
var PENDING_TASKS = new InjectionToken("PENDING_TASKS", { factory: () => {
	const token = Reflect.get(core_exports, "PendingTasks");
	const svc = token ? inject(token, { optional: true }) : null;
	return { add: svc ? () => svc.add() : () => noop };
} });
//#endregion
//#region node_modules/@tanstack/angular-query-experimental/create-base-query.mjs
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
	const optimisticResultSignal = computed(() => observerSignal().getOptimisticResult(defaultedOptionsSignal()));
	const resultFromSubscriberSignal = signal(null);
	effect((onCleanup) => {
		const observer = observerSignal();
		const defaultedOptions = defaultedOptionsSignal();
		untracked(() => {
			observer.setOptions(defaultedOptions);
		});
		onCleanup(() => {
			ngZone.run(() => resultFromSubscriberSignal.set(null));
		});
	}, { allowSignalWrites: VERSION.major < "19" || void 0 });
	effect((onCleanup) => {
		const observer = observerSignal();
		let pendingTaskRef = null;
		const unsubscribe = isRestoring() ? () => void 0 : untracked(() => ngZone.runOutsideAngular(() => {
			return observer.subscribe(notifyManager.batchCalls((state) => {
				ngZone.run(() => {
					if (state.fetchStatus === "fetching" && !pendingTaskRef) pendingTaskRef = pendingTasks.add();
					if (state.fetchStatus === "idle" && pendingTaskRef) {
						pendingTaskRef();
						pendingTaskRef = null;
					}
					if (state.isError && !state.isFetching && shouldThrowError(observer.options.throwOnError, [state.error, observer.getCurrentQuery()])) {
						ngZone.onError.emit(state.error);
						throw state.error;
					}
					resultFromSubscriberSignal.set(state);
				});
			}));
		}));
		onCleanup(() => {
			if (pendingTaskRef) {
				pendingTaskRef();
				pendingTaskRef = null;
			}
			unsubscribe();
		});
	});
	return signalProxy(computed(() => {
		const subscriberResult = resultFromSubscriberSignal();
		const optimisticResult = optimisticResultSignal();
		const result = subscriberResult ?? optimisticResult;
		const observer = observerSignal();
		const originalRefetch = result.refetch;
		return {
			...result,
			refetch: ((...args) => {
				observer.setOptions(defaultedOptionsSignal());
				return originalRefetch(...args);
			})
		};
	}));
}
//#endregion
//#region node_modules/@tanstack/angular-query-experimental/inject-infinite-query.mjs
function injectInfiniteQuery(injectInfiniteQueryFn, options) {
	!(options == null ? void 0 : options.injector) && assertInInjectionContext(injectInfiniteQuery);
	return runInInjectionContext((options == null ? void 0 : options.injector) ?? inject(Injector), () => createBaseQuery(injectInfiniteQueryFn, InfiniteQueryObserver));
}
//#endregion
//#region node_modules/@tanstack/angular-query-experimental/inject-is-fetching.mjs
function injectIsFetching(filters, options) {
	!(options == null ? void 0 : options.injector) && assertInInjectionContext(injectIsFetching);
	const injector = (options == null ? void 0 : options.injector) ?? inject(Injector);
	const destroyRef = injector.get(DestroyRef);
	const ngZone = injector.get(NgZone);
	const queryClient = injector.get(QueryClient);
	const cache = queryClient.getQueryCache();
	let isFetching = queryClient.isFetching(filters);
	const result = signal(isFetching);
	const unsubscribe = ngZone.runOutsideAngular(() => cache.subscribe(notifyManager.batchCalls(() => {
		const newIsFetching = queryClient.isFetching(filters);
		if (isFetching !== newIsFetching) {
			isFetching = newIsFetching;
			ngZone.run(() => {
				result.set(isFetching);
			});
		}
	})));
	destroyRef.onDestroy(unsubscribe);
	return result;
}
//#endregion
//#region node_modules/@tanstack/angular-query-experimental/inject-is-mutating.mjs
function injectIsMutating(filters, options) {
	!(options == null ? void 0 : options.injector) && assertInInjectionContext(injectIsMutating);
	const injector = (options == null ? void 0 : options.injector) ?? inject(Injector);
	const destroyRef = injector.get(DestroyRef);
	const ngZone = injector.get(NgZone);
	const queryClient = injector.get(QueryClient);
	const cache = queryClient.getMutationCache();
	let isMutating = queryClient.isMutating(filters);
	const result = signal(isMutating);
	const unsubscribe = ngZone.runOutsideAngular(() => cache.subscribe(notifyManager.batchCalls(() => {
		const newIsMutating = queryClient.isMutating(filters);
		if (isMutating !== newIsMutating) {
			isMutating = newIsMutating;
			ngZone.run(() => {
				result.set(isMutating);
			});
		}
	})));
	destroyRef.onDestroy(unsubscribe);
	return result.asReadonly();
}
//#endregion
//#region node_modules/@tanstack/angular-query-experimental/inject-mutation.mjs
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
		return observerSignal().getCurrentResult();
	});
	const resultFromSubscriberSignal = signal(null);
	effect(() => {
		const observer = observerSignal();
		const observerOptions = optionsSignal();
		untracked(() => {
			observer.setOptions(observerOptions);
		});
	}, { injector });
	effect((onCleanup) => {
		const observer = observerSignal();
		let pendingTaskRef = null;
		untracked(() => {
			const unsubscribe = ngZone.runOutsideAngular(() => observer.subscribe(notifyManager.batchCalls((state) => {
				ngZone.run(() => {
					if (state.isPending && !pendingTaskRef) pendingTaskRef = pendingTasks.add();
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
			})));
			onCleanup(() => {
				if (pendingTaskRef) {
					pendingTaskRef();
					pendingTaskRef = null;
				}
				unsubscribe();
			});
		});
	}, { injector });
	return signalProxy(computed(() => {
		const resultFromSubscriber = resultFromSubscriberSignal();
		const resultFromInitialOptions = resultFromInitialOptionsSignal();
		const result = resultFromSubscriber ?? resultFromInitialOptions;
		return {
			...result,
			mutate: mutateFnSignal(),
			mutateAsync: result.mutate
		};
	}));
}
//#endregion
//#region node_modules/@tanstack/angular-query-experimental/inject-mutation-state.mjs
function getResult(mutationCache, options) {
	return mutationCache.findAll(options.filters).map((mutation) => options.select ? options.select(mutation) : mutation.state);
}
function injectMutationState(injectMutationStateFn = () => ({}), options) {
	!(options == null ? void 0 : options.injector) && assertInInjectionContext(injectMutationState);
	const injector = (options == null ? void 0 : options.injector) ?? inject(Injector);
	const destroyRef = injector.get(DestroyRef);
	const ngZone = injector.get(NgZone);
	const mutationCache = injector.get(QueryClient).getMutationCache();
	const resultFromOptionsSignal = computed(() => {
		return [getResult(mutationCache, injectMutationStateFn()), performance.now()];
	});
	const resultFromSubscriberSignal = signal(null);
	const effectiveResultSignal = computed(() => {
		const optionsResult = resultFromOptionsSignal();
		const subscriberResult = resultFromSubscriberSignal();
		return subscriberResult && subscriberResult[1] > optionsResult[1] ? subscriberResult[0] : optionsResult[0];
	});
	const unsubscribe = ngZone.runOutsideAngular(() => mutationCache.subscribe(notifyManager.batchCalls(() => {
		const [lastResult] = effectiveResultSignal();
		const nextResult = replaceEqualDeep(lastResult, getResult(mutationCache, injectMutationStateFn()));
		if (lastResult !== nextResult) ngZone.run(() => {
			resultFromSubscriberSignal.set([nextResult, performance.now()]);
		});
	})));
	destroyRef.onDestroy(unsubscribe);
	return effectiveResultSignal;
}
//#endregion
//#region node_modules/@tanstack/angular-query-experimental/inject-query.mjs
function injectQuery(injectQueryFn, options) {
	!(options == null ? void 0 : options.injector) && assertInInjectionContext(injectQuery);
	return runInInjectionContext((options == null ? void 0 : options.injector) ?? inject(Injector), () => createBaseQuery(injectQueryFn, QueryObserver));
}
//#endregion
//#region node_modules/@tanstack/angular-query-experimental/inject-query-client.mjs
function injectQueryClient(injectOptions = {}) {
	return (injectOptions.injector ?? inject(Injector)).get(QueryClient);
}
//#endregion
export { CancelledError, InfiniteQueryObserver, Mutation, MutationCache, MutationObserver, QueriesObserver, Query, QueryCache, QueryClient, QueryObserver, dataTagErrorSymbol, dataTagSymbol, defaultScheduler, defaultShouldDehydrateMutation, defaultShouldDehydrateQuery, dehydrate, environmentManager, streamedQuery as experimental_streamedQuery, focusManager, hashKey, hydrate, infiniteQueryOptions, injectInfiniteQuery, injectIsFetching, injectIsMutating, injectIsRestoring, injectMutation, injectMutationState, injectQuery, injectQueryClient, isCancelledError, isServer, keepPreviousData, matchMutation, matchQuery, mutationOptions, noop, notifyManager, onlineManager, partialMatchKey, provideAngularQuery, provideIsRestoring, provideQueryClient, provideTanStackQuery, queryFeature, queryOptions, replaceEqualDeep, shouldThrowError, skipToken, timeoutManager, unsetMarker };
