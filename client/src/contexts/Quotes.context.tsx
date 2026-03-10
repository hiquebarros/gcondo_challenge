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
import { listCondominiums } from '@services/Condominium.service';
import { listQuoteCategories } from '@services/Quote.service';
import { listQuoteStatuses } from '@services/Quote.service';
import { listQuotes } from '@services/Quote.service';
import { listSuppliers } from '@services/Supplier.service';

type Value = {
    quotes: Quote.Model[];
    condominiums: Condominium.Model[];
    quoteCategories: QuoteCategory.Model[];
    quoteStatuses: QuoteStatus.Model[];
    suppliers: Supplier.Model[];
    isLoading: boolean;
    isCreateModalVisible: boolean;
    setIsCreateModalVisible: Dispatch<SetStateAction<boolean>>;
    fetchQuotes: () => Promise<void>;
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
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

    const app = App.useApp();

    const fetchQuotes = useCallback(async () => {
        setIsLoading(true);
        const response = await listQuotes();
        setIsLoading(false);
        if (hasServiceError(response)) return handleServiceError(app, response);
        setQuotes(response.data.quotes);
    }, [app]);

    const fetchCondominiums = useCallback(async () => {
        const response = await listCondominiums();
        if (hasServiceError(response)) return handleServiceError(app, response);
        setCondominiums(response.data.condominiums);
    }, [app]);

    const fetchQuoteCategories = useCallback(async () => {
        const response = await listQuoteCategories();
        if (hasServiceError(response)) return handleServiceError(app, response);
        setQuoteCategories(response.data.quote_categories);
    }, [app]);

    const fetchSuppliers = useCallback(async () => {
        const response = await listSuppliers();
        if (hasServiceError(response)) return handleServiceError(app, response);
        setSuppliers(response.data.suppliers);
    }, [app]);

    const fetchQuoteStatuses = useCallback(async () => {
        const response = await listQuoteStatuses();
        if (hasServiceError(response)) return handleServiceError(app, response);
        setQuoteStatuses(response.data.quote_statuses);
    }, [app]);

    useEffect(() => {
        fetchQuotes();
    }, [fetchQuotes]);

    useEffect(() => {
        if (isCreateModalVisible) {
            fetchCondominiums();
            fetchQuoteCategories();
            fetchQuoteStatuses();
            fetchSuppliers();
        }
    }, [isCreateModalVisible, fetchCondominiums, fetchQuoteCategories, fetchQuoteStatuses, fetchSuppliers]);

    const value: Value = {
        quotes,
        condominiums,
        quoteCategories,
        quoteStatuses,
        suppliers,
        isLoading,
        isCreateModalVisible,
        setIsCreateModalVisible,
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
