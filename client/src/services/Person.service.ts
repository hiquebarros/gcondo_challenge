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
    const params: Record<string, string> = {};
    if (filter.full_name != null && filter.full_name !== '') params.full_name = filter.full_name;
    if (filter.cpf != null && filter.cpf !== '') params.cpf = filter.cpf;
    if (filter.email != null && filter.email !== '') params.email = filter.email;
    if (filter.limit != null && filter.limit > 0) params.limit = String(filter.limit);
    return params;
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
