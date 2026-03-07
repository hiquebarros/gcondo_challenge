import type { Person } from '@internal-types/Person.type';

export namespace SupplierCategory {
    export type Model = {
        id: number;
        name: string;
        created_at: string;
        updated_at: string;
        deleted_at: string | null;
    };
}

export namespace Supplier {
    export type Filter = {
        legal_name: string;
        cnpj: string;
        email: string;
        supplier_category_id: string;
    };

    export type Model = {
        id: number;
        legal_name: string;
        trade_name: string | null;
        cnpj: string;
        email: string;
        supplier_address_id: number | null;
        supplier_category_id: number | null;
        created_by_condominium_id: number | null;
        created_at: string;
        updated_at: string;
        deleted_at: string | null;
        category?: SupplierCategory.Model | null;
        people?: Person.Model[];
    };
}
