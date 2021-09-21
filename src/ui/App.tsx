import * as React from "react";
import Toolbar from "./components/toolbar/Toolbar";
import RenderTree from "./components/render-tree/Tree";
import Details from "./components/details/Details";
import StatusBar from "./components/statusbar/StatusBar";
import { FindMatchContextProvider } from "./utils/find-match";
import {
  SelectedIdConsumer,
  SelectionContextProvider,
} from "./utils/selection";
import { EventsContextProvider, useEventsContext } from "./utils/events";
import { useFiberChildren } from "./utils/fiber-maps";

function WaitingForReady() {
  const [visible, setVisible] = React.useState(false);
  const children = useFiberChildren(0);
  const { loadedEventsCount, totalEventsCount } = useEventsContext();

  // Delay appearing to give a chance to receive some events before
  // displaying awaiting caption
  React.useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (children.length > 0) {
    return null;
  }

  return (
    <div className={"app-waiting-for-react" + (visible ? " visible" : "")}>
      {totalEventsCount > 0
        ? loadedEventsCount === totalEventsCount
          ? "Rendering..."
          : `Loading events (${Math.trunc(
              (100 * loadedEventsCount) / totalEventsCount
            )}%)...`
        : "Waiting for a React's render root to be mount..."}
    </div>
  );
}

function App() {
  const [filterPattern, setFilterPattern] = React.useState("");
  const [groupByParent, setGroupByParent] = React.useState(false);
  const [showUnmounted, setShowUnmounted] = React.useState(true);
  const [showTimings, setShowTimings] = React.useState(false);

  return (
    <EventsContextProvider>
      <SelectionContextProvider>
        <SelectedIdConsumer>
          {(selectedId: number | null) => (
            <div
              className="app"
              data-has-selected={selectedId !== null || undefined}
            >
              <Toolbar
                onFilterPatternChange={setFilterPattern}
                filterPattern={filterPattern}
                onGroupingChange={setGroupByParent}
                groupByParent={groupByParent}
                onShowUnmounted={setShowUnmounted}
                showUnmounted={showUnmounted}
                onShowTimings={setShowTimings}
                showTimings={showTimings}
              />

              <FindMatchContextProvider pattern={filterPattern}>
                <WaitingForReady />
                <RenderTree
                  rootId={0}
                  groupByParent={groupByParent}
                  showUnmounted={showUnmounted}
                  showTimings={showTimings}
                />
              </FindMatchContextProvider>

              {selectedId !== null && (
                <Details
                  rootId={selectedId}
                  groupByParent={groupByParent}
                  showUnmounted={showUnmounted}
                  showTimings={showTimings}
                />
              )}
              <StatusBar />
            </div>
          )}
        </SelectedIdConsumer>
      </SelectionContextProvider>
    </EventsContextProvider>
  );
}

export default App;
