import * as React from "react";
import { MessageFiber } from "../../types";

const MAX_TEXT = 12;

interface ElementKeyProps {
  component: MessageFiber;
}

const ElementKey = ({ component: { displayName, key } }: ElementKeyProps) => {
  const value = String(key);

  return (
    <span className="element-key" title={`<${displayName} key="${value}">`}>
      {value.length > MAX_TEXT ? value.substr(0, MAX_TEXT) + "…" : value}
    </span>
  );
};

export default ElementKey;
