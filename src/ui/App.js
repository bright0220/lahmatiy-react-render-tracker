import React, { useState, useMemo } from "react";

import { getTreeData, handleFilterDataElement } from "./data/helpers";

import TreeElement from "./components/TreeElement";
import ElementInfo from "./components/element/ElementInfo";
import Card from "./components/ui/Card";
import ToolsHeader from "./components/layout/ToolsHeader";

function App({ data }) {
  const [selectedId, setSelectedId] = useState(null);
  const [searched, setSearched] = useState("");
  const [showDisabled, setShowDisabled] = useState(true);

  const { componentById, roots } = useMemo(
    () => (data ? getTreeData(data) : [new Map(), []]),
    [data, searched, showDisabled]
  );
  const filteredData = useMemo(
    () => handleFilterDataElement(roots, searched, showDisabled),
    [roots, searched, showDisabled]
  );
  const selectedComponent = componentById.get(selectedId) || null;

  return (
    <div className="App">
      <ToolsHeader
        setSearched={setSearched}
        searched={searched}
        onShowDisabled={setShowDisabled}
        showDisabled={showDisabled}
      />
      <div className="tools-content">
        <div>
          <Card>
            {filteredData?.map(rootElement => (
              <TreeElement
                data={rootElement}
                onSelect={setSelectedId}
                selectedId={selectedId}
                key={rootElement.id}
                highlight={searched}
                root
              />
            ))}
          </Card>
        </div>
        {selectedComponent && <ElementInfo data={selectedComponent} />}
      </div>
    </div>
  );
}

export default App;
