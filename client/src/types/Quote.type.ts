export namespace QuoteCategory {
    export type Model = {
        id: number;
        name: string;
        created_at: string;
        updated_at: string;
        deleted_at: string | null;
    };
}

export namespace QuoteStatus {
    export type Model = {
        id: number;
        name: string;
        created_at: string;
        updated_at: string;
        deleted_at: string | null;
    };
}

export namespace Quote {
    export type Model = {
        id: number;
        title: string;
        description: string | null;
        amount: string | null;
        supplier_id: number;
        condominium_id: number;
        quote_category_id: number;
        quote_status_id: number;
        created_at: string;
        updated_at: string;
        deleted_at: string | null;
        condominium?: { id: number; name: string };
        supplier?: { id: number; legal_name: string };
        quote_category?: QuoteCategory.Model;
        quote_status?: QuoteStatus.Model;
    };
}
