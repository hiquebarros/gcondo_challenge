import type { Person } from '@internal-types/Person.type';

import type {
    CreatePerson,
    DeletePerson,
    FindPerson,
    ListPeople,
    UpdatePerson,
} from './contracts/Person.contract';
import { Request } from './Request';

function filterToParams(filter: Person.Filter): Record<string, string> {
    return {
        full_name: filter.full_name,
        cpf: filter.cpf,
        email: filter.email,
    };
}

export const listPeople = (filter?: Person.Filter): Promise<ListPeople.Response> =>
    Request.get('/people', filter ? filterToParams(filter) : undefined);

export const findPerson = (
    id: Person.Model['id'],
): Promise<FindPerson.Response> => Request.get(`/people/${id}`);

export const createPerson = (
    body: CreatePerson.Body,
): Promise<CreatePerson.Response> => Request.post('/people', body);

export const updatePerson = (
    id: Person.Model['id'],
    body: UpdatePerson.Body,
): Promise<UpdatePerson.Response> => Request.put(`/people/${id}`, body);

export const deletePerson = (
    id: Person.Model['id'],
): Promise<DeletePerson.Response> => Request.delete(`/people/${id}`);
