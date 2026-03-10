import type { Quote, QuoteCategory, QuoteStatus } from '@internal-types/Quote.type';
import type { Service } from '@internal-types/Service.type';

export namespace ListQuotes {
    type Data = { quotes: Quote.Model[] };

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
