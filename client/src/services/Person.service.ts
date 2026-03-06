import type { Person } from '@internal-types/Person.type';

import type {
    CreatePerson,
    DeletePerson,
    FindPerson,
    ListPeople,
    UpdatePerson,
} from './contracts/Person.contract';
import { Request } from './Request';

export const listPeople = (): Promise<ListPeople.Response> =>
    Request.get('/people');

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
