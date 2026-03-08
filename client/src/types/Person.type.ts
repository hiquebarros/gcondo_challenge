export namespace Person {
    export type Filter = {
        full_name?: string;
        cpf?: string;
        email?: string;
        /** Optional limit for search (e.g. 20). */
        limit?: number;
    };

    export type Model = {
        id: number,
        full_name: string,
        cpf: string,
        email: string,
        birth_date: string,
        created_at: string,
        updated_at: string,
        deleted_at: string | null,
    }
}
