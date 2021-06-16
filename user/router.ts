import { Application } from '../dep.ts';
import service from './service.ts';

const router = new Application.Router();

router.get('/users', service.find);
router.get('/users/:id', service.get);
router.post('/users', service.create);
router.post('/users/:id', service.update);
router.delete('/users/:id', service.del);

export default router;
