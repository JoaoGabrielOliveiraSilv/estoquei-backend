import { ProductStatus } from "../../products/shared/product.entity.js";

export function getProductStatusByQuantity(quantity: number): ProductStatus {
    if (quantity <= 0) {
        return 'danger';
    }
    else if (quantity <= 20) {
        return 'warning';
    }
    else {
        return 'normal';
    }
}