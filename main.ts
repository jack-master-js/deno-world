import 'https://deno.land/x/dotenv@v2.0.0/load.ts';
import app from './server/app.ts';
import ws from './server/ws.ts';
import logger from './common/utils/logger.ts';

const env = Deno.env.get('DENO_ENV');
const port = Number(Deno.env.get('PORT'));
const wsPort = Number(Deno.env.get('WS_PORT'));

logger.info(`env: ${env}`);

app.listen(port, () => logger.info(`[ app ] listening on localhost:${port}`));
ws.listen(wsPort, () => logger.info(`[ ws ] listening on localhost:${wsPort}`));
