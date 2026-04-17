export interface PipelineTicket {
  id: string;
  title: string;
}

export type PipelineBoardState<TTicket extends PipelineTicket = PipelineTicket> = Record<string, TTicket[]>;

export interface PipelineStageDefinition {
  id: string;
  title: string;
}

export interface PipelineMoveResult<TTicket extends PipelineTicket = PipelineTicket> {
  board: PipelineBoardState<TTicket>;
  movedTicket?: TTicket;
  fromColumn?: string;
  toColumn?: string;
}

export function createPipelineBoard<TTicket extends PipelineTicket>(
  stages: PipelineStageDefinition[],
  tickets: Array<TTicket & { stage: string }>,
): PipelineBoardState<TTicket> {
  const board = Object.fromEntries(stages.map((stage) => [stage.id, [] as TTicket[]])) as PipelineBoardState<TTicket>;
  for (const ticket of tickets) {
    if (!(ticket.stage in board)) board[ticket.stage] = [];
    board[ticket.stage].push(ticket);
  }
  return board;
}

export function moveTicket<TTicket extends PipelineTicket>(
  board: PipelineBoardState<TTicket>,
  ticketId: string,
  toColumn: string,
  targetIndex?: number,
): PipelineMoveResult<TTicket> {
  const fromColumn = findTicketColumn(board, ticketId);
  if (!fromColumn || !(toColumn in board)) return { board };

  const movedTicket = board[fromColumn].find((ticket) => ticket.id === ticketId);
  if (!movedTicket) return { board };

  const sourceTickets = board[fromColumn].filter((ticket) => ticket.id !== ticketId);
  const destinationTickets = fromColumn === toColumn ? sourceTickets : [...board[toColumn]];
  const index = targetIndex === undefined ? destinationTickets.length : Math.max(0, Math.min(targetIndex, destinationTickets.length));
  const nextDestination = [
    ...destinationTickets.slice(0, index),
    movedTicket,
    ...destinationTickets.slice(index),
  ];

  return {
    board: {
      ...board,
      [fromColumn]: fromColumn === toColumn ? nextDestination : sourceTickets,
      [toColumn]: nextDestination,
    },
    movedTicket,
    fromColumn,
    toColumn,
  };
}

export function reorderColumn<TTicket extends PipelineTicket>(
  board: PipelineBoardState<TTicket>,
  column: string,
  fromIndex: number,
  toIndex: number,
): PipelineBoardState<TTicket> {
  const items = [...(board[column] || [])];
  if (!items.length) return board;

  const [moved] = items.splice(fromIndex, 1);
  items.splice(toIndex, 0, moved);

  return {
    ...board,
    [column]: items,
  };
}

export function buildBatchStageUpdates<TTicket extends PipelineTicket>(
  tickets: TTicket[],
  stage: string,
) {
  return tickets.map((ticket, index) => ({
    id: ticket.id,
    stage,
    order: index,
  }));
}

export function findTicketColumn<TTicket extends PipelineTicket>(
  board: PipelineBoardState<TTicket>,
  ticketId: string,
): string | undefined {
  return Object.keys(board).find((column) => board[column].some((ticket) => ticket.id === ticketId));
}

export function summarizePipelineBoard<TTicket extends PipelineTicket>(board: PipelineBoardState<TTicket>) {
  const columns = Object.entries(board).map(([columnId, tickets]) => ({
    columnId,
    count: tickets.length,
    ticketIds: tickets.map((ticket) => ticket.id),
  }));
  return {
    totalTickets: columns.reduce((sum, column) => sum + column.count, 0),
    columns,
  };
}
