import type { MovementType } from "../shared/inventory-movement.entity.js";

export function calculateNextQuantityByMovement(actualQuantity: number, movement: { type: MovementType, quantity: number }): number {
    if (movement.type === 'inbound') {
        return actualQuantity + movement.quantity;
    }
    else {
        const nextQuantity = actualQuantity - movement.quantity;
        if (nextQuantity <= 0) {
            return 0;
        }
        return nextQuantity;
    }
}