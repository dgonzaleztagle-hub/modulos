import test from "node:test";
import assert from "node:assert/strict";

import {
  createPipelineBoard,
  moveTicket,
  reorderColumn,
  summarizePipelineBoard,
} from "../.dist/modulos/crm/pipeline-board/src.js";

test("pipeline-board crea tablero por etapas y mueve tickets", () => {
  const board = createPipelineBoard(
    [
      { id: "lead", title: "Lead" },
      { id: "won", title: "Won" },
    ],
    [
      { id: "t1", title: "Uno", stage: "lead" },
      { id: "t2", title: "Dos", stage: "lead" },
    ],
  );

  const moved = moveTicket(board, "t1", "won");
  assert.equal(moved.fromColumn, "lead");
  assert.equal(moved.toColumn, "won");
  assert.equal(moved.board.won[0].id, "t1");
});

test("pipeline-board reordena y resume columnas", () => {
  const board = {
    lead: [{ id: "t1", title: "Uno" }, { id: "t2", title: "Dos" }],
    won: [],
  };

  const reordered = reorderColumn(board, "lead", 0, 1);
  const summary = summarizePipelineBoard(reordered);

  assert.equal(reordered.lead[0].id, "t2");
  assert.equal(summary.totalTickets, 2);
});
