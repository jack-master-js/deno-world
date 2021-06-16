import { Application } from '../dep.ts';
import service from './service.ts';

const router = new Application.Router();

router.get('/', service.index);
router.get('/welcome', service.welcome);

export default router;
