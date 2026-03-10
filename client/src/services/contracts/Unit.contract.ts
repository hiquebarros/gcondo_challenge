import type { Unit } from '@internal-types/Unit.type';
import type { Service } from '@internal-types/Service.type';

export namespace ListUnits {
    type Data = { units: Unit.Model[] };

    export type Response =
        | Service.DefaultResponse<Data>
        | Service.ExceptionResponse;
}
