import { SetMetadata } from '@nestjs/common';

export const IS_SKIP_JWT = 'skip-jwt';
export const SkipJwt = () => SetMetadata(IS_SKIP_JWT, true);
