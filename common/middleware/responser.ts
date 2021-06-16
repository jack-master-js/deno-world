import logger from '../utils/logger.ts';

export default function responser(req: any, res: any, next: any) {
    //success
    res.success = () => {
        res.send({
            success: true,
        });
        logger.debug(
            `[ app ] request ${req.url} ${JSON.stringify(req.body)} success.`,
        );
    };

    //data
    res.data = (data: any, total?: any) => {
        let rst: any = {
            success: true,
            data,
        };
        if (total) rst.total = total;

        res.send(rst);
        logger.debug(
            `[ app ] request ${req.url} ${JSON.stringify(
                req.body,
            )} response ${JSON.stringify(rst)}`,
        );
    };

    //error
    res.error = ({ message = '' }) => {
        const rst = {
            success: false,
            message: message,
        };
        res.send(rst);
        logger.debug(
            `[ app ] request ${req.url} ${JSON.stringify(
                req.body,
            )} response ${JSON.stringify(rst)}`,
        );
    };

    next();
}
