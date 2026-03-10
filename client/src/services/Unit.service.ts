import type { ListUnits } from '@services/contracts/Unit.contract';
import { Request } from '@services/Request';

export const listUnits = (): Promise<ListUnits.Response> =>
    Request.get('/units');
