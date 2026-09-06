import {
  ChangeDetectorRef,
  DestroyRef,
  Directive,
  Injectable,
  InjectionToken,
  Injector,
  Input,
  NgZone,
  OutputEmitterRef,
  TemplateRef,
  Type,
  ViewContainerRef,
  assertInInjectionContext,
  computed,
  effect,
  inject,
  input,
  reflectComponentType,
  runInInjectionContext,
  setClassMetadata,
  signal,
  untracked,
  ɵɵProvidersFeature,
  ɵɵdefineDirective,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-PE7S7WW7.js";
import {
  ReplaySubject
} from "./chunk-RSS3ODKE.js";
import {
  __objRest,
  __spreadProps,
  __spreadValues
} from "./chunk-653SOEEV.js";

// node_modules/@tanstack/table-core/dist/utils.js
function functionalUpdate(updater, input2) {
  return typeof updater === "function" ? updater(input2) : updater;
}
function cloneState(value) {
  if (Array.isArray(value)) return value.map(cloneState);
  if (value && typeof value === "object") {
    const proto = Object.getPrototypeOf(value);
    if (proto !== Object.prototype && proto !== null) return value;
    const copy = proto === null ? makeObjectMap() : {};
    const keys = Object.keys(value);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      Object.defineProperty(copy, key, {
        configurable: true,
        enumerable: true,
        value: cloneState(value[key]),
        writable: true
      });
    }
    return copy;
  }
  return value;
}
function copyInstancePropertiesWithoutMemos(target, source) {
  const keys = Object.keys(source);
  const targetRecord = target;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (!key.startsWith("_memo_") && key !== "_cellsCache") targetRecord[key] = source[key];
  }
  return target;
}
function makeObjectMap() {
  return /* @__PURE__ */ Object.create(null);
}
function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
function makeStateUpdater(key, instance) {
  return (updater) => {
    (instance.options.atoms?.[key] ?? instance.baseAtoms[key]).set((old) => functionalUpdate(updater, old));
  };
}
function isPlainContainer(value) {
  if (typeof value !== "object" || value === null) return false;
  if (Array.isArray(value)) return true;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}
function getEnumerableOwnKeys(value) {
  return Reflect.ownKeys(value).filter((key) => Object.prototype.propertyIsEnumerable.call(value, key));
}
var MAX_STATE_COMPARE_DEPTH = 3;
function stateSlicesEqual(a, b) {
  return stateSlicesEqualAtDepth(a, b, MAX_STATE_COMPARE_DEPTH);
}
function stateSlicesEqualAtDepth(a, b, depth) {
  if (Object.is(a, b)) return true;
  if (depth <= 0 || !isPlainContainer(a) || !isPlainContainer(b)) return false;
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
  }
  const keysA = getEnumerableOwnKeys(a);
  const keysB = getEnumerableOwnKeys(b);
  if (keysA.length !== keysB.length) return false;
  const recordA = a;
  const recordB = b;
  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i];
    if (!Object.prototype.propertyIsEnumerable.call(b, key)) return false;
    if (!stateSlicesEqualAtDepth(recordA[key], recordB[key], depth - 1)) return false;
  }
  return true;
}
function setStateSlice(instance, key, updater, isEqual = stateSlicesEqual) {
  const onChangeKey = `on${key.charAt(0).toUpperCase()}${key.slice(1)}Change`;
  const onChange = instance.options[onChangeKey];
  if (!onChange) return;
  onChange((current) => {
    const next = functionalUpdate(updater, current);
    return isEqual(current, next) ? current : next;
  });
}
function isFunction(d) {
  return d instanceof Function;
}
function flattenBy(arr, getChildren) {
  const flat = [];
  const recurse = (subArr) => {
    subArr.forEach((item) => {
      flat.push(item);
      const children = getChildren(item);
      if (children.length) recurse(children);
    });
  };
  recurse(arr);
  return flat;
}
var memo = ({ fn, memoDeps, onAfterCompare, onAfterUpdate, onBeforeCompare, onBeforeUpdate }) => {
  let deps = [];
  let result;
  const memoizedFn = (depArgs) => {
    onBeforeCompare?.();
    const newDeps = memoDeps?.(depArgs);
    let depsChanged = !newDeps || newDeps.length !== deps?.length;
    if (!depsChanged && newDeps) {
      for (let i = 0; i < newDeps.length; i++) if (newDeps[i] !== deps[i]) {
        depsChanged = true;
        break;
      }
    }
    onAfterCompare?.(depsChanged);
    if (!depsChanged) return result;
    deps = newDeps;
    onBeforeUpdate?.();
    result = fn(...newDeps ?? []);
    onAfterUpdate?.(result);
    return result;
  };
  return memoizedFn;
};
function skipFirstRun(fn) {
  let hasRun = false;
  return () => {
    if (!hasRun) {
      hasRun = true;
      return;
    }
    fn();
  };
}
var pad = (str, num) => {
  str = String(str);
  while (str.length < num) str = " " + str;
  return str;
};
function tableMemo(_a) {
  var _b = _a, { feature, fnName, objectId, onAfterUpdate, table } = _b, memoOptions = __objRest(_b, ["feature", "fnName", "objectId", "onAfterUpdate", "table"]);
  let startCalcTime;
  let endCalcTime;
  let runCount = 0;
  let debug;
  if (true) {
    const { debugAll } = table.options;
    const { parentName } = getFunctionNameInfo(fnName, ".");
    const debugByParent = table.options[`debug${(parentName != "table" ? parentName + "s" : parentName).replace(parentName, parentName.charAt(0).toUpperCase() + parentName.slice(1))}`];
    const debugByFeature = feature ? table.options[`debug${feature.charAt(0).toUpperCase() + feature.slice(1)}`] : false;
    debug = debugAll || debugByParent || debugByFeature;
  }
  function logTime(time, depsChanged) {
    const runType = runCount === 0 ? "(1st run)" : depsChanged ? "(rerun #" + runCount + ")" : "(cache)";
    runCount++;
    console.groupCollapsed(`%c⏱ ${pad(`${time.toFixed(1)} ms`, 12)} %c${runType}%c ${fnName}%c ${objectId ? `(${fnName.split(".")[0]}Id: ${objectId})` : ""}`, `font-size: .6rem; font-weight: bold; ${depsChanged ? `color: hsl(
        ${Math.max(0, Math.min(120 - Math.log10(time) * 60, 120))}deg 100% 31%);` : ""} `, `color: ${runCount < 2 ? "#FF00FF" : "#FF1493"}`, "color: #666", "color: #87CEEB");
    console.info({
      feature,
      state: table.store.state,
      deps: memoOptions.memoDeps?.toString()
    });
    console.trace();
    console.groupEnd();
  }
  const onAfterUpdateHandler = () => {
    if (!onAfterUpdate) return;
    const { schedule, untrack } = table._reactivity;
    schedule(() => untrack(() => onAfterUpdate()));
  };
  const debugOptions = true ? {
    onBeforeCompare: () => {
    },
    onAfterCompare: (depsChanged) => {
    },
    onBeforeUpdate: () => {
      if (debug) startCalcTime = performance.now();
    },
    onAfterUpdate: () => {
      if (debug) {
        endCalcTime = performance.now();
        logTime(Math.round((endCalcTime - startCalcTime) * 100) / 100, true);
      }
      onAfterUpdateHandler();
    }
  } : { onAfterUpdate: () => {
    onAfterUpdateHandler();
  } };
  return memo(__spreadValues(__spreadValues({}, memoOptions), debugOptions));
}
function getFunctionNameInfo(staticFnName, splitBy = "_") {
  const [parentName, fnKey] = staticFnName.split(splitBy);
  return {
    fnKey,
    fnName: `${parentName}.${fnKey}`,
    parentName
  };
}
function assignTableAPIs(feature, table, apis) {
  for (const [staticFnName, { fn, memoDeps }] of Object.entries(apis)) {
    const { fnKey, fnName } = getFunctionNameInfo(staticFnName);
    table[fnKey] = memoDeps ? tableMemo({
      memoDeps,
      fn,
      fnName,
      table,
      feature
    }) : fn;
  }
}
function assignPrototypeAPIs(feature, prototype, table, apis) {
  for (const [staticFnName, { fn, memoDeps }] of Object.entries(apis)) {
    const { fnKey, fnName } = getFunctionNameInfo(staticFnName);
    if (memoDeps) {
      const memoKey = `_memo_${fnKey}`;
      prototype[fnKey] = function(...args) {
        if (!this[memoKey]) {
          const self = this;
          this[memoKey] = tableMemo({
            memoDeps: (depArgs) => memoDeps(self, depArgs),
            fn: (...deps) => fn(self, ...deps),
            fnName,
            objectId: self.id,
            table,
            feature
          });
        }
        return this[memoKey](...args);
      };
    } else prototype[fnKey] = function(...args) {
      return fn(this, ...args);
    };
  }
}
function callMemoOrStaticFn(obj, fnKey, staticFn, ...args) {
  return obj[fnKey]?.(...args) ?? staticFn(obj, ...args);
}

// node_modules/@tanstack/table-core/dist/core/cells/coreCellsFeature.utils.js
function cell_getValue(cell) {
  return cell.row.getValue(cell.column.id);
}
function cell_renderValue(cell) {
  return cell.getValue() ?? cell.table.options.renderFallbackValue;
}
function cell_getContext(cell) {
  return {
    table: cell.table,
    column: cell.column,
    row: cell.row,
    cell,
    getValue: () => cell.getValue(),
    renderValue: () => cell.renderValue()
  };
}

// node_modules/@tanstack/table-core/dist/core/cells/coreCellsFeature.js
var coreCellsFeature = { assignCellPrototype: (prototype, table) => {
  assignPrototypeAPIs("coreCellsFeature", prototype, table, {
    cell_getValue: { fn: (cell) => cell_getValue(cell) },
    cell_renderValue: { fn: (cell) => cell_renderValue(cell) },
    cell_getContext: {
      fn: (cell) => cell_getContext(cell),
      memoDeps: (cell) => [cell]
    }
  });
} };

// node_modules/@tanstack/table-core/dist/core/headers/constructHeader.js
function getHeaderPrototype(table) {
  if (!table._headerPrototype) {
    table._headerPrototype = { table };
    const features = Object.values(table._features);
    for (let i = 0; i < features.length; i++) features[i].assignHeaderPrototype?.(table._headerPrototype, table);
  }
  return table._headerPrototype;
}
function constructHeader(table, column, options) {
  const headerPrototype = getHeaderPrototype(table);
  const header = Object.create(headerPrototype);
  header.colSpan = 0;
  header.column = column;
  header.depth = options.depth;
  header.headerGroup = null;
  header.id = options.id ?? column.id;
  header.index = options.index;
  header.isPlaceholder = !!options.isPlaceholder;
  header.placeholderId = options.placeholderId;
  header.rowSpan = 0;
  header.subHeaders = [];
  const initFns = table._headerInstanceInitFns;
  for (let i = 0; i < initFns.length; i++) initFns[i](header);
  return header;
}

// node_modules/@tanstack/table-core/dist/features/column-pinning/columnPinningFeature.utils.js
function getDefaultColumnPinningState() {
  return {
    start: [],
    end: []
  };
}
function column_pin(column, position) {
  const leafColumns = column.getLeafColumns();
  const columnIds = [];
  for (let i = 0; i < leafColumns.length; i++) {
    const id = leafColumns[i].id;
    if (id) columnIds.push(id);
  }
  table_setColumnPinning(column.table, (old) => {
    if (position === "end") return {
      start: old.start.filter((d) => !columnIds.includes(d)),
      end: [...old.end.filter((d) => !columnIds.includes(d)), ...columnIds]
    };
    if (position === "start") return {
      start: [...old.start.filter((d) => !columnIds.includes(d)), ...columnIds],
      end: old.end.filter((d) => !columnIds.includes(d))
    };
    return {
      start: old.start.filter((d) => !columnIds.includes(d)),
      end: old.end.filter((d) => !columnIds.includes(d))
    };
  });
}
function column_getCanPin(column) {
  return column.getLeafColumns().some((leafColumn) => (leafColumn.columnDef.enablePinning ?? true) && (column.table.options.enableColumnPinning ?? true));
}
function column_getIsPinned(column) {
  const leafColumns = column.getLeafColumns();
  const { start, end } = column.table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState();
  for (let i = 0; i < leafColumns.length; i++) if (start.includes(leafColumns[i].id)) return "start";
  for (let i = 0; i < leafColumns.length; i++) if (end.includes(leafColumns[i].id)) return "end";
  return false;
}
function column_getPinnedIndex(column) {
  const position = column_getIsPinned(column);
  return position ? column.table.atoms.columnPinning?.get()?.[position].indexOf(column.id) ?? -1 : 0;
}
function row_getCenterVisibleCells(row) {
  const allCells = callMemoOrStaticFn(row, "getVisibleCells", row_getVisibleCells);
  const { start, end } = row.table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState();
  if (!start.length && !end.length) return allCells;
  const startAndEnd = [...start, ...end];
  return allCells.filter((d) => !startAndEnd.includes(d.column.id));
}
function row_getStartVisibleCells(row) {
  const { start } = row.table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState();
  if (!start.length) return [];
  const allVisibleCells = callMemoOrStaticFn(row, "getVisibleCellsByColumnId", row_getVisibleCellsByColumnId);
  const cells = [];
  for (let i = 0; i < start.length; i++) {
    const cell = allVisibleCells[start[i]];
    if (cell) {
      cell.position = "start";
      cells.push(cell);
    }
  }
  return cells;
}
function row_getEndVisibleCells(row) {
  const { end } = row.table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState();
  if (!end.length) return [];
  const allVisibleCells = callMemoOrStaticFn(row, "getVisibleCellsByColumnId", row_getVisibleCellsByColumnId);
  const cells = [];
  for (let i = 0; i < end.length; i++) {
    const cell = allVisibleCells[end[i]];
    if (cell) {
      cell.position = "end";
      cells.push(cell);
    }
  }
  return cells;
}
function table_setColumnPinning(table, updater) {
  setStateSlice(table, "columnPinning", updater);
}
function table_resetColumnPinning(table, defaultState) {
  table_setColumnPinning(table, defaultState ? getDefaultColumnPinningState() : cloneState(table.initialState.columnPinning ?? getDefaultColumnPinningState()));
}
function table_getIsSomeColumnsPinned(table, position) {
  const pinningState = table.atoms.columnPinning?.get();
  if (!position) return Boolean(pinningState?.start.length || pinningState?.end.length);
  return Boolean(pinningState?.[position].length);
}
function table_getStartHeaderGroups(table) {
  const allColumns = table.getAllColumns();
  const leafColumnsById = table.getAllLeafColumnsById();
  const { start } = table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState();
  const orderedLeafColumns = [];
  for (let i = 0; i < start.length; i++) {
    const column = leafColumnsById[start[i]];
    if (column && callMemoOrStaticFn(column, "getIsVisible", column_getIsVisible)) orderedLeafColumns.push(column);
  }
  return buildHeaderGroups(allColumns, orderedLeafColumns, table, "start");
}
function table_getEndHeaderGroups(table) {
  const allColumns = table.getAllColumns();
  const leafColumnsById = table.getAllLeafColumnsById();
  const { end } = table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState();
  const orderedLeafColumns = [];
  for (let i = 0; i < end.length; i++) {
    const column = leafColumnsById[end[i]];
    if (column && callMemoOrStaticFn(column, "getIsVisible", column_getIsVisible)) orderedLeafColumns.push(column);
  }
  return buildHeaderGroups(allColumns, orderedLeafColumns, table, "end");
}
function table_getCenterHeaderGroups(table) {
  const allColumns = table.getAllColumns();
  let leafColumns = callMemoOrStaticFn(table, "getVisibleLeafColumns", table_getVisibleLeafColumns);
  const { start, end } = table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState();
  if (start.length || end.length) {
    const startAndEnd = [...start, ...end];
    leafColumns = leafColumns.filter((column) => !startAndEnd.includes(column.id));
  }
  return buildHeaderGroups(allColumns, leafColumns, table, "center");
}
function table_getStartFooterGroups(table) {
  return [...callMemoOrStaticFn(table, "getStartHeaderGroups", table_getStartHeaderGroups)].reverse();
}
function table_getEndFooterGroups(table) {
  return [...callMemoOrStaticFn(table, "getEndHeaderGroups", table_getEndHeaderGroups)].reverse();
}
function table_getCenterFooterGroups(table) {
  return [...callMemoOrStaticFn(table, "getCenterHeaderGroups", table_getCenterHeaderGroups)].reverse();
}
function table_getStartFlatHeaders(table) {
  const leftHeaderGroups = callMemoOrStaticFn(table, "getStartHeaderGroups", table_getStartHeaderGroups);
  const result = [];
  for (let i = 0; i < leftHeaderGroups.length; i++) {
    const headers = leftHeaderGroups[i].headers;
    for (let j = 0; j < headers.length; j++) result.push(headers[j]);
  }
  return result;
}
function table_getEndFlatHeaders(table) {
  const rightHeaderGroups = callMemoOrStaticFn(table, "getEndHeaderGroups", table_getEndHeaderGroups);
  const result = [];
  for (let i = 0; i < rightHeaderGroups.length; i++) {
    const headers = rightHeaderGroups[i].headers;
    for (let j = 0; j < headers.length; j++) result.push(headers[j]);
  }
  return result;
}
function table_getCenterFlatHeaders(table) {
  const centerHeaderGroups = callMemoOrStaticFn(table, "getCenterHeaderGroups", table_getCenterHeaderGroups);
  const result = [];
  for (let i = 0; i < centerHeaderGroups.length; i++) {
    const headers = centerHeaderGroups[i].headers;
    for (let j = 0; j < headers.length; j++) result.push(headers[j]);
  }
  return result;
}
function table_getStartLeafHeaders(table) {
  return callMemoOrStaticFn(table, "getStartFlatHeaders", table_getStartFlatHeaders).filter((header) => !header.subHeaders.length);
}
function table_getEndLeafHeaders(table) {
  return callMemoOrStaticFn(table, "getEndFlatHeaders", table_getEndFlatHeaders).filter((header) => !header.subHeaders.length);
}
function table_getCenterLeafHeaders(table) {
  return callMemoOrStaticFn(table, "getCenterFlatHeaders", table_getCenterFlatHeaders).filter((header) => !header.subHeaders.length);
}
function table_getStartLeafColumns(table) {
  const { start } = table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState();
  const leafColumnsById = table.getAllLeafColumnsById();
  const result = [];
  for (let i = 0; i < start.length; i++) {
    const column = leafColumnsById[start[i]];
    if (column) result.push(column);
  }
  return result;
}
function table_getEndLeafColumns(table) {
  const { end } = table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState();
  const leafColumnsById = table.getAllLeafColumnsById();
  const result = [];
  for (let i = 0; i < end.length; i++) {
    const column = leafColumnsById[end[i]];
    if (column) result.push(column);
  }
  return result;
}
function table_getCenterLeafColumns(table) {
  const { start, end } = table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState();
  if (!start.length && !end.length) return table.getAllLeafColumns();
  const startAndEnd = [...start, ...end];
  return table.getAllLeafColumns().filter((d) => !startAndEnd.includes(d.id));
}
function table_getPinnedLeafColumns(table, position) {
  return !position ? table.getAllLeafColumns() : position === "start" ? callMemoOrStaticFn(table, "getStartLeafColumns", table_getStartLeafColumns) : position === "end" ? callMemoOrStaticFn(table, "getEndLeafColumns", table_getEndLeafColumns) : callMemoOrStaticFn(table, "getCenterLeafColumns", table_getCenterLeafColumns);
}
function table_getStartVisibleLeafColumns(table) {
  return callMemoOrStaticFn(table, "getStartLeafColumns", table_getStartLeafColumns).filter((column) => callMemoOrStaticFn(column, "getIsVisible", column_getIsVisible));
}
function table_getEndVisibleLeafColumns(table) {
  return callMemoOrStaticFn(table, "getEndLeafColumns", table_getEndLeafColumns).filter((column) => callMemoOrStaticFn(column, "getIsVisible", column_getIsVisible));
}
function table_getCenterVisibleLeafColumns(table) {
  return callMemoOrStaticFn(table, "getCenterLeafColumns", table_getCenterLeafColumns).filter((column) => callMemoOrStaticFn(column, "getIsVisible", column_getIsVisible));
}
function table_getPinnedVisibleLeafColumns(table, position) {
  return !position ? callMemoOrStaticFn(table, "getVisibleLeafColumns", table_getVisibleLeafColumns) : position === "start" ? callMemoOrStaticFn(table, "getStartVisibleLeafColumns", table_getStartVisibleLeafColumns) : position === "end" ? callMemoOrStaticFn(table, "getEndVisibleLeafColumns", table_getEndVisibleLeafColumns) : callMemoOrStaticFn(table, "getCenterVisibleLeafColumns", table_getCenterVisibleLeafColumns);
}

// node_modules/@tanstack/table-core/dist/features/column-visibility/columnVisibilityFeature.utils.js
function getDefaultColumnVisibilityState() {
  return makeObjectMap();
}
function column_toggleVisibility(column, visible) {
  if (column_getCanHide(column)) table_setColumnVisibility(column.table, (old) => {
    const next = Object.assign(makeObjectMap(), old);
    const nextVisible = visible ?? !callMemoOrStaticFn(column, "getIsVisible", column_getIsVisible);
    const leafColumns = column.getLeafColumns();
    for (let i = 0; i < leafColumns.length; i++) {
      const leafColumn = leafColumns[i];
      if (column_getCanHide(leafColumn)) next[leafColumn.id] = nextVisible;
    }
    return next;
  });
}
function column_getIsVisible(column) {
  const columnVisibility = column.table.atoms.columnVisibility?.get();
  if (!columnVisibility) return true;
  const childColumns = column.columns;
  if (childColumns.length) return childColumns.some((childColumn) => callMemoOrStaticFn(childColumn, "getIsVisible", column_getIsVisible));
  return (hasOwn(columnVisibility, column.id) ? columnVisibility[column.id] : void 0) ?? true;
}
function column_getCanHide(column) {
  return (column.columnDef.enableHiding ?? true) && (column.table.options.enableHiding ?? true);
}
function column_getToggleVisibilityHandler(column) {
  return (e) => {
    column_toggleVisibility(column, e.target.checked);
  };
}
function row_getVisibleCells(row) {
  const allCells = row.getAllCells();
  const visibleCells = [];
  for (let i = 0; i < allCells.length; i++) {
    const cell = allCells[i];
    if (callMemoOrStaticFn(cell.column, "getIsVisible", column_getIsVisible)) visibleCells.push(cell);
  }
  const { start, end } = row.table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState();
  if (!start.length && !end.length) return visibleCells;
  const visibleCellsByColumnId = callMemoOrStaticFn(row, "getVisibleCellsByColumnId", row_getVisibleCellsByColumnId);
  const startCells = [];
  for (let i = 0; i < start.length; i++) {
    const cell = visibleCellsByColumnId[start[i]];
    if (cell) startCells.push(cell);
  }
  const endCells = [];
  for (let i = 0; i < end.length; i++) {
    const cell = visibleCellsByColumnId[end[i]];
    if (cell) endCells.push(cell);
  }
  const centerCells = [];
  for (let i = 0; i < visibleCells.length; i++) {
    const cell = visibleCells[i];
    const id = cell.column.id;
    if (!start.includes(id) && !end.includes(id)) centerCells.push(cell);
  }
  return [
    ...startCells,
    ...centerCells,
    ...endCells
  ];
}
function row_getVisibleCellsByColumnId(row) {
  const result = makeObjectMap();
  const allCells = row.getAllCells();
  for (let i = 0; i < allCells.length; i++) {
    const cell = allCells[i];
    if (callMemoOrStaticFn(cell.column, "getIsVisible", column_getIsVisible)) result[cell.column.id] = cell;
  }
  return result;
}
function table_getVisibleFlatColumns(table) {
  return table.getAllFlatColumns().filter((column) => callMemoOrStaticFn(column, "getIsVisible", column_getIsVisible));
}
function table_getVisibleLeafColumns(table) {
  return table.getAllLeafColumns().filter((column) => callMemoOrStaticFn(column, "getIsVisible", column_getIsVisible));
}
function table_setColumnVisibility(table, updater) {
  setStateSlice(table, "columnVisibility", updater);
}
function table_resetColumnVisibility(table, defaultState) {
  table_setColumnVisibility(table, defaultState ? makeObjectMap() : Object.assign(makeObjectMap(), cloneState(table.initialState.columnVisibility ?? {})));
}
function table_toggleAllColumnsVisible(table, value) {
  value = value ?? !table_getIsAllColumnsVisible(table);
  const visibility = makeObjectMap();
  const leafColumns = table.getAllLeafColumns();
  for (let i = 0; i < leafColumns.length; i++) {
    const column = leafColumns[i];
    visibility[column.id] = !value ? !column_getCanHide(column) : value;
  }
  table_setColumnVisibility(table, visibility);
}
function table_getIsAllColumnsVisible(table) {
  return !table.getAllLeafColumns().some((column) => !callMemoOrStaticFn(column, "getIsVisible", column_getIsVisible));
}
function table_getIsSomeColumnsVisible(table) {
  return table.getAllLeafColumns().some((column) => callMemoOrStaticFn(column, "getIsVisible", column_getIsVisible));
}
function table_getToggleAllColumnsVisibilityHandler(table) {
  return (e) => {
    table_toggleAllColumnsVisible(table, e.target.checked);
  };
}

// node_modules/@tanstack/table-core/dist/core/headers/buildHeaderGroups.js
function getMaxHeaderDepth(columns, depth = 1) {
  let maxDepth = depth;
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (callMemoOrStaticFn(column, "getIsVisible", column_getIsVisible) && column.columns.length) maxDepth = Math.max(maxDepth, getMaxHeaderDepth(column.columns, depth + 1));
  }
  return maxDepth;
}
function formatHeaderGroupId(headerFamily, depth) {
  return headerFamily ? `${headerFamily}_${depth}` : String(depth);
}
function formatHeaderId(headerFamily, depth, columnId, childHeaderId) {
  let id = headerFamily ?? "";
  if (depth) id = id ? `${id}_${depth}` : String(depth);
  if (columnId) id = id ? `${id}_${columnId}` : columnId;
  if (childHeaderId) id = id ? `${id}_${childHeaderId}` : childHeaderId;
  return id;
}
function countPendingHeadersForColumn(headers, column) {
  let count = 0;
  for (let i = 0; i < headers.length; i++) if (headers[i].column === column) count++;
  return count;
}
function constructHeaderGroup(headersToGroup, depth, table, headerFamily, headerGroups, headerGroupInitFns) {
  const headerGroup = {
    depth,
    id: formatHeaderGroupId(headerFamily, depth),
    headers: []
  };
  const pendingParentHeaders = [];
  for (let i = 0; i < headersToGroup.length; i++) {
    if (!(i in headersToGroup)) continue;
    const headerToGroup = headersToGroup[i];
    const latestPendingParentHeader = pendingParentHeaders[pendingParentHeaders.length - 1];
    const isLeafHeader = headerToGroup.column.depth === headerGroup.depth;
    let column;
    let isPlaceholder = false;
    if (isLeafHeader && headerToGroup.column.parent) column = headerToGroup.column.parent;
    else {
      column = headerToGroup.column;
      isPlaceholder = true;
    }
    if (latestPendingParentHeader && latestPendingParentHeader.column === column) latestPendingParentHeader.subHeaders.push(headerToGroup);
    else {
      const header = constructHeader(table, column, {
        id: formatHeaderId(headerFamily, depth, column.id, headerToGroup.id),
        isPlaceholder,
        placeholderId: isPlaceholder ? String(countPendingHeadersForColumn(pendingParentHeaders, column)) : void 0,
        depth,
        index: pendingParentHeaders.length
      });
      header.subHeaders.push(headerToGroup);
      pendingParentHeaders.push(header);
    }
    headerGroup.headers.push(headerToGroup);
    headerToGroup.headerGroup = headerGroup;
  }
  for (let i = 0; i < headerGroupInitFns.length; i++) headerGroupInitFns[i](headerGroup);
  headerGroups.push(headerGroup);
  if (depth > 0) constructHeaderGroup(pendingParentHeaders, depth - 1, table, headerFamily, headerGroups, headerGroupInitFns);
}
function updateHeaderSpans(headers) {
  for (let i = 0; i < headers.length; i++) {
    const header = headers[i];
    if (!callMemoOrStaticFn(header.column, "getIsVisible", column_getIsVisible)) continue;
    let colSpan = 0;
    if (header.subHeaders.length) {
      updateHeaderSpans(header.subHeaders);
      for (let j = 0; j < header.subHeaders.length; j++) {
        const child = header.subHeaders[j];
        if (!callMemoOrStaticFn(child.column, "getIsVisible", column_getIsVisible)) continue;
        colSpan += child.colSpan;
      }
    } else colSpan = 1;
    header.colSpan = colSpan;
    if (header.isPlaceholder && header.subHeaders.length === 1 && header.subHeaders[0].column === header.column) {
      let rowSpan = 1;
      let chainChild = header.subHeaders[0];
      while (chainChild) {
        chainChild.rowSpan = 0;
        rowSpan++;
        chainChild = chainChild.subHeaders.length === 1 && chainChild.subHeaders[0].column === header.column ? chainChild.subHeaders[0] : void 0;
      }
      header.rowSpan = rowSpan;
    } else header.rowSpan = 1;
  }
}
function buildHeaderGroups(allColumns, columnsToGroup, table, headerFamily) {
  const maxDepth = getMaxHeaderDepth(allColumns);
  const headerGroups = [];
  const headerGroupInitFns = table._headerGroupInstanceInitFns;
  const bottomHeaders = new Array(columnsToGroup.length);
  for (let i = 0; i < columnsToGroup.length; i++) {
    if (!(i in columnsToGroup)) continue;
    bottomHeaders[i] = constructHeader(table, columnsToGroup[i], {
      depth: maxDepth,
      index: i
    });
  }
  constructHeaderGroup(bottomHeaders, maxDepth - 1, table, headerFamily, headerGroups, headerGroupInitFns);
  headerGroups.reverse();
  updateHeaderSpans(headerGroups[0]?.headers ?? []);
  return headerGroups;
}

// node_modules/@tanstack/table-core/dist/core/columns/constructColumn.js
function getColumnPrototype(table) {
  if (!table._columnPrototype) {
    table._columnPrototype = { table };
    const features = Object.values(table._features);
    for (let i = 0; i < features.length; i++) features[i].assignColumnPrototype?.(table._columnPrototype, table);
  }
  return table._columnPrototype;
}
function constructColumn(table, columnDef, depth, parent) {
  const resolvedColumnDef = __spreadValues(__spreadValues({}, table.getDefaultColumnDef()), columnDef);
  const accessorKey = resolvedColumnDef.accessorKey;
  const accessorKeyString = accessorKey === void 0 ? void 0 : String(accessorKey);
  const id = resolvedColumnDef.id ?? accessorKeyString?.replaceAll(".", "_") ?? (typeof resolvedColumnDef.header === "string" ? resolvedColumnDef.header : void 0);
  let accessorFn;
  if (resolvedColumnDef.accessorFn) accessorFn = resolvedColumnDef.accessorFn;
  else if (accessorKey !== void 0) if (typeof accessorKey === "string" && accessorKey.includes(".")) {
    const keys = accessorKey.split(".");
    accessorFn = (originalRow) => {
      let result = originalRow;
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        result = result?.[key];
        if (result === void 0) console.warn(`"${key}" in deeply nested key "${accessorKey}" returned undefined.`);
      }
      return result;
    };
  } else accessorFn = (originalRow) => originalRow[resolvedColumnDef.accessorKey];
  if (!id) {
    if (true) throw new Error(resolvedColumnDef.accessorFn ? `coreColumnsFeature require an id when using an accessorFn` : `coreColumnsFeature require an id when using a non-string header`);
    throw new Error();
  }
  const columnPrototype = getColumnPrototype(table);
  const column = Object.create(columnPrototype);
  column.accessorFn = accessorFn;
  column.columnDef = resolvedColumnDef;
  column.columns = [];
  column.depth = depth;
  column.id = `${String(id)}`;
  column.parent = parent;
  const initFns = table._columnInstanceInitFns;
  for (let i = 0; i < initFns.length; i++) initFns[i](column);
  return column;
}

// node_modules/@tanstack/table-core/dist/features/column-ordering/columnOrderingFeature.utils.js
function getDefaultColumnOrderState() {
  return [];
}
function table_getColumnIndexes(table) {
  const buildIndexes = (columns) => {
    const indexes = makeObjectMap();
    for (let i = 0; i < columns.length; i++) indexes[columns[i].id] = i;
    return indexes;
  };
  return {
    all: buildIndexes(table_getPinnedVisibleLeafColumns(table)),
    center: buildIndexes(table_getPinnedVisibleLeafColumns(table, "center")),
    start: buildIndexes(table_getPinnedVisibleLeafColumns(table, "start")),
    end: buildIndexes(table_getPinnedVisibleLeafColumns(table, "end"))
  };
}
function column_getIndex(column, position) {
  return callMemoOrStaticFn(column.table, "getColumnIndexes", table_getColumnIndexes)[position === "start" ? "start" : position === "end" ? "end" : position === "center" ? "center" : "all"][column.id] ?? -1;
}
function column_getIsFirstColumn(column, position) {
  return table_getPinnedVisibleLeafColumns(column.table, position)[0]?.id === column.id;
}
function column_getIsLastColumn(column, position) {
  const columns = table_getPinnedVisibleLeafColumns(column.table, position);
  return columns[columns.length - 1]?.id === column.id;
}
function table_setColumnOrder(table, updater) {
  setStateSlice(table, "columnOrder", updater);
}
function table_resetColumnOrder(table, defaultState) {
  table_setColumnOrder(table, defaultState ? [] : cloneState(table.initialState.columnOrder ?? []));
}
function table_getOrderColumnsFn(table) {
  const columnOrder = table.atoms.columnOrder?.get();
  return (columns) => {
    let orderedColumns = [];
    if (!columnOrder?.length) orderedColumns = columns;
    else {
      const remaining = /* @__PURE__ */ new Map();
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        remaining.set(column.id, column);
      }
      for (let i = 0; i < columnOrder.length; i++) {
        const id = columnOrder[i];
        const column = remaining.get(id);
        if (column) {
          orderedColumns.push(column);
          remaining.delete(id);
        }
      }
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        if (remaining.has(column.id)) orderedColumns.push(column);
      }
    }
    return orderColumns(table, orderedColumns);
  };
}
function orderColumns(table, leafColumns) {
  const grouping = table.atoms.grouping?.get() ?? [];
  const { groupedColumnMode } = table.options;
  if (!grouping.length || !groupedColumnMode) return leafColumns;
  const nonGroupingColumns = leafColumns.filter((col) => !grouping.includes(col.id));
  if (groupedColumnMode === "remove") return nonGroupingColumns;
  const leafColumnsById = /* @__PURE__ */ new Map();
  for (let i = 0; i < leafColumns.length; i++) {
    const col = leafColumns[i];
    leafColumnsById.set(col.id, col);
  }
  const groupingColumns = [];
  for (let i = 0; i < grouping.length; i++) {
    const col = leafColumnsById.get(grouping[i]);
    if (col) groupingColumns.push(col);
  }
  return [...groupingColumns, ...nonGroupingColumns];
}

// node_modules/@tanstack/table-core/dist/core/columns/coreColumnsFeature.utils.js
function column_getFlatColumns(column) {
  return [column, ...column.columns.flatMap((col) => col.getFlatColumns())];
}
function column_getLeafColumns(column) {
  if (column.columns.length) {
    const leafColumns = column.columns.flatMap((col) => col.getLeafColumns());
    return callMemoOrStaticFn(column.table, "getOrderColumns", table_getOrderColumnsFn)(leafColumns);
  }
  return [column];
}
function table_getDefaultColumnDef(table) {
  return __spreadValues(__spreadValues({
    header: (props) => {
      const resolvedColumnDef = props.header.column.columnDef;
      if (resolvedColumnDef.accessorKey) return resolvedColumnDef.accessorKey;
      if (resolvedColumnDef.accessorFn) return resolvedColumnDef.id;
      return null;
    },
    cell: (props) => props.renderValue()?.toString?.() ?? null
  }, Object.values(table._features).reduce((obj, feature) => {
    return Object.assign(obj, feature.getDefaultColumnDef?.());
  }, {})), table.options.defaultColumn);
}
function constructColumns(table, columnDefs, parent, depth = 0) {
  const columns = new Array(columnDefs.length);
  for (let i = 0; i < columnDefs.length; i++) {
    if (!(i in columnDefs)) continue;
    const columnDef = columnDefs[i];
    const column = constructColumn(table, columnDef, depth, parent);
    const groupingColumnDef = columnDef;
    column.columns = groupingColumnDef.columns ? constructColumns(table, groupingColumnDef.columns, column, depth + 1) : [];
    columns[i] = column;
  }
  return columns;
}
function table_getAllColumns(table) {
  return constructColumns(table, table.options.columns);
}
function table_getAllFlatColumns(table) {
  return table.getAllColumns().flatMap((column) => column.getFlatColumns());
}
function table_getAllFlatColumnsById(table) {
  const result = makeObjectMap();
  const flatColumns = table.getAllFlatColumns();
  for (let i = 0; i < flatColumns.length; i++) {
    const column = flatColumns[i];
    result[column.id] = column;
  }
  return result;
}
function table_getAllLeafColumns(table) {
  const leafColumns = table.getAllColumns().flatMap((c) => c.getLeafColumns());
  return callMemoOrStaticFn(table, "getOrderColumns", table_getOrderColumnsFn)(leafColumns);
}
function table_getAllLeafColumnsById(table) {
  const result = makeObjectMap();
  const leafColumns = table.getAllLeafColumns();
  for (let i = 0; i < leafColumns.length; i++) {
    const column = leafColumns[i];
    result[column.id] = column;
  }
  return result;
}
function table_getColumn(table, columnId) {
  const column = table.getAllFlatColumnsById()[columnId];
  if (!column) console.warn(`[Table] Column with id '${columnId}' does not exist.`);
  return column;
}

// node_modules/@tanstack/table-core/dist/core/columns/coreColumnsFeature.js
var coreColumnsFeature = {
  assignColumnPrototype: (prototype, table) => {
    assignPrototypeAPIs("coreColumnsFeature", prototype, table, {
      column_getFlatColumns: {
        fn: (column) => column_getFlatColumns(column),
        memoDeps: (column) => [column.table.options.columns]
      },
      column_getLeafColumns: {
        fn: (column) => column_getLeafColumns(column),
        memoDeps: (column) => [
          column.table.atoms.columnOrder?.get(),
          column.table.atoms.grouping?.get(),
          column.table.options.columns,
          column.table.options.groupedColumnMode
        ]
      }
    });
  },
  constructTableAPIs: (table) => {
    assignTableAPIs("coreColumnsFeature", table, {
      table_getDefaultColumnDef: {
        fn: () => table_getDefaultColumnDef(table),
        memoDeps: () => [table.options.defaultColumn]
      },
      table_getAllColumns: {
        fn: () => table_getAllColumns(table),
        memoDeps: () => [table.options.columns]
      },
      table_getAllFlatColumns: {
        fn: () => table_getAllFlatColumns(table),
        memoDeps: () => [table.options.columns]
      },
      table_getAllFlatColumnsById: {
        fn: () => table_getAllFlatColumnsById(table),
        memoDeps: () => [table.options.columns]
      },
      table_getAllLeafColumns: {
        fn: () => table_getAllLeafColumns(table),
        memoDeps: () => [
          table.atoms.columnOrder?.get(),
          table.atoms.grouping?.get(),
          table.options.columns,
          table.options.groupedColumnMode
        ]
      },
      table_getAllLeafColumnsById: {
        fn: () => table_getAllLeafColumnsById(table),
        memoDeps: () => [table.getAllLeafColumns()]
      },
      table_getColumn: { fn: (columnId) => table_getColumn(table, columnId) }
    });
  }
};

// node_modules/@tanstack/table-core/dist/core/headers/coreHeadersFeature.utils.js
function collectLeafHeaders(header, leafHeaders) {
  for (let i = 0; i < header.subHeaders.length; i++) collectLeafHeaders(header.subHeaders[i], leafHeaders);
  leafHeaders.push(header);
}
function header_getLeafHeaders(header) {
  const leafHeaders = [];
  collectLeafHeaders(header, leafHeaders);
  return leafHeaders;
}
function header_getContext(header) {
  return {
    column: header.column,
    header,
    table: header.column.table
  };
}
function table_getHeaderGroups(table) {
  const { start, end } = table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState();
  const allColumns = table.getAllColumns();
  const leafColumns = callMemoOrStaticFn(table, "getVisibleLeafColumns", table_getVisibleLeafColumns);
  if (!start.length && !end.length) return buildHeaderGroups(allColumns, leafColumns, table);
  const leafColumnsById = table.getAllLeafColumnsById();
  const leftColumns = [];
  for (let i = 0; i < start.length; i++) {
    const column = leafColumnsById[start[i]];
    if (column && callMemoOrStaticFn(column, "getIsVisible", column_getIsVisible)) leftColumns.push(column);
  }
  const rightColumns = [];
  for (let i = 0; i < end.length; i++) {
    const column = leafColumnsById[end[i]];
    if (column && callMemoOrStaticFn(column, "getIsVisible", column_getIsVisible)) rightColumns.push(column);
  }
  const centerColumns = leafColumns.filter((column) => !start.includes(column.id) && !end.includes(column.id));
  return buildHeaderGroups(allColumns, [
    ...leftColumns,
    ...centerColumns,
    ...rightColumns
  ], table);
}
function table_getFooterGroups(table) {
  return [...table.getHeaderGroups()].reverse();
}
function table_getFlatHeaders(table) {
  const headerGroups = table.getHeaderGroups();
  const result = [];
  for (let i = 0; i < headerGroups.length; i++) {
    const headers = headerGroups[i].headers;
    for (let j = 0; j < headers.length; j++) result.push(headers[j]);
  }
  return result;
}
function table_getLeafHeaders(table) {
  const topHeaders = table.getHeaderGroups()[0]?.headers ?? [];
  const result = [];
  for (let i = 0; i < topHeaders.length; i++) {
    const leafHeaders = topHeaders[i].getLeafHeaders();
    for (let j = 0; j < leafHeaders.length; j++) result.push(leafHeaders[j]);
  }
  return result;
}

// node_modules/@tanstack/table-core/dist/core/headers/coreHeadersFeature.js
var coreHeadersFeature = {
  assignHeaderPrototype: (prototype, table) => {
    assignPrototypeAPIs("coreHeadersFeature", prototype, table, {
      header_getLeafHeaders: {
        fn: (header) => header_getLeafHeaders(header),
        memoDeps: (header) => [header.column.table.options.columns]
      },
      header_getContext: {
        fn: (header) => header_getContext(header),
        memoDeps: (header) => [header.column.table.options.columns]
      }
    });
  },
  constructTableAPIs: (table) => {
    assignTableAPIs("coreHeadersFeature", table, {
      table_getHeaderGroups: {
        fn: () => table_getHeaderGroups(table),
        memoDeps: () => [
          table.options.columns,
          table.atoms.columnOrder?.get(),
          table.atoms.grouping?.get(),
          table.atoms.columnPinning?.get(),
          table.atoms.columnVisibility?.get(),
          table.options.groupedColumnMode
        ]
      },
      table_getFooterGroups: {
        fn: () => table_getFooterGroups(table),
        memoDeps: () => [table.getHeaderGroups()]
      },
      table_getFlatHeaders: {
        fn: () => table_getFlatHeaders(table),
        memoDeps: () => [table.getHeaderGroups()]
      },
      table_getLeafHeaders: {
        fn: () => table_getLeafHeaders(table),
        memoDeps: () => [table.getHeaderGroups()]
      }
    });
  }
};

// node_modules/@tanstack/table-core/dist/core/rows/constructRow.js
function getRowPrototype(table) {
  if (!table._rowPrototype) {
    table._rowPrototype = { table };
    const features = Object.values(table._features);
    for (let i = 0; i < features.length; i++) features[i].assignRowPrototype?.(table._rowPrototype, table);
  }
  return table._rowPrototype;
}
var constructRow = (table, id, original, rowIndex, depth, subRows, parentId) => {
  const rowPrototype = getRowPrototype(table);
  const row = Object.create(rowPrototype);
  row._displayIndexCache = -1;
  row._uniqueValuesCache = makeObjectMap();
  row._valuesCache = makeObjectMap();
  row.depth = depth;
  row.id = id;
  row.index = rowIndex;
  row.original = original;
  row.parentId = parentId;
  row.subRows = subRows ?? [];
  const initFns = table._rowInstanceInitFns;
  for (let i = 0; i < initFns.length; i++) initFns[i](row);
  return row;
};

// node_modules/@tanstack/table-core/dist/features/row-sorting/sortFns.js
var reSplitAlphaNumeric = /([0-9]+)/gm;
function constructSortFn(def) {
  const sortFn = Object.assign((rowA, rowB, columnId) => {
    let dataValueA = rowA.getValue(columnId);
    let dataValueB = rowB.getValue(columnId);
    const resolveDataValue = sortFn.resolveDataValue;
    if (resolveDataValue) {
      dataValueA = resolveDataValue(dataValueA);
      dataValueB = resolveDataValue(dataValueB);
    }
    return sortFn.sort(dataValueA, dataValueB, rowA, rowB, columnId);
  }, def);
  return sortFn;
}
var sortFn_alphanumeric = constructSortFn({
  resolveDataValue: (dataValue) => toString(dataValue).toLowerCase(),
  sort: (dataValueA, dataValueB) => compareAlphanumeric(dataValueA, dataValueB)
});
var sortFn_alphanumericCaseSensitive = constructSortFn({
  resolveDataValue: (dataValue) => toString(dataValue),
  sort: (dataValueA, dataValueB) => compareAlphanumeric(dataValueA, dataValueB)
});
var sortFn_text = constructSortFn({
  resolveDataValue: (dataValue) => toString(dataValue).toLowerCase(),
  sort: (dataValueA, dataValueB) => compareBasic(dataValueA, dataValueB)
});
var sortFn_textCaseSensitive = constructSortFn({
  resolveDataValue: (dataValue) => toString(dataValue),
  sort: (dataValueA, dataValueB) => compareBasic(dataValueA, dataValueB)
});
var sortFn_datetime = constructSortFn({
  resolveDataValue: (dataValue) => toDateSortValue(dataValue),
  sort: (dataValueA, dataValueB) => dataValueA > dataValueB ? 1 : dataValueA < dataValueB ? -1 : 0
});
var sortFn_basic = constructSortFn({ sort: (dataValueA, dataValueB) => compareBasic(dataValueA, dataValueB) });
function compareBasic(a, b) {
  return a === b ? 0 : a > b ? 1 : -1;
}
function toDateSortValue(value) {
  return value instanceof Date ? value.getTime() : value;
}
function toString(a) {
  if (typeof a === "number") {
    if (isNaN(a) || a === Infinity || a === -Infinity) return "";
    return String(a);
  }
  if (typeof a === "string") return a;
  return "";
}
function compareAlphanumeric(aStr, bStr) {
  let ai = 0;
  let bi = 0;
  const aLen = aStr.length;
  const bLen = bStr.length;
  while (ai < aLen && bi < bLen) {
    const aIsNumeric = isDigit(aStr.charCodeAt(ai));
    const bIsNumeric = isDigit(bStr.charCodeAt(bi));
    const aEnd = findChunkEnd(aStr, ai, aIsNumeric);
    const bEnd = findChunkEnd(bStr, bi, bIsNumeric);
    if (!aIsNumeric && !bIsNumeric) {
      const stringComparison = compareStringChunks(aStr, ai, aEnd, bStr, bi, bEnd);
      if (stringComparison) return stringComparison;
      ai = aEnd;
      bi = bEnd;
      continue;
    }
    if (aIsNumeric !== bIsNumeric) return aIsNumeric ? 1 : -1;
    const numericComparison = compareNumericChunks(aStr, ai, aEnd, bStr, bi, bEnd);
    if (numericComparison) return numericComparison;
    ai = aEnd;
    bi = bEnd;
  }
  return countRemainingChunks(aStr, ai) - countRemainingChunks(bStr, bi);
}
function isDigit(charCode) {
  return charCode >= 48 && charCode <= 57;
}
function findChunkEnd(str, start, isNumeric) {
  let end = start + 1;
  while (end < str.length && isDigit(str.charCodeAt(end)) === isNumeric) end++;
  return end;
}
function compareStringChunks(aStr, aStart, aEnd, bStr, bStart, bEnd) {
  const aLength = aEnd - aStart;
  const bLength = bEnd - bStart;
  const minLength = aLength < bLength ? aLength : bLength;
  for (let i = 0; i < minLength; i++) {
    const aCode = aStr.charCodeAt(aStart + i);
    const bCode = bStr.charCodeAt(bStart + i);
    if (aCode > bCode) return 1;
    if (bCode > aCode) return -1;
  }
  if (aLength > bLength) return 1;
  if (bLength > aLength) return -1;
  return 0;
}
function compareNumericChunks(aStr, aStart, aEnd, bStr, bStart, bEnd) {
  let aSignificantStart = aStart;
  while (aSignificantStart < aEnd && aStr.charCodeAt(aSignificantStart) === 48) aSignificantStart++;
  let bSignificantStart = bStart;
  while (bSignificantStart < bEnd && bStr.charCodeAt(bSignificantStart) === 48) bSignificantStart++;
  const aSignificantLength = aEnd - aSignificantStart;
  const bSignificantLength = bEnd - bSignificantStart;
  if (aSignificantLength === 0 && bSignificantLength === 0) return 0;
  if (aSignificantLength <= 15 && bSignificantLength <= 15) {
    const an2 = parseSmallInt(aStr, aSignificantStart, aEnd);
    const bn2 = parseSmallInt(bStr, bSignificantStart, bEnd);
    if (an2 > bn2) return 1;
    if (bn2 > an2) return -1;
    return 0;
  }
  const an = parseInt(aStr.slice(aStart, aEnd), 10);
  const bn = parseInt(bStr.slice(bStart, bEnd), 10);
  if (an > bn) return 1;
  if (bn > an) return -1;
  return 0;
}
function parseSmallInt(str, start, end) {
  let result = 0;
  for (let i = start; i < end; i++) result = result * 10 + str.charCodeAt(i) - 48;
  return result;
}
function countRemainingChunks(str, start) {
  let count = 0;
  let index = start;
  while (index < str.length) {
    count++;
    index = findChunkEnd(str, index, isDigit(str.charCodeAt(index)));
  }
  return count;
}
var sortFns = {
  alphanumeric: sortFn_alphanumeric,
  alphanumericCaseSensitive: sortFn_alphanumericCaseSensitive,
  basic: sortFn_basic,
  datetime: sortFn_datetime,
  text: sortFn_text,
  textCaseSensitive: sortFn_textCaseSensitive
};

// node_modules/@tanstack/table-core/dist/features/cell-selection/cellSelectionGeometry.js
function compareBounds(a, b) {
  return a.minRowIndex - b.minRowIndex || a.minColumnIndex - b.minColumnIndex || a.maxRowIndex - b.maxRowIndex || a.maxColumnIndex - b.maxColumnIndex;
}
function intersectCellSelectionBounds(a, b) {
  const intersection = {
    minRowIndex: Math.max(a.minRowIndex, b.minRowIndex),
    maxRowIndex: Math.min(a.maxRowIndex, b.maxRowIndex),
    minColumnIndex: Math.max(a.minColumnIndex, b.minColumnIndex),
    maxColumnIndex: Math.min(a.maxColumnIndex, b.maxColumnIndex)
  };
  return intersection.minRowIndex <= intersection.maxRowIndex && intersection.minColumnIndex <= intersection.maxColumnIndex ? intersection : void 0;
}
function subtractCellSelectionBounds(source, excluded) {
  const intersection = intersectCellSelectionBounds(source, excluded);
  if (!intersection) return [source];
  const result = [];
  if (source.minRowIndex < intersection.minRowIndex) result.push(__spreadProps(__spreadValues({}, source), {
    maxRowIndex: intersection.minRowIndex - 1
  }));
  if (intersection.maxRowIndex < source.maxRowIndex) result.push(__spreadProps(__spreadValues({}, source), {
    minRowIndex: intersection.maxRowIndex + 1
  }));
  if (source.minColumnIndex < intersection.minColumnIndex) result.push({
    minRowIndex: intersection.minRowIndex,
    maxRowIndex: intersection.maxRowIndex,
    minColumnIndex: source.minColumnIndex,
    maxColumnIndex: intersection.minColumnIndex - 1
  });
  if (intersection.maxColumnIndex < source.maxColumnIndex) result.push({
    minRowIndex: intersection.minRowIndex,
    maxRowIndex: intersection.maxRowIndex,
    minColumnIndex: intersection.maxColumnIndex + 1,
    maxColumnIndex: source.maxColumnIndex
  });
  return result;
}
function mergePair(a, b) {
  if (a.minRowIndex === b.minRowIndex && a.maxRowIndex === b.maxRowIndex && (a.maxColumnIndex + 1 === b.minColumnIndex || b.maxColumnIndex + 1 === a.minColumnIndex)) return {
    minRowIndex: a.minRowIndex,
    maxRowIndex: a.maxRowIndex,
    minColumnIndex: Math.min(a.minColumnIndex, b.minColumnIndex),
    maxColumnIndex: Math.max(a.maxColumnIndex, b.maxColumnIndex)
  };
  if (a.minColumnIndex === b.minColumnIndex && a.maxColumnIndex === b.maxColumnIndex && (a.maxRowIndex + 1 === b.minRowIndex || b.maxRowIndex + 1 === a.minRowIndex)) return {
    minRowIndex: Math.min(a.minRowIndex, b.minRowIndex),
    maxRowIndex: Math.max(a.maxRowIndex, b.maxRowIndex),
    minColumnIndex: a.minColumnIndex,
    maxColumnIndex: a.maxColumnIndex
  };
}
function mergeAdjacentCellSelectionBounds(input2) {
  const result = input2.slice();
  for (let i = 0; i < result.length; i++) for (let j = i + 1; j < result.length; j++) {
    const merged = mergePair(result[i], result[j]);
    if (!merged) continue;
    result.splice(j, 1);
    result[i] = merged;
    i = -1;
    break;
  }
  return result.sort(compareBounds);
}
function addCellSelectionBounds(selected, included) {
  let fragments = [included];
  for (const existing of selected) {
    fragments = fragments.flatMap((fragment) => subtractCellSelectionBounds(fragment, existing));
    if (!fragments.length) return selected.slice();
  }
  return mergeAdjacentCellSelectionBounds([...selected, ...fragments]);
}
function expandCellSelectionBounds(bounds, merges) {
  let expanded = bounds;
  let changed = true;
  while (changed) {
    changed = false;
    for (const merge of merges) {
      if (!intersectCellSelectionBounds(expanded, merge)) continue;
      const union = {
        minRowIndex: Math.min(expanded.minRowIndex, merge.minRowIndex),
        maxRowIndex: Math.max(expanded.maxRowIndex, merge.maxRowIndex),
        minColumnIndex: Math.min(expanded.minColumnIndex, merge.minColumnIndex),
        maxColumnIndex: Math.max(expanded.maxColumnIndex, merge.maxColumnIndex)
      };
      if (union.minRowIndex !== expanded.minRowIndex || union.maxRowIndex !== expanded.maxRowIndex || union.minColumnIndex !== expanded.minColumnIndex || union.maxColumnIndex !== expanded.maxColumnIndex) {
        expanded = union;
        changed = true;
      }
    }
  }
  return expanded;
}
function applyCellSelectionBoundsOperations(operations) {
  let selected = [];
  for (const operation of operations) {
    const bounds = {
      minRowIndex: operation.minRowIndex,
      maxRowIndex: operation.maxRowIndex,
      minColumnIndex: operation.minColumnIndex,
      maxColumnIndex: operation.maxColumnIndex
    };
    if (operation.operation === "exclude") selected = mergeAdjacentCellSelectionBounds(selected.flatMap((bound) => subtractCellSelectionBounds(bound, bounds)));
    else selected = addCellSelectionBounds(selected, bounds);
  }
  return selected.sort(compareBounds);
}

// node_modules/@tanstack/table-core/dist/features/cell-selection/cellSelectionFeature.utils.js
function getDefaultCellSelectionState() {
  return [];
}
function table_setCellSelection(table, updater) {
  table.options.onCellSelectionChange?.(updater);
}
function table_resetCellSelection(table, defaultState) {
  setStateSlice(table, "cellSelection", defaultState ? getDefaultCellSelectionState() : cloneState(table.initialState.cellSelection) ?? getDefaultCellSelectionState());
}
function table_autoResetCellSelection(table) {
  if (!table.atoms.cellSelection) return;
  if (table.options.autoResetAll ?? table.options.autoResetCellSelection ?? true) table._reactivity.schedule(() => table_resetCellSelection(table));
}
function getDisplayOrderedColumns(table) {
  const columns = callMemoOrStaticFn(table, "getVisibleLeafColumns", table_getVisibleLeafColumns);
  const pinning = table.atoms.columnPinning?.get();
  if (!pinning || !pinning.start.length && !pinning.end.length) return columns;
  const byId = makeObjectMap();
  for (let i = 0; i < columns.length; i++) byId[columns[i].id] = columns[i];
  const start = [];
  for (let i = 0; i < pinning.start.length; i++) {
    const column = byId[pinning.start[i]];
    if (column) start.push(column);
  }
  const end = [];
  for (let i = 0; i < pinning.end.length; i++) {
    const column = byId[pinning.end[i]];
    if (column) end.push(column);
  }
  const center = [];
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (!pinning.start.includes(column.id) && !pinning.end.includes(column.id)) center.push(column);
  }
  return [
    ...start,
    ...center,
    ...end
  ];
}
function table_getCellSelectionColumnIndexes(table) {
  const columns = getDisplayOrderedColumns(table);
  const indexes = makeObjectMap();
  for (let i = 0; i < columns.length; i++) indexes[columns[i].id] = i;
  return indexes;
}
var EMPTY_MERGE_BOUNDS = [];
function probeCellSpanIndex(table) {
  return table.getCellSpanIndex?.();
}
function table_getCellSelectionMergeBounds(table) {
  const spanIndex = probeCellSpanIndex(table);
  if (!spanIndex) return EMPTY_MERGE_BOUNDS;
  const columnIndexes = callMemoOrStaticFn(table, "getCellSelectionColumnIndexes", table_getCellSelectionColumnIndexes);
  const merges = [];
  for (const columnId in spanIndex.rowSpans) {
    const columnIndex = columnIndexes[columnId];
    if (columnIndex === void 0) continue;
    const spans = spanIndex.rowSpans[columnId];
    const spanColumnIndex = spanIndex.columnIndexes[columnId];
    for (let r = 0; r < spans.length; r++) {
      const span = spans[r];
      if (span <= 1) continue;
      const startRow = spanIndex.rows[r].getDisplayIndex();
      const endRow = spanIndex.rows[r + span - 1].getDisplayIndex();
      if (startRow < 0 || endRow - startRow !== span - 1) continue;
      const colSpan = spanColumnIndex === void 0 ? 1 : Math.max(spanIndex.colSpans[r]?.[spanColumnIndex] ?? 1, 1);
      merges.push({
        minRowIndex: startRow,
        maxRowIndex: endRow,
        minColumnIndex: columnIndex,
        maxColumnIndex: columnIndex + colSpan - 1
      });
    }
  }
  if (spanIndex.colSpans.length) {
    const columnIdBySpanIndex = [];
    for (const columnId in spanIndex.columnIndexes) columnIdBySpanIndex[spanIndex.columnIndexes[columnId]] = columnId;
    for (let r = 0; r < spanIndex.colSpans.length; r++) {
      const rowColSpans = spanIndex.colSpans[r];
      if (!rowColSpans) continue;
      const displayRow = spanIndex.rows[r]?.getDisplayIndex() ?? -1;
      if (displayRow < 0) continue;
      for (let c = 0; c < rowColSpans.length; c++) {
        const span = rowColSpans[c];
        if (span <= 1) continue;
        const columnId = columnIdBySpanIndex[c];
        if (columnId === void 0) continue;
        const vertical = spanIndex.rowSpans[columnId];
        if (vertical && vertical[r] !== 1) continue;
        const columnIndex = columnIndexes[columnId];
        if (columnIndex === void 0) continue;
        merges.push({
          minRowIndex: displayRow,
          maxRowIndex: displayRow,
          minColumnIndex: columnIndex,
          maxColumnIndex: columnIndex + span - 1
        });
      }
    }
  }
  return merges;
}
function findMergeBoundsAt(merges, rowIndex, columnIndex) {
  for (let i = 0; i < merges.length; i++) {
    const merge = merges[i];
    if (rowIndex >= merge.minRowIndex && rowIndex <= merge.maxRowIndex && columnIndex >= merge.minColumnIndex && columnIndex <= merge.maxColumnIndex) return merge;
  }
}
function resolveRowIndex(table, rows, rowId) {
  const row = table.getPrePaginatedRowModel().rowsById[rowId] ?? table.getCoreRowModel().rowsById[rowId];
  if (!row) return -1;
  const index = row.getDisplayIndex();
  if (index < 0 || index >= rows.length || rows[index]?.id !== rowId) return -1;
  return index;
}
function table_getCellSelectionBounds(table) {
  const ranges = table.atoms.cellSelection?.get();
  if (!ranges?.length) return [];
  const rows = table.getRowsInDisplayOrder();
  const columnIndexes = callMemoOrStaticFn(table, "getCellSelectionColumnIndexes", table_getCellSelectionColumnIndexes);
  const operations = [];
  for (let i = 0; i < ranges.length; i++) {
    const range = ranges[i];
    const anchorRowIndex = resolveRowIndex(table, rows, range.anchorRowId);
    const focusRowIndex = resolveRowIndex(table, rows, range.focusRowId);
    const anchorColumnIndex = columnIndexes[range.anchorColumnId] ?? -1;
    const focusColumnIndex = columnIndexes[range.focusColumnId] ?? -1;
    if (anchorRowIndex < 0 || focusRowIndex < 0 || anchorColumnIndex < 0 || focusColumnIndex < 0) continue;
    operations.push({
      minRowIndex: Math.min(anchorRowIndex, focusRowIndex),
      maxRowIndex: Math.max(anchorRowIndex, focusRowIndex),
      minColumnIndex: Math.min(anchorColumnIndex, focusColumnIndex),
      maxColumnIndex: Math.max(anchorColumnIndex, focusColumnIndex),
      operation: range.operation ?? "include"
    });
  }
  const merges = callMemoOrStaticFn(table, "getCellSelectionMergeBounds", table_getCellSelectionMergeBounds);
  if (merges.length) for (let i = 0; i < operations.length; i++) {
    const operation = operations[i];
    const expanded = expandCellSelectionBounds(operation, merges);
    operation.minRowIndex = expanded.minRowIndex;
    operation.maxRowIndex = expanded.maxRowIndex;
    operation.minColumnIndex = expanded.minColumnIndex;
    operation.maxColumnIndex = expanded.maxColumnIndex;
  }
  return applyCellSelectionBoundsOperations(operations);
}
function isWithinBounds(bounds, rowIndex, columnIndex) {
  for (let i = 0; i < bounds.length; i++) {
    const bound = bounds[i];
    if (rowIndex >= bound.minRowIndex && rowIndex <= bound.maxRowIndex && columnIndex >= bound.minColumnIndex && columnIndex <= bound.maxColumnIndex) return true;
  }
  return false;
}
function cell_getCanSelect(cell) {
  if (cell.column.columnDef.enableCellSelection === false) return false;
  const enabled = cell.table.options.enableCellSelection;
  if (typeof enabled === "function") return enabled(cell);
  return enabled ?? true;
}
function resolveCellPosition(cell) {
  const table = cell.table;
  const bounds = callMemoOrStaticFn(table, "getCellSelectionBounds", table_getCellSelectionBounds);
  if (!bounds.length) return null;
  if (!callMemoOrStaticFn(cell, "getCanSelect", cell_getCanSelect)) return null;
  const rowIndex = cell.row.getDisplayIndex();
  if (rowIndex < 0) return null;
  const columnIndex = callMemoOrStaticFn(table, "getCellSelectionColumnIndexes", table_getCellSelectionColumnIndexes)[cell.column.id] ?? -1;
  if (columnIndex < 0) return null;
  return {
    bounds,
    rowIndex,
    columnIndex
  };
}
function cell_getIsSelected(cell) {
  const position = resolveCellPosition(cell);
  if (!position) return false;
  return isWithinBounds(position.bounds, position.rowIndex, position.columnIndex);
}
function cell_getIsFocused(cell) {
  const ranges = cell.table.atoms.cellSelection?.get();
  const active = ranges?.[ranges.length - 1];
  if (!active) return false;
  return active.anchorRowId === cell.row.id && active.anchorColumnId === cell.column.id;
}
function cell_getTabIndex(cell) {
  return callMemoOrStaticFn(cell, "getIsFocused", cell_getIsFocused) ? 0 : -1;
}
function cell_getSelectionEdges(cell) {
  const none = {
    top: false,
    right: false,
    bottom: false,
    left: false
  };
  const position = resolveCellPosition(cell);
  if (!position) return none;
  const { bounds, rowIndex, columnIndex } = position;
  if (!isWithinBounds(bounds, rowIndex, columnIndex)) return none;
  const merges = callMemoOrStaticFn(cell.table, "getCellSelectionMergeBounds", table_getCellSelectionMergeBounds);
  const merge = merges.length ? findMergeBoundsAt(merges, rowIndex, columnIndex) : void 0;
  if (!merge) return {
    top: !isWithinBounds(bounds, rowIndex - 1, columnIndex),
    right: !isWithinBounds(bounds, rowIndex, columnIndex + 1),
    bottom: !isWithinBounds(bounds, rowIndex + 1, columnIndex),
    left: !isWithinBounds(bounds, rowIndex, columnIndex - 1)
  };
  return {
    top: isStripOutside(bounds, merge.minRowIndex - 1, merge.minColumnIndex, merge.maxColumnIndex, true),
    right: isStripOutside(bounds, merge.maxColumnIndex + 1, merge.minRowIndex, merge.maxRowIndex, false),
    bottom: isStripOutside(bounds, merge.maxRowIndex + 1, merge.minColumnIndex, merge.maxColumnIndex, true),
    left: isStripOutside(bounds, merge.minColumnIndex - 1, merge.minRowIndex, merge.maxRowIndex, false)
  };
}
function isStripOutside(bounds, fixedIndex, from, to, fixedIsRow) {
  for (let i = from; i <= to; i++) if (!isWithinBounds(bounds, fixedIsRow ? fixedIndex : i, fixedIsRow ? i : fixedIndex)) return true;
  return false;
}
function table_getFocusedCell(table) {
  const ranges = table.atoms.cellSelection?.get();
  const active = ranges?.[ranges.length - 1];
  if (!active) return void 0;
  return (table.getPrePaginatedRowModel().rowsById[active.anchorRowId] ?? table.getCoreRowModel().rowsById[active.anchorRowId])?.getAllCellsByColumnId()[active.anchorColumnId];
}
function table_setFocusedCell(table, rowId, columnId) {
  table_selectCellRange(table, {
    anchorRowId: rowId,
    anchorColumnId: columnId,
    focusRowId: rowId,
    focusColumnId: columnId
  });
}
function table_selectCellRange(table, range, opts) {
  const mode = opts?.mode ?? (opts?.additive ? "include" : "replace");
  const _a = range, { operation: _operation } = _a, coordinates = __objRest(_a, ["operation"]);
  const nextRange = mode === "exclude" ? __spreadProps(__spreadValues({}, coordinates), {
    operation: "exclude"
  }) : coordinates;
  table_setCellSelection(table, (old) => mode === "replace" ? [nextRange] : [...old, nextRange]);
}
function getSelectableColumns(table) {
  const columns = getDisplayOrderedColumns(table);
  if (table.options.enableCellSelection === false) return [];
  return columns.filter((column) => column.columnDef.enableCellSelection !== false);
}
function table_selectAllCells(table) {
  const rows = table.getRowsInDisplayOrder();
  const columns = getSelectableColumns(table);
  if (!rows.length || !columns.length) return;
  table_selectCellRange(table, {
    anchorRowId: rows[0].id,
    anchorColumnId: columns[0].id,
    focusRowId: rows[rows.length - 1].id,
    focusColumnId: columns[columns.length - 1].id
  });
}
function getDirectionDelta(direction) {
  switch (direction) {
    case "up":
      return {
        rowDelta: -1,
        columnDelta: 0
      };
    case "down":
      return {
        rowDelta: 1,
        columnDelta: 0
      };
    case "left":
      return {
        rowDelta: 0,
        columnDelta: -1
      };
    default:
      return {
        rowDelta: 0,
        columnDelta: 1
      };
  }
}
function stepCoordinate(table, rowId, columnId, direction) {
  const rows = table.getRowModel().rows;
  const columns = getDisplayOrderedColumns(table);
  if (!rows.length || !columns.length) return null;
  const { rowDelta, columnDelta } = getDirectionDelta(direction);
  const rowIndex = rows.findIndex((row) => row.id === rowId);
  const columnIndex = columns.findIndex((column) => column.id === columnId);
  if (rowIndex < 0 || columnIndex < 0) return null;
  const merges = callMemoOrStaticFn(table, "getCellSelectionMergeBounds", table_getCellSelectionMergeBounds);
  let fromRowIndex = rows[rowIndex].getDisplayIndex();
  let fromColumnIndex = columnIndex;
  if (merges.length) {
    const startMerge = findMergeBoundsAt(merges, rowIndex, columnIndex);
    if (startMerge) {
      if (rowDelta > 0) fromRowIndex = startMerge.maxRowIndex;
      if (rowDelta < 0) fromRowIndex = startMerge.minRowIndex;
      if (columnDelta > 0) fromColumnIndex = startMerge.maxColumnIndex;
      if (columnDelta < 0) fromColumnIndex = startMerge.minColumnIndex;
    }
  }
  let nextRowIndex = rowIndex + rowDelta;
  if (rowDelta && fromRowIndex !== rows[rowIndex].getDisplayIndex()) {
    const edgeRowIndex = rows.findIndex((row) => row.getDisplayIndex() === fromRowIndex);
    if (edgeRowIndex < 0) return null;
    nextRowIndex = edgeRowIndex + rowDelta;
  }
  if (nextRowIndex < 0 || nextRowIndex >= rows.length) return null;
  const selectableColumnIds = new Set(getSelectableColumns(table).map((column) => column.id));
  if (!selectableColumnIds.size) return null;
  let nextColumnIndex = fromColumnIndex;
  if (columnDelta) do
    nextColumnIndex += columnDelta;
  while (nextColumnIndex >= 0 && nextColumnIndex < columns.length && !selectableColumnIds.has(columns[nextColumnIndex].id));
  else if (!selectableColumnIds.has(columnId)) for (let distance = 1; distance < columns.length; distance++) {
    const before = columns[columnIndex - distance];
    const after = columns[columnIndex + distance];
    if (before && selectableColumnIds.has(before.id)) {
      nextColumnIndex = columnIndex - distance;
      break;
    }
    if (after && selectableColumnIds.has(after.id)) {
      nextColumnIndex = columnIndex + distance;
      break;
    }
  }
  if (nextColumnIndex < 0 || nextColumnIndex >= columns.length || !selectableColumnIds.has(columns[nextColumnIndex].id)) return null;
  let landingRowIndex = nextRowIndex;
  let landingColumnIndex = nextColumnIndex;
  if (merges.length) {
    const landingMerge = findMergeBoundsAt(merges, rows[nextRowIndex].getDisplayIndex(), nextColumnIndex);
    if (landingMerge) {
      landingRowIndex = rows.findIndex((row) => row.getDisplayIndex() === landingMerge.minRowIndex);
      if (landingRowIndex < 0) return null;
      landingColumnIndex = landingMerge.minColumnIndex;
    }
  }
  const landingRow = rows[landingRowIndex];
  const landingColumn = columns[landingColumnIndex];
  if (!landingRow || !landingColumn) return null;
  return {
    rowId: landingRow.id,
    columnId: landingColumn.id
  };
}
function table_moveCellSelection(table, direction) {
  const ranges = table.atoms.cellSelection?.get();
  const active = ranges?.[ranges.length - 1];
  if (!active) {
    const rows = table.getRowModel().rows;
    const columns = getSelectableColumns(table);
    if (!rows.length || !columns.length) return;
    table_setFocusedCell(table, rows[0].id, columns[0].id);
    return;
  }
  const next = stepCoordinate(table, active.anchorRowId, active.anchorColumnId, direction);
  if (!next) return;
  table_setFocusedCell(table, next.rowId, next.columnId);
}
function table_extendCellSelection(table, direction) {
  const ranges = table.atoms.cellSelection?.get();
  const active = ranges?.[ranges.length - 1];
  if (!active) {
    table_moveCellSelection(table, direction);
    return;
  }
  const next = stepCoordinate(table, active.focusRowId, active.focusColumnId, direction);
  if (!next) return;
  table_setCellSelection(table, (old) => {
    if (!old.length) return old;
    const nextRanges = old.slice(0, -1);
    nextRanges.push(__spreadProps(__spreadValues({}, old[old.length - 1]), {
      focusRowId: next.rowId,
      focusColumnId: next.columnId
    }));
    return nextRanges;
  });
}
function forEachSelectedCell(table, visit, skipCovered = false) {
  const bounds = callMemoOrStaticFn(table, "getCellSelectionBounds", table_getCellSelectionBounds);
  if (!bounds.length) return;
  const rows = table.getRowsInDisplayOrder();
  const columns = getDisplayOrderedColumns(table);
  for (let i = 0; i < bounds.length; i++) {
    const bound = bounds[i];
    for (let rowIndex = bound.minRowIndex; rowIndex <= bound.maxRowIndex; rowIndex++) {
      const row = rows[rowIndex];
      if (!row) continue;
      const cellsByColumnId = row.getAllCellsByColumnId();
      for (let columnIndex = bound.minColumnIndex; columnIndex <= bound.maxColumnIndex; columnIndex++) {
        const column = columns[columnIndex];
        if (!column) continue;
        const cell = cellsByColumnId[column.id];
        if (!cell) continue;
        if (!callMemoOrStaticFn(cell, "getCanSelect", cell_getCanSelect)) continue;
        if (skipCovered && cell.getIsCovered?.()) continue;
        visit(cell, i, rowIndex - bound.minRowIndex, columnIndex - bound.minColumnIndex);
      }
    }
  }
}
function table_getSelectedCellIds(table) {
  const ids = [];
  const seen = /* @__PURE__ */ new Set();
  forEachSelectedCell(table, (cell) => {
    if (seen.has(cell.id)) return;
    seen.add(cell.id);
    ids.push(cell.id);
  }, true);
  return ids;
}
function table_getSelectedCellRangesData(table) {
  const grids = [];
  forEachSelectedCell(table, (cell, rangeIndex, rowOffset) => {
    const grid = grids[rangeIndex] ??= [];
    (grid[rowOffset] ??= []).push(cell.getValue());
  });
  return grids;
}
function table_getSelectedCellCount(table) {
  if (table.options.enableCellSelection === false) return 0;
  const bounds = callMemoOrStaticFn(table, "getCellSelectionBounds", table_getCellSelectionBounds);
  if (!bounds.length) return 0;
  const merges = callMemoOrStaticFn(table, "getCellSelectionMergeBounds", table_getCellSelectionMergeBounds);
  if (typeof table.options.enableCellSelection === "function" || merges.length) {
    const ids = /* @__PURE__ */ new Set();
    forEachSelectedCell(table, (cell) => ids.add(cell.id), true);
    return ids.size;
  }
  const columns = getDisplayOrderedColumns(table);
  let count = 0;
  for (const bound of bounds) {
    let selectableColumns = 0;
    for (let columnIndex = bound.minColumnIndex; columnIndex <= bound.maxColumnIndex; columnIndex++) {
      const column = columns[columnIndex];
      if (!column) continue;
      if (column.columnDef.enableCellSelection !== false) selectableColumns++;
    }
    count += (bound.maxRowIndex - bound.minRowIndex + 1) * selectableColumns;
  }
  return count;
}
function table_getCellSelectionRowIds(table) {
  const bounds = callMemoOrStaticFn(table, "getCellSelectionBounds", table_getCellSelectionBounds);
  if (!bounds.length) return [];
  const rows = table.getRowsInDisplayOrder();
  const seen = /* @__PURE__ */ new Set();
  const ids = [];
  for (let i = 0; i < bounds.length; i++) {
    const bound = bounds[i];
    for (let index = bound.minRowIndex; index <= bound.maxRowIndex; index++) {
      const row = rows[index];
      if (!row || seen.has(row.id)) continue;
      seen.add(row.id);
      ids.push(row.id);
    }
  }
  return ids;
}
function table_getCellSelectionColumnIds(table) {
  const bounds = callMemoOrStaticFn(table, "getCellSelectionBounds", table_getCellSelectionBounds);
  if (!bounds.length) return [];
  const columns = getDisplayOrderedColumns(table);
  const seen = /* @__PURE__ */ new Set();
  const ids = [];
  for (let i = 0; i < bounds.length; i++) {
    const bound = bounds[i];
    for (let index = bound.minColumnIndex; index <= bound.maxColumnIndex; index++) {
      const column = columns[index];
      if (!column || seen.has(column.id)) continue;
      if (column.columnDef.enableCellSelection === false) continue;
      seen.add(column.id);
      ids.push(column.id);
    }
  }
  return ids;
}
function cell_getSelectionStartHandler(cell, _contextDocument) {
  const canSelect = cell_getCanSelect(cell);
  return (e) => {
    if (!canSelect) return;
    const table = cell.table;
    const options = table.options;
    const contextDocument = _contextDocument ?? (typeof document !== "undefined" ? document : null);
    const isRangeEvent = options.enableCellRangeSelection !== false && (options.isCellRangeSelectionEvent?.(e) ?? false);
    const isMultiRangeEvent = options.enableMultiCellRangeSelection !== false && (options.isMultiCellRangeSelectionEvent?.(e) ?? false);
    if (options.enableCellSelectionDrag !== false && options.enableCellRangeSelection !== false && contextDocument) {
      table._isSelectingCells = true;
      const upHandler = () => {
        contextDocument.removeEventListener("mouseup", upHandler);
        table._isSelectingCells = false;
      };
      contextDocument.addEventListener("mouseup", upHandler);
    }
    const rowId = cell.row.id;
    const columnId = cell.column.id;
    const shouldExclude = isMultiRangeEvent && callMemoOrStaticFn(cell, "getIsSelected", cell_getIsSelected);
    table_setCellSelection(table, (old) => {
      const active = old[old.length - 1];
      if (isRangeEvent && active) {
        const ranges = old.slice(0, -1);
        ranges.push(__spreadProps(__spreadValues({}, active), {
          focusRowId: rowId,
          focusColumnId: columnId
        }));
        return ranges;
      }
      const range = __spreadValues({
        anchorRowId: rowId,
        anchorColumnId: columnId,
        focusRowId: rowId,
        focusColumnId: columnId
      }, shouldExclude ? { operation: "exclude" } : {});
      return isMultiRangeEvent ? [...old, range] : [range];
    });
  };
}
function cell_getSelectionExtendHandler(cell) {
  const canSelect = cell_getCanSelect(cell);
  return (_e) => {
    if (!canSelect) return;
    const table = cell.table;
    if (!table._isSelectingCells) return;
    const ranges = table.atoms.cellSelection?.get();
    const active = ranges?.[ranges.length - 1];
    if (!active) return;
    const rowId = cell.row.id;
    const columnId = cell.column.id;
    if (active.focusRowId === rowId && active.focusColumnId === columnId) return;
    table_setCellSelection(table, (old) => {
      if (!old.length) return old;
      const next = old.slice(0, -1);
      next.push(__spreadProps(__spreadValues({}, old[old.length - 1]), {
        focusRowId: rowId,
        focusColumnId: columnId
      }));
      return next;
    });
  };
}

// node_modules/@tanstack/table-core/dist/features/row-expanding/rowExpandingFeature.utils.js
function getDefaultExpandedState() {
  return makeObjectMap();
}
function table_autoResetExpanded(table) {
  if (!table.atoms.expanded) return;
  if (table.options.autoResetAll ?? table.options.autoResetExpanded ?? !table.options.manualExpanding) table._reactivity.schedule(() => table_resetExpanded(table));
}
function table_setExpanded(table, updater) {
  table.options.onExpandedChange?.(updater);
}
function table_toggleAllRowsExpanded(table, expanded) {
  const currentExpanded = table.atoms.expanded?.get() ?? {};
  if (expanded ?? !table_getIsAllRowsExpanded(table)) {
    if (currentExpanded === true) return;
    if (!table_getCanSomeRowsExpand(table)) return;
    table_setExpanded(table, true);
  } else {
    if (currentExpanded !== true && !Object.keys(currentExpanded).length) return;
    table_setExpanded(table, makeObjectMap());
  }
}
function table_resetExpanded(table, defaultState) {
  const initialExpanded = table.initialState.expanded;
  setStateSlice(table, "expanded", defaultState ? makeObjectMap() : initialExpanded === true ? true : Object.assign(makeObjectMap(), cloneState(initialExpanded ?? {})));
}
function table_getCanSomeRowsExpand(table) {
  return table.getPrePaginatedRowModel().flatRows.some((row) => row_getCanExpand(row));
}
function table_getToggleAllRowsExpandedHandler(table) {
  return (_e) => {
    table_toggleAllRowsExpanded(table);
  };
}
function table_getIsSomeRowsExpanded(table) {
  const expanded = table.atoms.expanded?.get() ?? {};
  return expanded === true || Object.values(expanded).some(Boolean);
}
function table_getIsAllRowsExpanded(table) {
  const expanded = table.atoms.expanded?.get() ?? {};
  if (expanded === true) return true;
  if (!Object.keys(expanded).length) return false;
  const expandableRows = table.getRowModel().flatRows.filter((row) => row_getCanExpand(row));
  if (!expandableRows.length) return false;
  if (expandableRows.some((row) => !row_getIsExpanded(row))) return false;
  return true;
}
function table_getExpandedDepth(table) {
  let maxDepth = 0;
  const expanded = table.atoms.expanded?.get();
  (expanded === true ? Object.values(table.getRowModel().rowsById).filter((row) => row_getCanExpand(row)).map((row) => row.id) : Object.keys(expanded ?? {})).forEach((id) => {
    const splitId = id.split(".");
    maxDepth = Math.max(maxDepth, splitId.length);
  });
  return maxDepth;
}
function row_toggleExpanded(row, expanded) {
  const currentExpanded = row.table.atoms.expanded?.get() ?? {};
  const currentExists = currentExpanded === true || isExpandedRowId(currentExpanded, row.id);
  const targetExpanded = expanded ?? !currentExists;
  if (targetExpanded === currentExists) return;
  if (targetExpanded && !row_getCanExpand(row)) return;
  table_setExpanded(row.table, (old) => {
    const exists = old === true ? true : isExpandedRowId(old, row.id);
    let oldExpanded = makeObjectMap();
    if (old === true) Object.values(row.table.getRowModel().rowsById).forEach((rowModelRow) => {
      if (row_getCanExpand(rowModelRow)) oldExpanded[rowModelRow.id] = true;
    });
    else oldExpanded = Object.assign(makeObjectMap(), old);
    if (!exists && targetExpanded) {
      oldExpanded[row.id] = true;
      return oldExpanded;
    }
    if (exists && !targetExpanded) {
      const rest = makeObjectMap();
      const rowIds = Object.keys(oldExpanded);
      for (let i = 0; i < rowIds.length; i++) {
        const rowId = rowIds[i];
        if (rowId !== row.id && oldExpanded[rowId]) rest[rowId] = true;
      }
      return rest;
    }
    return old;
  });
}
function row_getIsExpanded(row) {
  const expanded = row.table.atoms.expanded?.get() ?? {};
  return !!(row.table.options.getIsRowExpanded?.(row) ?? (expanded === true || isExpandedRowId(expanded, row.id)));
}
function isExpandedRowId(expanded, rowId) {
  return !!(expanded && expanded !== true && hasOwn(expanded, rowId) && expanded[rowId]);
}
function row_getCanExpand(row) {
  return row.table.options.getRowCanExpand?.(row) ?? ((row.table.options.enableExpanding ?? true) && !!row.subRows.length);
}
function row_getIsAllParentsExpanded(row) {
  let isFullyExpanded = true;
  let currentRow = row;
  while (isFullyExpanded && currentRow.parentId) {
    currentRow = row.table.getRow(currentRow.parentId, true);
    isFullyExpanded = row_getIsExpanded(currentRow);
  }
  return isFullyExpanded;
}
function row_getToggleExpandedHandler(row) {
  const canExpand = row_getCanExpand(row);
  return () => {
    if (!canExpand) return;
    row_toggleExpanded(row);
  };
}

// node_modules/@tanstack/table-core/dist/features/row-pagination/rowPaginationFeature.utils.js
var defaultPageIndex = 0;
var defaultPageSize = 10;
function getDefaultPaginationState() {
  return {
    pageIndex: defaultPageIndex,
    pageSize: defaultPageSize
  };
}
function table_autoResetPageIndex(table) {
  if (table.options.autoResetAll ?? table.options.autoResetPageIndex ?? !table.options.manualPagination) {
    if ((table.atoms.pagination?.get()?.pageIndex ?? defaultPageIndex) === defaultPageIndex) return;
    table_resetPageIndex(table, true);
  }
}
function table_setPagination(table, updater) {
  setStateSlice(table, "pagination", updater);
}
function table_resetPagination(table, defaultState) {
  table_setPagination(table, defaultState ? getDefaultPaginationState() : cloneState(table.initialState.pagination ?? getDefaultPaginationState()));
}
function table_setPageIndex(table, updater) {
  table_setPagination(table, (old) => {
    let pageIndex = functionalUpdate(updater, old.pageIndex);
    const maxPageIndex = typeof table.options.pageCount === "undefined" || table.options.pageCount === -1 ? Number.MAX_SAFE_INTEGER : table.options.pageCount - 1;
    pageIndex = Math.max(0, Math.min(pageIndex, maxPageIndex));
    return __spreadProps(__spreadValues({}, old), {
      pageIndex
    });
  });
}
function table_resetPageIndex(table, defaultState) {
  table_setPageIndex(table, defaultState ? defaultPageIndex : table.initialState.pagination?.pageIndex ?? defaultPageIndex);
}
function table_resetPageSize(table, defaultState) {
  table_setPageSize(table, defaultState ? defaultPageSize : table.initialState.pagination?.pageSize ?? defaultPageSize);
}
function table_setPageSize(table, updater) {
  table_setPagination(table, (old) => {
    const pageSize = Math.max(1, functionalUpdate(updater, old.pageSize));
    const topRowIndex = old.pageSize === Infinity ? 0 : old.pageSize * old.pageIndex;
    const pageIndex = pageSize === Infinity ? 0 : Math.floor(topRowIndex / pageSize);
    return __spreadProps(__spreadValues({}, old), {
      pageIndex,
      pageSize
    });
  });
}
function table_getPageOptions(table) {
  const pageCount = table_getPageCount(table);
  let pageOptions = [];
  if (pageCount && pageCount > 0) pageOptions = [...new Array(pageCount)].fill(null).map((_, i) => i);
  return pageOptions;
}
function table_getCanPreviousPage(table) {
  return (table.atoms.pagination?.get()?.pageIndex ?? 0) > 0;
}
function table_getCanNextPage(table) {
  const pageIndex = table.atoms.pagination?.get()?.pageIndex ?? defaultPageIndex;
  const pageCount = table_getPageCount(table);
  if (pageCount === -1) return true;
  if (pageCount === 0) return false;
  return pageIndex < pageCount - 1;
}
function table_getCanLastPage(table) {
  const pageIndex = table.atoms.pagination?.get()?.pageIndex ?? defaultPageIndex;
  const pageCount = table_getPageCount(table);
  return Number.isFinite(pageCount) && pageCount > 0 && pageIndex < pageCount - 1;
}
function table_previousPage(table) {
  return table_setPageIndex(table, (old) => old - 1);
}
function table_nextPage(table) {
  return table_setPageIndex(table, (old) => {
    return old + 1;
  });
}
function table_firstPage(table) {
  return table_setPageIndex(table, 0);
}
function table_lastPage(table) {
  const pageCount = table_getPageCount(table);
  if (!Number.isFinite(pageCount) || pageCount <= 0) return;
  return table_setPageIndex(table, pageCount - 1);
}
function table_getPageCount(table) {
  const configuredPageCount = table.options.pageCount;
  if (configuredPageCount != null) return configuredPageCount;
  const rowCount = table_getRowCount(table);
  const pageSize = table.atoms.pagination?.get()?.pageSize ?? defaultPageSize;
  if (pageSize === Infinity && Number.isFinite(rowCount) && rowCount > 0) return 1;
  return Math.ceil(rowCount / pageSize);
}
function table_getRowCount(table) {
  return table.options.rowCount ?? table.getPrePaginatedRowModel().rows.length;
}

// node_modules/@tanstack/table-core/dist/features/row-sorting/rowSortingFeature.utils.js
function getDefaultSortingState() {
  return [];
}
function table_setSorting(table, updater) {
  setStateSlice(table, "sorting", updater);
}
function table_resetSorting(table, defaultState) {
  table_setSorting(table, defaultState ? [] : cloneState(table.initialState.sorting ?? []));
}
function table_autoResetSorting(table) {
  if (!table.atoms.sorting) return;
  if (table.options.autoResetAll ?? table.options.autoResetSorting ?? false) table_resetSorting(table);
}
function column_getAutoSortFn(column) {
  const sortFns2 = column.table._rowModelFns.sortFns;
  const firstRows = column.table.getFilteredRowModel().flatRows.slice(0, 10);
  let sortFnName;
  let isString = false;
  for (let i = 0; i < firstRows.length; i++) {
    const value = firstRows[i].getValue(column.id);
    if (Object.prototype.toString.call(value) === "[object Date]") {
      sortFnName = "datetime";
      break;
    }
    if (typeof value === "string") {
      isString = true;
      if (value.split(reSplitAlphaNumeric).length > 1) {
        sortFnName = "alphanumeric";
        break;
      }
    }
  }
  if (!sortFnName && isString) sortFnName = "text";
  if (sortFnName) {
    let sortFn = sortFns2?.[sortFnName];
    if (!sortFn) {
      if (true) console.warn(`sortFn '${sortFnName}' (auto) for column '${column.id}' is not registered`);
      if (sortFnName === "alphanumeric") sortFn = sortFns2?.text;
    }
    if (sortFn) return sortFn;
  }
  return sortFn_basic;
}
function column_getAutoSortDir(column) {
  const firstRows = column.table.getFilteredRowModel().flatRows.slice(0, 10);
  for (let i = 0; i < firstRows.length; i++) {
    const value = firstRows[i].getValue(column.id);
    if (value == null) continue;
    return typeof value === "string" ? "asc" : "desc";
  }
  return "desc";
}
function column_getSortFn(column) {
  const sortFns2 = column.table._rowModelFns.sortFns;
  if (isFunction(column.columnDef.sortFn)) return column.columnDef.sortFn;
  if (column.columnDef.sortFn === "auto") return column_getAutoSortFn(column);
  const sortFn = sortFns2?.[column.columnDef.sortFn];
  if (!sortFn) console.warn(`sortFn '${String(column.columnDef.sortFn)}' for column '${column.id}' is not registered`);
  return sortFn ?? sortFn_basic;
}
function column_toggleSorting(column, desc, multi) {
  const nextSortingOrder = column_getNextSortingOrder(column, multi && column_getCanMultiSort(column));
  const hasManualValue = typeof desc !== "undefined";
  table_setSorting(column.table, (old) => {
    const existingIndex = old.findIndex((d) => d.id === column.id);
    const existingSorting = existingIndex === -1 ? void 0 : old[existingIndex];
    let newSorting = [];
    let sortAction;
    const nextDesc = hasManualValue ? desc : nextSortingOrder === "desc";
    const isMultiMode = !!(old.length && column_getCanMultiSort(column) && multi);
    if (isMultiMode) if (existingSorting) sortAction = "toggle";
    else sortAction = "add";
    else if (existingSorting) sortAction = "toggle";
    else sortAction = "replace";
    if (sortAction === "toggle") {
      if (!hasManualValue) {
        if (!nextSortingOrder) sortAction = "remove";
      }
    }
    if (sortAction === "add") {
      newSorting = [...old, {
        id: column.id,
        desc: nextDesc
      }];
      newSorting.splice(0, newSorting.length - (column.table.options.maxMultiSortColCount ?? Number.MAX_SAFE_INTEGER));
    } else if (sortAction === "toggle") newSorting = isMultiMode ? old.map((d) => {
      if (d.id === column.id) return __spreadProps(__spreadValues({}, d), {
        desc: nextDesc
      });
      return d;
    }) : [{
      id: column.id,
      desc: nextDesc
    }];
    else if (sortAction === "remove") newSorting = isMultiMode ? old.filter((d) => d.id !== column.id) : [];
    else newSorting = [{
      id: column.id,
      desc: nextDesc
    }];
    return newSorting;
  });
}
function column_getFirstSortDir(column) {
  return column.columnDef.sortDescFirst ?? column.table.options.sortDescFirst ?? column_getAutoSortDir(column) === "desc" ? "desc" : "asc";
}
function column_getNextSortingOrder(column, multi) {
  const firstSortDirection = column_getFirstSortDir(column);
  const isSorted = column_getIsSorted(column);
  if (!isSorted) return firstSortDirection;
  if (isSorted !== firstSortDirection && (column.table.options.enableSortingRemoval ?? true) && (multi ? column.table.options.enableMultiRemove ?? true : true)) return false;
  return isSorted === "desc" ? "asc" : "desc";
}
function column_getCanSort(column) {
  return (column.columnDef.enableSorting ?? true) && (column.table.options.enableSorting ?? true) && !!column.accessorFn;
}
function column_getCanMultiSort(column) {
  return column.columnDef.enableMultiSort ?? column.table.options.enableMultiSort ?? !!column.accessorFn;
}
function column_getIsSorted(column) {
  const columnSort = column.table.atoms.sorting?.get()?.find((d) => d.id === column.id);
  return !columnSort ? false : columnSort.desc ? "desc" : "asc";
}
function column_getSortIndex(column) {
  return column.table.atoms.sorting?.get()?.findIndex((d) => d.id === column.id) ?? -1;
}
function column_clearSorting(column) {
  table_setSorting(column.table, (old) => old.length ? old.filter((d) => d.id !== column.id) : []);
}
function column_getToggleSortingHandler(column) {
  const canSort = column_getCanSort(column);
  return (e) => {
    if (!canSort) return;
    column_toggleSorting(column, void 0, column_getCanMultiSort(column) ? column.table.options.isMultiSortEvent?.(e) : false);
  };
}

// node_modules/@tanstack/table-core/dist/core/row-models/createCoreRowModel.js
function createCoreRowModel() {
  return (table) => {
    return tableMemo({
      feature: "coreRowModelsFeature",
      table,
      fnName: "table.getCoreRowModel",
      memoDeps: () => [table.options.data],
      fn: () => _createCoreRowModel(table, table.options.data),
      onAfterUpdate: skipFirstRun(() => {
        table_autoResetExpanded(table);
        table_autoResetPageIndex(table);
        table_autoResetSorting(table);
        table_autoResetCellSelection(table);
      })
    });
  };
}
function accessRows(table, rowModel, originalRows, depth = 0, parentRow) {
  const rows = [];
  for (let i = 0; i < originalRows.length; i++) {
    const originalRow = originalRows[i];
    const row = constructRow(table, table.getRowId(originalRow, i, parentRow), originalRow, i, depth, void 0, parentRow?.id);
    rowModel.flatRows.push(row);
    rowModel.rowsById[row.id] = row;
    rows.push(row);
    if (table.options.getSubRows) {
      row.originalSubRows = table.options.getSubRows(originalRow, i);
      if (row.originalSubRows?.length) row.subRows = accessRows(table, rowModel, row.originalSubRows, depth + 1, row);
    }
  }
  return rows;
}
function _createCoreRowModel(table, data) {
  const rowModel = {
    rows: [],
    flatRows: [],
    rowsById: makeObjectMap()
  };
  rowModel.rows = accessRows(table, rowModel, data);
  return rowModel;
}

// node_modules/@tanstack/table-core/dist/core/row-models/coreRowModelsFeature.utils.js
function table_getCoreRowModel(table) {
  if (!table._rowModels.coreRowModel) table._rowModels.coreRowModel = table.options.features.coreRowModel?.(table) ?? createCoreRowModel()(table);
  return table._rowModels.coreRowModel();
}
function table_getPreFilteredRowModel(table) {
  return table.getCoreRowModel();
}
function table_getFilteredRowModel(table) {
  if (!table._rowModels.filteredRowModel) table._rowModels.filteredRowModel = table.options.features.filteredRowModel?.(table);
  if (table.options.manualFiltering || !table._rowModels.filteredRowModel) return table.getPreFilteredRowModel();
  return table._rowModels.filteredRowModel();
}
function table_getPreGroupedRowModel(table) {
  return table.getFilteredRowModel();
}
function table_getGroupedRowModel(table) {
  if (!table._rowModels.groupedRowModel) table._rowModels.groupedRowModel = table.options.features.groupedRowModel?.(table);
  if (table.options.manualGrouping || !table._rowModels.groupedRowModel) return table.getPreGroupedRowModel();
  return table._rowModels.groupedRowModel();
}
function table_getPreSortedRowModel(table) {
  return table.getGroupedRowModel();
}
function table_getSortedRowModel(table) {
  if (!table._rowModels.sortedRowModel) table._rowModels.sortedRowModel = table.options.features.sortedRowModel?.(table);
  if (table.options.manualSorting || !table._rowModels.sortedRowModel) return table.getPreSortedRowModel();
  return table._rowModels.sortedRowModel();
}
function table_getPreExpandedRowModel(table) {
  return table.getSortedRowModel();
}
function table_getExpandedRowModel(table) {
  if (!table._rowModels.expandedRowModel) table._rowModels.expandedRowModel = table.options.features.expandedRowModel?.(table);
  if (table.options.manualExpanding || !table._rowModels.expandedRowModel) return table.getPreExpandedRowModel();
  return table._rowModels.expandedRowModel();
}
function table_getPrePaginatedRowModel(table) {
  return table.getExpandedRowModel();
}
function table_getPaginatedRowModel(table) {
  if (!table._rowModels.paginatedRowModel) table._rowModels.paginatedRowModel = table.options.features.paginatedRowModel?.(table);
  if (table.options.manualPagination || !table._rowModels.paginatedRowModel) return table.getPrePaginatedRowModel();
  return table._rowModels.paginatedRowModel();
}
function table_getRowModel(table) {
  return table.getPaginatedRowModel();
}

// node_modules/@tanstack/table-core/dist/core/row-models/coreRowModelsFeature.js
var coreRowModelsFeature = { constructTableAPIs: (table) => {
  assignTableAPIs("coreRowModelsFeature", table, {
    table_getCoreRowModel: { fn: () => table_getCoreRowModel(table) },
    table_getPreFilteredRowModel: { fn: () => table_getPreFilteredRowModel(table) },
    table_getFilteredRowModel: { fn: () => table_getFilteredRowModel(table) },
    table_getPreGroupedRowModel: { fn: () => table_getPreGroupedRowModel(table) },
    table_getGroupedRowModel: { fn: () => table_getGroupedRowModel(table) },
    table_getPreSortedRowModel: { fn: () => table_getPreSortedRowModel(table) },
    table_getSortedRowModel: { fn: () => table_getSortedRowModel(table) },
    table_getPreExpandedRowModel: { fn: () => table_getPreExpandedRowModel(table) },
    table_getExpandedRowModel: { fn: () => table_getExpandedRowModel(table) },
    table_getPrePaginatedRowModel: { fn: () => table_getPrePaginatedRowModel(table) },
    table_getPaginatedRowModel: { fn: () => table_getPaginatedRowModel(table) },
    table_getRowModel: { fn: () => table_getRowModel(table) }
  });
} };

// node_modules/@tanstack/table-core/dist/core/cells/constructCell.js
function getCellPrototype(table) {
  if (!table._cellPrototype) {
    table._cellPrototype = { table };
    const features = Object.values(table._features);
    for (let i = 0; i < features.length; i++) features[i].assignCellPrototype?.(table._cellPrototype, table);
  }
  return table._cellPrototype;
}
function constructCell(column, row, table) {
  const cellPrototype = getCellPrototype(table);
  const cell = Object.create(cellPrototype);
  cell.column = column;
  cell.id = `${row.id}_${column.id}`;
  cell.row = row;
  const initFns = table._cellInstanceInitFns;
  for (let i = 0; i < initFns.length; i++) initFns[i](cell);
  return cell;
}

// node_modules/@tanstack/table-core/dist/core/rows/coreRowsFeature.utils.js
function row_getDisplayIndex(row) {
  const rows = row.table.getRowsInDisplayOrder();
  const displayIndex = row._displayIndexCache;
  return rows[displayIndex] === row ? displayIndex : -1;
}
function table_getRowsInDisplayOrder(table) {
  const rows = table.getPrePaginatedRowModel().rows;
  if (table.options.paginateExpandedRows === false) {
    const displayRows = [];
    const handleRow = (row) => {
      row._displayIndexCache = displayRows.length;
      displayRows.push(row);
      if (row.subRows.length && row.getIsExpanded?.()) row.subRows.forEach(handleRow);
    };
    rows.forEach(handleRow);
    return displayRows;
  }
  for (let i = 0; i < rows.length; i++) rows[i]._displayIndexCache = i;
  return rows;
}
function row_getValue(row, columnId) {
  if (hasOwn(row._valuesCache, columnId)) return row._valuesCache[columnId];
  const column = row.table.getColumn(columnId);
  if (!column?.accessorFn) return;
  row._valuesCache[columnId] = column.accessorFn(row.original, row.index);
  return row._valuesCache[columnId];
}
function row_getUniqueValues(row, columnId) {
  if (hasOwn(row._uniqueValuesCache, columnId)) return row._uniqueValuesCache[columnId];
  const column = row.table.getColumn(columnId);
  if (!column?.accessorFn) return;
  if (!column.columnDef.getUniqueValues) {
    row._uniqueValuesCache[columnId] = [row.getValue(columnId)];
    return row._uniqueValuesCache[columnId];
  }
  row._uniqueValuesCache[columnId] = column.columnDef.getUniqueValues(row.original, row.index);
  return row._uniqueValuesCache[columnId];
}
function row_renderValue(row, columnId) {
  return row.getValue(columnId) ?? row.table.options.renderFallbackValue;
}
function row_getLeafRows(row) {
  return flattenBy(row.subRows, (d) => d.subRows);
}
function table_getMaxSubRowDepth(table) {
  const rows = table.getCoreRowModel().flatRows;
  let maxDepth = 0;
  for (let i = 0; i < rows.length; i++) maxDepth = Math.max(maxDepth, rows[i].depth);
  return maxDepth;
}
function row_getParentRow(row) {
  if (!row.parentId) return;
  return row.table.getCoreRowModel().rowsById[row.parentId] ?? row.table.getRow(row.parentId, true);
}
function row_getParentRows(row) {
  const parentRows = [];
  let currentRow = row;
  while (true) {
    const parentRow = currentRow.getParentRow();
    if (!parentRow) break;
    parentRows.push(parentRow);
    currentRow = parentRow;
  }
  return parentRows.reverse();
}
function row_getAllCells(row) {
  const columns = row.table.getAllLeafColumns();
  let cache = row._cellsCache;
  if (!cache) cache = row._cellsCache = /* @__PURE__ */ new WeakMap();
  const cells = new Array(columns.length);
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    let cell = cache.get(column);
    if (!cell) {
      cell = constructCell(column, row, row.table);
      cache.set(column, cell);
    }
    cells[i] = cell;
  }
  return cells;
}
function row_getAllCellsByColumnId(row) {
  const result = makeObjectMap();
  const cells = row.getAllCells();
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    result[cell.column.id] = cell;
  }
  return result;
}
function table_getRowId(originalRow, table, index, parent) {
  return table.options.getRowId?.(originalRow, index, parent) ?? (parent ? `${parent.id}.${index}` : String(index));
}
function table_getRow(table, rowId, searchAll) {
  let row = (searchAll ? table.getPrePaginatedRowModel() : table.getRowModel()).rowsById[rowId];
  if (!row) {
    row = table.getCoreRowModel().rowsById[rowId];
    if (!row) {
      if (true) throw new Error(`getRow could not find row with ID: ${rowId}`);
      throw new Error();
    }
  }
  return row;
}

// node_modules/@tanstack/table-core/dist/core/rows/coreRowsFeature.js
var coreRowsFeature = {
  assignRowPrototype: (prototype, table) => {
    assignPrototypeAPIs("coreRowsFeature", prototype, table, {
      row_getDisplayIndex: { fn: (row) => row_getDisplayIndex(row) },
      row_getAllCellsByColumnId: {
        fn: (row) => row_getAllCellsByColumnId(row),
        memoDeps: (row) => [row.getAllCells()]
      },
      row_getAllCells: {
        fn: (row) => row_getAllCells(row),
        memoDeps: (row) => [row.table.getAllLeafColumns()]
      },
      row_getLeafRows: {
        fn: (row) => row_getLeafRows(row),
        memoDeps: (row) => [row.subRows]
      },
      row_getParentRow: { fn: (row) => row_getParentRow(row) },
      row_getParentRows: { fn: (row) => row_getParentRows(row) },
      row_getUniqueValues: { fn: (row, columnId) => row_getUniqueValues(row, columnId) },
      row_getValue: { fn: (row, columnId) => row_getValue(row, columnId) },
      row_renderValue: { fn: (row, columnId) => row_renderValue(row, columnId) }
    });
  },
  constructTableAPIs: (table) => {
    assignTableAPIs("coreRowsFeature", table, {
      table_getRowsInDisplayOrder: {
        fn: () => table_getRowsInDisplayOrder(table),
        memoDeps: () => [
          table.getPrePaginatedRowModel().rows,
          table.options.paginateExpandedRows,
          table.options.paginateExpandedRows === false ? table.atoms.expanded?.get() : void 0
        ]
      },
      table_getRowId: { fn: (originalRow, index, parent) => table_getRowId(originalRow, table, index, parent) },
      table_getRow: { fn: (id, searchAll) => table_getRow(table, id, searchAll) },
      table_getMaxSubRowDepth: {
        fn: () => table_getMaxSubRowDepth(table),
        memoDeps: () => [table.getCoreRowModel()]
      }
    });
  }
};

// node_modules/@tanstack/table-core/dist/core/table/coreTablesFeature.utils.js
function table_syncExternalStateToBaseAtoms(table, capturedState, compare = (currentState, externalState) => currentState === externalState) {
  const state = capturedState === void 0 ? table.options.state : capturedState;
  table._reactivity.batch(() => {
    if (state) for (const key in state) {
      const baseAtom = table.baseAtoms[key];
      if (!baseAtom) continue;
      const rawExternalState = state[key];
      const externalState = rawExternalState === void 0 ? table.initialState[key] : rawExternalState;
      if (!compare(table._reactivity.untrack(() => baseAtom.get()), externalState)) baseAtom.set(() => externalState);
    }
  });
}
function table_publishExternalState(table, state, compare = (currentState, externalState) => currentState === externalState) {
  table._reactivity.batch(() => {
    table_syncExternalStateToBaseAtoms(table, state, compare);
    table._reactivity.commit?.();
  });
}
function table_reset(table) {
  const snap = cloneState(table.initialState);
  table._reactivity.batch(() => {
    const keys = Object.keys(snap);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      table.baseAtoms[key].set(snap[key]);
    }
  });
  const features = Object.values(table._features);
  for (let i = 0; i < features.length; i++) features[i].resetTableInstanceData?.(table);
}
function table_mergeOptions(table, newOptions) {
  const { features, atoms, initialState } = table.options;
  if (!table.options.mergeOptions) return __spreadProps(__spreadValues(__spreadValues({}, table.options), newOptions), {
    features,
    atoms,
    initialState
  });
  const mergedOptions = table.options.mergeOptions(table.options, newOptions);
  const descriptors = __spreadValues({}, Object.getOwnPropertyDescriptors(mergedOptions));
  return Object.defineProperties(Object.create(Object.getPrototypeOf(mergedOptions)), __spreadProps(__spreadValues({}, descriptors), {
    features: {
      value: features,
      enumerable: true,
      configurable: true,
      writable: true
    },
    atoms: {
      value: atoms,
      enumerable: true,
      configurable: true,
      writable: true
    },
    initialState: {
      value: initialState,
      enumerable: true,
      configurable: true,
      writable: true
    }
  }));
}
function table_setOptions(table, updater, options) {
  const mergedOptions = table_mergeOptions(table, functionalUpdate(updater, table.options));
  if (table.optionsStore) table.optionsStore.set(() => mergedOptions);
  else table.options = mergedOptions;
  if (options?.syncExternalState !== false) table_publishExternalState(table, mergedOptions.state ?? null);
}

// node_modules/@tanstack/table-core/dist/core/table/coreTablesFeature.js
var coreTablesFeature = { constructTableAPIs: (table) => {
  assignTableAPIs("coreTablesFeature", table, {
    table_reset: { fn: () => table_reset(table) },
    table_setOptions: { fn: (updater) => table_setOptions(table, updater) }
  });
} };

// node_modules/@tanstack/table-core/dist/core/coreFeatures.js
var coreFeatures = {
  coreCellsFeature,
  coreColumnsFeature,
  coreHeadersFeature,
  coreRowModelsFeature,
  coreRowsFeature,
  coreTablesFeature
};

// node_modules/@tanstack/table-core/dist/helpers/columnHelper.js
function createColumnHelper() {
  return {
    accessor: (accessor, column) => {
      return typeof accessor === "function" ? __spreadProps(__spreadValues({}, column), {
        accessorFn: accessor
      }) : __spreadProps(__spreadValues({}, column), {
        accessorKey: accessor
      });
    },
    columns: (columns) => columns,
    display: (column) => column,
    group: (column) => column
  };
}

// node_modules/@tanstack/table-core/dist/helpers/metaHelper.js
function metaHelper() {
  return {};
}

// node_modules/@tanstack/table-core/dist/helpers/tableFeatures.js
function tableFeatures(features) {
  return features;
}

// node_modules/@tanstack/table-core/dist/helpers/tableOptions.js
function tableOptions(options) {
  return options;
}

// node_modules/@tanstack/table-core/dist/core/reactivity/coreReactivityFeature.utils.js
function atomToStore(atom) {
  const store = atom;
  Object.defineProperty(atom, "state", { get() {
    return atom.get();
  } });
  if ("set" in atom) store.setState = atom.set.bind(atom);
  return store;
}

// node_modules/@tanstack/store/dist/alien.js
function createReactiveSystem({ update, notify, unwatched }) {
  return {
    link: link2,
    unlink: unlink2,
    propagate: propagate2,
    checkDirty: checkDirty2,
    shallowPropagate: shallowPropagate2
  };
  function link2(dep, sub, version) {
    const prevDep = sub.depsTail;
    if (prevDep !== void 0 && prevDep.dep === dep) return;
    const nextDep = prevDep !== void 0 ? prevDep.nextDep : sub.deps;
    if (nextDep !== void 0 && nextDep.dep === dep) {
      nextDep.version = version;
      sub.depsTail = nextDep;
      return;
    }
    const prevSub = dep.subsTail;
    if (prevSub !== void 0 && prevSub.version === version && prevSub.sub === sub) return;
    const newLink = sub.depsTail = dep.subsTail = {
      version,
      dep,
      sub,
      prevDep,
      nextDep,
      prevSub,
      nextSub: void 0
    };
    if (nextDep !== void 0) nextDep.prevDep = newLink;
    if (prevDep !== void 0) prevDep.nextDep = newLink;
    else sub.deps = newLink;
    if (prevSub !== void 0) prevSub.nextSub = newLink;
    else dep.subs = newLink;
  }
  function unlink2(link3, sub = link3.sub) {
    const dep = link3.dep;
    const prevDep = link3.prevDep;
    const nextDep = link3.nextDep;
    const nextSub = link3.nextSub;
    const prevSub = link3.prevSub;
    if (nextDep !== void 0) nextDep.prevDep = prevDep;
    else sub.depsTail = prevDep;
    if (prevDep !== void 0) prevDep.nextDep = nextDep;
    else sub.deps = nextDep;
    if (nextSub !== void 0) nextSub.prevSub = prevSub;
    else dep.subsTail = prevSub;
    if (prevSub !== void 0) prevSub.nextSub = nextSub;
    else if ((dep.subs = nextSub) === void 0) unwatched(dep);
    return nextDep;
  }
  function propagate2(link3) {
    let next = link3.nextSub;
    let stack;
    top: do {
      const sub = link3.sub;
      let flags = sub.flags;
      if (!(flags & 60)) sub.flags = flags | 32;
      else if (!(flags & (4 | 8))) flags = 0;
      else if (!(flags & 4)) sub.flags = flags & ~8 | 32;
      else if (!(flags & (16 | 32)) && isValidLink(link3, sub)) {
        sub.flags = flags | (8 | 32);
        flags &= 1;
      } else flags = 0;
      if (flags & 2) notify(sub);
      if (flags & 1) {
        const subSubs = sub.subs;
        if (subSubs !== void 0) {
          const nextSub = (link3 = subSubs).nextSub;
          if (nextSub !== void 0) {
            stack = {
              value: next,
              prev: stack
            };
            next = nextSub;
          }
          continue;
        }
      }
      if ((link3 = next) !== void 0) {
        next = link3.nextSub;
        continue;
      }
      while (stack !== void 0) {
        link3 = stack.value;
        stack = stack.prev;
        if (link3 !== void 0) {
          next = link3.nextSub;
          continue top;
        }
      }
      break;
    } while (true);
  }
  function checkDirty2(link3, sub) {
    let stack;
    let checkDepth = 0;
    let dirty = false;
    top: do {
      const dep = link3.dep;
      const flags = dep.flags;
      if (sub.flags & 16) dirty = true;
      else if ((flags & (1 | 16)) === (1 | 16)) {
        if (update(dep)) {
          const subs = dep.subs;
          if (subs.nextSub !== void 0) shallowPropagate2(subs);
          dirty = true;
        }
      } else if ((flags & (1 | 32)) === (1 | 32)) {
        if (link3.nextSub !== void 0 || link3.prevSub !== void 0) stack = {
          value: link3,
          prev: stack
        };
        link3 = dep.deps;
        sub = dep;
        ++checkDepth;
        continue;
      }
      if (!dirty) {
        const nextDep = link3.nextDep;
        if (nextDep !== void 0) {
          link3 = nextDep;
          continue;
        }
      }
      while (checkDepth--) {
        const firstSub = sub.subs;
        const hasMultipleSubs = firstSub.nextSub !== void 0;
        if (hasMultipleSubs) {
          link3 = stack.value;
          stack = stack.prev;
        } else link3 = firstSub;
        if (dirty) {
          if (update(sub)) {
            if (hasMultipleSubs) shallowPropagate2(firstSub);
            sub = link3.sub;
            continue;
          }
          dirty = false;
        } else sub.flags &= ~32;
        sub = link3.sub;
        const nextDep = link3.nextDep;
        if (nextDep !== void 0) {
          link3 = nextDep;
          continue top;
        }
      }
      return dirty;
    } while (true);
  }
  function shallowPropagate2(link3) {
    do {
      const sub = link3.sub;
      const flags = sub.flags;
      if ((flags & (32 | 16)) === 32) {
        sub.flags = flags | 16;
        if ((flags & (2 | 4)) === 2) notify(sub);
      }
    } while ((link3 = link3.nextSub) !== void 0);
  }
  function isValidLink(checkLink, sub) {
    let link3 = sub.depsTail;
    while (link3 !== void 0) {
      if (link3 === checkLink) return true;
      link3 = link3.prevDep;
    }
    return false;
  }
}

// node_modules/@tanstack/store/dist/atom.js
var queuedEffects = [];
var { link, unlink, propagate, checkDirty, shallowPropagate } = createReactiveSystem({
  update(atom) {
    return atom._update();
  },
  notify(effect2) {
    queuedEffects[queuedEffectsLength++] = effect2;
    effect2.flags &= ~2;
  },
  unwatched(atom) {
    if (atom.depsTail !== void 0) {
      atom.depsTail = void 0;
      atom.flags = 1 | 16;
      purgeDeps(atom);
    }
  }
});
var queuedEffectsLength = 0;
function purgeDeps(sub) {
  const depsTail = sub.depsTail;
  let dep = depsTail !== void 0 ? depsTail.nextDep : sub.deps;
  while (dep !== void 0) dep = unlink(dep, sub);
}

// node_modules/@tanstack/store/dist/shallow.js
function shallow(objA, objB) {
  if (Object.is(objA, objB)) return true;
  if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) return false;
  if (objA instanceof Map && objB instanceof Map) {
    if (objA.size !== objB.size) return false;
    for (const [k, v] of objA) if (!objB.has(k) || !Object.is(v, objB.get(k))) return false;
    return true;
  }
  if (objA instanceof Set && objB instanceof Set) {
    if (objA.size !== objB.size) return false;
    for (const v of objA) if (!objB.has(v)) return false;
    return true;
  }
  if (objA instanceof Date && objB instanceof Date) {
    if (objA.getTime() !== objB.getTime()) return false;
    return true;
  }
  const keysA = getOwnKeys(objA);
  if (keysA.length !== getOwnKeys(objB).length) return false;
  for (let i = 0; i < keysA.length; i++) if (!Object.prototype.hasOwnProperty.call(objB, keysA[i]) || !Object.is(objA[keysA[i]], objB[keysA[i]])) return false;
  return true;
}
function getOwnKeys(obj) {
  return Object.keys(obj).concat(Object.getOwnPropertySymbols(obj));
}

// node_modules/@tanstack/table-core/dist/core/table/constructTable.js
function getInitialTableState(features, initialState = {}) {
  Object.values(features).forEach((feature) => {
    initialState = feature.getInitialState?.(initialState) ?? initialState;
  });
  return cloneState(initialState);
}
function constructTable(tableOptions2) {
  const _reactivity = tableOptions2.features.coreReactivityFeature;
  const _a = tableOptions2.features, { aggregationFns: aggregationFns2, columnMeta: _columnMeta, coreRowModel, expandedRowModel, facetedMinMaxValues, facetedRowModel, facetedUniqueValues, filterFns: filterFns2, filterMeta: _filterMeta, filteredRowModel, groupedRowModel, paginatedRowModel, sortFns: sortFns2, sortedRowModel, tableMeta: _tableMeta } = _a, features = __objRest(_a, ["aggregationFns", "columnMeta", "coreRowModel", "expandedRowModel", "facetedMinMaxValues", "facetedRowModel", "facetedUniqueValues", "filterFns", "filterMeta", "filteredRowModel", "groupedRowModel", "paginatedRowModel", "sortFns", "sortedRowModel", "tableMeta"]);
  const table = {
    _cellInstanceInitFns: [],
    _columnInstanceInitFns: [],
    _features: __spreadValues(__spreadValues({}, coreFeatures), features),
    _headerGroupInstanceInitFns: [],
    _headerInstanceInitFns: [],
    _reactivity,
    _rowInstanceInitFns: [],
    _rowModelFns: {
      aggregationFns: aggregationFns2,
      filterFns: filterFns2,
      sortFns: sortFns2
    },
    _rowModels: {},
    atoms: {},
    baseAtoms: {}
  };
  const featuresList = Object.values(table._features);
  const mergedOptions = __spreadValues(__spreadValues({}, featuresList.reduce((obj, feature) => {
    return Object.assign(obj, feature.getDefaultTableOptions?.(table));
  }, {})), tableOptions2);
  if (_reactivity.wrapExternalAtoms && mergedOptions.atoms) for (const [atomKey, _atom] of Object.entries(mergedOptions.atoms)) {
    const atom = _atom;
    const wrappedAtom = _reactivity.createWritableAtom(atom.get(), { debugName: `externalAtom/${atomKey}` });
    mergedOptions.atoms[atomKey] = wrappedAtom;
    let syncExternal = false;
    const syncAtomToWrappedSub = atom.subscribe((value) => {
      if (syncExternal) return;
      wrappedAtom.set(value);
    });
    const syncWrappedToAtomSub = wrappedAtom.subscribe((value) => {
      syncExternal = true;
      atom.set(value);
      syncExternal = false;
    });
    _reactivity.addSubscription(syncAtomToWrappedSub);
    _reactivity.addSubscription(syncWrappedToAtomSub);
  }
  if (_reactivity.createOptionsStore) {
    table.optionsStore = _reactivity.createWritableAtom(mergedOptions, { debugName: "table/optionsStore" });
    Object.defineProperty(table, "options", {
      configurable: true,
      enumerable: true,
      get() {
        return table.optionsStore.get();
      },
      set(value) {
        table.optionsStore.set(() => value);
      }
    });
  } else table.options = mergedOptions;
  table.initialState = getInitialTableState(table._features, table.options.initialState);
  const stateKeys = Object.keys(table.initialState);
  for (let i = 0; i < stateKeys.length; i++) {
    const key = stateKeys[i];
    table.baseAtoms[key] = _reactivity.createWritableAtom(table.initialState[key], { debugName: `table/baseAtoms/${key}` });
    table.atoms[key] = _reactivity.createReadonlyAtom(() => {
      const options = table.options;
      const externalAtom = options.atoms?.[key];
      const reactiveState = externalAtom ? externalAtom.get() : table.baseAtoms[key].get();
      if (externalAtom) return reactiveState;
      const controlledState = options.state;
      if (controlledState && hasOwn(controlledState, key)) {
        const controlledValue = controlledState[key];
        return controlledValue === void 0 ? table.initialState[key] : controlledValue;
      }
      return reactiveState;
    }, { debugName: `table/atoms/${key}` });
  }
  table_syncExternalStateToBaseAtoms(table);
  table.store = atomToStore(_reactivity.createReadonlyAtom(() => {
    const snapshot = {};
    for (let i = 0; i < stateKeys.length; i++) {
      const key = stateKeys[i];
      snapshot[key] = table.atoms[key].get();
    }
    return snapshot;
  }, {
    compare: shallow,
    debugName: "table/store"
  }));
  for (let i = 0; i < featuresList.length; i++) {
    const feature = featuresList[i];
    feature.initTableInstanceData?.(table);
    if (feature.initCellInstanceData) table._cellInstanceInitFns.push(feature.initCellInstanceData.bind(feature));
    if (feature.initColumnInstanceData) table._columnInstanceInitFns.push(feature.initColumnInstanceData.bind(feature));
    if (feature.initHeaderGroupInstanceData) table._headerGroupInstanceInitFns.push(feature.initHeaderGroupInstanceData.bind(feature));
    if (feature.initHeaderInstanceData) table._headerInstanceInitFns.push(feature.initHeaderInstanceData.bind(feature));
    if (feature.initRowInstanceData) table._rowInstanceInitFns.push(feature.initRowInstanceData.bind(feature));
    feature.constructTableAPIs?.(table);
  }
  if (tableOptions2.debugAll || tableOptions2.debugTable) {
    const features2 = Object.keys(table._features);
    const rowModels = Object.entries({
      coreRowModel,
      filteredRowModel,
      groupedRowModel,
      sortedRowModel,
      expandedRowModel,
      paginatedRowModel,
      facetedRowModel,
      facetedMinMaxValues,
      facetedUniqueValues
    }).filter(([, factory]) => factory).map(([key]) => key);
    const states = Object.keys(table.initialState);
    console.log(`Constructing Table Instance

  Features:   ${features2.join("\n              ")}

  Row Models: ${rowModels.length ? rowModels.join("\n              ") : "(none)"}

  States:     ${states.join("\n              ")}
`, { table });
  }
  return table;
}

// node_modules/@tanstack/table-core/dist/features/cell-selection/cellSelectionFeature.js
var cellSelectionFeature = {
  initTableInstanceData: (table) => {
    table._isSelectingCells = false;
  },
  resetTableInstanceData: (table) => {
    table._isSelectingCells = false;
  },
  getInitialState: (initialState) => {
    return __spreadValues({
      cellSelection: getDefaultCellSelectionState()
    }, initialState);
  },
  getDefaultTableOptions: (table) => {
    return {
      onCellSelectionChange: makeStateUpdater("cellSelection", table),
      autoResetCellSelection: true,
      enableCellSelection: true,
      enableCellRangeSelection: true,
      enableMultiCellRangeSelection: true,
      enableCellSelectionDrag: true,
      isCellRangeSelectionEvent: (event) => {
        const rangeEvent = event;
        return Boolean(rangeEvent.shiftKey || rangeEvent.nativeEvent?.shiftKey);
      },
      isMultiCellRangeSelectionEvent: (event) => {
        const multiEvent = event;
        return Boolean(multiEvent.ctrlKey || multiEvent.metaKey || multiEvent.nativeEvent?.ctrlKey || multiEvent.nativeEvent?.metaKey);
      }
    };
  },
  assignCellPrototype: (prototype, table) => {
    assignPrototypeAPIs("cellSelectionFeature", prototype, table, {
      cell_getCanSelect: { fn: (cell) => cell_getCanSelect(cell) },
      cell_getIsSelected: { fn: (cell) => cell_getIsSelected(cell) },
      cell_getIsFocused: { fn: (cell) => cell_getIsFocused(cell) },
      cell_getTabIndex: { fn: (cell) => cell_getTabIndex(cell) },
      cell_getSelectionEdges: { fn: (cell) => cell_getSelectionEdges(cell) },
      cell_getSelectionStartHandler: { fn: (cell, contextDocument) => cell_getSelectionStartHandler(cell, contextDocument) },
      cell_getSelectionExtendHandler: { fn: (cell) => cell_getSelectionExtendHandler(cell) }
    });
  },
  constructTableAPIs: (table) => {
    assignTableAPIs("cellSelectionFeature", table, {
      table_setCellSelection: { fn: (updater) => table_setCellSelection(table, updater) },
      table_resetCellSelection: { fn: (defaultState) => table_resetCellSelection(table, defaultState) },
      table_autoResetCellSelection: { fn: () => table_autoResetCellSelection(table) },
      table_getCellSelectionColumnIndexes: {
        fn: () => table_getCellSelectionColumnIndexes(table),
        memoDeps: () => [
          table.atoms.columnVisibility?.get(),
          table.atoms.columnOrder?.get(),
          table.atoms.columnPinning?.get(),
          table.atoms.grouping?.get(),
          table.options.columns,
          table.options.groupedColumnMode
        ]
      },
      table_getCellSelectionMergeBounds: {
        fn: () => table_getCellSelectionMergeBounds(table),
        memoDeps: () => [
          table.getCellSpanIndex?.(),
          table.getRowsInDisplayOrder(),
          callMemoOrStaticFn(table, "getCellSelectionColumnIndexes", table_getCellSelectionColumnIndexes)
        ]
      },
      table_getCellSelectionBounds: {
        fn: () => table_getCellSelectionBounds(table),
        memoDeps: () => [
          table.atoms.cellSelection?.get(),
          table.getRowsInDisplayOrder(),
          callMemoOrStaticFn(table, "getCellSelectionColumnIndexes", table_getCellSelectionColumnIndexes),
          callMemoOrStaticFn(table, "getCellSelectionMergeBounds", table_getCellSelectionMergeBounds)
        ]
      },
      table_selectCellRange: { fn: (range, opts) => table_selectCellRange(table, range, opts) },
      table_selectAllCells: { fn: () => table_selectAllCells(table) },
      table_setFocusedCell: { fn: (rowId, columnId) => table_setFocusedCell(table, rowId, columnId) },
      table_getFocusedCell: { fn: () => table_getFocusedCell(table) },
      table_moveCellSelection: { fn: (direction) => table_moveCellSelection(table, direction) },
      table_extendCellSelection: { fn: (direction) => table_extendCellSelection(table, direction) },
      table_getSelectedCellIds: {
        fn: () => table_getSelectedCellIds(table),
        memoDeps: () => [
          callMemoOrStaticFn(table, "getCellSelectionBounds", table_getCellSelectionBounds),
          callMemoOrStaticFn(table, "getCellSelectionMergeBounds", table_getCellSelectionMergeBounds),
          table.getRowsInDisplayOrder(),
          table.options.enableCellSelection
        ]
      },
      table_getSelectedCellRangesData: {
        fn: () => table_getSelectedCellRangesData(table),
        memoDeps: () => [
          callMemoOrStaticFn(table, "getCellSelectionBounds", table_getCellSelectionBounds),
          table.getRowsInDisplayOrder(),
          table.options.enableCellSelection
        ]
      },
      table_getSelectedCellCount: {
        fn: () => table_getSelectedCellCount(table),
        memoDeps: () => [
          callMemoOrStaticFn(table, "getCellSelectionBounds", table_getCellSelectionBounds),
          callMemoOrStaticFn(table, "getCellSelectionMergeBounds", table_getCellSelectionMergeBounds),
          table.getRowsInDisplayOrder(),
          table.options.enableCellSelection
        ]
      },
      table_getCellSelectionRowIds: {
        fn: () => table_getCellSelectionRowIds(table),
        memoDeps: () => [callMemoOrStaticFn(table, "getCellSelectionBounds", table_getCellSelectionBounds), table.getRowsInDisplayOrder()]
      },
      table_getCellSelectionColumnIds: {
        fn: () => table_getCellSelectionColumnIds(table),
        memoDeps: () => [callMemoOrStaticFn(table, "getCellSelectionBounds", table_getCellSelectionBounds)]
      }
    });
  }
};

// node_modules/@tanstack/table-core/dist/features/cell-spanning/cellSpanningFeature.utils.js
var EMPTY_ROW_SPANS = makeObjectMap();
var EMPTY_COLUMN_INDEXES = makeObjectMap();
var EMPTY_COL_SPANS = [];
var NO_SECTION_STARTS = [];
function getRenderedRows(table) {
  const rows = table.getRowModel().rows;
  const rowPinning = table.atoms.rowPinning?.get();
  if (!rowPinning || !rowPinning.top.length && !rowPinning.bottom.length) return {
    rows,
    sectionStarts: NO_SECTION_STARTS
  };
  const pinnedTable = table;
  const top = pinnedTable.getTopRows?.() ?? [];
  const center = pinnedTable.getCenterRows?.() ?? rows;
  const bottom = pinnedTable.getBottomRows?.() ?? [];
  return {
    rows: [
      ...top,
      ...center,
      ...bottom
    ],
    sectionStarts: [top.length, top.length + center.length]
  };
}
function getRenderedColumns(table, firstRow) {
  const cells = firstRow.getVisibleCells?.() ?? firstRow.getAllCells();
  const columns = new Array(cells.length);
  for (let i = 0; i < cells.length; i++) columns[i] = cells[i].column;
  const pinning = table.atoms.columnPinning?.get();
  let centerStart = 0;
  let centerEnd = columns.length;
  if (pinning) {
    while (centerStart < centerEnd && pinning.start.includes(columns[centerStart].id)) centerStart++;
    while (centerEnd > centerStart && pinning.end.includes(columns[centerEnd - 1].id)) centerEnd--;
  }
  return {
    columns,
    centerStart,
    centerEnd
  };
}
function column_getCanSpan(column) {
  if (column.columnDef.enableCellSpanning === false) return false;
  return column.table.options.enableCellSpanning ?? true;
}
function table_getCellSpanIndex(table) {
  const { rows, sectionStarts } = getRenderedRows(table);
  const rowCount = rows.length;
  const empty = {
    colSpans: EMPTY_COL_SPANS,
    columnIndexes: EMPTY_COLUMN_INDEXES,
    rowSpans: EMPTY_ROW_SPANS,
    rows
  };
  if (!rowCount || table.options.enableCellSpanning === false) return empty;
  const { columns, centerStart, centerEnd } = getRenderedColumns(table, rows[0]);
  const columnCount = columns.length;
  if (!columnCount) return empty;
  const columnIndexes = makeObjectMap();
  for (let c = 0; c < columnCount; c++) columnIndexes[columns[c].id] = c;
  const breaks = new Uint8Array(rowCount);
  for (let s = 0; s < sectionStarts.length; s++) {
    const start = sectionStarts[s];
    if (start < rowCount) breaks[start] = 1;
  }
  for (let r = 0; r < rowCount; r++) {
    const row = rows[r];
    row._cellSpanRowIndex = r;
    const prev = r > 0 ? rows[r - 1] : void 0;
    if (prev && (row.depth !== prev.depth || row.parentId !== prev.parentId) || row.getIsGrouped?.() === true) breaks[r] = 1;
  }
  const colSpans = [];
  let anyColSpan = false;
  for (let c = 0; c < columnCount; c++) {
    const column = columns[c];
    const spanColumns = column.columnDef.spanColumns;
    if (spanColumns === void 0 || !column_getCanSpan(column)) continue;
    const regionEnd = c < centerStart ? centerStart : c < centerEnd ? centerEnd : columnCount;
    for (let r = 0; r < rowCount; r++) {
      const existing = colSpans[r];
      if (existing && existing[c] === 0) continue;
      const requested = isFunction(spanColumns) ? spanColumns({
        column,
        row: rows[r],
        table
      }) : spanColumns;
      if (!(requested > 1)) continue;
      const span = Math.min(requested, regionEnd - c);
      if (span < 2) continue;
      const target = existing ?? (colSpans[r] = new Int32Array(columnCount).fill(1));
      target[c] = span;
      for (let k = c + 1; k < c + span; k++) target[k] = 0;
      anyColSpan = true;
    }
  }
  const rowSpans = makeObjectMap();
  for (let c = 0; c < columnCount; c++) {
    const column = columns[c];
    const spanRows = column.columnDef.spanRows;
    if (!spanRows || !column_getCanSpan(column)) continue;
    if (column.getIsGrouped?.() === true) continue;
    const columnId = column.id;
    const predicate = isFunction(spanRows) ? spanRows : void 0;
    const spans = new Int32Array(rowCount).fill(1);
    let anyRun = false;
    let anchorIndex = -1;
    let anchorValue;
    let anchorColSpan = 1;
    for (let r = 0; r < rowCount; r++) {
      const row = rows[r];
      const rowColSpans = anyColSpan ? colSpans[r] : void 0;
      const cellColSpan = rowColSpans ? rowColSpans[c] : 1;
      if (cellColSpan === 0) {
        anchorIndex = -1;
        continue;
      }
      const value = row.getValue(columnId);
      if (anchorIndex !== -1 && !breaks[r] && cellColSpan === anchorColSpan && (predicate ? predicate({
        anchorRow: rows[anchorIndex],
        anchorValue,
        column,
        previousRow: rows[r - 1],
        row,
        table,
        value
      }) : value != null && Object.is(value, anchorValue))) {
        spans[r] = 0;
        spans[anchorIndex] = spans[anchorIndex] + 1;
        anyRun = true;
        continue;
      }
      anchorIndex = r;
      anchorValue = value;
      anchorColSpan = cellColSpan;
    }
    if (anyRun) rowSpans[columnId] = spans;
  }
  return {
    colSpans,
    columnIndexes,
    rowSpans,
    rows
  };
}
function resolveRowIndex2(index, cell) {
  const rowIndex = cell.row._cellSpanRowIndex;
  if (rowIndex === void 0 || index.rows[rowIndex] !== cell.row) return -1;
  return rowIndex;
}
function cell_getRowSpan(cell) {
  const table = cell.row.table;
  const index = callMemoOrStaticFn(table, "getCellSpanIndex", table_getCellSpanIndex);
  const spans = index.rowSpans[cell.column.id];
  if (!spans) return 1;
  const rowIndex = resolveRowIndex2(index, cell);
  if (rowIndex === -1) return 1;
  return spans[rowIndex];
}
function cell_getColSpan(cell) {
  const table = cell.row.table;
  const index = callMemoOrStaticFn(table, "getCellSpanIndex", table_getCellSpanIndex);
  const rowIndex = resolveRowIndex2(index, cell);
  if (rowIndex === -1) return 1;
  const spans = index.colSpans[rowIndex];
  if (!spans) return 1;
  const columnIndex = index.columnIndexes[cell.column.id];
  return columnIndex === void 0 ? 1 : spans[columnIndex];
}
function cell_getIsCovered(cell) {
  return cell_getRowSpan(cell) === 0 || cell_getColSpan(cell) === 0;
}

// node_modules/@tanstack/table-core/dist/features/cell-spanning/cellSpanningFeature.js
var cellSpanningFeature = {
  getDefaultTableOptions: () => {
    return { enableCellSpanning: true };
  },
  initRowInstanceData: (row) => {
    row._cellSpanRowIndex = -1;
  },
  assignCellPrototype: (prototype, table) => {
    assignPrototypeAPIs("cellSpanningFeature", prototype, table, {
      cell_getColSpan: { fn: (cell) => cell_getColSpan(cell) },
      cell_getIsCovered: { fn: (cell) => cell_getIsCovered(cell) },
      cell_getRowSpan: { fn: (cell) => cell_getRowSpan(cell) }
    });
  },
  constructTableAPIs: (table) => {
    assignTableAPIs("cellSpanningFeature", table, { table_getCellSpanIndex: {
      fn: () => table_getCellSpanIndex(table),
      memoDeps: () => [
        table.getRowModel().rows,
        table.atoms.rowPinning?.get(),
        table.options.keepPinnedRows,
        table.atoms.columnVisibility?.get(),
        table.atoms.columnOrder?.get(),
        table.atoms.columnPinning?.get(),
        table.atoms.grouping?.get(),
        table.options.columns,
        table.options.groupedColumnMode,
        table.options.enableCellSpanning
      ]
    } });
  }
};

// node_modules/@tanstack/table-core/dist/features/column-faceting/columnFacetingFeature.utils.js
function column_getFacetedMinMaxValues(column, table) {
  const facetedMinMaxValues = table._rowModels.facetedMinMaxValues ??= makeObjectMap();
  let facetedMinMaxValuesFn = facetedMinMaxValues[column.id];
  if (!facetedMinMaxValuesFn) facetedMinMaxValuesFn = facetedMinMaxValues[column.id] = table.options.features.facetedMinMaxValues?.(table, column.id) ?? (() => void 0);
  return facetedMinMaxValuesFn();
}
function column_getFacetedRowModel(column, table) {
  const columnId = column?.id ?? "";
  const facetedRowModels = table._rowModels.facetedRowModels ??= makeObjectMap();
  let facetedRowModelFn = facetedRowModels[columnId];
  if (!facetedRowModelFn) facetedRowModelFn = facetedRowModels[columnId] = table.options.features.facetedRowModel?.(table, columnId) ?? (() => table.getPreFilteredRowModel());
  return facetedRowModelFn();
}
function column_getFacetedUniqueValues(column, table) {
  const facetedUniqueValues = table._rowModels.facetedUniqueValues ??= makeObjectMap();
  let facetedUniqueValuesFn = facetedUniqueValues[column.id];
  if (!facetedUniqueValuesFn) facetedUniqueValuesFn = facetedUniqueValues[column.id] = table.options.features.facetedUniqueValues?.(table, column.id) ?? createStableEmptyMapFn();
  return facetedUniqueValuesFn();
}
function createStableEmptyMapFn() {
  const emptyMap = /* @__PURE__ */ new Map();
  return () => emptyMap;
}
function table_getGlobalFacetedMinMaxValues(table) {
  if (!table._rowModels.globalFacetedMinMaxValues) table._rowModels.globalFacetedMinMaxValues = table.options.features.facetedMinMaxValues?.(table, "__global__") ?? (() => void 0);
  const facetedMinMaxValuesFn = table._rowModels.globalFacetedMinMaxValues;
  return facetedMinMaxValuesFn();
}
function table_getGlobalFacetedRowModel(table) {
  if (!table._rowModels.globalFacetedRowModel) table._rowModels.globalFacetedRowModel = table.options.features.facetedRowModel?.(table, "__global__") ?? (() => table.getPreFilteredRowModel());
  const facetedRowModelFn = table._rowModels.globalFacetedRowModel;
  return facetedRowModelFn();
}
function table_getGlobalFacetedUniqueValues(table) {
  if (!table._rowModels.globalFacetedUniqueValues) table._rowModels.globalFacetedUniqueValues = table.options.features.facetedUniqueValues?.(table, "__global__") ?? createStableEmptyMapFn();
  const facetedUniqueValuesFn = table._rowModels.globalFacetedUniqueValues;
  return facetedUniqueValuesFn();
}

// node_modules/@tanstack/table-core/dist/features/column-faceting/columnFacetingFeature.js
var columnFacetingFeature = {
  assignColumnPrototype: (prototype, table) => {
    assignPrototypeAPIs("columnFacetingFeature", prototype, table, {
      column_getFacetedRowModel: { fn: (column) => column_getFacetedRowModel(column, column.table) },
      column_getFacetedMinMaxValues: { fn: (column) => column_getFacetedMinMaxValues(column, column.table) },
      column_getFacetedUniqueValues: { fn: (column) => column_getFacetedUniqueValues(column, column.table) }
    });
  },
  constructTableAPIs: (table) => {
    assignTableAPIs("columnFacetingFeature", table, {
      table_getGlobalFacetedRowModel: { fn: () => table_getGlobalFacetedRowModel(table) },
      table_getGlobalFacetedMinMaxValues: { fn: () => table_getGlobalFacetedMinMaxValues(table) },
      table_getGlobalFacetedUniqueValues: { fn: () => table_getGlobalFacetedUniqueValues(table) }
    });
  }
};

// node_modules/@tanstack/table-core/dist/features/row-aggregation/rowAggregationFeature.utils.js
function isAggregationFnDef(value) {
  return !!value && typeof value === "object" && "aggregate" in value;
}
function isAggregationFnDescriptor(value) {
  return !!value && typeof value === "object" && "id" in value && "aggregationFn" in value;
}
function warn(message) {
  if (true) console.warn(message);
}
function resolveMaxAggregationDepth(maxDepth) {
  return maxDepth === void 0 || Number.isNaN(maxDepth) ? 0 : Math.max(0, Math.floor(maxDepth));
}
function collectNormalizedAggregationRow(row, depth, maxDepth, seen, result) {
  if (row.subRows.length && depth < maxDepth) {
    for (let i = 0; i < row.subRows.length; i++) collectNormalizedAggregationRow(row.subRows[i], depth + 1, maxDepth, seen, result);
    return;
  }
  if (!seen.has(row.id)) {
    seen.add(row.id);
    result.push(row);
  }
}
function collectUniqueAggregationRow(row, depth, maxDepth, result) {
  if (row.subRows.length && depth < maxDepth) {
    for (let i = 0; i < row.subRows.length; i++) collectUniqueAggregationRow(row.subRows[i], depth + 1, maxDepth, result);
    return;
  }
  result.push(row);
}
function normalizeAggregationRows(rows, maxDepth = 0) {
  const result = [];
  const seen = /* @__PURE__ */ new Set();
  const normalizedMaxDepth = resolveMaxAggregationDepth(maxDepth);
  for (let i = 0; i < rows.length; i++) collectNormalizedAggregationRow(rows[i], 0, normalizedMaxDepth, seen, result);
  return result;
}
function normalizeUniqueAggregationRows(rows, maxDepth = 0) {
  const normalizedMaxDepth = resolveMaxAggregationDepth(maxDepth);
  let needsDescent = false;
  if (normalizedMaxDepth > 0) {
    for (let i = 0; i < rows.length; i++) if (rows[i].subRows.length) {
      needsDescent = true;
      break;
    }
  }
  if (!needsDescent) return rows;
  const result = [];
  for (let i = 0; i < rows.length; i++) collectUniqueAggregationRow(rows[i], 0, normalizedMaxDepth, result);
  return result;
}
function getAutoAggregationFnName(value) {
  if (typeof value === "number") return "sum";
  if (value instanceof Date && !Number.isNaN(value.getTime())) return "extent";
}
function column_getAutoAggregationFn(column) {
  const value = column.table.getCoreRowModel().flatRows[0]?.getValue(column.id);
  const name = getAutoAggregationFnName(value);
  if (!name) return void 0;
  const aggregationFn = column.table._rowModelFns.aggregationFns?.[name];
  if (!aggregationFn) warn(`aggregationFn '${name}' (auto) for column '${column.id}' is not registered`);
  return aggregationFn;
}
function resolveAggregationFn(column, ref) {
  if (isAggregationFnDef(ref)) return ref;
  if (ref === "auto") return column_getAutoAggregationFn(column);
  const aggregationFn = column.table._rowModelFns.aggregationFns?.[ref];
  if (!aggregationFn) warn(`aggregationFn '${String(ref)}' for column '${column.id}' is not registered`);
  return aggregationFn;
}
function column_getAggregationFns(column) {
  const option = column.columnDef.aggregationFn;
  const registry = column.table._rowModelFns.aggregationFns;
  const coreRowModel = column.table.getCoreRowModel();
  const previous = column._resolvedAggregationFnsCache;
  if (previous && previous.option === option && previous.registry === registry && previous.coreRowModel === coreRowModel) return previous.value;
  const finish = (value) => {
    column._resolvedAggregationFnsCache = {
      coreRowModel,
      option,
      registry,
      value
    };
    return value;
  };
  if (option == null) return finish([]);
  if (!Array.isArray(option)) return finish([{
    aggregationFn: resolveAggregationFn(column, option),
    id: typeof option === "string" ? option : void 0
  }]);
  const ids = makeObjectMap();
  for (let i = 0; i < option.length; i++) {
    const item = option[i];
    const id = typeof item === "string" ? item : isAggregationFnDescriptor(item) ? item.id : void 0;
    if (id !== void 0) ids[id] = (ids[id] ?? 0) + 1;
  }
  const resolved = [];
  for (let i = 0; i < option.length; i++) {
    const item = option[i];
    const id = typeof item === "string" ? item : isAggregationFnDescriptor(item) ? item.id : void 0;
    if (id === void 0) {
      warn(`aggregationFn at index ${i} for column '${column.id}' needs a stable id`);
      resolved.push({
        aggregationFn: void 0,
        id: void 0
      });
      continue;
    }
    if (ids[id] > 1) {
      warn(`aggregationFn id '${id}' for column '${column.id}' is duplicated`);
      resolved.push({
        aggregationFn: void 0,
        id
      });
      continue;
    }
    const ref = isAggregationFnDescriptor(item) ? item.aggregationFn : item;
    resolved.push({
      aggregationFn: resolveAggregationFn(column, ref),
      id
    });
  }
  return finish(resolved);
}
function getSubRowResult(subRowValue, isMultiple, id) {
  if (!isMultiple) return subRowValue;
  if (!id || !subRowValue || typeof subRowValue !== "object") return void 0;
  return hasOwn(subRowValue, id) ? subRowValue[id] : void 0;
}
function aggregateColumnValue(args) {
  const { subRows, column, groupingRow, rows, uniqueRows } = args;
  const internalColumn = column;
  const maxDepth = resolveMaxAggregationDepth(args.maxDepth ?? internalColumn.columnDef.maxAggregationDepth);
  const aggregationRows = uniqueRows ? normalizeUniqueAggregationRows(rows, maxDepth) : normalizeAggregationRows(rows, maxDepth);
  const entries = column_getAggregationFns(internalColumn);
  const isMultiple = Array.isArray(internalColumn.columnDef.aggregationFn);
  const canMerge = !!subRows?.length && subRows.every((row) => !!row.groupingColumnId && row.groupingColumnId !== column.id);
  const getValue = (row) => row.getValue(column.id);
  const execute = (entry) => {
    const definition = entry.aggregationFn;
    if (!definition) return void 0;
    const context = __spreadProps(__spreadValues(__spreadProps(__spreadValues({}, subRows ? { subRows } : {}), {
      column,
      columnId: column.id,
      getValue
    }), groupingRow ? { groupingRow } : {}), {
      maxDepth,
      rows: aggregationRows,
      table: column.table
    });
    if (canMerge && definition.merge) return definition.merge(__spreadProps(__spreadValues({}, context), {
      subRowResults: subRows.map((row) => getSubRowResult(row.getValue(column.id), isMultiple, entry.id)),
      subRows
    }));
    return definition.aggregate(context);
  };
  if (!isMultiple) return entries[0] ? execute(entries[0]) : void 0;
  const result = makeObjectMap();
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    if (entry.id !== void 0) result[entry.id] = execute(entry);
  }
  return result;
}
function column_getAggregationValue(column, options) {
  const rows = options?.rows;
  const resolvedMaxDepth = resolveMaxAggregationDepth(options?.maxDepth ?? column.columnDef.maxAggregationDepth);
  const providedResult = column.columnDef.getAggregationValue?.({
    column,
    maxDepth: resolvedMaxDepth,
    rows,
    table: column.table
  });
  if (providedResult) return providedResult.value;
  if (column.table.options.manualAggregation) return void 0;
  if (rows !== void 0) return aggregateColumnValue({
    column,
    maxDepth: resolvedMaxDepth,
    rows
  });
  const model = column.table.getPreGroupedRowModel();
  const previous = column._aggregationValueCache;
  const registry = column.table._rowModelFns.aggregationFns;
  const aggregationFnOption = column.columnDef.aggregationFn;
  if (previous && previous.dependency === model && previous.maxDepth === resolvedMaxDepth && previous.registry === registry && previous.aggregationFnOption === aggregationFnOption) return previous.value;
  const value = aggregateColumnValue({
    column,
    maxDepth: resolvedMaxDepth,
    rows: model.rows,
    uniqueRows: true
  });
  column._aggregationValueCache = {
    aggregationFnOption,
    dependency: model,
    maxDepth: resolvedMaxDepth,
    registry,
    value
  };
  return value;
}
function cell_getIsAggregated(cell) {
  const groupingColumnId = cell.row.groupingColumnId;
  if (!groupingColumnId || groupingColumnId === cell.column.id) return false;
  if (cell.column.table.atoms.grouping?.get?.()?.includes(cell.column.id)) return false;
  return column_getAggregationFns(cell.column).some((entry) => !!entry.aggregationFn);
}
function formatAggregatedCellValue(value, option) {
  if (value == null) return null;
  if (Array.isArray(option) && typeof value === "object") return Object.keys(value).map((key) => `${key}: ${String(value[key])}`).join(", ");
  return String(value);
}

// node_modules/@tanstack/table-core/dist/features/row-aggregation/rowAggregationFeature.js
var rowAggregationFeature = {
  getDefaultColumnDef: () => ({
    aggregatedCell: ({ column, getValue }) => formatAggregatedCellValue(getValue(), column.columnDef.aggregationFn),
    aggregationFn: "auto",
    maxAggregationDepth: 0
  }),
  getDefaultTableOptions: () => ({ manualAggregation: false }),
  assignCellPrototype: (prototype, table) => {
    assignPrototypeAPIs("rowAggregationFeature", prototype, table, { cell_getIsAggregated: { fn: (cell) => cell_getIsAggregated(cell) } });
  },
  assignColumnPrototype: (prototype, table) => {
    assignPrototypeAPIs("rowAggregationFeature", prototype, table, {
      column_getAggregationFns: { fn: (column) => column_getAggregationFns(column) },
      column_getAggregationValue: { fn: (column, options) => column_getAggregationValue(column, options) },
      column_getAutoAggregationFn: {
        fn: (column) => column_getAutoAggregationFn(column),
        memoDeps: (column) => [column.table.getCoreRowModel(), column.table._rowModelFns.aggregationFns]
      }
    });
  },
  initColumnInstanceData: (column) => {
    column._aggregationValueCache = void 0;
    column._resolvedAggregationFnsCache = void 0;
  }
};

// node_modules/@tanstack/table-core/dist/features/column-filtering/columnFilteringFeature.utils.js
function getDefaultColumnFiltersState() {
  return [];
}
function column_getAutoFilterFn(column) {
  const filterFns2 = column.table._rowModelFns.filterFns;
  const rows = column.table.getCoreRowModel().flatRows;
  let value;
  for (let i = 0; i < rows.length; i++) {
    const rowValue = rows[i].getValue(column.id);
    if (rowValue !== null && rowValue !== void 0) {
      value = rowValue;
      break;
    }
  }
  let filterFnName;
  if (typeof value === "string") filterFnName = "includesString";
  else if (typeof value === "number") filterFnName = "inNumberRange";
  else if (typeof value === "boolean") filterFnName = "equals";
  else if (Array.isArray(value)) filterFnName = "arrIncludes";
  else if (Object.prototype.toString.call(value) === "[object Date]") filterFnName = "inDateRange";
  else if (value !== null && typeof value === "object") filterFnName = "equals";
  else filterFnName = "weakEquals";
  const filterFn = filterFns2?.[filterFnName];
  if (!filterFn) console.warn(`filterFn '${filterFnName}' (auto) for column '${column.id}' is not registered`);
  return filterFn;
}
function column_getFilterFn(column) {
  let filterFn = null;
  const filterFns2 = column.table._rowModelFns.filterFns;
  filterFn = isFunction(column.columnDef.filterFn) ? column.columnDef.filterFn : column.columnDef.filterFn === "auto" ? column_getAutoFilterFn(column) : filterFns2?.[column.columnDef.filterFn];
  if (!filterFn && column.columnDef.filterFn !== "auto") console.warn(`filterFn '${String(column.columnDef.filterFn)}' for column '${column.id}' is not registered`);
  return filterFn ?? void 0;
}
function column_getCanFilter(column) {
  return (column.columnDef.enableColumnFilter ?? true) && (column.table.options.enableColumnFilters ?? true) && (column.table.options.enableFilters ?? true) && !!column.accessorFn;
}
function column_getIsFiltered(column) {
  return column_getFilterIndex(column) > -1;
}
function column_getFilterValue(column) {
  return column.table.atoms.columnFilters?.get()?.find((d) => d.id === column.id)?.value;
}
function column_getFilterIndex(column) {
  return column.table.atoms.columnFilters?.get()?.findIndex((d) => d.id === column.id) ?? -1;
}
function column_setFilterValue(column, value) {
  table_setColumnFilters(column.table, (old) => {
    const filterFn = column_getFilterFn(column);
    const previousFilter = old.find((d) => d.id === column.id);
    const newFilter = functionalUpdate(value, previousFilter ? previousFilter.value : void 0);
    if (shouldAutoRemoveFilter(filterFn, newFilter, column)) return old.filter((d) => d.id !== column.id);
    const newFilterObj = {
      id: column.id,
      value: newFilter
    };
    if (previousFilter) return old.map((d) => {
      if (d.id === column.id) return newFilterObj;
      return d;
    });
    if (old.length) return [...old, newFilterObj];
    return [newFilterObj];
  });
}
function table_setColumnFilters(table, updater) {
  const leafColumnsById = table.getAllLeafColumnsById();
  const updateFn = (old) => {
    return functionalUpdate(updater, old).filter((filter) => {
      const column = leafColumnsById[filter.id];
      if (column) {
        if (shouldAutoRemoveFilter(column_getFilterFn(column), filter.value, column)) return false;
      }
      return true;
    });
  };
  setStateSlice(table, "columnFilters", updateFn);
}
function table_resetColumnFilters(table, defaultState) {
  table_setColumnFilters(table, defaultState ? [] : cloneState(table.initialState.columnFilters ?? []));
}
function shouldAutoRemoveFilter(filterFn, value, column) {
  if (typeof value === "undefined") return true;
  if (filterFn?.autoRemove) return !!filterFn.autoRemove(value, column);
  return typeof value === "string" && !value;
}

// node_modules/@tanstack/table-core/dist/features/column-filtering/columnFilteringFeature.js
var columnFilteringFeature = {
  getInitialState: (initialState) => {
    return __spreadValues({
      columnFilters: getDefaultColumnFiltersState()
    }, initialState);
  },
  getDefaultColumnDef: () => {
    return { filterFn: "auto" };
  },
  getDefaultTableOptions: (table) => {
    return {
      onColumnFiltersChange: makeStateUpdater("columnFilters", table),
      filterFromLeafRows: false,
      maxLeafRowFilterDepth: 100
    };
  },
  assignColumnPrototype: (prototype, table) => {
    assignPrototypeAPIs("columnFilteringFeature", prototype, table, {
      column_getAutoFilterFn: { fn: (column) => column_getAutoFilterFn(column) },
      column_getFilterFn: { fn: (column) => column_getFilterFn(column) },
      column_getCanFilter: { fn: (column) => column_getCanFilter(column) },
      column_getIsFiltered: { fn: (column) => column_getIsFiltered(column) },
      column_getFilterValue: { fn: (column) => column_getFilterValue(column) },
      column_getFilterIndex: { fn: (column) => column_getFilterIndex(column) },
      column_setFilterValue: { fn: (column, value) => column_setFilterValue(column, value) }
    });
  },
  initRowInstanceData: (row) => {
    row.columnFilters = makeObjectMap();
    row.columnFiltersMeta = makeObjectMap();
  },
  constructTableAPIs: (table) => {
    assignTableAPIs("columnFilteringFeature", table, {
      table_setColumnFilters: { fn: (updater) => table_setColumnFilters(table, updater) },
      table_resetColumnFilters: { fn: (defaultState) => table_resetColumnFilters(table, defaultState) }
    });
  }
};

// node_modules/@tanstack/table-core/dist/features/column-grouping/columnGroupingFeature.utils.js
function getDefaultGroupingState() {
  return [];
}
function column_toggleGrouping(column) {
  table_setGrouping(column.table, (old) => {
    if (old.includes(column.id)) return old.filter((d) => d !== column.id);
    return [...old, column.id];
  });
}
function column_getCanGroup(column) {
  return (column.columnDef.enableGrouping ?? true) && (column.table.options.enableGrouping ?? true) && (!!column.accessorFn || !!column.columnDef.getGroupingValue);
}
function column_getIsGrouped(column) {
  return !!column.table.atoms.grouping?.get()?.includes(column.id);
}
function column_getGroupedIndex(column) {
  return column.table.atoms.grouping?.get()?.indexOf(column.id) ?? -1;
}
function column_getToggleGroupingHandler(column) {
  const canGroup = column_getCanGroup(column);
  return () => {
    if (!canGroup) return;
    column_toggleGrouping(column);
  };
}
function table_setGrouping(table, updater) {
  setStateSlice(table, "grouping", updater);
}
function table_resetGrouping(table, defaultState) {
  table_setGrouping(table, defaultState ? [] : cloneState(table.initialState.grouping ?? []));
}
function row_getIsGrouped(row) {
  return !!row.groupingColumnId;
}
function row_getGroupingValue(row, columnId) {
  if (row._groupingValuesCache && hasOwn(row._groupingValuesCache, columnId)) return row._groupingValuesCache[columnId];
  const column = row.table.getColumn(columnId);
  if (!column.columnDef.getGroupingValue) return row.getValue(columnId);
  if (row._groupingValuesCache) row._groupingValuesCache[columnId] = column.columnDef.getGroupingValue(row.original, row.index, row);
  return row._groupingValuesCache?.[columnId];
}
function cell_getIsGrouped(cell) {
  const row = cell.row;
  return column_getIsGrouped(cell.column) && cell.column.id === row.groupingColumnId;
}
function cell_getIsPlaceholder(cell) {
  return !cell_getIsGrouped(cell) && column_getIsGrouped(cell.column);
}

// node_modules/@tanstack/table-core/dist/features/column-grouping/columnGroupingFeature.js
var columnGroupingFeature = {
  getInitialState: (initialState) => {
    return __spreadValues({
      grouping: getDefaultGroupingState()
    }, initialState);
  },
  getDefaultTableOptions: (table) => {
    return {
      onGroupingChange: makeStateUpdater("grouping", table),
      groupedColumnMode: "reorder"
    };
  },
  assignCellPrototype: (prototype, table) => {
    assignPrototypeAPIs("columnGroupingFeature", prototype, table, {
      cell_getIsGrouped: { fn: (cell) => cell_getIsGrouped(cell) },
      cell_getIsPlaceholder: { fn: (cell) => cell_getIsPlaceholder(cell) }
    });
  },
  assignColumnPrototype: (prototype, table) => {
    assignPrototypeAPIs("columnGroupingFeature", prototype, table, {
      column_toggleGrouping: { fn: (column) => column_toggleGrouping(column) },
      column_getCanGroup: { fn: (column) => column_getCanGroup(column) },
      column_getIsGrouped: { fn: (column) => column_getIsGrouped(column) },
      column_getGroupedIndex: { fn: (column) => column_getGroupedIndex(column) },
      column_getToggleGroupingHandler: { fn: (column) => column_getToggleGroupingHandler(column) }
    });
  },
  assignRowPrototype: (prototype, table) => {
    assignPrototypeAPIs("columnGroupingFeature", prototype, table, {
      row_getIsGrouped: { fn: (row) => row_getIsGrouped(row) },
      row_getGroupingValue: { fn: (row, columnId) => row_getGroupingValue(row, columnId) }
    });
  },
  initRowInstanceData: (row) => {
    row._groupingValuesCache = makeObjectMap();
  },
  constructTableAPIs: (table) => {
    assignTableAPIs("columnGroupingFeature", table, {
      table_setGrouping: { fn: (updater) => table_setGrouping(table, updater) },
      table_resetGrouping: { fn: (defaultState) => table_resetGrouping(table, defaultState) }
    });
  }
};

// node_modules/@tanstack/table-core/dist/features/column-ordering/columnOrderingFeature.js
var columnOrderingFeature = {
  getInitialState: (initialState) => {
    return __spreadValues({
      columnOrder: getDefaultColumnOrderState()
    }, initialState);
  },
  getDefaultTableOptions: (table) => {
    return { onColumnOrderChange: makeStateUpdater("columnOrder", table) };
  },
  assignColumnPrototype: (prototype, table) => {
    assignPrototypeAPIs("columnOrderingFeature", prototype, table, {
      column_getIndex: { fn: (column, position) => column_getIndex(column, position) },
      column_getIsFirstColumn: { fn: (column, position) => column_getIsFirstColumn(column, position) },
      column_getIsLastColumn: { fn: (column, position) => column_getIsLastColumn(column, position) }
    });
  },
  constructTableAPIs: (table) => {
    assignTableAPIs("columnOrderingFeature", table, {
      table_getColumnIndexes: {
        fn: () => table_getColumnIndexes(table),
        memoDeps: () => [
          table.options.columns,
          table.atoms.columnOrder?.get(),
          table.atoms.columnPinning?.get(),
          table.atoms.columnVisibility?.get(),
          table.atoms.grouping?.get(),
          table.options.groupedColumnMode
        ]
      },
      table_setColumnOrder: { fn: (updater) => table_setColumnOrder(table, updater) },
      table_resetColumnOrder: { fn: (defaultState) => table_resetColumnOrder(table, defaultState) },
      table_getOrderColumnsFn: {
        fn: () => table_getOrderColumnsFn(table),
        memoDeps: () => [
          table.atoms.columnOrder?.get(),
          table.atoms.grouping?.get(),
          table.options.groupedColumnMode
        ]
      }
    });
  }
};

// node_modules/@tanstack/table-core/dist/features/column-pinning/columnPinningFeature.js
var columnPinningFeature = {
  getInitialState: (initialState) => {
    return __spreadValues({
      columnPinning: __spreadValues(__spreadValues({}, getDefaultColumnPinningState()), initialState.columnPinning)
    }, initialState);
  },
  getDefaultTableOptions: (table) => {
    return { onColumnPinningChange: makeStateUpdater("columnPinning", table) };
  },
  assignColumnPrototype: (prototype, table) => {
    assignPrototypeAPIs("columnPinningFeature", prototype, table, {
      column_pin: { fn: (column, position) => column_pin(column, position) },
      column_getCanPin: { fn: (column) => column_getCanPin(column) },
      column_getPinnedIndex: { fn: (column) => column_getPinnedIndex(column) },
      column_getIsPinned: { fn: (column) => column_getIsPinned(column) }
    });
  },
  assignRowPrototype: (prototype, table) => {
    assignPrototypeAPIs("columnPinningFeature", prototype, table, {
      row_getCenterVisibleCells: {
        fn: (row) => row_getCenterVisibleCells(row),
        memoDeps: (row) => [
          row.getAllCells(),
          row.table.atoms.columnPinning?.get(),
          row.table.atoms.columnVisibility?.get()
        ]
      },
      row_getStartVisibleCells: {
        fn: (row) => row_getStartVisibleCells(row),
        memoDeps: (row) => [
          row.getAllCells(),
          row.table.atoms.columnPinning?.get()?.start,
          row.table.atoms.columnVisibility?.get()
        ]
      },
      row_getEndVisibleCells: {
        fn: (row) => row_getEndVisibleCells(row),
        memoDeps: (row) => [
          row.getAllCells(),
          row.table.atoms.columnPinning?.get()?.end,
          row.table.atoms.columnVisibility?.get()
        ]
      }
    });
  },
  constructTableAPIs: (table) => {
    assignTableAPIs("columnPinningFeature", table, {
      table_setColumnPinning: { fn: (updater) => table_setColumnPinning(table, updater) },
      table_resetColumnPinning: { fn: (defaultState) => table_resetColumnPinning(table, defaultState) },
      table_getIsSomeColumnsPinned: { fn: (position) => table_getIsSomeColumnsPinned(table, position) },
      table_getStartHeaderGroups: {
        fn: () => table_getStartHeaderGroups(table),
        memoDeps: () => [
          table.getAllColumns(),
          callMemoOrStaticFn(table, "getVisibleLeafColumns", table_getVisibleLeafColumns),
          table.atoms.columnPinning?.get()?.start,
          table.atoms.columnOrder?.get()
        ]
      },
      table_getCenterHeaderGroups: {
        fn: () => table_getCenterHeaderGroups(table),
        memoDeps: () => [
          table.getAllColumns(),
          callMemoOrStaticFn(table, "getVisibleLeafColumns", table_getVisibleLeafColumns),
          table.atoms.columnPinning?.get(),
          table.atoms.columnOrder?.get()
        ]
      },
      table_getEndHeaderGroups: {
        fn: () => table_getEndHeaderGroups(table),
        memoDeps: () => [
          table.getAllColumns(),
          callMemoOrStaticFn(table, "getVisibleLeafColumns", table_getVisibleLeafColumns),
          table.atoms.columnPinning?.get()?.end,
          table.atoms.columnOrder?.get()
        ]
      },
      table_getStartFooterGroups: {
        fn: () => table_getStartFooterGroups(table),
        memoDeps: () => [callMemoOrStaticFn(table, "getStartHeaderGroups", table_getStartHeaderGroups)]
      },
      table_getCenterFooterGroups: {
        fn: () => table_getCenterFooterGroups(table),
        memoDeps: () => [callMemoOrStaticFn(table, "getCenterHeaderGroups", table_getCenterHeaderGroups)]
      },
      table_getEndFooterGroups: {
        fn: () => table_getEndFooterGroups(table),
        memoDeps: () => [callMemoOrStaticFn(table, "getEndHeaderGroups", table_getEndHeaderGroups)]
      },
      table_getStartFlatHeaders: {
        fn: () => table_getStartFlatHeaders(table),
        memoDeps: () => [callMemoOrStaticFn(table, "getStartHeaderGroups", table_getStartHeaderGroups)]
      },
      table_getEndFlatHeaders: {
        fn: () => table_getEndFlatHeaders(table),
        memoDeps: () => [callMemoOrStaticFn(table, "getEndHeaderGroups", table_getEndHeaderGroups)]
      },
      table_getCenterFlatHeaders: {
        fn: () => table_getCenterFlatHeaders(table),
        memoDeps: () => [callMemoOrStaticFn(table, "getCenterHeaderGroups", table_getCenterHeaderGroups)]
      },
      table_getStartLeafHeaders: {
        fn: () => table_getStartLeafHeaders(table),
        memoDeps: () => [callMemoOrStaticFn(table, "getStartHeaderGroups", table_getStartHeaderGroups)]
      },
      table_getEndLeafHeaders: {
        fn: () => table_getEndLeafHeaders(table),
        memoDeps: () => [callMemoOrStaticFn(table, "getEndHeaderGroups", table_getEndHeaderGroups)]
      },
      table_getCenterLeafHeaders: {
        fn: () => table_getCenterLeafHeaders(table),
        memoDeps: () => [callMemoOrStaticFn(table, "getCenterHeaderGroups", table_getCenterHeaderGroups)]
      },
      table_getStartLeafColumns: {
        fn: () => table_getStartLeafColumns(table),
        memoDeps: () => [
          table.options.columns,
          table.atoms.columnPinning?.get(),
          table.atoms.columnOrder?.get(),
          table.atoms.grouping?.get(),
          table.options.groupedColumnMode
        ]
      },
      table_getEndLeafColumns: {
        fn: () => table_getEndLeafColumns(table),
        memoDeps: () => [
          table.options.columns,
          table.atoms.columnPinning?.get(),
          table.atoms.columnOrder?.get(),
          table.atoms.grouping?.get(),
          table.options.groupedColumnMode
        ]
      },
      table_getCenterLeafColumns: {
        fn: () => table_getCenterLeafColumns(table),
        memoDeps: () => [
          table.options.columns,
          table.atoms.columnPinning?.get(),
          table.atoms.columnOrder?.get(),
          table.atoms.grouping?.get(),
          table.options.groupedColumnMode
        ]
      },
      table_getPinnedLeafColumns: { fn: (position) => table_getPinnedLeafColumns(table, position) },
      table_getStartVisibleLeafColumns: {
        fn: () => table_getStartVisibleLeafColumns(table),
        memoDeps: () => [
          table.options.columns,
          table.atoms.columnPinning?.get(),
          table.atoms.columnVisibility?.get(),
          table.atoms.columnOrder?.get(),
          table.atoms.grouping?.get(),
          table.options.groupedColumnMode
        ]
      },
      table_getCenterVisibleLeafColumns: {
        fn: () => table_getCenterVisibleLeafColumns(table),
        memoDeps: () => [
          table.options.columns,
          table.atoms.columnPinning?.get(),
          table.atoms.columnVisibility?.get(),
          table.atoms.columnOrder?.get(),
          table.atoms.grouping?.get(),
          table.options.groupedColumnMode
        ]
      },
      table_getEndVisibleLeafColumns: {
        fn: () => table_getEndVisibleLeafColumns(table),
        memoDeps: () => [
          table.options.columns,
          table.atoms.columnPinning?.get(),
          table.atoms.columnVisibility?.get(),
          table.atoms.columnOrder?.get(),
          table.atoms.grouping?.get(),
          table.options.groupedColumnMode
        ]
      },
      table_getPinnedVisibleLeafColumns: { fn: (position) => table_getPinnedVisibleLeafColumns(table, position) }
    });
  }
};

// node_modules/@tanstack/table-core/dist/features/column-sizing/columnSizingFeature.utils.js
function getDefaultColumnSizingState() {
  return makeObjectMap();
}
function getDefaultColumnSizingColumnDef() {
  return {
    size: 150,
    minSize: 20,
    maxSize: Number.MAX_SAFE_INTEGER
  };
}
function column_getSize(column) {
  const defaultSizes = getDefaultColumnSizingColumnDef();
  const columnSizing = column.table.atoms.columnSizing?.get();
  const columnSize = columnSizing && hasOwn(columnSizing, column.id) ? columnSizing[column.id] : void 0;
  return Math.min(Math.max(column.columnDef.minSize ?? defaultSizes.minSize, columnSize ?? column.columnDef.size ?? defaultSizes.size), column.columnDef.maxSize ?? defaultSizes.maxSize);
}
function buildColumnOffsets(columns) {
  const starts = makeObjectMap();
  const afters = makeObjectMap();
  const sizes = new Array(columns.length);
  let start = 0;
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    const size = callMemoOrStaticFn(column, "getSize", column_getSize);
    sizes[i] = size;
    starts[column.id] = start;
    start += size;
  }
  let after = 0;
  for (let i = columns.length - 1; i >= 0; i--) {
    afters[columns[i].id] = after;
    after += sizes[i];
  }
  return {
    starts,
    afters
  };
}
function table_getColumnOffsets(table) {
  return {
    all: buildColumnOffsets(table_getPinnedVisibleLeafColumns(table)),
    center: buildColumnOffsets(table_getPinnedVisibleLeafColumns(table, "center")),
    start: buildColumnOffsets(table_getPinnedVisibleLeafColumns(table, "start")),
    end: buildColumnOffsets(table_getPinnedVisibleLeafColumns(table, "end"))
  };
}
function toOffsetsKey(position) {
  return position === "start" ? "start" : position === "end" ? "end" : position === "center" ? "center" : "all";
}
function column_getStart(column, position) {
  return callMemoOrStaticFn(column.table, "getColumnOffsets", table_getColumnOffsets)[toOffsetsKey(position)].starts[column.id] ?? 0;
}
function column_getAfter(column, position) {
  return callMemoOrStaticFn(column.table, "getColumnOffsets", table_getColumnOffsets)[toOffsetsKey(position)].afters[column.id] ?? 0;
}
function column_resetSize(column) {
  table_setColumnSizing(column.table, (old) => {
    const rest = makeObjectMap();
    const columnIds = Object.keys(old);
    for (let i = 0; i < columnIds.length; i++) {
      const columnId = columnIds[i];
      if (columnId !== column.id) rest[columnId] = old[columnId];
    }
    return rest;
  });
}
function sumHeaderSize(header) {
  if (!header.subHeaders.length) return column_getSize(header.column);
  let sum = 0;
  for (let i = 0; i < header.subHeaders.length; i++) sum += sumHeaderSize(header.subHeaders[i]);
  return sum;
}
function header_getSize(header) {
  return sumHeaderSize(header);
}
function header_getStart(header) {
  if (header.index > 0) {
    const prevSiblingHeader = header.headerGroup?.headers[header.index - 1];
    if (prevSiblingHeader) return callMemoOrStaticFn(prevSiblingHeader, "getStart", header_getStart) + callMemoOrStaticFn(prevSiblingHeader, "getSize", header_getSize);
  }
  return 0;
}
function table_setColumnSizing(table, updater) {
  table.options.onColumnSizingChange?.(updater);
}
function table_resetColumnSizing(table, defaultState) {
  table_setColumnSizing(table, defaultState ? makeObjectMap() : Object.assign(makeObjectMap(), cloneState(table.initialState.columnSizing ?? {})));
}
function table_getTotalSize(table) {
  return table.getHeaderGroups()[0]?.headers.reduce((sum, header) => {
    return sum + header_getSize(header);
  }, 0) ?? 0;
}
function table_getStartTotalSize(table) {
  return callMemoOrStaticFn(table, "getStartHeaderGroups", table_getStartHeaderGroups)[0]?.headers.reduce((sum, header) => {
    return sum + header_getSize(header);
  }, 0) ?? 0;
}
function table_getCenterTotalSize(table) {
  return callMemoOrStaticFn(table, "getCenterHeaderGroups", table_getCenterHeaderGroups)[0]?.headers.reduce((sum, header) => {
    return sum + header_getSize(header);
  }, 0) ?? 0;
}
function table_getEndTotalSize(table) {
  return callMemoOrStaticFn(table, "getEndHeaderGroups", table_getEndHeaderGroups)[0]?.headers.reduce((sum, header) => {
    return sum + header_getSize(header);
  }, 0) ?? 0;
}

// node_modules/@tanstack/table-core/dist/features/column-resizing/columnResizingFeature.utils.js
function getDefaultColumnResizingState() {
  return {
    startOffset: null,
    startSize: null,
    deltaOffset: null,
    deltaPercentage: null,
    isResizingColumn: false,
    columnSizingStart: []
  };
}
function column_getCanResize(column) {
  return (column.columnDef.enableResizing ?? true) && (column.table.options.enableColumnResizing ?? true);
}
function column_getIsResizing(column) {
  return column.table.atoms.columnResizing?.get()?.isResizingColumn === column.id;
}
function header_getResizeHandler(header, _contextDocument) {
  const column = header.table.getColumn(header.column.id);
  const canResize = column_getCanResize(column);
  return (event) => {
    if (!canResize) return;
    if (isTouchStartEvent(event)) {
      if (event.touches.length > 1) return;
    }
    const startSize = header_getSize(header);
    const columnSizingStart = header.getLeafHeaders().map((leafHeader) => [leafHeader.column.id, column_getSize(leafHeader.column)]);
    const clientX = isTouchStartEvent(event) ? Math.round(event.touches[0].clientX) : event.clientX;
    const newColumnSizing = makeObjectMap();
    const updateOffset = (eventType, clientXPos) => {
      if (typeof clientXPos !== "number") return;
      const table = column.table;
      const isCommit = table.options.columnResizeMode === "onChange" || eventType === "end";
      table._reactivity.batch(() => {
        table_setColumnResizing(table, (old) => {
          const deltaDirection = table.options.columnResizeDirection === "rtl" ? -1 : 1;
          const deltaOffset = (clientXPos - (old.startOffset ?? 0)) * deltaDirection;
          const startSize2 = old.startSize ?? 0;
          const deltaPercentage = Math.max(startSize2 > 0 ? deltaOffset / startSize2 : 0, -0.999999);
          if (isCommit) {
            const columnSizingStart2 = old.columnSizingStart;
            for (let i = 0; i < columnSizingStart2.length; i++) {
              const entry = columnSizingStart2[i];
              const headerSize = entry[1];
              newColumnSizing[entry[0]] = Math.round(Math.max(headerSize > 0 ? headerSize + headerSize * deltaPercentage : deltaOffset / columnSizingStart2.length, 0) * 100) / 100;
            }
          }
          return __spreadProps(__spreadValues({}, old), {
            deltaOffset,
            deltaPercentage
          });
        });
        if (isCommit) table_setColumnSizing(table, (old) => Object.assign(makeObjectMap(), old, newColumnSizing));
      });
    };
    let moveRafId = null;
    let hasPendingMove = false;
    let latestMoveX;
    const flushMove = () => {
      if (hasPendingMove) {
        hasPendingMove = false;
        updateOffset("move", latestMoveX);
        moveRafId = requestAnimationFrame(flushMove);
      } else moveRafId = null;
    };
    const onMove = (clientXPos) => {
      latestMoveX = clientXPos;
      if (typeof requestAnimationFrame !== "function") {
        updateOffset("move", clientXPos);
        return;
      }
      if (moveRafId !== null) {
        hasPendingMove = true;
        return;
      }
      updateOffset("move", clientXPos);
      moveRafId = requestAnimationFrame(flushMove);
    };
    const onEnd = (clientXPos) => {
      if (moveRafId !== null) {
        cancelAnimationFrame(moveRafId);
        moveRafId = null;
        hasPendingMove = false;
      }
      column.table._reactivity.batch(() => {
        updateOffset("end", clientXPos ?? latestMoveX);
        table_setColumnResizing(column.table, (old) => __spreadProps(__spreadValues({}, old), {
          isResizingColumn: false,
          startOffset: null,
          startSize: null,
          deltaOffset: null,
          deltaPercentage: null,
          columnSizingStart: []
        }));
      });
    };
    const contextDocument = _contextDocument || (typeof document !== "undefined" ? document : null);
    const mouseEvents = {
      moveHandler: (e) => onMove(e.clientX),
      upHandler: (e) => {
        contextDocument?.removeEventListener("mousemove", mouseEvents.moveHandler);
        contextDocument?.removeEventListener("mouseup", mouseEvents.upHandler);
        onEnd(e.clientX);
      }
    };
    const touchEvents = {
      moveHandler: (touchEvent) => {
        if (touchEvent.cancelable) {
          touchEvent.preventDefault();
          touchEvent.stopPropagation();
        }
        onMove(touchEvent.touches[0].clientX);
        return false;
      },
      upHandler: (e) => {
        removeTouchEvents();
        if (e.cancelable) {
          e.preventDefault();
          e.stopPropagation();
        }
        onEnd(e.touches[0]?.clientX);
      },
      cancelHandler: () => {
        removeTouchEvents();
        onEnd();
      }
    };
    const removeTouchEvents = () => {
      contextDocument?.removeEventListener("touchmove", touchEvents.moveHandler);
      contextDocument?.removeEventListener("touchend", touchEvents.upHandler);
      contextDocument?.removeEventListener("touchcancel", touchEvents.cancelHandler);
    };
    const passiveIfSupported = passiveEventSupported() ? { passive: false } : false;
    if (isTouchStartEvent(event)) {
      contextDocument?.addEventListener("touchmove", touchEvents.moveHandler, passiveIfSupported);
      contextDocument?.addEventListener("touchend", touchEvents.upHandler, passiveIfSupported);
      contextDocument?.addEventListener("touchcancel", touchEvents.cancelHandler, passiveIfSupported);
    } else {
      contextDocument?.addEventListener("mousemove", mouseEvents.moveHandler, passiveIfSupported);
      contextDocument?.addEventListener("mouseup", mouseEvents.upHandler, passiveIfSupported);
    }
    table_setColumnResizing(column.table, (old) => __spreadProps(__spreadValues({}, old), {
      startOffset: clientX,
      startSize,
      deltaOffset: 0,
      deltaPercentage: 0,
      columnSizingStart,
      isResizingColumn: column.id
    }));
  };
}
function table_setColumnResizing(table, updater) {
  table.options.onColumnResizingChange?.(updater);
}
function table_resetHeaderSizeInfo(table, defaultState) {
  table_setColumnResizing(table, defaultState ? getDefaultColumnResizingState() : cloneState(table.initialState.columnResizing ?? getDefaultColumnResizingState()));
}
var passiveSupported = null;
function passiveEventSupported() {
  if (typeof passiveSupported === "boolean") return passiveSupported;
  let supported = false;
  try {
    const options = { get passive() {
      supported = true;
      return false;
    } };
    const noop = () => {
    };
    window.addEventListener("test", noop, options);
    window.removeEventListener("test", noop);
  } catch (err) {
    supported = false;
  }
  passiveSupported = supported;
  return passiveSupported;
}
function isTouchStartEvent(e) {
  return e.type === "touchstart";
}

// node_modules/@tanstack/table-core/dist/features/column-resizing/columnResizingFeature.js
var columnResizingFeature = {
  getInitialState: (initialState) => {
    return __spreadValues({
      columnResizing: getDefaultColumnResizingState()
    }, initialState);
  },
  getDefaultTableOptions: (table) => {
    return {
      columnResizeMode: "onEnd",
      columnResizeDirection: "ltr",
      onColumnResizingChange: makeStateUpdater("columnResizing", table)
    };
  },
  assignColumnPrototype: (prototype, table) => {
    assignPrototypeAPIs("columnResizingFeature", prototype, table, {
      column_getCanResize: { fn: (column) => column_getCanResize(column) },
      column_getIsResizing: { fn: (column) => column_getIsResizing(column) }
    });
  },
  assignHeaderPrototype: (prototype, table) => {
    assignPrototypeAPIs("columnResizingFeature", prototype, table, { header_getResizeHandler: { fn: (header, _contextDocument) => header_getResizeHandler(header, _contextDocument) } });
  },
  constructTableAPIs: (table) => {
    assignTableAPIs("columnResizingFeature", table, {
      table_setColumnResizing: { fn: (updater) => table_setColumnResizing(table, updater) },
      table_resetHeaderSizeInfo: { fn: (defaultState) => table_resetHeaderSizeInfo(table, defaultState) }
    });
  }
};

// node_modules/@tanstack/table-core/dist/features/column-sizing/columnSizingFeature.js
var columnSizingFeature = {
  getInitialState: (initialState) => {
    return __spreadValues({
      columnSizing: getDefaultColumnSizingState()
    }, initialState);
  },
  getDefaultColumnDef: () => {
    return getDefaultColumnSizingColumnDef();
  },
  getDefaultTableOptions: (table) => {
    return { onColumnSizingChange: makeStateUpdater("columnSizing", table) };
  },
  assignColumnPrototype: (prototype, table) => {
    assignPrototypeAPIs("columnSizingFeature", prototype, table, {
      column_getSize: {
        fn: (column) => column_getSize(column),
        memoDeps: (column) => [table.options.columns, table.atoms.columnSizing?.get()?.[column.id]]
      },
      column_getStart: { fn: (column, position) => column_getStart(column, position) },
      column_getAfter: { fn: (column, position) => column_getAfter(column, position) },
      column_resetSize: { fn: (column) => column_resetSize(column) }
    });
  },
  assignHeaderPrototype: (prototype, table) => {
    assignPrototypeAPIs("columnSizingFeature", prototype, table, {
      header_getSize: {
        fn: (header) => header_getSize(header),
        memoDeps: (header) => [table.options.columns, header.column.columns.length > 0 ? table.atoms.columnSizing?.get() : table.atoms.columnSizing?.get()?.[header.column.id]]
      },
      header_getStart: {
        fn: (header) => header_getStart(header),
        memoDeps: () => [
          table.options.columns,
          table.atoms.columnSizing?.get(),
          table.atoms.columnOrder?.get(),
          table.atoms.columnPinning?.get(),
          table.atoms.columnVisibility?.get(),
          table.atoms.grouping?.get(),
          table.options.groupedColumnMode
        ]
      }
    });
  },
  constructTableAPIs: (table) => {
    assignTableAPIs("columnSizingFeature", table, {
      table_getColumnOffsets: {
        fn: () => table_getColumnOffsets(table),
        memoDeps: () => [
          table.options.columns,
          table.atoms.columnSizing?.get(),
          table.atoms.columnOrder?.get(),
          table.atoms.columnPinning?.get(),
          table.atoms.columnVisibility?.get(),
          table.atoms.grouping?.get(),
          table.options.groupedColumnMode
        ]
      },
      table_setColumnSizing: { fn: (updater) => table_setColumnSizing(table, updater) },
      table_resetColumnSizing: { fn: (defaultState) => table_resetColumnSizing(table, defaultState) },
      table_getTotalSize: {
        fn: () => table_getTotalSize(table),
        memoDeps: () => [table.atoms.columnSizing?.get(), table.getHeaderGroups()]
      },
      table_getStartTotalSize: {
        fn: () => table_getStartTotalSize(table),
        memoDeps: () => [table.atoms.columnSizing?.get(), table.getHeaderGroups()]
      },
      table_getCenterTotalSize: {
        fn: () => table_getCenterTotalSize(table),
        memoDeps: () => [table.atoms.columnSizing?.get(), table.getHeaderGroups()]
      },
      table_getEndTotalSize: {
        fn: () => table_getEndTotalSize(table),
        memoDeps: () => [table.atoms.columnSizing?.get(), table.getHeaderGroups()]
      }
    });
  }
};

// node_modules/@tanstack/table-core/dist/features/column-visibility/columnVisibilityFeature.js
var columnVisibilityFeature = {
  getInitialState: (initialState) => {
    return __spreadValues({
      columnVisibility: getDefaultColumnVisibilityState()
    }, initialState);
  },
  getDefaultTableOptions: (table) => {
    return { onColumnVisibilityChange: makeStateUpdater("columnVisibility", table) };
  },
  assignColumnPrototype: (prototype, table) => {
    assignPrototypeAPIs("columnVisibilityFeature", prototype, table, {
      column_getIsVisible: {
        fn: (column) => column_getIsVisible(column),
        memoDeps: (column) => [
          table.options.columns,
          table.atoms.columnVisibility?.get(),
          column.columns
        ]
      },
      column_getCanHide: { fn: (column) => column_getCanHide(column) },
      column_getToggleVisibilityHandler: { fn: (column) => column_getToggleVisibilityHandler(column) },
      column_toggleVisibility: { fn: (column, visible) => column_toggleVisibility(column, visible) }
    });
  },
  assignRowPrototype: (prototype, table) => {
    assignPrototypeAPIs("columnVisibilityFeature", prototype, table, {
      row_getVisibleCells: {
        fn: (row) => row_getVisibleCells(row),
        memoDeps: (row) => [
          row.getAllCells(),
          table.atoms.columnPinning?.get(),
          table.atoms.columnVisibility?.get()
        ]
      },
      row_getVisibleCellsByColumnId: {
        fn: (row) => row_getVisibleCellsByColumnId(row),
        memoDeps: (row) => [row.getAllCells(), table.atoms.columnVisibility?.get()]
      }
    });
  },
  constructTableAPIs: (table) => {
    assignTableAPIs("columnVisibilityFeature", table, {
      table_getVisibleFlatColumns: {
        fn: () => table_getVisibleFlatColumns(table),
        memoDeps: () => [
          table.atoms.columnVisibility?.get(),
          table.atoms.columnOrder?.get(),
          table.atoms.grouping?.get(),
          table.options.columns,
          table.options.groupedColumnMode
        ]
      },
      table_getVisibleLeafColumns: {
        fn: () => table_getVisibleLeafColumns(table),
        memoDeps: () => [
          table.atoms.columnVisibility?.get(),
          table.atoms.columnOrder?.get(),
          table.atoms.grouping?.get(),
          table.options.columns,
          table.options.groupedColumnMode
        ]
      },
      table_setColumnVisibility: { fn: (updater) => table_setColumnVisibility(table, updater) },
      table_resetColumnVisibility: { fn: (defaultState) => table_resetColumnVisibility(table, defaultState) },
      table_toggleAllColumnsVisible: { fn: (value) => table_toggleAllColumnsVisible(table, value) },
      table_getIsAllColumnsVisible: { fn: () => table_getIsAllColumnsVisible(table) },
      table_getIsSomeColumnsVisible: { fn: () => table_getIsSomeColumnsVisible(table) },
      table_getToggleAllColumnsVisibilityHandler: { fn: () => table_getToggleAllColumnsVisibilityHandler(table) }
    });
  }
};

// node_modules/@tanstack/table-core/dist/features/column-filtering/filterFns.js
function constructFilterFn(def) {
  const filterFn = Object.assign((row, columnId, filterValue, addMeta) => {
    const rawValue = row.getValue(columnId);
    const dataValue = filterFn.resolveDataValue ? filterFn.resolveDataValue(rawValue) : rawValue;
    return filterFn.filter(dataValue, filterValue, row, columnId, addMeta);
  }, def);
  return filterFn;
}
var filterFn_equals = constructFilterFn({
  filter: (dataValue, filterValue) => dataValue === filterValue,
  autoRemove: (val) => testFalsy(val)
});
var filterFn_weakEquals = constructFilterFn({
  filter: (dataValue, filterValue) => dataValue == filterValue,
  autoRemove: (val) => testFalsy(val)
});
var filterFn_includesStringSensitive = constructFilterFn({
  filter: (dataValue, filterValue) => Boolean(dataValue?.includes(filterValue)),
  autoRemove: (val) => testFalsy(val),
  resolveFilterValue: (val) => String(val),
  resolveDataValue: (val) => val == null ? void 0 : String(val)
});
var filterFn_includesString = constructFilterFn({
  filter: (dataValue, filterValue) => Boolean(dataValue?.includes(filterValue)),
  autoRemove: (val) => testFalsy(val),
  resolveFilterValue: (val) => String(val).toLowerCase(),
  resolveDataValue: (val) => val == null ? void 0 : String(val).toLowerCase()
});
var filterFn_equalsString = constructFilterFn({
  filter: (dataValue, filterValue) => dataValue === filterValue,
  autoRemove: (val) => testFalsy(val),
  resolveFilterValue: (val) => String(val).toLowerCase(),
  resolveDataValue: (val) => val == null ? void 0 : String(val).toLowerCase()
});
var filterFn_equalsStringSensitive = constructFilterFn({
  filter: (dataValue, filterValue) => dataValue === filterValue,
  autoRemove: (val) => testFalsy(val),
  resolveFilterValue: (val) => String(val),
  resolveDataValue: (val) => val == null ? void 0 : String(val)
});
var filterFn_startsWith = constructFilterFn({
  filter: (dataValue, filterValue) => Boolean(dataValue?.startsWith(filterValue)),
  autoRemove: (val) => testFalsy(val),
  resolveFilterValue: (val) => String(val).toLowerCase(),
  resolveDataValue: (val) => val == null ? void 0 : String(val).toLowerCase()
});
var filterFn_endsWith = constructFilterFn({
  filter: (dataValue, filterValue) => Boolean(dataValue?.endsWith(filterValue)),
  autoRemove: (val) => testFalsy(val),
  resolveFilterValue: (val) => String(val).toLowerCase(),
  resolveDataValue: (val) => val == null ? void 0 : String(val).toLowerCase()
});
var filterFn_empty = constructFilterFn({
  filter: (dataValue) => testValueEmpty(dataValue),
  autoRemove: (val) => testFalsy(val) || val === false
});
var filterFn_notEmpty = constructFilterFn({
  filter: (dataValue) => !testValueEmpty(dataValue),
  autoRemove: (val) => testFalsy(val) || val === false
});
var filterFn_greaterThan = constructFilterFn({
  filter: (dataValue, filterValue) => compareGreaterThan(dataValue, filterValue),
  autoRemove: (val) => testFalsy(val)
});
var filterFn_greaterThanOrEqualTo = constructFilterFn({
  filter: (dataValue, filterValue) => compareGreaterThanOrEqualTo(dataValue, filterValue),
  autoRemove: (val) => testFalsy(val)
});
var filterFn_lessThan = constructFilterFn({
  filter: (dataValue, filterValue) => !compareGreaterThanOrEqualTo(dataValue, filterValue),
  autoRemove: (val) => testFalsy(val)
});
var filterFn_lessThanOrEqualTo = constructFilterFn({
  filter: (dataValue, filterValue) => !compareGreaterThan(dataValue, filterValue),
  autoRemove: (val) => testFalsy(val)
});
var filterFn_between = constructFilterFn({
  filter: (dataValue, filterValues) => compareBetween(dataValue, filterValues, false),
  autoRemove: (val) => testFalsy(val) || Array.isArray(val) && testFalsy(val[0]) && testFalsy(val[1])
});
var filterFn_betweenInclusive = constructFilterFn({
  filter: (dataValue, filterValues) => compareBetween(dataValue, filterValues, true),
  autoRemove: (val) => testFalsy(val) || Array.isArray(val) && testFalsy(val[0]) && testFalsy(val[1])
});
var filterFn_inNumberRange = constructFilterFn({
  filter: (dataValue, filterValue) => {
    if (typeof dataValue !== "number" || Number.isNaN(dataValue)) return false;
    const [min, max] = filterValue;
    return dataValue >= min && dataValue <= max;
  },
  resolveFilterValue: (val) => {
    const [unsafeMin, unsafeMax] = val;
    const parsedMin = typeof unsafeMin !== "number" ? parseFloat(unsafeMin) : unsafeMin;
    const parsedMax = typeof unsafeMax !== "number" ? parseFloat(unsafeMax) : unsafeMax;
    let min = unsafeMin === null || Number.isNaN(parsedMin) ? -Infinity : parsedMin;
    let max = unsafeMax === null || Number.isNaN(parsedMax) ? Infinity : parsedMax;
    if (min > max) {
      const temp = min;
      min = max;
      max = temp;
    }
    return [min, max];
  },
  autoRemove: (val) => testFalsy(val) || Array.isArray(val) && testFalsy(val[0]) && testFalsy(val[1])
});
var filterFn_inDateRange = constructFilterFn({
  filter: (dataValue, filterValue) => {
    const [min, max] = filterValue;
    return dataValue >= min && dataValue <= max;
  },
  resolveFilterValue: (val) => {
    const [unsafeMin, unsafeMax] = val;
    const parsedMin = toDateTimestamp(unsafeMin);
    const parsedMax = toDateTimestamp(unsafeMax);
    let min = Number.isNaN(parsedMin) ? -Infinity : parsedMin;
    let max = Number.isNaN(parsedMax) ? Infinity : parsedMax;
    if (min > max) {
      const temp = min;
      min = max;
      max = temp;
    }
    return [min, max];
  },
  resolveDataValue: (val) => toDateTimestamp(val),
  autoRemove: (val) => testFalsy(val) || Array.isArray(val) && testFalsy(val[0]) && testFalsy(val[1])
});
var filterFn_arrHas = constructFilterFn({
  filter: (dataValue, filterValue) => {
    for (let i = 0; i < filterValue.length; i++) if (dataValue === filterValue[i]) return true;
    return false;
  },
  autoRemove: (val) => testFalsy(val) || !val?.length
});
var filterFn_arrIncludes = constructFilterFn({
  filter: (dataValue, filterValue) => {
    if (typeof dataValue !== "string" && !Array.isArray(dataValue)) return false;
    for (let i = 0; i < filterValue.length; i++) if (dataValue.includes(filterValue[i])) return true;
    return false;
  },
  autoRemove: (val) => testFalsy(val) || !val?.length
});
var filterFn_arrIncludesAll = constructFilterFn({
  filter: (dataValue, filterValue) => {
    if (!Array.isArray(dataValue)) return false;
    for (let i = 0; i < filterValue.length; i++) if (!dataValue.includes(filterValue[i])) return false;
    return true;
  },
  autoRemove: (val) => testFalsy(val) || !val?.length
});
var filterFn_arrIncludesSome = constructFilterFn({
  filter: (dataValue, filterValue) => {
    if (!Array.isArray(dataValue)) return false;
    for (let i = 0; i < filterValue.length; i++) if (dataValue.includes(filterValue[i])) return true;
    return false;
  },
  autoRemove: (val) => testFalsy(val) || !val?.length
});
var filterFns = {
  arrIncludes: filterFn_arrIncludes,
  arrIncludesAll: filterFn_arrIncludesAll,
  arrHas: filterFn_arrHas,
  arrIncludesSome: filterFn_arrIncludesSome,
  between: filterFn_between,
  betweenInclusive: filterFn_betweenInclusive,
  empty: filterFn_empty,
  endsWith: filterFn_endsWith,
  equals: filterFn_equals,
  equalsString: filterFn_equalsString,
  equalsStringSensitive: filterFn_equalsStringSensitive,
  inDateRange: filterFn_inDateRange,
  inNumberRange: filterFn_inNumberRange,
  includesString: filterFn_includesString,
  includesStringSensitive: filterFn_includesStringSensitive,
  notEmpty: filterFn_notEmpty,
  startsWith: filterFn_startsWith,
  weakEquals: filterFn_weakEquals
};
function testFalsy(val) {
  return val === void 0 || val === null || val === "";
}
function testValueEmpty(dataValue) {
  return dataValue == null || String(dataValue).trim() === "";
}
function toDateTimestamp(value) {
  if (value instanceof Date) return value.getTime();
  if (typeof value === "number") return value;
  if (value == null || value === "") return NaN;
  return new Date(value).getTime();
}
function compareGreaterThan(dataValue, filterValue) {
  const numericDataValue = dataValue == null ? 0 : +dataValue;
  const numericFilterValue = Number(filterValue);
  if (!isNaN(numericFilterValue) && !isNaN(numericDataValue)) return numericDataValue > numericFilterValue;
  return String(dataValue ?? "").toLowerCase().trim() > String(filterValue).toLowerCase().trim();
}
function compareGreaterThanOrEqualTo(dataValue, filterValue) {
  return dataValue === filterValue || compareGreaterThan(dataValue, filterValue);
}
function compareBetween(dataValue, filterValues, inclusive) {
  const min = filterValues[0];
  const hasMin = min !== "" && min !== void 0;
  if (hasMin) {
    if (!(inclusive ? compareGreaterThanOrEqualTo(dataValue, min) : compareGreaterThan(dataValue, min))) return false;
  }
  const max = filterValues[1];
  if (max === "" || max === void 0) return true;
  if (hasMin) {
    const numericMin = Number(min);
    const numericMax = Number(max);
    if (!isNaN(numericMin) && !isNaN(numericMax) && numericMin > numericMax) return true;
  }
  return inclusive ? !compareGreaterThan(dataValue, max) : !compareGreaterThanOrEqualTo(dataValue, max);
}

// node_modules/@tanstack/table-core/dist/features/global-filtering/globalFilteringFeature.utils.js
function column_getCanGlobalFilter(column) {
  return (column.columnDef.enableGlobalFilter ?? true) && (column.table.options.enableGlobalFilter ?? true) && (column.table.options.enableFilters ?? true) && (column.table.options.getColumnCanGlobalFilter?.(column) ?? true) && !!column.accessorFn;
}
function table_getGlobalAutoFilterFn() {
  return filterFn_includesString;
}
function table_getGlobalFilterFn(table) {
  const { globalFilterFn } = table.options;
  const filterFns2 = table._rowModelFns.filterFns;
  const filterFn = isFunction(globalFilterFn) ? globalFilterFn : globalFilterFn === "auto" ? table_getGlobalAutoFilterFn() : filterFns2?.[globalFilterFn];
  if (!filterFn && globalFilterFn != null) console.warn(`globalFilterFn '${String(globalFilterFn)}' is not registered`);
  return filterFn;
}
function table_setGlobalFilter(table, updater) {
  table.options.onGlobalFilterChange?.(updater);
}
function table_resetGlobalFilter(table, defaultState) {
  table_setGlobalFilter(table, defaultState ? void 0 : cloneState(table.initialState.globalFilter));
}

// node_modules/@tanstack/table-core/dist/features/global-filtering/globalFilteringFeature.js
var globalFilteringFeature = {
  getInitialState: (initialState) => {
    return __spreadValues({
      globalFilter: void 0
    }, initialState);
  },
  getDefaultTableOptions: (table) => {
    return {
      onGlobalFilterChange: makeStateUpdater("globalFilter", table),
      globalFilterFn: "auto",
      getColumnCanGlobalFilter: (column) => {
        if ("enableGlobalFilter" in column.columnDef && column.columnDef.enableGlobalFilter === true) return true;
        const value = table.getCoreRowModel().flatRows.find((row) => row.getAllCellsByColumnId()[column.id]?.getValue() != null)?.getAllCellsByColumnId()[column.id]?.getValue();
        return typeof value === "string" || typeof value === "number";
      }
    };
  },
  assignColumnPrototype: (prototype, table) => {
    assignPrototypeAPIs("globalFilteringFeature", prototype, table, { column_getCanGlobalFilter: { fn: (column) => column_getCanGlobalFilter(column) } });
  },
  constructTableAPIs: (table) => {
    assignTableAPIs("globalFilteringFeature", table, {
      table_getGlobalAutoFilterFn: { fn: () => table_getGlobalAutoFilterFn() },
      table_getGlobalFilterFn: { fn: () => table_getGlobalFilterFn(table) },
      table_setGlobalFilter: { fn: (updater) => table_setGlobalFilter(table, updater) },
      table_resetGlobalFilter: { fn: (defaultState) => table_resetGlobalFilter(table, defaultState) }
    });
  }
};

// node_modules/@tanstack/table-core/dist/features/row-expanding/rowExpandingFeature.js
var rowExpandingFeature = {
  getInitialState: (initialState) => {
    return __spreadValues({
      expanded: getDefaultExpandedState()
    }, initialState);
  },
  getDefaultTableOptions: (table) => {
    return {
      onExpandedChange: makeStateUpdater("expanded", table),
      paginateExpandedRows: true
    };
  },
  assignRowPrototype: (prototype, table) => {
    assignPrototypeAPIs("rowExpandingFeature", prototype, table, {
      row_toggleExpanded: { fn: (row, expanded) => row_toggleExpanded(row, expanded) },
      row_getIsExpanded: { fn: (row) => row_getIsExpanded(row) },
      row_getCanExpand: { fn: (row) => row_getCanExpand(row) },
      row_getIsAllParentsExpanded: { fn: (row) => row_getIsAllParentsExpanded(row) },
      row_getToggleExpandedHandler: { fn: (row) => row_getToggleExpandedHandler(row) }
    });
  },
  constructTableAPIs: (table) => {
    assignTableAPIs("rowExpandingFeature", table, {
      table_autoResetExpanded: { fn: () => table_autoResetExpanded(table) },
      table_setExpanded: { fn: (updater) => table_setExpanded(table, updater) },
      table_toggleAllRowsExpanded: { fn: (expanded) => table_toggleAllRowsExpanded(table, expanded) },
      table_resetExpanded: { fn: (defaultState) => table_resetExpanded(table, defaultState) },
      table_getCanSomeRowsExpand: { fn: () => table_getCanSomeRowsExpand(table) },
      table_getToggleAllRowsExpandedHandler: { fn: () => table_getToggleAllRowsExpandedHandler(table) },
      table_getIsSomeRowsExpanded: { fn: () => table_getIsSomeRowsExpanded(table) },
      table_getIsAllRowsExpanded: { fn: () => table_getIsAllRowsExpanded(table) },
      table_getExpandedDepth: { fn: () => table_getExpandedDepth(table) }
    });
  }
};

// node_modules/@tanstack/table-core/dist/features/row-pagination/rowPaginationFeature.js
var rowPaginationFeature = {
  getInitialState: (initialState) => {
    return __spreadProps(__spreadValues({}, initialState), {
      pagination: __spreadValues(__spreadValues({}, getDefaultPaginationState()), initialState.pagination)
    });
  },
  getDefaultTableOptions: (table) => {
    return { onPaginationChange: makeStateUpdater("pagination", table) };
  },
  constructTableAPIs: (table) => {
    assignTableAPIs("rowPaginationFeature", table, {
      table_autoResetPageIndex: { fn: () => table_autoResetPageIndex(table) },
      table_setPagination: { fn: (updater) => table_setPagination(table, updater) },
      table_resetPagination: { fn: (defaultState) => table_resetPagination(table, defaultState) },
      table_setPageIndex: { fn: (updater) => table_setPageIndex(table, updater) },
      table_resetPageIndex: { fn: (defaultState) => table_resetPageIndex(table, defaultState) },
      table_setPageSize: { fn: (updater) => table_setPageSize(table, updater) },
      table_getPageCount: { fn: () => table_getPageCount(table) },
      table_resetPageSize: { fn: (defaultState) => table_resetPageSize(table, defaultState) },
      table_getPageOptions: { fn: () => table_getPageOptions(table) },
      table_getCanPreviousPage: { fn: () => table_getCanPreviousPage(table) },
      table_getCanNextPage: { fn: () => table_getCanNextPage(table) },
      table_getCanLastPage: { fn: () => table_getCanLastPage(table) },
      table_previousPage: { fn: () => table_previousPage(table) },
      table_nextPage: { fn: () => table_nextPage(table) },
      table_firstPage: { fn: () => table_firstPage(table) },
      table_lastPage: { fn: () => table_lastPage(table) },
      table_getRowCount: { fn: () => table_getRowCount(table) }
    });
  }
};

// node_modules/@tanstack/table-core/dist/features/row-pinning/rowPinningFeature.utils.js
function getDefaultRowPinningState() {
  return {
    top: [],
    bottom: []
  };
}
function table_setRowPinning(table, updater) {
  setStateSlice(table, "rowPinning", updater);
}
function table_resetRowPinning(table, defaultState) {
  table_setRowPinning(table, defaultState ? getDefaultRowPinningState() : cloneState(table.initialState.rowPinning ?? getDefaultRowPinningState()));
}
function table_getIsSomeRowsPinned(table, position) {
  const rowPinning = table.atoms.rowPinning?.get();
  if (!position) return Boolean(rowPinning?.top.length || rowPinning?.bottom.length);
  return Boolean(rowPinning?.[position].length);
}
function table_getPinnedRows(table, position) {
  const visibleRows = table.getRowModel().rows;
  const pinnedRowIds = table.atoms.rowPinning?.get()?.[position] ?? [];
  const keepPinnedRows = table.options.keepPinnedRows ?? true;
  const result = [];
  for (let i = 0; i < pinnedRowIds.length; i++) {
    const rowId = pinnedRowIds[i];
    let row;
    if (keepPinnedRows) {
      const fullRow = table.getPrePaginatedRowModel().rowsById[rowId] ?? table.getCoreRowModel().rowsById[rowId];
      if (fullRow && row_getIsAllParentsExpanded(fullRow)) row = fullRow;
    } else row = visibleRows.find((r) => r.id === rowId);
    if (!row) continue;
    row.position = position;
    result.push(row);
  }
  return result;
}
function table_getTopRows(table) {
  return table_getPinnedRows(table, "top");
}
function table_getBottomRows(table) {
  return table_getPinnedRows(table, "bottom");
}
function table_getCenterRows(table) {
  const { top, bottom } = table.atoms.rowPinning?.get() ?? getDefaultRowPinningState();
  const allRows = table.getRowModel().rows;
  const topAndBottom = /* @__PURE__ */ new Set([...top, ...bottom]);
  return allRows.filter((d) => !topAndBottom.has(d.id));
}
function row_getCanPin(row) {
  const { enableRowPinning } = row.table.options;
  if (typeof enableRowPinning === "function") return enableRowPinning(row);
  return enableRowPinning ?? true;
}
function row_getIsPinned(row) {
  const { top, bottom } = row.table.atoms.rowPinning?.get() ?? getDefaultRowPinningState();
  return top.includes(row.id) ? "top" : bottom.includes(row.id) ? "bottom" : false;
}
function row_getPinnedIndex(row) {
  const position = row_getIsPinned(row);
  if (!position) return -1;
  return (position === "top" ? callMemoOrStaticFn(row.table, "getTopRows", table_getTopRows) : callMemoOrStaticFn(row.table, "getBottomRows", table_getBottomRows)).map(({ id }) => id).indexOf(row.id);
}
function row_pin(row, position, includeLeafRows, includeParentRows) {
  const leafRowIds = includeLeafRows ? row.getLeafRows().map(({ id }) => id) : [];
  const parentRowIds = includeParentRows ? row.getParentRows().map(({ id }) => id) : [];
  const rowIds = /* @__PURE__ */ new Set([
    ...parentRowIds,
    row.id,
    ...leafRowIds
  ]);
  table_setRowPinning(row.table, (old) => {
    if (position === "bottom") return {
      top: old.top.filter((d) => !rowIds.has(d)),
      bottom: [...old.bottom.filter((d) => !rowIds.has(d)), ...Array.from(rowIds)]
    };
    if (position === "top") return {
      top: [...old.top.filter((d) => !rowIds.has(d)), ...Array.from(rowIds)],
      bottom: old.bottom.filter((d) => !rowIds.has(d))
    };
    return {
      top: old.top.filter((d) => !rowIds.has(d)),
      bottom: old.bottom.filter((d) => !rowIds.has(d))
    };
  });
}

// node_modules/@tanstack/table-core/dist/features/row-pinning/rowPinningFeature.js
var rowPinningFeature = {
  getInitialState: (initialState) => {
    return __spreadProps(__spreadValues({}, initialState), {
      rowPinning: __spreadValues(__spreadValues({}, getDefaultRowPinningState()), initialState.rowPinning)
    });
  },
  getDefaultTableOptions: (table) => {
    return { onRowPinningChange: makeStateUpdater("rowPinning", table) };
  },
  assignRowPrototype: (prototype, table) => {
    assignPrototypeAPIs("rowPinningFeature", prototype, table, {
      row_getCanPin: { fn: (row) => row_getCanPin(row) },
      row_getIsPinned: { fn: (row) => row_getIsPinned(row) },
      row_getPinnedIndex: {
        fn: (row) => row_getPinnedIndex(row),
        memoDeps: (row) => [row.table.getRowModel().rows, row.table.atoms.rowPinning?.get()]
      },
      row_pin: { fn: (row, position, includeLeafRows, includeParentRows) => row_pin(row, position, includeLeafRows, includeParentRows) }
    });
  },
  constructTableAPIs: (table) => {
    assignTableAPIs("rowPinningFeature", table, {
      table_setRowPinning: { fn: (updater) => table_setRowPinning(table, updater) },
      table_resetRowPinning: { fn: (defaultState) => table_resetRowPinning(table, defaultState) },
      table_getIsSomeRowsPinned: { fn: (position) => table_getIsSomeRowsPinned(table, position) },
      table_getTopRows: {
        fn: () => table_getTopRows(table),
        memoDeps: () => [table.getRowModel().rows, table.atoms.rowPinning?.get()?.top]
      },
      table_getBottomRows: {
        fn: () => table_getBottomRows(table),
        memoDeps: () => [table.getRowModel().rows, table.atoms.rowPinning?.get()?.bottom]
      },
      table_getCenterRows: {
        fn: () => table_getCenterRows(table),
        memoDeps: () => [table.getRowModel().rows, table.atoms.rowPinning?.get()]
      }
    });
  }
};

// node_modules/@tanstack/table-core/dist/features/row-selection/rowSelectionFeature.utils.js
function getDefaultRowSelectionState() {
  return makeObjectMap();
}
function table_setRowSelection(table, updater) {
  table.options.onRowSelectionChange?.(updater);
}
function table_resetRowSelection(table, defaultState) {
  table._lastSelectedRowId = null;
  table_setRowSelection(table, defaultState ? makeObjectMap() : Object.assign(makeObjectMap(), cloneState(table.initialState.rowSelection ?? {})));
}
function table_toggleAllRowsSelected(table, value, opts) {
  table._lastSelectedRowId = null;
  table_setRowSelection(table, (old) => {
    value = typeof value !== "undefined" ? value : !callMemoOrStaticFn(table, "getIsAllRowsSelected", table_getIsAllRowsSelected);
    if (opts?.deselectAll && !value) return makeObjectMap();
    const rowSelection = Object.assign(makeObjectMap(), old);
    const preGroupedFlatRows = table.getPreGroupedRowModel().flatRows;
    if (value) {
      const subtreeCache = /* @__PURE__ */ new Map();
      preGroupedFlatRows.forEach((row) => {
        if (isRowSelectableInSelectAll(row, subtreeCache)) rowSelection[row.id] = true;
      });
    } else preGroupedFlatRows.forEach((row) => {
      if (row_getCanSelect(row)) delete rowSelection[row.id];
    });
    return rowSelection;
  });
}
function table_toggleAllPageRowsSelected(table, value, opts) {
  table._lastSelectedRowId = null;
  table_setRowSelection(table, (old) => {
    const resolvedValue = typeof value !== "undefined" ? value : !callMemoOrStaticFn(table, "getIsAllPageRowsSelected", table_getIsAllPageRowsSelected);
    if (opts?.deselectAll && !resolvedValue) return makeObjectMap();
    const rowSelection = Object.assign(makeObjectMap(), old);
    table.getRowModel().rows.forEach((row) => {
      mutateRowIsSelected(rowSelection, row.id, resolvedValue, true, table, true);
    });
    return rowSelection;
  });
}
function table_getPreSelectedRowModel(table) {
  return table.getCoreRowModel();
}
function table_getSelectedRowModel(table) {
  const rowModel = table.getCoreRowModel();
  if (!callMemoOrStaticFn(table, "getIsSomeRowsSelected", table_getIsSomeRowsSelected)) return {
    rows: [],
    flatRows: [],
    rowsById: makeObjectMap()
  };
  return selectRowsFn(rowModel, table);
}
function table_getFilteredSelectedRowModel(table) {
  const rowModel = table.getFilteredRowModel();
  if (!callMemoOrStaticFn(table, "getIsSomeRowsSelected", table_getIsSomeRowsSelected)) return {
    rows: [],
    flatRows: [],
    rowsById: makeObjectMap()
  };
  return selectRowsFn(rowModel, table);
}
function table_getGroupedSelectedRowModel(table) {
  const rowModel = table.getSortedRowModel();
  if (!callMemoOrStaticFn(table, "getIsSomeRowsSelected", table_getIsSomeRowsSelected)) return {
    rows: [],
    flatRows: [],
    rowsById: makeObjectMap()
  };
  return selectRowsFn(rowModel, table);
}
function table_getSelectedRowIds(table) {
  return Object.keys(table.atoms.rowSelection?.get() ?? {});
}
function table_getIsAllRowsSelected(table) {
  const preGroupedFlatRows = table.getFilteredRowModel().flatRows;
  const rowSelection = table.atoms.rowSelection?.get() ?? {};
  let isAllRowsSelected = Boolean(preGroupedFlatRows.length && Object.keys(rowSelection).length);
  if (isAllRowsSelected) {
    const subtreeCache = /* @__PURE__ */ new Map();
    if (preGroupedFlatRows.some((row) => !isRowSelected(row, rowSelection) && isRowSelectableInSelectAll(row, subtreeCache))) isAllRowsSelected = false;
  }
  return isAllRowsSelected;
}
function table_getIsAllPageRowsSelected(table) {
  const paginationFlatRows = table.getPaginatedRowModel().flatRows;
  const rowSelection = table.atoms.rowSelection?.get() ?? {};
  const subtreeCache = /* @__PURE__ */ new Map();
  let sawSelectableRow = false;
  for (let i = 0; i < paginationFlatRows.length; i++) {
    const row = paginationFlatRows[i];
    if (!isRowSelected(row, rowSelection)) {
      if (isRowSelectableInSelectAll(row, subtreeCache)) return false;
    } else if (!sawSelectableRow && isRowSelectableInSelectAll(row, subtreeCache)) sawSelectableRow = true;
  }
  return sawSelectableRow;
}
function table_getIsSomeRowsSelected(table) {
  return callMemoOrStaticFn(table, "getSelectedRowIds", table_getSelectedRowIds).length > 0;
}
function table_getIsSomePageRowsSelected(table) {
  return table.getPaginatedRowModel().flatRows.filter((row) => row_getCanSelect(row)).some((row) => row_getIsSelected(row) || callMemoOrStaticFn(row, "getIsSomeSelected", row_getIsSomeSelected));
}
function table_getToggleAllRowsSelectedHandler(table) {
  return (e) => {
    table_toggleAllRowsSelected(table, e.target.checked);
  };
}
function table_getToggleAllPageRowsSelectedHandler(table) {
  return (e) => {
    table_toggleAllPageRowsSelected(table, e.target.checked);
  };
}
function row_toggleSelected(row, value, opts) {
  const isSelected = row_getIsSelected(row);
  table_setRowSelection(row.table, (old) => {
    value = typeof value !== "undefined" ? value : !isSelected;
    const rowSelection = Object.assign(makeObjectMap(), old);
    mutateRowIsSelected(rowSelection, row.id, value, (opts?.selectChildren ?? true) && row_getCanMultiSelect(row), row.table);
    if (!value && opts?.deselectParents) pruneAncestorRowIds(rowSelection, row);
    return rowSelection;
  });
}
function row_getIsSelected(row) {
  return isRowSelected(row, row.table.atoms.rowSelection?.get() ?? {});
}
function row_getIsSomeSelected(row) {
  return isSubRowSelected(row) === "some";
}
function row_getIsAllSubRowsSelected(row) {
  return isSubRowSelected(row) === "all";
}
function row_getCanSelect(row) {
  const options = row.table.options;
  if (typeof options.enableRowSelection === "function") return options.enableRowSelection(row);
  return options.enableRowSelection ?? true;
}
function row_getCanSelectSubRows(row) {
  const options = row.table.options;
  if (typeof options.enableSubRowSelection === "function") return options.enableSubRowSelection(row);
  return options.enableSubRowSelection ?? true;
}
function row_getCanMultiSelect(row) {
  const options = row.table.options;
  if (typeof options.enableMultiRowSelection === "function") return options.enableMultiRowSelection(row);
  return options.enableMultiRowSelection ?? true;
}
function row_getToggleSelectedHandler(row, opts) {
  const canSelect = row_getCanSelect(row);
  return (e) => {
    if (!canSelect) return;
    const event = e;
    const table = row.table;
    const checked = event.target.checked;
    const anchorId = table._lastSelectedRowId;
    if (!(table.options.enableRowRangeSelection !== false && anchorId !== null && row_getCanMultiSelect(row) && (table.options.isRowRangeSelectionEvent?.(e) ?? false)) || !selectRowRange(row, anchorId, checked, opts)) row_toggleSelected(row, checked, opts);
    table._lastSelectedRowId = row.id;
  };
}
function selectRowRange(row, anchorId, value, opts) {
  const includeChildren = opts?.selectChildren ?? true;
  const table = row.table;
  const rows = table.getRowsInDisplayOrder();
  const anchorRow = table.getPrePaginatedRowModel().rowsById[anchorId] ?? table.getCoreRowModel().rowsById[anchorId];
  if (!anchorRow) return false;
  const anchorIndex = anchorRow.getDisplayIndex();
  const rowIndex = row.getDisplayIndex();
  const anchorAtIndex = rows[anchorIndex];
  const rowAtIndex = rows[rowIndex];
  if (anchorIndex < 0 || rowIndex < 0 || anchorIndex >= rows.length || rowIndex >= rows.length || anchorAtIndex?.id !== anchorRow.id || rowAtIndex?.id !== row.id || !row_getCanMultiSelect(anchorRow) || !row_getCanMultiSelect(row)) return false;
  const start = Math.min(anchorIndex, rowIndex);
  const end = Math.max(anchorIndex, rowIndex);
  table_setRowSelection(table, (old) => {
    const rowSelection = Object.assign(makeObjectMap(), old);
    for (let index = start; index <= end; index++) {
      const rangeRow = rows[index];
      if (!row_getCanSelect(rangeRow) || !row_getCanMultiSelect(rangeRow)) continue;
      mutateRowIsSelected(rowSelection, rangeRow.id, value, includeChildren, table);
      if (!value && opts?.deselectParents) pruneAncestorRowIds(rowSelection, rangeRow);
    }
    return rowSelection;
  });
  return true;
}
function mutateRowIsSelected(rowSelection, rowId, value, includeChildren, table, respectCanSelectOnDeselect) {
  const row = table.getRow(rowId, true);
  if (value) {
    if (!row_getCanMultiSelect(row)) Object.keys(rowSelection).forEach((key) => delete rowSelection[key]);
    if (row_getCanSelect(row)) rowSelection[rowId] = true;
  } else if (!respectCanSelectOnDeselect || row_getCanSelect(row)) delete rowSelection[rowId];
  if (includeChildren && row.subRows.length && row_getCanSelectSubRows(row)) row.subRows.forEach((r) => mutateRowIsSelected(rowSelection, r.id, value, includeChildren, table, respectCanSelectOnDeselect));
}
function isRowSelectableInSelectAll(row, subtreeCache) {
  if (!row_getCanSelect(row)) return false;
  const table = row.table;
  if (table.options.enableSubRowSelection === true) return true;
  const parentId = row.parentId;
  if (parentId === void 0) return true;
  const cached = subtreeCache.get(parentId);
  if (cached !== void 0) return cached;
  const rowsById = table.getCoreRowModel().rowsById;
  const visited = [];
  let selectable = true;
  let currentId = parentId;
  while (currentId !== void 0) {
    const known = subtreeCache.get(currentId);
    if (known !== void 0) {
      selectable = known;
      break;
    }
    visited.push(currentId);
    const parent = rowsById[currentId] ?? table.getRow(currentId, true);
    if (!row_getCanSelectSubRows(parent)) {
      selectable = false;
      break;
    }
    currentId = parent.parentId;
  }
  visited.forEach((id) => subtreeCache.set(id, selectable));
  return selectable;
}
function pruneAncestorRowIds(rowSelection, row) {
  const rowsById = row.table.getCoreRowModel().rowsById;
  let parentId = row.parentId;
  while (parentId !== void 0) {
    delete rowSelection[parentId];
    parentId = (rowsById[parentId] ?? row.table.getRow(parentId, true)).parentId;
  }
}
function selectRowsRecursively(rows, rowSelection, selectedFlatRows, selectedRowsById) {
  const result = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const isSelected = isRowSelected(row, rowSelection);
    if (isSelected) {
      selectedFlatRows.push(row);
      selectedRowsById[row.id] = row;
    }
    if (row.subRows.length) {
      const newSubRows = selectRowsRecursively(row.subRows, rowSelection, selectedFlatRows, selectedRowsById);
      if (isSelected) {
        const cloned = Object.create(Object.getPrototypeOf(row));
        copyInstancePropertiesWithoutMemos(cloned, row);
        cloned.subRows = newSubRows;
        result.push(cloned);
      }
    } else if (isSelected) result.push(row);
  }
  return result;
}
function selectRowsFn(rowModel, table) {
  const newSelectedFlatRows = [];
  const newSelectedRowsById = makeObjectMap();
  const rowSelection = table.atoms.rowSelection?.get() ?? {};
  return {
    rows: selectRowsRecursively(rowModel.rows, rowSelection, newSelectedFlatRows, newSelectedRowsById),
    flatRows: newSelectedFlatRows,
    rowsById: newSelectedRowsById
  };
}
function isRowSelected(row, rowSelection) {
  return !!(hasOwn(rowSelection, row.id) && rowSelection[row.id]);
}
function isSubRowSelected(row) {
  if (!row.subRows.length) return false;
  const rowSelection = row.table.atoms.rowSelection?.get() ?? {};
  let someSelected = false;
  let allChildrenSelected = true;
  let someSelectable = false;
  for (let i = 0; i < row.subRows.length; i++) {
    const subRow = row.subRows[i];
    if (someSelected && !allChildrenSelected) break;
    if (row_getCanSelect(subRow)) {
      someSelectable = true;
      if (isRowSelected(subRow, rowSelection)) someSelected = true;
      else allChildrenSelected = false;
    }
    if (subRow.subRows.length) {
      const subRowChildrenSelected = isSubRowSelected(subRow);
      if (subRowChildrenSelected === "all") {
        someSelected = true;
        someSelectable = true;
      } else if (subRowChildrenSelected === "some") {
        someSelected = true;
        allChildrenSelected = false;
        someSelectable = true;
      } else allChildrenSelected = false;
    }
  }
  if (!someSelectable) return false;
  return allChildrenSelected ? "all" : someSelected ? "some" : false;
}

// node_modules/@tanstack/table-core/dist/features/row-selection/rowSelectionFeature.js
var rowSelectionFeature = {
  initTableInstanceData: (table) => {
    table._lastSelectedRowId = null;
  },
  resetTableInstanceData: (table) => {
    table._lastSelectedRowId = null;
  },
  getInitialState: (initialState) => {
    return __spreadValues({
      rowSelection: getDefaultRowSelectionState()
    }, initialState);
  },
  getDefaultTableOptions: (table) => {
    return {
      onRowSelectionChange: makeStateUpdater("rowSelection", table),
      enableRowSelection: true,
      enableMultiRowSelection: true,
      enableRowRangeSelection: true,
      enableSubRowSelection: true,
      isRowRangeSelectionEvent: (event) => {
        const rangeEvent = event;
        return Boolean(rangeEvent.shiftKey || rangeEvent.nativeEvent?.shiftKey);
      }
    };
  },
  assignRowPrototype: (prototype, table) => {
    assignPrototypeAPIs("rowSelectionFeature", prototype, table, {
      row_toggleSelected: { fn: (row, value, opts) => row_toggleSelected(row, value, opts) },
      row_getIsSelected: { fn: (row) => row_getIsSelected(row) },
      row_getIsSomeSelected: {
        fn: (row) => row_getIsSomeSelected(row),
        memoDeps: (row) => [
          row.subRows,
          row.table.atoms.rowSelection?.get(),
          row.table.options.enableRowSelection
        ]
      },
      row_getIsAllSubRowsSelected: {
        fn: (row) => row_getIsAllSubRowsSelected(row),
        memoDeps: (row) => [
          row.subRows,
          row.table.atoms.rowSelection?.get(),
          row.table.options.enableRowSelection
        ]
      },
      row_getCanSelect: { fn: (row) => row_getCanSelect(row) },
      row_getCanSelectSubRows: { fn: (row) => row_getCanSelectSubRows(row) },
      row_getCanMultiSelect: { fn: (row) => row_getCanMultiSelect(row) },
      row_getToggleSelectedHandler: { fn: (row, opts) => row_getToggleSelectedHandler(row, opts) }
    });
  },
  constructTableAPIs: (table) => {
    assignTableAPIs("rowSelectionFeature", table, {
      table_setRowSelection: { fn: (updater) => table_setRowSelection(table, updater) },
      table_resetRowSelection: { fn: (defaultState) => table_resetRowSelection(table, defaultState) },
      table_toggleAllRowsSelected: { fn: (value, opts) => table_toggleAllRowsSelected(table, value, opts) },
      table_toggleAllPageRowsSelected: { fn: (value, opts) => table_toggleAllPageRowsSelected(table, value, opts) },
      table_getPreSelectedRowModel: { fn: () => table_getPreSelectedRowModel(table) },
      table_getSelectedRowModel: {
        fn: () => table_getSelectedRowModel(table),
        memoDeps: () => [table.atoms.rowSelection?.get(), table.getCoreRowModel()]
      },
      table_getFilteredSelectedRowModel: {
        fn: () => table_getFilteredSelectedRowModel(table),
        memoDeps: () => [table.atoms.rowSelection?.get(), table.getFilteredRowModel()]
      },
      table_getGroupedSelectedRowModel: {
        fn: () => table_getGroupedSelectedRowModel(table),
        memoDeps: () => [table.atoms.rowSelection?.get(), table.getSortedRowModel()]
      },
      table_getSelectedRowIds: {
        fn: () => table_getSelectedRowIds(table),
        memoDeps: () => [table.atoms.rowSelection?.get()]
      },
      table_getIsAllRowsSelected: {
        fn: () => table_getIsAllRowsSelected(table),
        memoDeps: () => [
          table.atoms.rowSelection?.get(),
          table.getFilteredRowModel(),
          table.options.enableRowSelection,
          table.options.enableSubRowSelection
        ]
      },
      table_getIsAllPageRowsSelected: {
        fn: () => table_getIsAllPageRowsSelected(table),
        memoDeps: () => [
          table.atoms.rowSelection?.get(),
          table.getPaginatedRowModel(),
          table.options.enableRowSelection,
          table.options.enableSubRowSelection
        ]
      },
      table_getIsSomeRowsSelected: {
        fn: () => table_getIsSomeRowsSelected(table),
        memoDeps: () => [table.atoms.rowSelection?.get()]
      },
      table_getIsSomePageRowsSelected: {
        fn: () => table_getIsSomePageRowsSelected(table),
        memoDeps: () => [
          table.atoms.rowSelection?.get(),
          table.getPaginatedRowModel(),
          table.options.enableRowSelection
        ]
      },
      table_getToggleAllRowsSelectedHandler: { fn: () => table_getToggleAllRowsSelectedHandler(table) },
      table_getToggleAllPageRowsSelectedHandler: { fn: () => table_getToggleAllPageRowsSelectedHandler(table) }
    });
  }
};

// node_modules/@tanstack/table-core/dist/features/row-sorting/rowSortingFeature.js
var rowSortingFeature = {
  getInitialState(initialState) {
    return __spreadValues({
      sorting: getDefaultSortingState()
    }, initialState);
  },
  getDefaultColumnDef() {
    return {
      sortFn: "auto",
      sortUndefined: 1
    };
  },
  getDefaultTableOptions(table) {
    return {
      autoResetSorting: false,
      onSortingChange: makeStateUpdater("sorting", table),
      isMultiSortEvent: (e) => {
        return e.shiftKey;
      }
    };
  },
  assignColumnPrototype(prototype, table) {
    assignPrototypeAPIs("rowSortingFeature", prototype, table, {
      column_getAutoSortFn: { fn: (column) => column_getAutoSortFn(column) },
      column_getAutoSortDir: { fn: (column) => column_getAutoSortDir(column) },
      column_getSortFn: { fn: (column) => column_getSortFn(column) },
      column_toggleSorting: { fn: (column, desc, multi) => column_toggleSorting(column, desc, multi) },
      column_getFirstSortDir: { fn: (column) => column_getFirstSortDir(column) },
      column_getNextSortingOrder: { fn: (column, multi) => column_getNextSortingOrder(column, multi) },
      column_getCanSort: { fn: (column) => column_getCanSort(column) },
      column_getCanMultiSort: { fn: (column) => column_getCanMultiSort(column) },
      column_getIsSorted: { fn: (column) => column_getIsSorted(column) },
      column_getSortIndex: { fn: (column) => column_getSortIndex(column) },
      column_clearSorting: { fn: (column) => column_clearSorting(column) },
      column_getToggleSortingHandler: { fn: (column) => column_getToggleSortingHandler(column) }
    });
  },
  constructTableAPIs(table) {
    assignTableAPIs("rowSortingFeature", table, {
      table_setSorting: { fn: (updater) => table_setSorting(table, updater) },
      table_resetSorting: { fn: (defaultState) => table_resetSorting(table, defaultState) }
    });
  }
};

// node_modules/@tanstack/table-core/dist/features/stockFeatures.js
var stockFeatures = {
  cellSelectionFeature,
  cellSpanningFeature,
  columnFacetingFeature,
  columnFilteringFeature,
  columnGroupingFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  globalFilteringFeature,
  rowAggregationFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  rowPinningFeature,
  rowSelectionFeature,
  rowSortingFeature
};

// node_modules/@tanstack/table-core/dist/features/row-aggregation/rowAggregationFeature.types.js
function constructAggregationFn(definition) {
  return definition;
}

// node_modules/@tanstack/table-core/dist/features/row-aggregation/aggregationFns.js
function isNumber(value) {
  return typeof value === "number";
}
function isValidDate(value) {
  return value instanceof Date && !Number.isNaN(value.getTime());
}
function getRangeKind(value) {
  if (isNumber(value)) return "number";
  if (isValidDate(value)) return "date";
}
function compareRangeValues(left, right) {
  return (left instanceof Date ? left.getTime() : left) - (right instanceof Date ? right.getTime() : right);
}
function toRangeNumber(value) {
  return value instanceof Date ? value.getTime() : value;
}
var aggregationFn_sum = constructAggregationFn({
  aggregate: (context) => {
    const rows = context.rows;
    let sum = 0;
    for (let i = 0; i < rows.length; i++) {
      const value = context.getValue(rows[i]);
      sum += typeof value === "number" ? value : 0;
    }
    return sum;
  },
  merge: ({ subRowResults }) => {
    let sum = 0;
    for (let i = 0; i < subRowResults.length; i++) {
      const value = subRowResults[i];
      if (isNumber(value)) sum += value;
    }
    return sum;
  }
});
var aggregationFn_min = constructAggregationFn({
  aggregate: (context) => {
    const rows = context.rows;
    let kind;
    let result;
    let resultNumber = 0;
    for (let i = 0; i < rows.length; i++) {
      const value = context.getValue(rows[i]);
      const valueKind = getRangeKind(value);
      if (!valueKind || kind !== void 0 && valueKind !== kind) continue;
      const valueNumber = toRangeNumber(value);
      if (kind === void 0) {
        kind = valueKind;
        result = value;
        resultNumber = valueNumber;
      } else if (valueNumber - resultNumber < 0) {
        result = value;
        resultNumber = valueNumber;
      }
    }
    return result;
  },
  merge: ({ subRowResults }) => {
    let result;
    let kind;
    for (let i = 0; i < subRowResults.length; i++) {
      const value = subRowResults[i];
      const valueKind = getRangeKind(value);
      if (!valueKind) continue;
      if (value === void 0) continue;
      kind ??= valueKind;
      if (kind !== valueKind) continue;
      if (result === void 0 || compareRangeValues(value, result) < 0) result = value;
    }
    return result;
  }
});
var aggregationFn_max = constructAggregationFn({
  aggregate: (context) => {
    const rows = context.rows;
    let kind;
    let result;
    let resultNumber = 0;
    for (let i = 0; i < rows.length; i++) {
      const value = context.getValue(rows[i]);
      const valueKind = getRangeKind(value);
      if (!valueKind || kind !== void 0 && valueKind !== kind) continue;
      const valueNumber = toRangeNumber(value);
      if (kind === void 0) {
        kind = valueKind;
        result = value;
        resultNumber = valueNumber;
      } else if (valueNumber - resultNumber > 0) {
        result = value;
        resultNumber = valueNumber;
      }
    }
    return result;
  },
  merge: ({ subRowResults }) => {
    let result;
    let kind;
    for (let i = 0; i < subRowResults.length; i++) {
      const value = subRowResults[i];
      const valueKind = getRangeKind(value);
      if (!valueKind) continue;
      if (value === void 0) continue;
      kind ??= valueKind;
      if (kind !== valueKind) continue;
      if (result === void 0 || compareRangeValues(value, result) > 0) result = value;
    }
    return result;
  }
});
var aggregationFn_extent = constructAggregationFn({
  aggregate: (context) => {
    const rows = context.rows;
    let kind;
    let min;
    let max;
    let minNumber = 0;
    let maxNumber = 0;
    for (let i = 0; i < rows.length; i++) {
      const value = context.getValue(rows[i]);
      const valueKind = getRangeKind(value);
      if (!valueKind || kind !== void 0 && valueKind !== kind) continue;
      const valueNumber = toRangeNumber(value);
      if (kind === void 0) {
        kind = valueKind;
        min = max = value;
        minNumber = maxNumber = valueNumber;
      } else {
        if (valueNumber - minNumber < 0) {
          min = value;
          minNumber = valueNumber;
        }
        if (valueNumber - maxNumber > 0) {
          max = value;
          maxNumber = valueNumber;
        }
      }
    }
    if (kind === void 0) return [void 0, void 0];
    return [min, max];
  },
  merge: ({ subRowResults }) => {
    let result = [void 0, void 0];
    let kind;
    for (let i = 0; i < subRowResults.length; i++) {
      const extent = subRowResults[i];
      const min = extent[0];
      const max = extent[1];
      const valueKind = getRangeKind(min);
      if (!valueKind || min === void 0 || max === void 0) continue;
      kind ??= valueKind;
      if (kind !== valueKind) continue;
      if (result[0] === void 0) result = [min, max];
      else {
        if (compareRangeValues(min, result[0]) < 0) result[0] = min;
        const currentMax = result[1];
        if (currentMax === void 0 || compareRangeValues(max, currentMax) > 0) result[1] = max;
      }
    }
    return result;
  }
});
var aggregationFn_mean = constructAggregationFn({ aggregate: (context) => {
  const rows = context.rows;
  let count = 0;
  let sum = 0;
  for (let i = 0; i < rows.length; i++) {
    const value = context.getValue(rows[i]);
    if (value == null) continue;
    const numberValue = typeof value === "number" ? value : +value;
    if (!Number.isNaN(numberValue)) {
      count++;
      sum += numberValue;
    }
  }
  return count ? sum / count : void 0;
} });
var aggregationFn_median = constructAggregationFn({ aggregate: (context) => {
  const rows = context.rows;
  const values = [];
  for (let i = 0; i < rows.length; i++) {
    const value = context.getValue(rows[i]);
    if (typeof value === "number") values.push(value);
  }
  if (!values.length) return void 0;
  values.sort((a, b) => a - b);
  const mid = Math.floor(values.length / 2);
  return values.length % 2 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
} });
var aggregationFn_unique = constructAggregationFn({ aggregate: (context) => {
  const rows = context.rows;
  const values = /* @__PURE__ */ new Set();
  for (let i = 0; i < rows.length; i++) values.add(context.getValue(rows[i]));
  return Array.from(values);
} });
var aggregationFn_uniqueCount = constructAggregationFn({ aggregate: (context) => {
  const rows = context.rows;
  const values = /* @__PURE__ */ new Set();
  for (let i = 0; i < rows.length; i++) values.add(context.getValue(rows[i]));
  return values.size;
} });
var aggregationFn_count = constructAggregationFn({
  aggregate: ({ rows }) => rows.length,
  merge: ({ subRowResults }) => {
    let count = 0;
    for (let i = 0; i < subRowResults.length; i++) {
      const value = subRowResults[i];
      if (isNumber(value)) count += value;
    }
    return count;
  }
});
var aggregationFn_first = constructAggregationFn({
  aggregate: (context) => context.rows[0] ? context.getValue(context.rows[0]) : void 0,
  merge: ({ subRowResults }) => subRowResults[0]
});
var aggregationFn_last = constructAggregationFn({
  aggregate: (context) => {
    const row = context.rows[context.rows.length - 1];
    return row ? context.getValue(row) : void 0;
  },
  merge: ({ subRowResults }) => subRowResults[subRowResults.length - 1]
});
var aggregationFns = {
  sum: aggregationFn_sum,
  min: aggregationFn_min,
  max: aggregationFn_max,
  extent: aggregationFn_extent,
  mean: aggregationFn_mean,
  median: aggregationFn_median,
  unique: aggregationFn_unique,
  uniqueCount: aggregationFn_uniqueCount,
  count: aggregationFn_count,
  first: aggregationFn_first,
  last: aggregationFn_last
};

// node_modules/@tanstack/table-core/dist/features/column-faceting/createFacetedMinMaxValues.js
function createFacetedMinMaxValues() {
  return (_table, columnId) => {
    const table = _table;
    return tableMemo({
      feature: "columnFacetingFeature",
      fn: (flatRows) => _createFacetedMinMaxValues(table, columnId, flatRows),
      fnName: "table.getFacetedMinMaxValues",
      memoDeps: () => {
        if (columnId === "__global__") return [callMemoOrStaticFn(table, "getGlobalFacetedRowModel", table_getGlobalFacetedRowModel).flatRows];
        const column = table.getColumn(columnId);
        if (!column) return [table.getPreFilteredRowModel().flatRows];
        return [callMemoOrStaticFn(column, "getFacetedRowModel", column_getFacetedRowModel, table).flatRows];
      },
      table
    });
  };
}
function _createFacetedMinMaxValues(table, columnId, flatRows) {
  if (!flatRows.length) return void 0;
  const columnIds = columnId === "__global__" ? table.getAllLeafColumns().filter((column) => column_getCanGlobalFilter(column)).map((column) => column.id) : [columnId];
  let facetedMinValue = Number.POSITIVE_INFINITY;
  let facetedMaxValue = Number.NEGATIVE_INFINITY;
  let foundAny = false;
  for (let i = 0; i < flatRows.length; i++) for (let c = 0; c < columnIds.length; c++) {
    const value = Number(flatRows[i].getValue(columnIds[c]));
    if (Number.isNaN(value)) continue;
    foundAny = true;
    if (value < facetedMinValue) facetedMinValue = value;
    if (value > facetedMaxValue) facetedMaxValue = value;
  }
  if (!foundAny) return void 0;
  return [facetedMinValue, facetedMaxValue];
}

// node_modules/@tanstack/table-core/dist/features/column-filtering/filterRowsUtils.js
function filterRows(rows, filterRowImpl, table) {
  if (table.options.filterFromLeafRows) return filterRowModelFromLeafs(rows, filterRowImpl, table);
  return filterRowModelFromRoot(rows, filterRowImpl, table);
}
function filterRowModelFromLeafs(rowsToFilter, filterRow, table) {
  const newFilteredFlatRows = [];
  const newFilteredRowsById = makeObjectMap();
  const maxDepth = table.options.maxLeafRowFilterDepth ?? 100;
  const recurseFilterRows = (rowsToFilter2, depth = 0) => {
    const filteredRows = [];
    for (let row of rowsToFilter2) {
      const newRow = constructRow(table, row.id, row.original, row.index, row.depth, void 0, row.parentId);
      newRow.columnFilters = row.columnFilters;
      if (row.subRows.length && depth < maxDepth) {
        newRow.subRows = recurseFilterRows(row.subRows, depth + 1);
        row = newRow;
        if (filterRow(row) && !newRow.subRows.length) {
          filteredRows.push(row);
          newFilteredRowsById[row.id] = row;
          newFilteredFlatRows.push(row);
          continue;
        }
        if (filterRow(row) || newRow.subRows.length) {
          filteredRows.push(row);
          newFilteredRowsById[row.id] = row;
          newFilteredFlatRows.push(row);
          continue;
        }
      } else {
        row = newRow;
        if (filterRow(row)) {
          filteredRows.push(row);
          newFilteredRowsById[row.id] = row;
          newFilteredFlatRows.push(row);
        }
      }
    }
    return filteredRows;
  };
  return {
    rows: recurseFilterRows(rowsToFilter),
    flatRows: newFilteredFlatRows,
    rowsById: newFilteredRowsById
  };
}
function filterRowModelFromRoot(rowsToFilter, filterRow, table) {
  const newFilteredFlatRows = [];
  const newFilteredRowsById = makeObjectMap();
  const maxDepth = table.options.maxLeafRowFilterDepth ?? 100;
  const recurseFilterRows = (rowsToFilter2, depth = 0) => {
    const filteredRows = [];
    for (let row of rowsToFilter2) if (filterRow(row)) {
      if (row.subRows.length && depth < maxDepth) {
        const newRow = constructRow(table, row.id, row.original, row.index, row.depth, void 0, row.parentId);
        newRow.subRows = recurseFilterRows(row.subRows, depth + 1);
        row = newRow;
      }
      filteredRows.push(row);
      newFilteredFlatRows.push(row);
      newFilteredRowsById[row.id] = row;
      if (row.subRows.length && depth >= maxDepth) addSubRowsToFlatArrays(row.subRows, newFilteredFlatRows, newFilteredRowsById);
    }
    return filteredRows;
  };
  return {
    rows: recurseFilterRows(rowsToFilter),
    flatRows: newFilteredFlatRows,
    rowsById: newFilteredRowsById
  };
}
function addSubRowsToFlatArrays(subRows, flatRows, rowsById) {
  for (const subRow of subRows) {
    flatRows.push(subRow);
    rowsById[subRow.id] = subRow;
    if (subRow.subRows.length) addSubRowsToFlatArrays(subRow.subRows, flatRows, rowsById);
  }
}

// node_modules/@tanstack/table-core/dist/features/column-faceting/createFacetedRowModel.js
function createFacetedRowModel() {
  return (_table, columnId) => {
    const table = _table;
    return tableMemo({
      feature: "columnFacetingFeature",
      table,
      fnName: "createFacetedRowModel",
      memoDeps: () => [
        table.getPreFilteredRowModel(),
        table.atoms.columnFilters?.get(),
        table.atoms.globalFilter?.get(),
        table.getFilteredRowModel()
      ],
      fn: (preRowModel, columnFilters, globalFilter) => _createFacetedRowModel(table, columnId, preRowModel, columnFilters, globalFilter)
    });
  };
}
function _createFacetedRowModel(table, columnId, preRowModel, columnFilters, globalFilter) {
  const hasGlobalFilter = globalFilter !== void 0 && globalFilter !== null && globalFilter !== "";
  if (!preRowModel.rows.length || !columnFilters?.length && !hasGlobalFilter) return preRowModel;
  const filterableIds = [];
  if (columnFilters) for (let i = 0; i < columnFilters.length; i++) {
    const id = columnFilters[i].id;
    if (id !== columnId) filterableIds.push(id);
  }
  if (hasGlobalFilter && columnId !== "__global__") filterableIds.push("__global__");
  if (!filterableIds.length) return preRowModel;
  const filterRowsImpl = (row) => {
    for (let i = 0; i < filterableIds.length; i++) if (row.columnFilters?.[filterableIds[i]] === false) return false;
    return true;
  };
  return filterRows(preRowModel.rows, filterRowsImpl, table);
}

// node_modules/@tanstack/table-core/dist/features/column-faceting/createFacetedUniqueValues.js
function createFacetedUniqueValues() {
  return (_table, columnId) => {
    const table = _table;
    return tableMemo({
      feature: "columnFacetingFeature",
      table,
      fnName: "table.getFacetedUniqueValues",
      memoDeps: () => {
        if (columnId === "__global__") return [callMemoOrStaticFn(table, "getGlobalFacetedRowModel", table_getGlobalFacetedRowModel).flatRows];
        const column = table.getColumn(columnId);
        if (!column) return [table.getPreFilteredRowModel().flatRows];
        return [callMemoOrStaticFn(column, "getFacetedRowModel", column_getFacetedRowModel, table).flatRows];
      },
      fn: (flatRows) => _createFacetedUniqueValues(table, columnId, flatRows)
    });
  };
}
function _createFacetedUniqueValues(table, columnId, flatRows) {
  const columnIds = columnId === "__global__" ? table.getAllLeafColumns().filter((column) => column_getCanGlobalFilter(column)).map((column) => column.id) : [columnId];
  const facetedUniqueValues = /* @__PURE__ */ new Map();
  for (let i = 0; i < flatRows.length; i++) for (let c = 0; c < columnIds.length; c++) {
    const values = flatRows[i].getUniqueValues(columnIds[c]);
    if (!values) continue;
    for (let j = 0; j < values.length; j++) {
      const value = values[j];
      const previousValue = facetedUniqueValues.get(value);
      facetedUniqueValues.set(value, previousValue === void 0 ? 1 : previousValue + 1);
    }
  }
  return facetedUniqueValues;
}

// node_modules/@tanstack/table-core/dist/features/column-filtering/createFilteredRowModel.js
function createFilteredRowModel() {
  return (_table) => {
    const table = _table;
    return tableMemo({
      feature: "columnFilteringFeature",
      table,
      fnName: "table.getFilteredRowModel",
      memoDeps: () => [
        table.getPreFilteredRowModel(),
        table.atoms.columnFilters?.get(),
        table.atoms.globalFilter?.get()
      ],
      fn: () => _createFilteredRowModel(table),
      onAfterUpdate: skipFirstRun(() => table_autoResetPageIndex(table))
    });
  };
}
function _createFilteredRowModel(table) {
  const rowModel = table.getPreFilteredRowModel();
  const columnFilters = table.atoms.columnFilters?.get();
  const globalFilter = table.atoms.globalFilter?.get();
  const hasGlobalFilter = globalFilter !== void 0 && globalFilter !== null && globalFilter !== "";
  if (!rowModel.rows.length || !columnFilters?.length && !hasGlobalFilter) {
    const flatRows2 = rowModel.flatRows;
    for (let i = 0; i < flatRows2.length; i++) {
      const row = flatRows2[i];
      row.columnFilters = makeObjectMap();
      row.columnFiltersMeta = makeObjectMap();
    }
    return rowModel;
  }
  const resolvedColumnFilters = [];
  const resolvedGlobalFilters = [];
  columnFilters?.forEach((columnFilter) => {
    const column = table_getColumn(table, columnFilter.id);
    if (!column) return;
    const filterFn = column_getFilterFn(column);
    if (!filterFn) return;
    resolvedColumnFilters.push({
      id: columnFilter.id,
      filterFn,
      resolvedValue: filterFn.resolveFilterValue?.(columnFilter.value) ?? columnFilter.value
    });
  });
  const filterableIds = columnFilters?.map((d) => d.id) ?? [];
  const globalFilterFn = table_getGlobalFilterFn(table);
  const globallyFilterableColumns = table.getAllLeafColumns().filter((column) => column_getCanGlobalFilter(column));
  if (hasGlobalFilter && globalFilterFn && globallyFilterableColumns.length) {
    filterableIds.push("__global__");
    globallyFilterableColumns.forEach((column) => {
      resolvedGlobalFilters.push({
        id: column.id,
        filterFn: globalFilterFn,
        resolvedValue: globalFilterFn.resolveFilterValue?.(globalFilter) ?? globalFilter
      });
    });
  }
  const flatRows = rowModel.flatRows;
  for (let i = 0; i < flatRows.length; i++) {
    const row = flatRows[i];
    row.columnFilters = makeObjectMap();
    row.columnFiltersMeta = makeObjectMap();
    if (resolvedColumnFilters.length) for (let j = 0; j < resolvedColumnFilters.length; j++) {
      const currentColumnFilter = resolvedColumnFilters[j];
      const id = currentColumnFilter.id;
      row.columnFilters[id] = currentColumnFilter.filterFn(row, id, currentColumnFilter.resolvedValue, (filterMeta) => {
        if (!row.columnFiltersMeta) row.columnFiltersMeta = makeObjectMap();
        row.columnFiltersMeta[id] = filterMeta;
      });
    }
    if (resolvedGlobalFilters.length) {
      for (let j = 0; j < resolvedGlobalFilters.length; j++) {
        const currentGlobalFilter = resolvedGlobalFilters[j];
        const id = currentGlobalFilter.id;
        if (currentGlobalFilter.filterFn(row, id, currentGlobalFilter.resolvedValue, (filterMeta) => {
          if (!row.columnFiltersMeta) row.columnFiltersMeta = makeObjectMap();
          row.columnFiltersMeta[id] = filterMeta;
        })) {
          row.columnFilters.__global__ = true;
          break;
        }
      }
      if (row.columnFilters.__global__ !== true) row.columnFilters.__global__ = false;
    }
  }
  const filterRowsImpl = (row) => {
    for (let i = 0; i < filterableIds.length; i++) if (row.columnFilters[filterableIds[i]] === false) return false;
    return true;
  };
  return filterRows(rowModel.rows, filterRowsImpl, table);
}

// node_modules/@tanstack/table-core/dist/features/column-grouping/createGroupedRowModel.js
function createGroupedRowModel() {
  return (_table) => {
    const table = _table;
    let hasAutoResetDependencies = false;
    let previousGrouping;
    let previousPreGroupedRowModel;
    return tableMemo({
      feature: "columnGroupingFeature",
      table,
      fnName: "table.getGroupedRowModel",
      memoDeps: () => [
        table.atoms.grouping?.get(),
        table.getPreGroupedRowModel(),
        table.options.columns
      ],
      fn: () => _createGroupedRowModel(table),
      onAfterUpdate: () => {
        const grouping = table.atoms.grouping?.get();
        const preGroupedRowModel = table.getPreGroupedRowModel();
        const rowInputsChanged = hasAutoResetDependencies && (grouping !== previousGrouping || preGroupedRowModel !== previousPreGroupedRowModel);
        previousGrouping = grouping;
        previousPreGroupedRowModel = preGroupedRowModel;
        hasAutoResetDependencies = true;
        if (rowInputsChanged) {
          table_autoResetExpanded(table);
          table_autoResetPageIndex(table);
        }
      }
    });
  };
}
function _createGroupedRowModel(table) {
  const rowModel = table.getPreGroupedRowModel();
  const grouping = table.atoms.grouping?.get();
  if (!rowModel.rows.length || !grouping?.length) {
    resetRowRelationships(rowModel.rows, 0, void 0);
    return rowModel;
  }
  const existingGrouping = grouping.filter((columnId) => table_getColumn(table, columnId));
  const groupedFlatRows = [];
  const groupedRowsById = makeObjectMap();
  const groupUpRecursively = (rows, depth = 0, parentId) => {
    if (depth >= existingGrouping.length) return rows.map((row) => {
      row.depth = depth;
      if (row.subRows.length) {
        row.subRows = groupUpRecursively(row.subRows, depth + 1, row.id);
        for (let i = 0; i < row.subRows.length; i++) {
          const subRow = row.subRows[i];
          groupedFlatRows.push(subRow);
          groupedRowsById[subRow.id] = subRow;
        }
      }
      return row;
    });
    const columnId = existingGrouping[depth];
    const rowGroupsMap = groupBy(table, rows, columnId);
    return Array.from(rowGroupsMap.entries()).map(([groupingValue, groupedRows2], index) => {
      let id = `${columnId}:${groupingValue}`;
      id = parentId ? `${parentId}>${id}` : id;
      const subRows = groupUpRecursively(groupedRows2, depth + 1, id);
      subRows.forEach((subRow) => {
        subRow.parentId = id;
      });
      const leafRows = normalizeUniqueAggregationRows(groupedRows2, Infinity);
      const row = constructRow(table, id, leafRows[0].original, index, depth, void 0, parentId);
      Object.assign(row, {
        groupingColumnId: columnId,
        groupingValue,
        subRows,
        leafRows,
        getValue: (colId) => {
          const groupingIndex = existingGrouping.indexOf(colId);
          if (groupingIndex !== -1 && groupingIndex <= depth) {
            if (hasOwn(row._valuesCache, colId)) return row._valuesCache[colId];
            if (groupedRows2[0]) row._valuesCache[colId] = groupedRows2[0].getValue(colId) ?? void 0;
            return row._valuesCache[colId];
          }
          const aggregationCache = row._aggregationValuesCache;
          if (aggregationCache && hasOwn(aggregationCache, colId)) return aggregationCache[colId];
          const column = table.getColumn(colId);
          if (typeof column.getAggregationFns !== "function") return void 0;
          const cache = row._aggregationValuesCache ??= makeObjectMap();
          cache[colId] = aggregateColumnValue({
            subRows,
            column,
            groupingRow: row,
            rows: groupedRows2,
            uniqueRows: true
          });
          return cache[colId];
        }
      });
      subRows.forEach((subRow) => {
        groupedFlatRows.push(subRow);
        groupedRowsById[subRow.id] = subRow;
      });
      return row;
    });
  };
  const groupedRows = groupUpRecursively(rowModel.rows, 0);
  groupedRows.forEach((subRow) => {
    groupedFlatRows.push(subRow);
    groupedRowsById[subRow.id] = subRow;
  });
  return {
    rows: groupedRows,
    flatRows: groupedFlatRows,
    rowsById: groupedRowsById
  };
}
function resetRowRelationships(rows, depth, parentId) {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    row.depth = depth;
    row.parentId = parentId;
    if (row.subRows.length) resetRowRelationships(row.subRows, depth + 1, row.id);
  }
}
function groupBy(table, rows, columnId) {
  const groupMap = /* @__PURE__ */ new Map();
  const getGroupingValue = table_getColumn(table, columnId)?.columnDef.getGroupingValue;
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    let groupingValue;
    if (getGroupingValue) {
      const cache = row._groupingValuesCache;
      if (cache && hasOwn(cache, columnId)) groupingValue = cache[columnId];
      else if (cache) groupingValue = cache[columnId] = getGroupingValue(row.original, row.index, row);
    } else groupingValue = row.getValue(columnId);
    const resKey = `${groupingValue}`;
    const previous = groupMap.get(resKey);
    if (!previous) groupMap.set(resKey, [row]);
    else previous.push(row);
  }
  return groupMap;
}

// node_modules/@tanstack/table-core/dist/features/row-expanding/createExpandedRowModel.js
function createExpandedRowModel() {
  return (_table) => {
    const table = _table;
    return tableMemo({
      feature: "rowExpandingFeature",
      table,
      fnName: "table.getExpandedRowModel",
      memoDeps: () => [
        table.atoms.expanded?.get(),
        table.getPreExpandedRowModel(),
        table.options.paginateExpandedRows,
        table.options.manualPagination
      ],
      fn: () => _createExpandedRowModel(table)
    });
  };
}
function _createExpandedRowModel(table) {
  const rowModel = table.getPreExpandedRowModel();
  const expanded = table.atoms.expanded?.get();
  if (!rowModel.rows.length || expanded !== true && !Object.keys(expanded ?? {}).length) return rowModel;
  if (!table.options.paginateExpandedRows && !table.options.manualPagination) return rowModel;
  return expandRows(rowModel);
}
function expandRows(rowModel) {
  const expandedRows = [];
  const handleRow = (row) => {
    expandedRows.push(row);
    if (row.subRows.length && row_getIsExpanded(row)) row.subRows.forEach(handleRow);
  };
  rowModel.rows.forEach(handleRow);
  return {
    rows: expandedRows,
    flatRows: rowModel.flatRows,
    rowsById: rowModel.rowsById
  };
}

// node_modules/@tanstack/table-core/dist/features/row-pagination/createPaginatedRowModel.js
function createPaginatedRowModel() {
  return (_table) => {
    const table = _table;
    return tableMemo({
      feature: "rowPaginationFeature",
      table,
      fnName: "table.getPaginatedRowModel",
      memoDeps: () => [
        table.getPrePaginatedRowModel(),
        table.atoms.pagination?.get(),
        !table.options.paginateExpandedRows ? table.atoms.expanded?.get() : void 0
      ],
      fn: () => _createPaginatedRowModel(table)
    });
  };
}
function _createPaginatedRowModel(table) {
  const prePaginatedRowModel = table.getPrePaginatedRowModel();
  const pagination = table.atoms.pagination?.get();
  if (!prePaginatedRowModel.rows.length) return prePaginatedRowModel;
  const { pageSize, pageIndex } = pagination ?? getDefaultPaginationState();
  const { rows, flatRows, rowsById } = prePaginatedRowModel;
  let paginatedRows = rows;
  if (pageSize !== Infinity || pageIndex !== 0) {
    const pageStart = pageSize * pageIndex;
    const pageEnd = pageStart + pageSize;
    paginatedRows = rows.slice(pageStart, pageEnd);
  }
  let paginatedRowModel;
  if (!table.options.paginateExpandedRows) paginatedRowModel = expandRows({
    rows: paginatedRows,
    flatRows,
    rowsById
  });
  else paginatedRowModel = {
    rows: paginatedRows,
    flatRows,
    rowsById
  };
  paginatedRowModel.flatRows = [];
  const seenFlatRows = /* @__PURE__ */ new Set();
  const handleRow = (row) => {
    if (seenFlatRows.has(row.id)) return;
    seenFlatRows.add(row.id);
    paginatedRowModel.flatRows.push(row);
    if (row.subRows.length) row.subRows.forEach(handleRow);
  };
  paginatedRowModel.rows.forEach(handleRow);
  return paginatedRowModel;
}

// node_modules/@tanstack/table-core/dist/features/row-sorting/createSortedRowModel.js
function createSortedRowModel() {
  return (_table) => {
    const table = _table;
    return tableMemo({
      feature: "rowSortingFeature",
      table,
      fnName: "table.getSortedRowModel",
      memoDeps: () => [table.atoms.sorting?.get(), table.getPreSortedRowModel()],
      fn: () => _createSortedRowModel(table),
      onAfterUpdate: skipFirstRun(() => table_autoResetPageIndex(table))
    });
  };
}
function _createSortedRowModel(table) {
  const preSortedRowModel = table.getPreSortedRowModel();
  const sorting = table.atoms.sorting?.get();
  if (!preSortedRowModel.rows.length || !sorting?.length) return preSortedRowModel;
  const sortedFlatRows = [];
  const availableSorting = sorting.filter((sort) => {
    const column = table.getColumn(sort.id);
    return column ? column_getCanSort(column) : false;
  });
  if (!availableSorting.length) return preSortedRowModel;
  const resolvedSorting = [];
  for (let i = 0; i < availableSorting.length; i++) {
    const sortEntry = availableSorting[i];
    const column = table.getColumn(sortEntry.id);
    if (!column) continue;
    resolvedSorting.push({
      id: sortEntry.id,
      desc: sortEntry.desc,
      sortUndefined: column.columnDef.sortUndefined,
      invertSorting: column.columnDef.invertSorting,
      sortFn: column_getSortFn(column)
    });
  }
  const compareRows = (rowA, rowB) => {
    for (let i = 0; i < resolvedSorting.length; i++) {
      const sortEntry = resolvedSorting[i];
      const sortUndefined = sortEntry.sortUndefined;
      const isDesc = sortEntry.desc;
      let sortInt = 0;
      if (sortUndefined) {
        const aValue = rowA.getValue(sortEntry.id);
        const bValue = rowB.getValue(sortEntry.id);
        const aUndefined = aValue === void 0;
        const bUndefined = bValue === void 0;
        if (aUndefined && bUndefined) continue;
        if (aUndefined || bUndefined) {
          if (sortUndefined === "first") return aUndefined ? -1 : 1;
          if (sortUndefined === "last") return aUndefined ? 1 : -1;
          sortInt = aUndefined ? sortUndefined : -sortUndefined;
        }
      }
      if (sortInt === 0) sortInt = sortEntry.sortFn(rowA, rowB, sortEntry.id);
      if (sortInt !== 0) {
        if (isDesc) sortInt *= -1;
        if (sortEntry.invertSorting) sortInt *= -1;
        return sortInt;
      }
    }
    return rowA.index - rowB.index;
  };
  const sortData = (rows) => {
    const sortedData = rows.slice();
    sortedData.sort(compareRows);
    let changed = false;
    for (let i = 0; i < sortedData.length; i++) {
      const row = sortedData[i];
      if (row !== rows[i]) changed = true;
      const flatIndex = sortedFlatRows.length;
      sortedFlatRows.push(row);
      if (row.subRows.length) {
        const sortedSubRows = sortData(row.subRows);
        if (sortedSubRows.changed) {
          const cloned = Object.create(Object.getPrototypeOf(row));
          copyInstancePropertiesWithoutMemos(cloned, row);
          cloned.subRows = sortedSubRows.rows;
          sortedData[i] = cloned;
          sortedFlatRows[flatIndex] = cloned;
          changed = true;
        }
      }
    }
    return {
      rows: sortedData,
      changed
    };
  };
  return {
    rows: sortData(preSortedRowModel.rows).rows,
    flatRows: sortedFlatRows,
    rowsById: preSortedRowModel.rowsById
  };
}

// node_modules/@angular/core/fesm2022/rxjs-interop.mjs
function toObservable(source, options) {
  if (ngDevMode && !options?.injector) {
    assertInInjectionContext(toObservable);
  }
  const injector = options?.injector ?? inject(Injector);
  const subject = new ReplaySubject(1);
  const watcher = effect(() => {
    let value;
    try {
      value = source();
    } catch (err) {
      untracked(() => subject.error(err));
      return;
    }
    untracked(() => subject.next(value));
  }, {
    injector,
    manualCleanup: true
  });
  injector.get(DestroyRef).onDestroy(() => {
    watcher.destroy();
    subject.complete();
  });
  return subject.asObservable();
}

// node_modules/@tanstack/angular-table/dist/fesm2022/tanstack-angular-table.mjs
var TanStackTableCellToken = new InjectionToken("[TanStack Table] CellContext");
var TanStackTableCell = class _TanStackTableCell {
  /**
   * The current TanStack Table cell.
   *
   * Provided as a required signal input so DI consumers always read the latest value.
   */
  cell = input.required(__spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "cell"
  } : (
    /* istanbul ignore next */
    {}
  )), {
    alias: "tanStackTableCell"
  }));
  static ɵfac = function TanStackTableCell_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TanStackTableCell)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _TanStackTableCell,
    selectors: [["", "tanStackTableCell", ""]],
    inputs: {
      cell: [1, "tanStackTableCell", "cell"]
    },
    exportAs: ["cell"],
    features: [ɵɵProvidersFeature([{
      provide: TanStackTableCellToken,
      useFactory: () => inject(_TanStackTableCell).cell
    }])]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TanStackTableCell, [{
    type: Directive,
    args: [{
      selector: "[tanStackTableCell]",
      exportAs: "cell",
      providers: [{
        provide: TanStackTableCellToken,
        useFactory: () => inject(TanStackTableCell).cell
      }]
    }]
  }], null, {
    cell: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "tanStackTableCell",
        required: true
      }]
    }]
  });
})();
function injectTableCellContext() {
  return inject(TanStackTableCellToken);
}
var TanStackTableHeaderToken = new InjectionToken("[TanStack Table] HeaderContext");
var TanStackTableHeader = class _TanStackTableHeader {
  /**
   * The current TanStack Table header.
   *
   * Provided as a required signal input so DI consumers always read the latest value.
   */
  header = input.required(__spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "header"
  } : (
    /* istanbul ignore next */
    {}
  )), {
    alias: "tanStackTableHeader"
  }));
  static ɵfac = function TanStackTableHeader_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TanStackTableHeader)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _TanStackTableHeader,
    selectors: [["", "tanStackTableHeader", ""]],
    inputs: {
      header: [1, "tanStackTableHeader", "header"]
    },
    exportAs: ["header"],
    features: [ɵɵProvidersFeature([{
      provide: TanStackTableHeaderToken,
      useFactory: () => inject(_TanStackTableHeader).header
    }])]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TanStackTableHeader, [{
    type: Directive,
    args: [{
      selector: "[tanStackTableHeader]",
      exportAs: "header",
      providers: [{
        provide: TanStackTableHeaderToken,
        useFactory: () => inject(TanStackTableHeader).header
      }]
    }]
  }], null, {
    header: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "tanStackTableHeader",
        required: true
      }]
    }]
  });
})();
function injectTableHeaderContext() {
  return inject(TanStackTableHeaderToken);
}
var TanStackTableToken = new InjectionToken("[TanStack Table] Table Context");
var TanStackTable = class _TanStackTable {
  /**
   * The current TanStack Table instance.
   *
   * Provided as a required signal input so DI consumers always read the latest value.
   */
  table = input.required(__spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "table"
  } : (
    /* istanbul ignore next */
    {}
  )), {
    alias: "tanStackTable"
  }));
  static ɵfac = function TanStackTable_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TanStackTable)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _TanStackTable,
    selectors: [["", "tanStackTable", ""]],
    inputs: {
      table: [1, "tanStackTable", "table"]
    },
    exportAs: ["table"],
    features: [ɵɵProvidersFeature([{
      provide: TanStackTableToken,
      useFactory: () => inject(_TanStackTable).table
    }])]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TanStackTable, [{
    type: Directive,
    args: [{
      selector: "[tanStackTable]",
      exportAs: "table",
      providers: [{
        provide: TanStackTableToken,
        useFactory: () => inject(TanStackTable).table
      }]
    }]
  }], null, {
    table: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "tanStackTable",
        required: true
      }]
    }]
  });
})();
function injectTableContext() {
  return inject(TanStackTableToken);
}
var FlexRenderComponentProps = new InjectionToken("[@tanstack/angular-table] Flex render component context props");
function injectFlexRenderContext() {
  return inject(FlexRenderComponentProps);
}
var FlexRenderFlags = {
  /**
   * The renderer has not completed its initial update. The first update creates
   * the view from scratch, then clears this flag.
   */
  ViewFirstRender: 1 << 0,
  /**
   * The `content` input changed by reference, or its resolved value is not
   * compatible with the mounted view. The next update recreates the view.
   */
  ContentChanged: 1 << 1,
  /**
   * The `props` input changed by reference. Components receive the latest
   * inputs and embedded templates are marked so their getter-backed context is
   * evaluated again.
   */
  PropsReferenceChanged: 1 << 2,
  /**
   * A render function produced compatible content that must be synchronized
   * with the mounted view without recreating it.
   */
  Dirty: 1 << 3,
  /**
   * The render-function effect completed its initial dependency read. That
   * first execution records dependencies; subsequent executions update the
   * view.
   */
  RenderEffectChecked: 1 << 4
};
function flexRenderComponent(component, options) {
  const {
    key,
    inputs,
    injector,
    outputs,
    directives,
    bindings
  } = options ?? {};
  return new FlexRenderComponentInstance(component, inputs, injector, outputs, directives, bindings, key);
}
var FlexRenderComponentInstance = class {
  component;
  inputs;
  injector;
  outputs;
  directives;
  bindings;
  key;
  mirror;
  metadata;
  constructor(component, inputs, injector, outputs, directives, bindings, key) {
    this.component = component;
    this.inputs = inputs;
    this.injector = injector;
    this.outputs = outputs;
    this.directives = directives;
    this.bindings = bindings;
    this.key = key;
    this.metadata = resolveComponentTypeMetadata(component);
    this.mirror = this.metadata.mirror;
  }
};
var typeCache = /* @__PURE__ */ new WeakMap();
function resolveComponentTypeMetadata(type) {
  let metadata = typeCache.get(type);
  if (metadata) return metadata;
  const mirror = reflectComponentType(type);
  if (!mirror) {
    throw new Error(`[@tanstack-table/angular] The provided symbol is not a component`);
  }
  const inputNames = /* @__PURE__ */ new Map();
  const outputNames = /* @__PURE__ */ new Set();
  for (const input2 of mirror.inputs) {
    inputNames.set(input2.propName, input2.templateName);
    if (input2.templateName !== input2.propName) {
      inputNames.set(input2.templateName, input2.templateName);
    }
  }
  for (const output of mirror.outputs) {
    outputNames.add(output.propName);
  }
  metadata = {
    mirror,
    inputNames,
    outputNames
  };
  typeCache.set(type, metadata);
  return metadata;
}
var FlexRenderComponentFactory = class _FlexRenderComponentFactory {
  #viewContainerRef;
  constructor(viewContainerRef) {
    this.#viewContainerRef = viewContainerRef;
  }
  createComponent(flexRenderComponent2, componentInjector) {
    const componentRef = this.#viewContainerRef.createComponent(flexRenderComponent2.component, {
      injector: componentInjector,
      directives: flexRenderComponent2.directives,
      bindings: flexRenderComponent2.bindings
    });
    const view = new FlexRenderComponentRef(componentRef, flexRenderComponent2, componentInjector);
    const {
      inputs,
      outputs
    } = flexRenderComponent2;
    if (inputs) view.setInputs(inputs);
    if (outputs) view.setOutputs(outputs);
    return view;
  }
  static ɵfac = function FlexRenderComponentFactory_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FlexRenderComponentFactory)(ɵɵinject(ViewContainerRef));
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _FlexRenderComponentFactory,
    factory: _FlexRenderComponentFactory.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FlexRenderComponentFactory, [{
    type: Injectable
  }], () => [{
    type: ViewContainerRef
  }], null);
})();
var FlexRenderComponentRef = class {
  componentRef;
  componentInjector;
  #componentData;
  #creationKey;
  #outputRegistry;
  constructor(componentRef, componentData, componentInjector) {
    this.componentRef = componentRef;
    this.componentInjector = componentInjector;
    this.#componentData = componentData;
    this.#creationKey = componentData.key;
    this.#outputRegistry = new FlexRenderComponentOutputManager();
    this.componentRef.onDestroy(() => this.#outputRegistry.unsubscribeAll());
  }
  get component() {
    return this.#componentData.component;
  }
  get inputs() {
    return this.#componentData.inputs ?? {};
  }
  get outputs() {
    return this.#componentData.outputs ?? {};
  }
  /**
   *
   * @param compare Whether the current ref component instance is the same as the given one
   */
  eqType(compare) {
    return compare.component === this.component;
  }
  canReuse(compare) {
    return this.eqType(compare) && Object.is(compare.key, this.#creationKey);
  }
  /**
   * Tries to update current component refs input by the new given content component.
   */
  update(content) {
    if (!this.canReuse(content)) return;
    this.#syncInputs(content.inputs ?? {});
    this.#syncOutputs(content.outputs ?? {});
    this.#componentData = content;
  }
  markAsDirty() {
    this.componentRef.injector.get(ChangeDetectorRef).markForCheck();
  }
  setInputs(inputs) {
    for (const prop of Object.keys(inputs)) {
      this.setInput(prop, inputs[prop]);
    }
  }
  setInput(key, value) {
    const inputName = this.#componentData.metadata.inputNames.get(key);
    if (inputName === void 0) return;
    this.componentRef.setInput(inputName, value);
  }
  setOutputs(outputs) {
    this.#outputRegistry.unsubscribeAll();
    for (const prop of Object.keys(outputs)) {
      this.setOutput(prop, outputs[prop]);
    }
  }
  setOutput(key, emit) {
    if (!this.#componentData.metadata.outputNames.has(key)) return;
    const outputName = key;
    if (!emit) {
      this.#outputRegistry.unsubscribe(outputName);
      return;
    }
    const hasSubscription = this.#outputRegistry.hasSubscription(outputName);
    this.#outputRegistry.setListener(outputName, emit);
    if (hasSubscription) {
      return;
    }
    const instance = this.componentRef.instance;
    const output = instance[outputName];
    if (output && output instanceof OutputEmitterRef) {
      this.#outputRegistry.setSubscription(outputName, output.subscribe((value) => {
        this.#outputRegistry.getListener(outputName)?.(value);
      }));
    }
  }
  #syncInputs(newInputs) {
    for (const prop of Object.keys(newInputs)) {
      this.setInput(prop, newInputs[prop]);
    }
  }
  #syncOutputs(outputs) {
    const outputKeys = Object.keys(outputs);
    const currentSubscribedKeys = this.#outputRegistry.getSubscribedKeys();
    for (const key of currentSubscribedKeys) {
      if (!outputKeys.includes(key)) {
        this.#outputRegistry.unsubscribe(key);
      }
    }
    for (const prop of outputKeys) {
      this.setOutput(prop, outputs[prop]);
    }
  }
};
var FlexRenderComponentOutputManager = class {
  #outputSubscribers = /* @__PURE__ */ new Map();
  #outputListeners = /* @__PURE__ */ new Map();
  getSubscribedKeys() {
    return Array.from(this.#outputListeners.keys());
  }
  hasSubscription(outputName) {
    return this.#outputSubscribers.has(outputName);
  }
  setListener(outputName, callback) {
    this.#outputListeners.set(outputName, callback);
  }
  getListener(outputName) {
    return this.#outputListeners.get(outputName);
  }
  setSubscription(outputName, subscription) {
    this.#outputSubscribers.set(outputName, subscription);
  }
  unsubscribeAll() {
    for (const outputName of this.#outputListeners.keys()) {
      this.unsubscribe(outputName);
    }
  }
  unsubscribe(outputName) {
    this.#outputSubscribers.get(outputName)?.unsubscribe();
    this.#outputSubscribers.delete(outputName);
    this.#outputListeners.delete(outputName);
  }
};
function mapToFlexRenderTypedContent(content) {
  if (content === null || content === void 0) {
    return {
      kind: "null"
    };
  }
  if (typeof content === "string" || typeof content === "number") {
    return {
      kind: "primitive",
      content
    };
  }
  if (content instanceof FlexRenderComponentInstance) {
    return {
      kind: "flexRenderComponent",
      content
    };
  } else if (content instanceof TemplateRef) {
    return {
      kind: "templateRef",
      content
    };
  } else if (content instanceof Type) {
    return {
      kind: "component",
      content
    };
  } else {
    return {
      kind: "primitive",
      content
    };
  }
}
var FlexRenderView = class {
  view;
  #content;
  constructor(initialContent, view) {
    this.#content = initialContent;
    this.view = view;
  }
  get content() {
    return this.#content;
  }
  set content(content) {
    this.#content = content;
  }
};
var FlexRenderTemplateView = class extends FlexRenderView {
  constructor(initialContent, view) {
    super(initialContent, view);
  }
  updateProps(_props) {
    if (this.content.kind === "templateRef") {
      this.view.markForCheck();
    }
  }
  dirtyCheck() {
    if (this.content.kind === "primitive") {
      this.view.markForCheck();
    }
  }
  unmount() {
    this.view.destroy();
  }
  canReuse(compare) {
    return this.content.kind === "primitive" && compare.kind === "primitive" || this.content.kind === "templateRef" && compare.kind === "templateRef" && this.content.content === compare.content;
  }
};
var FlexRenderComponentView = class extends FlexRenderView {
  constructor(initialContent, view) {
    super(initialContent, view);
  }
  updateProps(props) {
    switch (this.content.kind) {
      case "component": {
        this.view.setInputs(props);
        break;
      }
      case "flexRenderComponent": {
        break;
      }
    }
  }
  dirtyCheck() {
    switch (this.content.kind) {
      case "component": {
        this.view.markAsDirty();
        break;
      }
      case "flexRenderComponent": {
        if (this.view.eqType(this.content.content)) {
          this.view.update(this.content.content);
        }
        this.view.markAsDirty();
        break;
      }
    }
  }
  unmount() {
    this.view.componentRef.destroy();
  }
  canReuse(compare) {
    return this.content.kind === "component" && compare.kind === "component" && this.content.content === compare.content || this.content.kind === "flexRenderComponent" && compare.kind === "flexRenderComponent" && this.view.canReuse(compare.content);
  }
};
var FlexViewRenderer = class {
  #renderFlags = FlexRenderFlags.ViewFirstRender;
  #renderView = null;
  #outerRenderEffectRef = null;
  #currentRenderEffectRef = null;
  #content;
  #props;
  #injector;
  #viewContainerRef;
  #templateRef;
  #flexRenderComponentFactory;
  #getLatestContentValue = () => {
    const content = this.#content();
    const props = this.#props();
    return typeof content !== "function" ? content : runInInjectionContext(this.#injector(), () => content(props));
  };
  #latestContent = computed(
    () => this.#getLatestContentValue(),
    ...ngDevMode ? [{
      debugName: "#latestContent"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  #getContentValue = computed(
    () => {
      return mapToFlexRenderTypedContent(this.#latestContent());
    },
    ...ngDevMode ? [{
      debugName: "#getContentValue"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor(options) {
    this.#content = options.content;
    this.#props = options.props;
    this.#injector = options.injector;
    this.#templateRef = options.templateRef;
    this.#viewContainerRef = options.viewContainerRef;
    this.#flexRenderComponentFactory = new FlexRenderComponentFactory(this.#viewContainerRef);
  }
  mount() {
    if (this.#outerRenderEffectRef) {
      return this.#outerRenderEffectRef;
    }
    let previousContent;
    let previousProps;
    this.#outerRenderEffectRef = effect(() => {
      const props = this.#props();
      const content = this.#content();
      if (!(this.#renderFlags & FlexRenderFlags.ViewFirstRender)) {
        if (previousContent !== content) {
          this.#destroyContentEffect();
          this.#renderFlags |= FlexRenderFlags.ContentChanged;
        }
        if (previousProps !== props) {
          this.#renderFlags |= FlexRenderFlags.PropsReferenceChanged;
        }
      }
      untracked(() => this.#update());
      if (this.#renderFlags & FlexRenderFlags.ViewFirstRender) {
        this.#renderFlags &= ~FlexRenderFlags.ViewFirstRender;
      }
      previousContent = content;
      previousProps = props;
    }, __spreadProps(__spreadValues({}, ngDevMode ? {
      debugName: "#outerRenderEffectRef"
    } : (
      /* istanbul ignore next */
      {}
    )), {
      injector: this.#viewContainerRef.injector
    }));
    return this.#outerRenderEffectRef;
  }
  destroy() {
    if (this.#outerRenderEffectRef) {
      this.#outerRenderEffectRef.destroy();
      this.#outerRenderEffectRef = null;
    }
    this.#destroyContentEffect();
    this.#destroyView();
    this.#renderFlags = FlexRenderFlags.ViewFirstRender;
  }
  #destroyContentEffect() {
    if (this.#currentRenderEffectRef) {
      this.#currentRenderEffectRef.destroy();
      this.#currentRenderEffectRef = null;
    }
    this.#renderFlags &= ~FlexRenderFlags.RenderEffectChecked;
  }
  #update() {
    if (this.#renderFlags & (FlexRenderFlags.ContentChanged | FlexRenderFlags.ViewFirstRender)) {
      this.#render();
      return;
    }
    if (this.#renderFlags & FlexRenderFlags.PropsReferenceChanged) {
      this.#renderView?.updateProps(this.#props());
      this.#renderFlags &= ~FlexRenderFlags.PropsReferenceChanged;
    }
    if (this.#renderFlags & FlexRenderFlags.Dirty) {
      this.#renderView?.dirtyCheck();
      this.#renderFlags &= ~FlexRenderFlags.Dirty;
    }
  }
  #render() {
    this.#destroyView();
    this.#renderFlags &= FlexRenderFlags.ViewFirstRender | FlexRenderFlags.RenderEffectChecked;
    const content = this.#getContentValue();
    this.#renderView = this.#renderViewByContent(content);
    if (!this.#currentRenderEffectRef && typeof untracked(this.#content) === "function") {
      this.#currentRenderEffectRef = effect(() => {
        const latestContent = this.#getContentValue();
        if (!(this.#renderFlags & FlexRenderFlags.RenderEffectChecked)) {
          this.#renderFlags |= FlexRenderFlags.RenderEffectChecked;
          return;
        }
        untracked(() => {
          this.#renderFlags |= FlexRenderFlags.Dirty;
          this.#doCheck(latestContent);
        });
      }, __spreadProps(__spreadValues({}, ngDevMode ? {
        debugName: "#currentRenderEffectRef"
      } : (
        /* istanbul ignore next */
        {}
      )), {
        injector: this.#viewContainerRef.injector
      }));
    }
  }
  #doCheck(latestContent) {
    if (latestContent.kind === "null" || !this.#renderView || !this.#renderView.canReuse(latestContent)) {
      this.#renderFlags |= FlexRenderFlags.ContentChanged;
    } else {
      this.#renderView.content = latestContent;
    }
    this.#update();
  }
  #destroyView() {
    if (this.#renderView) {
      this.#renderView.unmount();
      this.#renderView = null;
    }
  }
  #renderViewByContent(content) {
    if (content.kind === "primitive") {
      return this.#renderStringContent(content);
    } else if (content.kind === "templateRef") {
      return this.#renderTemplateRefContent(content);
    } else if (content.kind === "flexRenderComponent") {
      return this.#renderComponent(content);
    } else if (content.kind === "component") {
      return this.#renderCustomComponent(content);
    }
    return null;
  }
  #renderStringContent(template) {
    const latestContent = () => untracked(this.#getContentValue);
    const ref = this.#viewContainerRef.createEmbeddedView(this.#templateRef, {
      get $implicit() {
        const content = latestContent();
        return content.kind === "primitive" ? content.content : void 0;
      }
    });
    return new FlexRenderTemplateView(template, ref);
  }
  #renderTemplateRefContent(template) {
    const latestProps = () => untracked(this.#props);
    const view = this.#viewContainerRef.createEmbeddedView(template.content, {
      get $implicit() {
        return latestProps();
      }
    }, {
      injector: this.#getInjector()
    });
    return new FlexRenderTemplateView(template, view);
  }
  #renderComponent(flexRenderComponent2) {
    const componentInjector = this.#getInjector(flexRenderComponent2.content.injector);
    const view = this.#flexRenderComponentFactory.createComponent(flexRenderComponent2.content, componentInjector);
    return new FlexRenderComponentView(flexRenderComponent2, view);
  }
  #renderCustomComponent(component) {
    const instance = flexRenderComponent(component.content, {
      inputs: this.#props()
    });
    const injector = this.#getInjector(instance.injector);
    const view = this.#flexRenderComponentFactory.createComponent(instance, injector);
    return new FlexRenderComponentView(component, view);
  }
  #getInjector(parentInjector) {
    const getContext = () => this.#props();
    const proxy = new Proxy(this.#props(), {
      get: (_, key) => getContext()[key]
    });
    const staticProviders = [];
    if ("table" in proxy) {
      staticProviders.push({
        provide: TanStackTableToken,
        useValue: () => proxy.table
      });
    }
    if ("cell" in proxy) {
      staticProviders.push({
        provide: TanStackTableCellToken,
        useValue: () => proxy.cell
      });
    }
    if ("header" in proxy) {
      staticProviders.push({
        provide: TanStackTableHeaderToken,
        useValue: () => proxy.header
      });
    }
    return Injector.create({
      parent: parentInjector ?? this.#injector(),
      providers: [...staticProviders, {
        provide: FlexRenderComponentProps,
        useValue: proxy
      }]
    });
  }
};
var FlexRenderCell = class _FlexRenderCell {
  cell = input(void 0, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "cell"
  } : (
    /* istanbul ignore next */
    {}
  )), {
    alias: "flexRenderCell"
  }));
  header = input(void 0, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "header"
  } : (
    /* istanbul ignore next */
    {}
  )), {
    alias: "flexRenderHeader"
  }));
  footer = input(void 0, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "footer"
  } : (
    /* istanbul ignore next */
    {}
  )), {
    alias: "flexRenderFooter"
  }));
  #renderData = computed(() => {
    const cell = this.cell();
    const header = this.header();
    const footer = this.footer();
    if (cell) {
      const def = cell.column.columnDef;
      const groupingCell = cell;
      const groupingDef = def;
      if (groupingCell.getIsAggregated?.()) {
        return [groupingDef.aggregatedCell ?? def.cell, cell.getContext()];
      }
      if (groupingCell.getIsPlaceholder?.()) {
        return [null, null];
      }
      return [cell.column.columnDef.cell, cell.getContext()];
    }
    if (header) {
      return [header.column.columnDef.header, header.getContext()];
    }
    if (footer) {
      return [footer.column.columnDef.footer, footer.getContext()];
    }
    return [null, null];
  }, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "#renderData"
  } : (
    /* istanbul ignore next */
    {}
  )), {
    equal: (a, b) => {
      return a[0] === b[0] && a[1] === b[1];
    }
  }));
  #injector = inject(Injector);
  #templateRef = inject(TemplateRef);
  #viewContainerRef = inject(ViewContainerRef);
  constructor() {
    const content = computed(
      () => this.#renderData()[0],
      ...ngDevMode ? [{
        debugName: "content"
      }] : (
        /* istanbul ignore next */
        []
      )
    );
    const props = computed(
      () => this.#renderData()[1],
      ...ngDevMode ? [{
        debugName: "props"
      }] : (
        /* istanbul ignore next */
        []
      )
    );
    const renderer = new FlexViewRenderer({
      content,
      props,
      injector: () => this.#injector,
      templateRef: this.#templateRef,
      viewContainerRef: this.#viewContainerRef
    });
    renderer.mount();
    inject(DestroyRef).onDestroy(() => {
      renderer.destroy();
    });
  }
  static ɵfac = function FlexRenderCell_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FlexRenderCell)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _FlexRenderCell,
    selectors: [["ng-template", "flexRenderCell", ""], ["ng-template", "flexRenderFooter", ""], ["ng-template", "flexRenderHeader", ""]],
    inputs: {
      cell: [1, "flexRenderCell", "cell"],
      header: [1, "flexRenderHeader", "header"],
      footer: [1, "flexRenderFooter", "footer"]
    }
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FlexRenderCell, [{
    type: Directive,
    args: [{
      selector: "ng-template[flexRenderCell], ng-template[flexRenderFooter], ng-template[flexRenderHeader]"
    }]
  }], () => [], {
    cell: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "flexRenderCell",
        required: false
      }]
    }],
    header: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "flexRenderHeader",
        required: false
      }]
    }],
    footer: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "flexRenderFooter",
        required: false
      }]
    }]
  });
})();
var FlexRenderDirective = class _FlexRenderDirective {
  content = input(void 0, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "content"
  } : (
    /* istanbul ignore next */
    {}
  )), {
    alias: "flexRender"
  }));
  props = input({}, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "props"
  } : (
    /* istanbul ignore next */
    {}
  )), {
    alias: "flexRenderProps"
  }));
  injector = input(inject(Injector), __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "injector"
  } : (
    /* istanbul ignore next */
    {}
  )), {
    alias: "flexRenderInjector"
  }));
  #viewContainerRef = inject(ViewContainerRef);
  #templateRef = inject(TemplateRef);
  constructor() {
    const renderer = new FlexViewRenderer({
      content: this.content,
      props: this.props,
      injector: this.injector,
      templateRef: this.#templateRef,
      viewContainerRef: this.#viewContainerRef
    });
    renderer.mount();
    inject(DestroyRef).onDestroy(() => {
      renderer.destroy();
    });
  }
  static ɵfac = function FlexRenderDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FlexRenderDirective)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _FlexRenderDirective,
    selectors: [["ng-template", "flexRender", ""]],
    inputs: {
      content: [1, "flexRender", "content"],
      props: [1, "flexRenderProps", "props"],
      injector: [1, "flexRenderInjector", "injector"]
    }
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FlexRenderDirective, [{
    type: Directive,
    args: [{
      selector: "ng-template[flexRender]"
    }]
  }], () => [], {
    content: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "flexRender",
        required: false
      }]
    }],
    props: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "flexRenderProps",
        required: false
      }]
    }],
    injector: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "flexRenderInjector",
        required: false
      }]
    }]
  });
})();
function lazyInit(initializer) {
  assertInInjectionContext(lazyInit);
  let object = null;
  const initializeObject = () => {
    if (!object) {
      object = untracked(() => initializer());
    }
  };
  effect(() => initializeObject(), {
    debugName: "tableLazyInitEffect"
  });
  const table = () => {
  };
  const proxy = new Proxy(table, {
    apply(target, thisArg, argArray) {
      initializeObject();
      if (typeof object === "function") {
        return Reflect.apply(object, thisArg, argArray);
      }
      return Reflect.apply(target, thisArg, argArray);
    },
    get(_, prop, receiver) {
      initializeObject();
      return Reflect.get(object, prop, receiver);
    },
    has(_, prop) {
      initializeObject();
      return Reflect.has(object, prop);
    },
    ownKeys() {
      initializeObject();
      return Reflect.ownKeys(object);
    },
    getOwnPropertyDescriptor() {
      return {
        enumerable: true,
        configurable: true
      };
    }
  });
  return {
    value: proxy,
    get rawValue() {
      return object;
    },
    get initialized() {
      return !!object;
    }
  };
}
function signalToReadonlyAtom(signal2, injector, debugName) {
  const _signal = Object.assign(signal2, {
    get: () => signal2(),
    subscribe: (observer) => {
      return untracked(() => toObservable(signal2, {
        injector
      }).subscribe(observer));
    }
  });
  if (debugName) {
    _signal.toString = () => debugName;
  }
  return _signal;
}
function signalToWritableAtom(signal2, injector, debugName) {
  const _signal = Object.assign(signal2.asReadonly(), {
    set: (updater) => {
      typeof updater === "function" ? signal2.update(updater) : signal2.set(updater);
    },
    get: () => signal2(),
    subscribe: (observer) => {
      return untracked(() => toObservable(signal2, {
        injector
      }).subscribe(observer));
    }
  });
  if (debugName) {
    _signal.toString = () => debugName;
  }
  return _signal;
}
function angularReactivity(injector) {
  const ngZone = injector.get(NgZone);
  const subscriptions = /* @__PURE__ */ new Set();
  return {
    createOptionsStore: true,
    wrapExternalAtoms: true,
    addSubscription: (subscription) => {
      subscriptions.add(subscription);
    },
    unmount: () => {
      subscriptions.forEach((s) => s.unsubscribe());
      subscriptions.clear();
    },
    schedule: (fn) => ngZone.runOutsideAngular(() => queueMicrotask(fn)),
    createReadonlyAtom: (fn, options) => {
      const signal2 = computed(() => fn(), {
        equal: options?.compare,
        debugName: options?.debugName
      });
      return signalToReadonlyAtom(signal2, injector, options?.debugName);
    },
    createWritableAtom: (value, options) => {
      const writableSignal = signal(value, {
        equal: options?.compare,
        debugName: options?.debugName
      });
      return signalToWritableAtom(writableSignal, injector, options?.debugName);
    },
    untrack: untracked,
    batch: (fn) => fn()
  };
}
function injectTable(optionsFactory) {
  assertInInjectionContext(injectTable);
  const injector = inject(Injector);
  const ngZone = inject(NgZone);
  const destroyRef = inject(DestroyRef);
  const options = computed(
    () => optionsFactory(),
    ...ngDevMode ? [{
      debugName: "options"
    }] : (
      /* istanbul ignore next */
      []
    )
  );
  const coreReactivityFeature = angularReactivity(injector);
  const lazyTable = ngZone.runOutsideAngular(() => lazyInit(() => {
    const currentOptions = options();
    const features = __spreadValues({
      coreReactivityFeature
    }, currentOptions.features);
    return constructTable(__spreadProps(__spreadValues({}, currentOptions), {
      features
    }));
  }));
  destroyRef.onDestroy(() => {
    if (lazyTable.initialized) {
      lazyTable.value._reactivity.unmount?.();
    }
  });
  let previousOptions = void 0;
  effect(() => {
    const currentOptions = options();
    const tableInstance = lazyTable.rawValue;
    if (previousOptions === currentOptions) return;
    untracked(() => tableInstance.setOptions((previous) => __spreadValues(__spreadValues({}, previous), currentOptions)));
    previousOptions = currentOptions;
  }, {
    injector,
    debugName: "tableOptionsUpdate"
  });
  return lazyTable.value;
}
function createTableHook(_a) {
  var _b = _a, {
    tableComponents,
    cellComponents,
    headerComponents
  } = _b, defaultTableOptions = __objRest(_b, [
    "tableComponents",
    "cellComponents",
    "headerComponents"
  ]);
  function injectTableContext$1() {
    return injectTableContext();
  }
  function injectTableHeaderContext$1() {
    return injectTableHeaderContext();
  }
  function injectTableCellContext$1() {
    return injectTableCellContext();
  }
  function injectFlexRenderHeaderContext() {
    return injectFlexRenderContext();
  }
  function injectFlexRenderCellContext() {
    return injectFlexRenderContext();
  }
  function injectAppTable(tableOptions2) {
    function appCell(cell) {
      return cell;
    }
    function appHeader(header) {
      return header;
    }
    function appFooter(footer) {
      return footer;
    }
    const appTableFeatures = {
      constructTableAPIs: (table) => {
        Object.assign(table, tableComponents, {
          appCell,
          appHeader,
          appFooter
        });
      },
      assignCellPrototype(prototype) {
        Object.assign(prototype, cellComponents);
      },
      assignHeaderPrototype(prototype) {
        Object.assign(prototype, headerComponents);
      }
    };
    return injectTable(() => {
      return __spreadProps(__spreadValues(__spreadValues({}, defaultTableOptions), tableOptions2()), {
        features: __spreadProps(__spreadValues({}, defaultTableOptions.features), {
          appTableFeatures
        })
      });
    });
  }
  function createAppColumnHelper() {
    return createColumnHelper();
  }
  return {
    createAppColumnHelper,
    injectTableContext: injectTableContext$1,
    injectTableHeaderContext: injectTableHeaderContext$1,
    injectTableCellContext: injectTableCellContext$1,
    injectFlexRenderHeaderContext,
    injectFlexRenderCellContext,
    injectAppTable
  };
}
var FlexRender = [FlexRenderDirective, FlexRenderCell];
export {
  FlexRender,
  FlexRenderCell,
  FlexRenderComponentInstance,
  FlexRenderDirective,
  TanStackTable,
  TanStackTableCell,
  TanStackTableCellToken,
  TanStackTableHeader,
  TanStackTableHeaderToken,
  TanStackTableToken,
  aggregationFn_count,
  aggregationFn_extent,
  aggregationFn_first,
  aggregationFn_last,
  aggregationFn_max,
  aggregationFn_mean,
  aggregationFn_median,
  aggregationFn_min,
  aggregationFn_sum,
  aggregationFn_unique,
  aggregationFn_uniqueCount,
  aggregationFns,
  assignPrototypeAPIs,
  assignTableAPIs,
  buildHeaderGroups,
  callMemoOrStaticFn,
  cellSelectionFeature,
  cellSpanningFeature,
  cloneState,
  columnFacetingFeature,
  columnFilteringFeature,
  columnGroupingFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  constructAggregationFn,
  constructCell,
  constructColumn,
  constructFilterFn,
  constructHeader,
  constructRow,
  constructSortFn,
  constructTable,
  copyInstancePropertiesWithoutMemos,
  coreCellsFeature,
  coreColumnsFeature,
  coreFeatures,
  coreHeadersFeature,
  coreRowModelsFeature,
  coreRowsFeature,
  coreTablesFeature,
  createColumnHelper,
  createCoreRowModel,
  createExpandedRowModel,
  createFacetedMinMaxValues,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  createTableHook,
  expandRows,
  filterFn_arrHas,
  filterFn_arrIncludes,
  filterFn_arrIncludesAll,
  filterFn_arrIncludesSome,
  filterFn_between,
  filterFn_betweenInclusive,
  filterFn_empty,
  filterFn_endsWith,
  filterFn_equals,
  filterFn_equalsString,
  filterFn_equalsStringSensitive,
  filterFn_greaterThan,
  filterFn_greaterThanOrEqualTo,
  filterFn_inDateRange,
  filterFn_inNumberRange,
  filterFn_includesString,
  filterFn_includesStringSensitive,
  filterFn_lessThan,
  filterFn_lessThanOrEqualTo,
  filterFn_notEmpty,
  filterFn_startsWith,
  filterFn_weakEquals,
  filterFns,
  flattenBy,
  flexRenderComponent,
  functionalUpdate,
  getFunctionNameInfo,
  getInitialTableState,
  globalFilteringFeature,
  hasOwn,
  injectFlexRenderContext,
  injectTable,
  injectTableCellContext,
  injectTableContext,
  injectTableHeaderContext,
  isFunction,
  makeObjectMap,
  makeStateUpdater,
  memo,
  metaHelper,
  reSplitAlphaNumeric,
  rowAggregationFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  rowPinningFeature,
  rowSelectionFeature,
  rowSortingFeature,
  setStateSlice,
  shallow,
  skipFirstRun,
  sortFn_alphanumeric,
  sortFn_alphanumericCaseSensitive,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  sortFn_textCaseSensitive,
  sortFns,
  stateSlicesEqual,
  stockFeatures,
  tableFeatures,
  tableMemo,
  tableOptions
};
//# sourceMappingURL=@tanstack_angular-table.js.map
