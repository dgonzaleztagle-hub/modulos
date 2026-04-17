export type TransitionMap<TState extends string> = Record<TState, readonly TState[]>;

export interface StateMachine<TState extends string> {
  transitions: TransitionMap<TState>;
  canTransition: (from: TState, to: TState) => boolean;
  assertTransition: (from: TState, to: TState) => void;
  getNextStates: (from: TState) => readonly TState[];
}

export function createStateMachine<TState extends string>(
  transitions: TransitionMap<TState>,
): StateMachine<TState> {
  return {
    transitions,
    canTransition(from, to) {
      return transitions[from]?.includes(to) ?? false;
    },
    assertTransition(from, to) {
      if (!(transitions[from]?.includes(to) ?? false)) {
        throw new Error(`Invalid transition: ${from} -> ${to}`);
      }
    },
    getNextStates(from) {
      return transitions[from] ?? [];
    },
  };
}

export type DeliveryOrderStatus =
  | "pending"
  | "assigned"
  | "accepted"
  | "arrived_pickup"
  | "picked_up"
  | "in_transit"
  | "arrived_delivery"
  | "completed"
  | "failed_delivery"
  | "cancelled";

export const defaultDeliveryTransitions: TransitionMap<DeliveryOrderStatus> = {
  pending: ["assigned", "cancelled"],
  assigned: ["accepted", "cancelled"],
  accepted: ["arrived_pickup", "cancelled"],
  arrived_pickup: ["picked_up", "failed_delivery", "cancelled"],
  picked_up: ["in_transit", "failed_delivery"],
  in_transit: ["arrived_delivery", "failed_delivery"],
  arrived_delivery: ["completed", "failed_delivery"],
  completed: [],
  failed_delivery: ["assigned", "cancelled"],
  cancelled: [],
};

export const deliveryOrderStateMachine = createStateMachine(defaultDeliveryTransitions);
