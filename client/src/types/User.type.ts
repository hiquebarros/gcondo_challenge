export namespace User {
    export type Role = 'pessoa_operacao' | 'coordenacao' | 'equipe_interna';

    export type Model = {
        id: number;
        name: string;
        email: string;
        role: Role;
    };
}
