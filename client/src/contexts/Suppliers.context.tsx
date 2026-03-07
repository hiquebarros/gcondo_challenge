import {
    createContext,
    type Dispatch,
    type ReactNode,
    type SetStateAction,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';

import { App } from 'antd';
import { useSearchParams } from 'react-router';

import { UnknownContextError } from '@errors/UnknownContextError';
import { handleServiceError, hasServiceError } from '@helpers/Service.helper';
import type { Supplier } from '@internal-types/Supplier.type';
import type { SupplierCategory } from '@internal-types/Supplier.type';
import { listSupplierCategories } from '@services/Supplier.service';
import { listPeople } from '@services/Person.service';
import { listSuppliers } from '@services/Supplier.service';

function filterFromSearchParams(searchParams: URLSearchParams): Supplier.Filter {
    return {
        legal_name: searchParams.get('legal_name') ?? '',
        cnpj: searchParams.get('cnpj') ?? '',
        email: searchParams.get('email') ?? '',
        supplier_category_id: searchParams.get('supplier_category_id') ?? '',
    };
}

function filterToSearchParams(filter: Supplier.Filter): Record<string, string> {
    const params: Record<string, string> = {};
    if (filter.legal_name.trim()) params.legal_name = filter.legal_name.trim();
    if (filter.cnpj.trim()) params.cnpj = filter.cnpj.trim();
    if (filter.email.trim()) params.email = filter.email.trim();
    if (filter.supplier_category_id.trim()) params.supplier_category_id = filter.supplier_category_id.trim();
    return params;
}

type Value = {
    suppliers: Supplier.Model[];
    supplierCategories: SupplierCategory.Model[];
    people: import('@internal-types/Person.type').Person.Model[];
    filter: Supplier.Filter;
    setFilter: Dispatch<SetStateAction<Value['filter']>>;
    applyFilter: () => void;
    isLoading: boolean;
    isCreateModalVisible: boolean;
    setIsCreateModalVisible: Dispatch<SetStateAction<Value['isCreateModalVisible']>>;
    fetchSuppliers: (criteria?: Supplier.Filter) => Promise<void>;
    fetchSupplierCategories: () => Promise<void>;
    fetchPeople: () => Promise<void>;
};

type Props = { children: (value: Value) => ReactNode };

export const SuppliersContext = createContext<Value | null>(null);

export function SuppliersContextProvider({ children }: Props) {
    const [searchParams, setSearchParams] = useSearchParams();

    const [isLoading, setIsLoading] = useState(true);
    const [suppliers, setSuppliers] = useState<Supplier.Model[]>([]);
    const [supplierCategories, setSupplierCategories] = useState<SupplierCategory.Model[]>([]);
    const [people, setPeople] = useState<Value['people']>([]);
    const [filter, setFilter] = useState<Supplier.Filter>(() => filterFromSearchParams(searchParams));
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

    const app = App.useApp();

    const fetchSupplierCategories = useCallback(async () => {
        const response = await listSupplierCategories();
        if (hasServiceError(response)) return handleServiceError(app, response);
        setSupplierCategories(response.data.supplier_categories);
    }, [app]);

    const fetchPeople = useCallback(async () => {
        const response = await listPeople();
        if (hasServiceError(response)) return handleServiceError(app, response);
        setPeople(response.data.people);
    }, [app]);

    const fetchSuppliers = useCallback(async (criteria?: Supplier.Filter) => {
        setIsLoading(true);
        const params = criteria ?? filter;
        const response = await listSuppliers(params);
        setIsLoading(false);
        if (hasServiceError(response)) return handleServiceError(app, response);
        setSuppliers(response.data.suppliers);
    }, [app, filter]);

    useEffect(() => {
        const criteria = filterFromSearchParams(searchParams);
        setFilter(criteria);
        setIsLoading(true);
        listSuppliers(criteria)
            .then(response => {
                if (hasServiceError(response)) return handleServiceError(app, response);
                setSuppliers(response.data.suppliers);
            })
            .finally(() => setIsLoading(false));
    }, [searchParams, app]);

    useEffect(() => {
        fetchSupplierCategories();
        fetchPeople();
    }, [fetchSupplierCategories, fetchPeople]);

    const applyFilter = useCallback(() => {
        setSearchParams(filterToSearchParams(filter));
    }, [filter, setSearchParams]);

    const value: Value = {
        suppliers,
        supplierCategories,
        people,
        filter,
        setFilter,
        applyFilter,
        isLoading,
        isCreateModalVisible,
        setIsCreateModalVisible,
        fetchSuppliers,
        fetchSupplierCategories,
        fetchPeople,
    };

    return (
        <SuppliersContext.Provider value={value}>
            {children(value)}
        </SuppliersContext.Provider>
    );
}

export function useSuppliersContext() {
    const context = useContext(SuppliersContext);
    if (!context) throw new UnknownContextError();
    return context;
}
