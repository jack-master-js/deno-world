import { Application, path } from '../dep.ts';
import router from './router.ts';
import userRouter from '../user/router.ts';
import responser from '../common/middleware/responser.ts';

const { opine, serveStatic, json, urlencoded } = Application;
const app = opine();

//views
const __dirname = path.dirname(import.meta.url);
app.engine('html', (path: string) => Deno.readTextFile(path));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.use(serveStatic(path.join(__dirname, 'public')));

//middlewares
app.use(json());
app.use(urlencoded());
app.use(responser);

//routes
app.use(router);
app.use(userRouter);

//client.js
app.get('/scripts/client.js', async (req, res) => {
    const { diagnostics, files } = await Deno.emit(
        './server/react/client.tsx',
        {
            bundle: 'module',
            compilerOptions: {
                lib: ['dom', 'dom.iterable', 'esnext'],
            },
        },
    );

    if (diagnostics?.length) {
        console.log(diagnostics);
    }

    const js = files['deno:///bundle.js'];
    res.type('application/javascript').send(js);
});

//errors
app.use((err: any, req: any, res: any, next: any) => {
    res.error(err);
});

export default app;
