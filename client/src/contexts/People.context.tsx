import {
    createContext,
    type Dispatch,
    type ReactNode,
    type SetStateAction,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

import { App } from 'antd';
import { useSearchParams } from 'react-router';

import { UnknownContextError } from '@errors/UnknownContextError';
import { handleServiceError, hasServiceError } from '@helpers/Service.helper';
import type { Person } from '@internal-types/Person.type';
import { listPeople } from '@services/Person.service';

function filterFromSearchParams(searchParams: URLSearchParams): Person.Filter {
    return {
        full_name: searchParams.get('full_name') ?? '',
        cpf: searchParams.get('cpf') ?? '',
        email: searchParams.get('email') ?? '',
    };
}

function filterToSearchParams(filter: Person.Filter): Record<string, string> {
    const params: Record<string, string> = {};
    if (filter.full_name.trim()) params.full_name = filter.full_name.trim();
    if (filter.cpf.trim()) params.cpf = filter.cpf.trim();
    if (filter.email.trim()) params.email = filter.email.trim();
    return params;
}

type Value = {
    people: Person.Model[];
    filter: Person.Filter;
    setFilter: Dispatch<SetStateAction<Value['filter']>>;
    applyFilter: () => void;
    person: Person.Model | null;
    personId: Person.Model['id'] | null;
    setPersonId: Dispatch<SetStateAction<Value['personId']>>;
    isLoading: boolean;
    isCreateModalVisible: boolean;
    setIsCreateModalVisible: Dispatch<SetStateAction<Value['isCreateModalVisible']>>;
    isEditModalVisible: boolean;
    setIsEditModalVisible: Dispatch<SetStateAction<Value['isEditModalVisible']>>;
    fetchPeople: (criteria?: Person.Filter) => Promise<void>;
};

type Props = { children: (value: Value) => ReactNode };

// eslint-disable-next-line react-refresh/only-export-components
export const PeopleContext = createContext<Value | null>(null);

export function PeopleContextProvider({ children }: Props) {
    const [searchParams, setSearchParams] = useSearchParams();

    const [isLoading, setIsLoading] = useState<Value['isLoading']>(true);
    const [people, setPeople] = useState<Value['people']>([]);
    const [filter, setFilter] = useState<Person.Filter>(() => filterFromSearchParams(searchParams));
    const [personId, setPersonId] = useState<Person.Model['id'] | null>(null);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    const app = App.useApp();

    const fetchPeople = useCallback(async (criteria?: Person.Filter) => {
        setIsLoading(true);

        const params = criteria ?? filter;
        const response = await listPeople(params);

        setIsLoading(false);

        if (hasServiceError(response))
            return handleServiceError(app, response);

        setPeople(response.data.people);
    }, [app, filter]);

    useEffect(() => {
        const criteria = filterFromSearchParams(searchParams);
        setFilter(criteria);
        setIsLoading(true);
        listPeople(criteria)
            .then(response => {
                if (hasServiceError(response))
                    return handleServiceError(app, response);
                setPeople(response.data.people);
            })
            .finally(() => setIsLoading(false));
    }, [searchParams, app]);

    const applyFilter = useCallback(() => {
        setSearchParams(filterToSearchParams(filter));
    }, [filter, setSearchParams]);

    const person = useMemo(() => {
        if (!personId)
            return null;

        const found = people.find((p: Person.Model) => p.id === personId);

        if (!found)
            throw new Error(`Could not find a person with id ${personId}`);

        return found;
    }, [people, personId]);

    const value: Value = {
        isLoading,
        people,
        filter,
        setFilter,
        applyFilter,
        person,
        personId,
        setPersonId,
        isCreateModalVisible,
        setIsCreateModalVisible,
        isEditModalVisible,
        setIsEditModalVisible,
        fetchPeople,
    };

    return (
        <PeopleContext.Provider value={value}>
            {children(value)}
        </PeopleContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePeopleContext() {
    const context = useContext(PeopleContext);

    if (!context)
        throw new UnknownContextError();

    return context;
}
