import React, { useState } from "react";
import dateFormat from "dateformat";
import ButtonCollapse from "../common/ButtonCollapse";
import EventRenderReason from "./EventRenderReasonDetails";
import ElementId from "../common/ElementId";
import { TreeElement, Event } from "../../types";

interface EventListItemProps {
  component: TreeElement;
  event: Event;
}

function getReasons(event: Event) {
  const reasons: string[] = [];

  if (event.op === "render") {
    const { context, hooks, props, state, parentUpdate } = event.changes || {};

    if (context) {
      reasons.push("Context change");
    }

    if (hooks) {
      reasons.push("Hooks change");
    }

    if (props) {
      reasons.push("Props change");
    }

    if (state) {
      reasons.push("State change");
    }

    if (parentUpdate) {
      reasons.push("Parent Update");
    }
  }

  return reasons;
}

const EventListItem = ({ component, event }: EventListItemProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const hasDetails =
    event.op === "render" &&
    (event.changes?.props || event.changes?.state || event.changes?.hooks);

  return (
    <>
      <tr>
        <td>
          {hasDetails && (
            <ButtonCollapse
              isCollapsed={isCollapsed}
              onToggle={() => setIsCollapsed(prev => !prev)}
            />
          )}
        </td>
        <td className="timestamp">
          <span className="timestamp-label">
            {dateFormat(Number(event.timestamp), "HH:MM:ss.l")}
          </span>
        </td>
        <td className="event">
          <span className="event-type-label">{event.op}</span>
        </td>
        <td className="details">
          {component.displayName || "Unknown"}
          <ElementId id={component.id} /> {getReasons(event).join(", ")}{" "}
          {event.op === "render" && event.selfDuration.toFixed(1)}ms{" "}
          {event.op === "render" && event.actualDuration.toFixed(1)}ms
        </td>
      </tr>
      {event.op === "render" && isCollapsed && (
        <EventRenderReason changes={event.changes} />
      )}
    </>
  );
};

export default EventListItem;
