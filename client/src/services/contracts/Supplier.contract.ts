import type { Service } from '@internal-types/Service.type';
import type { Supplier, SupplierCategory } from '@internal-types/Supplier.type';

export namespace ListSuppliers {
    type Data = { suppliers: Supplier.Model[] };

    export type Response =
        | Service.DefaultResponse<Data>
        | Service.ExceptionResponse;
}

export namespace FindSupplier {
    type Data = { supplier: Supplier.Model };

    export type Response =
        | Service.DefaultResponse<Data>
        | Service.ExceptionResponse;
}

export type SupplierAddressBody = {
    street: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city: string;
    state?: string;
    country?: string;
    postal_code: string;
};

export namespace CreateSupplier {
    export type Body = {
        legal_name: string;
        trade_name?: string;
        cnpj: string;
        email: string;
        supplier_category_id?: number | null;
        person_ids?: number[];
        address: SupplierAddressBody;
    };

    type Data = { supplier: Supplier.Model };

    export type Response =
        | Service.DefaultResponse<Data>
        | Service.ExceptionResponse;
}

export namespace UpdateSupplier {
    export type Body = CreateSupplier.Body;

    type Data = { supplier: Supplier.Model };

    export type Response =
        | Service.DefaultResponse<Data>
        | Service.ExceptionResponse;
}

export namespace DeleteSupplier {
    export type Response =
        | Service.DefaultResponse
        | Service.ExceptionResponse;
}

export namespace ListSupplierCategories {
    type Data = { supplier_categories: SupplierCategory.Model[] };

    export type Response =
        | Service.DefaultResponse<Data>
        | Service.ExceptionResponse;
}
