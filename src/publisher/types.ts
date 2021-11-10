import {
  FiberType,
  Message,
  TransferCallTrace,
  TransferFiberChanges,
} from "common-types";
export * from "common-types";

export type DistributiveOmit<T, K extends keyof T> = T extends any
  ? Omit<T, K>
  : never;

export type ReactInternals = {
  reconcilerVersion?: string;
  version?: string;
  currentDispatcherRef: any;
  getCurrentFiber: () => Fiber | null;
  rendererPackageName: string;
  findFiberByHostInstance: (hostInstance: NativeType) => Fiber | null;
};

export type NativeType = Record<string, unknown>;
type HookType =
  | "useState"
  | "useReducer"
  | "useContext"
  | "useRef"
  | "useEffect"
  | "useLayoutEffect"
  | "useCallback"
  | "useMemo"
  | "useImperativeHandle"
  | "useDebugValue"
  | "useDeferredValue"
  | "useTransition"
  | "useMutableSource"
  | "useOpaqueIdentifier"
  | "useCacheRefresh";

export type RefObject = {
  current: any;
};

export type WorkTag =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24;

export type ReactNode =
  | ReactElement
  | ReactPortal
  | ReactText
  | ReactFragment
  | ReactProvider<any>
  | ReactConsumer<any>;

export type ReactEmpty = null | void | boolean;

export type ReactFragment = ReactEmpty | Iterable<ReactNode>;

export type ReactNodeList = ReactEmpty | ReactNode[];

export type ReactText = string | number;

export type ReactElement = {
  $$typeof: symbol | number;
  type: any;
  key: null | string;
  ref: any;
  props: Record<string, unknown>;
  // ReactFiber
  _owner: Fiber;

  // __DEV__
  _store: { validated: boolean };
  _self: ReactElement;
  _shadowChildren: any;
  _source: Source;
};

export type ReactProvider<T> = {
  $$typeof: symbol | number;
  type: ReactProviderType<T>;
  key: null | string;
  ref: null;
  props: {
    value: T;
    children?: ReactNodeList;
  };
};

export type ReactProviderType<T> = {
  $$typeof: symbol | number;
  _context: ReactContext<T>;
};

export type ReactConsumer<T> = {
  $$typeof: symbol | number;
  type: ReactContext<T>;
  key: null | string;
  ref: null;
  props: {
    children: (value: T) => ReactNodeList;
  };
};

export type ReactContext<T> = {
  $$typeof: symbol | number;
  Consumer: ReactContext<T>;
  Provider: ReactProviderType<T>;
  _currentValue: T;
  _currentValue2: T;
  _threadCount: number;
  // DEV only
  _currentRenderer?: Record<string, unknown> | null;
  _currentRenderer2?: Record<string, unknown> | null;
  // This value may be added by application code
  // to improve DEV tooling display names
  displayName?: string;
};

export type ReactPortal = {
  $$typeof: symbol | number;
  key: null | string;
  containerInfo: any;
  children: ReactNodeList;
  // TODO: figure out the API for cross-renderer implementation.
  implementation: any;
};

export type ContextDependency<T> = {
  context: ReactContext<T>;
  next: ContextDependency<any> | null;
};

export type Dependencies = {
  lanes: Lanes;
  firstContext: ContextDependency<any> | null;
};

export type OldDependencies = {
  first: ContextDependency<any> | null;
};

type Lanes = number;
type Flags = number;

export type FiberRoot = { current: Fiber };

type MemoizedStateMemo = {
  memoizedState: [any, any[] | null];
  next: MemoizedState;
};
// type MemoizedStateState = {
//   queue: {
//     dispatch(): void;
//   };
//   next: MemoizedState;
// };
export type MemoizedState = any; //MemoizedStateMemo | MemoizedStateState | null;
export interface Fiber {
  // Tag identifying the type of fiber.
  tag: WorkTag;

  // Unique identifier of this child.
  key: null | string;

  // The value of element.type which is used to preserve the identity during
  // reconciliation of this child.
  elementType: any;

  // The resolved function/class/ associated with this fiber.
  type: any;

  // The local state associated with this fiber.
  stateNode: any;

  // Conceptual aliases
  // parent : Instance -> return The parent happens to be the same as the
  // return fiber since we've merged the fiber and instance.

  // Remaining fields belong to Fiber

  // The Fiber to return to after finishing processing this one.
  // This is effectively the parent, but there can be multiple parents (two)
  // so this is only the parent of the thing we're currently processing.
  // It is conceptually the same as the return address of a stack frame.
  return: Fiber | null;

  // Singly Linked List Tree Structure.
  child: Fiber | null;
  sibling: Fiber | null;
  index: number;

  // The ref last used to attach this node.
  // I'll avoid adding an owner field for prod and model that as functions.
  ref:
    | null
    | (((handle: any) => void) & { _stringRef: string | null })
    | RefObject;

  // Input is the data coming into process this fiber. Arguments. Props.
  pendingProps: any; // This type will be more specific once we overload the tag.
  memoizedProps: any; // The props used to create the output.

  // A queue of state updates and callbacks.
  updateQueue: null;

  // The state used to create the output
  memoizedState: MemoizedState;

  // React 16.9+ Dependencies (contexts, events) for this fiber, if it has any
  dependencies?: Dependencies | null;

  // React prior 16.9 Dependencies (contexts, events) for this fiber, if it has any
  contextDependencies?: OldDependencies | null;

  // Bitfield that describes properties about the fiber and its subtree. E.g.
  // the ConcurrentMode flag indicates whether the subtree should be async-by-
  // default. When a fiber is created, it inherits the mode of its
  // parent. Additional flags can be set at creation time, but after that the
  // value should remain unchanged throughout the fiber's lifetime, particularly
  // before its child fibers are created.
  mode: number;

  // Effect
  flags: Flags;
  subtreeFlags: Flags;
  deletions: Array<Fiber> | null;

  // Singly linked list fast path to the next fiber with side-effects.
  nextEffect: Fiber | null;

  // The first and last fiber with side-effect within this subtree. This allows
  // us to reuse a slice of the linked list when we reuse the work done within
  // this fiber.
  firstEffect: Fiber | null;
  lastEffect: Fiber | null;

  lanes: Lanes;
  childLanes: Lanes;

  // This is a pooled version of a Fiber. Every fiber that gets updated will
  // eventually have a pair. There are cases when we can clean up pairs to save
  // memory if we need to.
  alternate: Fiber | null;

  // Time spent rendering this Fiber and its descendants for the current update.
  // This tells us how well the tree makes use of sCU for memoization.
  // It is reset to 0 each time we render and only updated when we don't bailout.
  // This field is only set when the enableProfilerTimer flag is enabled.
  actualDuration?: number;

  // If the Fiber is currently active in the "render" phase,
  // This marks the time at which the work began.
  // This field is only set when the enableProfilerTimer flag is enabled.
  actualStartTime?: number;

  // Duration of the most recent render time for this Fiber.
  // This value is not updated when we bailout for memoization purposes.
  // This field is only set when the enableProfilerTimer flag is enabled.
  selfBaseDuration?: number;

  // Sum of base times for all descendants of this Fiber.
  // This value bubbles up during the "complete" phase.
  // This field is only set when the enableProfilerTimer flag is enabled.
  treeBaseDuration?: number;

  // Conceptual aliases
  // workInProgress : Fiber ->  alternate The alternate used for reuse happens
  // to be the same as work in progress.
  // __DEV__ only

  _debugSource?: Source | null;
  _debugOwner?: Fiber | null;
  _debugIsCurrentlyTiming?: boolean;
  _debugNeedsRemount?: boolean;

  // Used to verify that the order of hooks does not change between renders.
  _debugHookTypes?: Array<HookType> | null;
}

export type PathFrame = {
  key: string | null;
  index: number;
  displayName: string | null;
};

export type PathMatch = {
  id: number;
  isFullMatch: boolean;
};

export type SerializedElement = {
  displayName: string | null;
  id: number;
  key: number | string | null;
  type: FiberType;
};

export type OwnersList = {
  id: number;
  owners: Array<SerializedElement> | null;
};

export type ReactCommitData = {
  commitTime: number;
  // Tuple of fiber ID and change description
  changeDescriptions: Map<number, TransferFiberChanges> | null;
  duration: number;
  // Only available in certain (newer) React builds,
  effectDuration: number | null;
  // Tuple of fiber ID and actual duration
  fiberActualDurations: Array<[number, number]>;
  // Tuple of fiber ID and computed "self" duration
  fiberSelfDurations: Array<[number, number]>;
  // Only available in certain (newer) React builds,
  passiveEffectDuration: number | null;
  priorityLevel: string | null;
  timestamp: number;
  updaters: Array<SerializedElement> | null;
};

export type Source = {
  fileName: string;
  lineNumber: number;
};

export type InspectedElement = {
  id: number;

  displayName: string | null;

  // Does the current renderer support editable hooks and function props?
  canEditHooks: boolean;
  canEditFunctionProps: boolean;

  // Does the current renderer support advanced editing interface?
  canEditHooksAndDeletePaths: boolean;
  canEditHooksAndRenamePaths: boolean;
  canEditFunctionPropsDeletePaths: boolean;
  canEditFunctionPropsRenamePaths: boolean;

  // Is this Error, and can its value be overridden now?
  canToggleError: boolean;
  isErrored: boolean;
  targetErrorBoundaryID?: number;

  // Is this Suspense, and can its value be overridden now?
  canToggleSuspense: boolean;

  // Can view component source location.
  canViewSource: boolean;

  // Does the component have legacy context attached to it.
  hasLegacyContext: boolean;

  // Inspectable properties.
  context: Record<string, unknown> | null;
  hooks: Record<string, unknown> | null;
  props: Record<string, unknown> | null;
  state: Record<string, unknown> | null;
  key: number | string | null;
  errors: Array<[string, number]>;
  warnings: Array<[string, number]>;

  // List of owners
  owners: Array<SerializedElement> | null;

  // Location of component in source code.
  source: Source | null;

  type: FiberType;

  // Meta information about the root this element belongs to.
  rootType: string | null;

  // Meta information about the renderer that created this element.
  rendererPackageName: string | null;
  rendererVersion: string | null;
};

export type RerenderState = {
  state: MemoizedState;
};

export type FiberDispatcherContext = {
  context: ReactContext<any>;
  reads: Array<{
    index: number;
    trace: TransferCallTrace;
  }>;
};

export type FiberDispatchCall = {
  dispatch: any;
  dispatchName: "setState" | "dispatch";
  root: FiberRoot;
  fiber: Fiber;
  renderFiber: Fiber | null;
  effectFiber: Fiber | null;
  effectName: "effect" | "layout-effect" | null;
  event: string | null;
  loc: string | null;
  stack?: string;
};

export type ClassComponentUpdateCall = {
  type: "setState" | "forceUpdate";
  rootId?: number;
  fiber?: Fiber;
  loc: string | null;
};

export type HookInfo = {
  name: string;
  deps: number | null;
  context: ReactContext<any> | null;
  trace: TransferCallTrace;
};

export type HookCompute = {
  render: number;
  hook: number;
  prev: MemoizedStateMemo;
  next: MemoizedStateMemo;
};

export type ReactDevtoolsHookHandlers = {
  handleCommitFiberRoot: (fiber: FiberRoot, commitPriority?: number) => void;
  handlePostCommitFiberRoot: (fiber: FiberRoot) => void;
  handleCommitFiberUnmount: (fiber: Fiber) => void;
};
export type ReactInterationApi = {
  findNativeNodesForFiberID: (id: number) => any[] | null;
  getFiberIDForNative: (
    hostInstance: NativeType,
    findNearestUnfilteredAncestor?: boolean
  ) => number | null;
  getDisplayNameForFiberID: (id: number) => string | null;
  getOwnersList: (id: number) => Array<SerializedElement> | null;
  getPathForElement: (id: number) => Array<PathFrame> | null;
};
export type ReactDispatcherTrapApi = {
  getDispatchHookIndex: (dispatch: (state: any) => any) => number | null;
  getFiberTypeHookInfo: (fiberTypeId: number) => HookInfo[];
  getFiberComputes: (fiber: Fiber) => HookCompute[];
  getFiberRerenders: (fiber: Fiber) => RerenderState[] | undefined;
  flushDispatchCalls: (root: FiberRoot) => FiberDispatchCall[];
};
export type ReactIntegration = ReactDevtoolsHookHandlers & ReactInterationApi;

export type RecordEventHandler = (
  payload: DistributiveOmit<Message, "id" | "timestamp">
) => number;
