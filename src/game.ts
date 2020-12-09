import { Request } from 'express';

type appResponse = {
    errors?: string,
    data?: string
}

export default (req: Request) : appResponse => ({ data: `Hello ${req.body.foo}` });
