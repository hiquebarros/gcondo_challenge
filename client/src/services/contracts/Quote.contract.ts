import type { Quote, QuoteCategory, QuoteStatus } from '@internal-types/Quote.type';
import type { Service } from '@internal-types/Service.type';

export type QuoteFilter = {
    quote_category_id: string;
    quote_status_id: string;
    condominium_id: string;
    supplier_id: string;
};

export namespace ListQuotes {
    type Data = { quotes: Quote.Model[] };

    export type Response =
        | Service.DefaultResponse<Data>
        | Service.ExceptionResponse;
}

export namespace FindQuote {
    type Data = { quote: Quote.Model };

    export type Response =
        | Service.DefaultResponse<Data>
        | Service.ExceptionResponse;
}

export namespace CreateQuote {
    export type Body = {
        supplier_id: number;
        condominium_id: number;
        title: string;
        description: string;
        amount: string | number;
        quote_category_id: number;
        quote_status_id: number;
    };

    type Data = { quote: Quote.Model };

    export type Response =
        | Service.DefaultResponse<Data>
        | Service.ExceptionResponse;
}

export namespace ListQuoteCategories {
    type Data = { quote_categories: QuoteCategory.Model[] };

    export type Response =
        | Service.DefaultResponse<Data>
        | Service.ExceptionResponse;
}

export namespace ListQuoteStatuses {
    type Data = { quote_statuses: QuoteStatus.Model[] };

    export type Response =
        | Service.DefaultResponse<Data>
        | Service.ExceptionResponse;
}

export namespace UpdateQuote {
    export type Body = CreateQuote.Body;

    type Data = { quote: Quote.Model };

    export type Response =
        | Service.DefaultResponse<Data>
        | Service.ExceptionResponse;
}

export namespace DeleteQuote {
    export type Response =
        | Service.DefaultResponse<Record<string, never>>
        | Service.ExceptionResponse;
}
