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

import { UnknownContextError } from '@errors/UnknownContextError';
import { handleServiceError, hasServiceError } from '@helpers/Service.helper';
import type { Condominium } from '@internal-types/Condominium.type';
import type { Quote, QuoteCategory, QuoteStatus } from '@internal-types/Quote.type';
import type { Supplier } from '@internal-types/Supplier.type';
import type { QuoteFilter } from '@services/contracts/Quote.contract';
import { listCondominiums } from '@services/Condominium.service';
import { listQuoteCategories, listQuoteStatuses, listQuotes } from '@services/Quote.service';
import { listSuppliers } from '@services/Supplier.service';

const DEFAULT_FILTER: QuoteFilter = {
    quote_category_id: '',
    quote_status_id: '',
    condominium_id: '',
    supplier_id: '',
};

type Value = {
    quotes: Quote.Model[];
    condominiums: Condominium.Model[];
    quoteCategories: QuoteCategory.Model[];
    quoteStatuses: QuoteStatus.Model[];
    suppliers: Supplier.Model[];
    isLoadingCondominiums: boolean;
    isLoadingQuoteCategories: boolean;
    isLoadingQuoteStatuses: boolean;
    isLoadingSuppliers: boolean;
    filter: QuoteFilter;
    setFilter: Dispatch<SetStateAction<QuoteFilter>>;
    applyFilter: () => void;
    isLoading: boolean;
    isCreateModalVisible: boolean;
    setIsCreateModalVisible: Dispatch<SetStateAction<boolean>>;
    quoteIdForEdit: number | null;
    setQuoteIdForEdit: Dispatch<SetStateAction<number | null>>;
    fetchQuotes: (criteria?: QuoteFilter) => Promise<void>;
};

type Props = { children: ReactNode };

export const QuotesContext = createContext<Value | null>(null);

export function QuotesContextProvider({ children }: Props) {
    const [quotes, setQuotes] = useState<Quote.Model[]>([]);
    const [condominiums, setCondominiums] = useState<Condominium.Model[]>([]);
    const [quoteCategories, setQuoteCategories] = useState<QuoteCategory.Model[]>([]);
    const [quoteStatuses, setQuoteStatuses] = useState<QuoteStatus.Model[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier.Model[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingCondominiums, setIsLoadingCondominiums] = useState(false);
    const [isLoadingQuoteCategories, setIsLoadingQuoteCategories] = useState(false);
    const [isLoadingQuoteStatuses, setIsLoadingQuoteStatuses] = useState(false);
    const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [filter, setFilter] = useState<QuoteFilter>(DEFAULT_FILTER);
    const [quoteIdForEdit, setQuoteIdForEdit] = useState<number | null>(null);

    const app = App.useApp();

    const fetchQuotes = useCallback(async (criteria?: QuoteFilter) => {
        setIsLoading(true);
        const response = await listQuotes(criteria ?? filter);
        setIsLoading(false);
        if (hasServiceError(response)) return handleServiceError(app, response);
        setQuotes(response.data.quotes);
    }, [app, filter]);

    const applyFilter = useCallback(() => {
        fetchQuotes(filter);
    }, [fetchQuotes, filter]);

    const fetchCondominiums = useCallback(async () => {
        setIsLoadingCondominiums(true);
        const response = await listCondominiums();
        setIsLoadingCondominiums(false);
        if (hasServiceError(response)) return handleServiceError(app, response);
        setCondominiums(response.data.condominiums);
    }, [app]);

    const fetchQuoteCategories = useCallback(async () => {
        setIsLoadingQuoteCategories(true);
        const response = await listQuoteCategories();
        setIsLoadingQuoteCategories(false);
        if (hasServiceError(response)) return handleServiceError(app, response);
        setQuoteCategories(response.data.quote_categories);
    }, [app]);

    const fetchSuppliers = useCallback(async () => {
        setIsLoadingSuppliers(true);
        const response = await listSuppliers();
        setIsLoadingSuppliers(false);
        if (hasServiceError(response)) return handleServiceError(app, response);
        setSuppliers(response.data.suppliers);
    }, [app]);

    const fetchQuoteStatuses = useCallback(async () => {
        setIsLoadingQuoteStatuses(true);
        const response = await listQuoteStatuses();
        setIsLoadingQuoteStatuses(false);
        if (hasServiceError(response)) return handleServiceError(app, response);
        setQuoteStatuses(response.data.quote_statuses);
    }, [app]);

    useEffect(() => {
        fetchQuotes(DEFAULT_FILTER);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fetchCondominiums();
        fetchQuoteCategories();
        fetchQuoteStatuses();
        fetchSuppliers();
    }, [fetchCondominiums, fetchQuoteCategories, fetchQuoteStatuses, fetchSuppliers]);

    const value: Value = {
        quotes,
        condominiums,
        quoteCategories,
        quoteStatuses,
        suppliers,
        isLoadingCondominiums,
        isLoadingQuoteCategories,
        isLoadingQuoteStatuses,
        isLoadingSuppliers,
        filter,
        setFilter,
        applyFilter,
        isLoading,
        isCreateModalVisible,
        setIsCreateModalVisible,
        quoteIdForEdit,
        setQuoteIdForEdit,
        fetchQuotes,
    };

    return (
        <QuotesContext.Provider value={value}>
            {children}
        </QuotesContext.Provider>
    );
}

export function useQuotesContext() {
    const context = useContext(QuotesContext);
    if (!context) throw new UnknownContextError();
    return context;
}
