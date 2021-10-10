import * as React from "react";
import { MessageFiber } from "../../types";
import { useFiberMaps } from "../../utils/fiber-maps";
import FiberId from "../common/FiberId";
import { ChevronUp, ChevronDown } from "../common/icons";
import { fiberTypeName } from "../../../common/constants";
import { useSelectedId } from "../../utils/selection";
import { FiberLink } from "./FiberLink";
import { useTreeUpdateSubscription } from "../../utils/tree";
import { usePinnedId } from "../../utils/pinned";

const FiberInfoHeaderPrelude = ({
  fiber,
  groupByParent,
  showUnmounted,
}: {
  fiber: MessageFiber;
  groupByParent: boolean;
  showUnmounted: boolean;
}) => {
  return (
    <div className="fiber-info-header-prelude">
      <div className="fiber-info-header-prelude__content">
        <span className="fiber-info-header-type-badge" data-type="type">
          {fiberTypeName[fiber.type]}
        </span>
        {!fiber.mounted && (
          <span className="fiber-info-header-type-badge">Unmounted</span>
        )}
      </div>
      <InstanceSwitcher
        fiberId={fiber.id}
        typeId={fiber.typeId}
        groupByParent={groupByParent}
        showUnmounted={showUnmounted}
      />
    </div>
  );
};

function InstanceSwitcher({
  fiberId,
  typeId,
  groupByParent,
  showUnmounted,
}: {
  fiberId: number;
  typeId: number;
  groupByParent: boolean;
  showUnmounted: boolean;
}) {
  const { select } = useSelectedId();
  const { pinnedId } = usePinnedId();
  const { selectTree } = useFiberMaps();
  const tree = selectTree(groupByParent, showUnmounted);
  const treeUpdate = useTreeUpdateSubscription(tree);

  const { index, total } = React.useMemo(() => {
    let index = 0;
    let total = 0;

    tree.get(pinnedId)?.walk(node => {
      if (node.fiber?.typeId === typeId) {
        total++;

        if (fiberId === node.id) {
          index = total;
        }
      }
    });

    return { index, total };
  }, [tree, treeUpdate, pinnedId, fiberId]);

  const disableButtons = total === 0 || (total === 1 && index === 1);

  return (
    <div className="fiber-info-instance-iterator">
      <span className="fiber-info-instance-iterator__label">
        {index || "–"} / {total}
      </span>
      <span className="fiber-info-instance-iterator__buttons">
        <button
          className="fiber-info-instance-iterator__button"
          disabled={disableButtons}
          onClick={() => {
            const node = tree.findBack(
              node => node.id !== fiberId && node.fiber?.typeId === typeId,
              fiberId
            );

            if (node !== null) {
              select(node.id);
            }
          }}
        >
          {ChevronUp}
        </button>
        <button
          className="fiber-info-instance-iterator__button"
          disabled={disableButtons}
          onClick={() => {
            const node = tree.find(
              node => node.id !== fiberId && node.fiber?.typeId === typeId,
              fiberId
            );

            if (node !== null) {
              select(node.id);
            }
          }}
        >
          {ChevronDown}
        </button>
      </span>
    </div>
  );
}

function FiberInfoHeaderNotes({ fiber }: { fiber?: MessageFiber }) {
  const { fiberById } = useFiberMaps();
  const owner = fiberById.get(fiber?.ownerId as number);
  const parent = fiberById.get(fiber?.parentId as number);

  if (!fiber || !parent) {
    return null;
  }

  return (
    <div className="fiber-info-header-notes">
      {parent === owner ? (
        <>
          Parent / created by{" "}
          <FiberLink key={parent.id} id={parent.id} name={parent.displayName} />
        </>
      ) : (
        <>
          {"Parent: "}
          <FiberLink key={parent.id} id={parent.id} name={parent.displayName} />
          {", "}
          {owner ? (
            <>
              {"created by "}
              <FiberLink
                key={owner.id}
                id={owner.id}
                name={owner.displayName}
              />
            </>
          ) : (
            "no owner (created outside of render)"
          )}
        </>
      )}
    </div>
  );
}

export const FiberInfoHeader = ({
  fiber,
  groupByParent,
  showUnmounted,
}: {
  fiber: MessageFiber;
  groupByParent: boolean;
  showUnmounted: boolean;
}) => {
  return (
    <>
      <FiberInfoHeaderPrelude
        fiber={fiber}
        groupByParent={groupByParent}
        showUnmounted={showUnmounted}
      />
      <div className="fiber-info-header">
        {fiber.displayName}
        <FiberId id={fiber.id} />
      </div>
      <FiberInfoHeaderNotes fiber={fiber} />
    </>
  );
};
