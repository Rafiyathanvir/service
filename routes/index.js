import express from 'express';
import homeRoutes from '../controllers/home/index.js';
import userRoutes from '../controllers/users/index.js';
import vendorRoutes from '../controllers/vendor/index.js'
import accountsettingRoutes from '../controllers/accountsetting/index.js';
import userInfoRoutes from '../controllers/userInfo/index.js';
import bookingRoutes from '../controllers/booking/index.js';
import currencyRoutes from '../controllers/currency/index.js';
import wishlistRoutes from '../controllers/wishlist/index.js';
const app = express();
const routes = express.Router();

routes.use('/api/home', homeRoutes);
routes.use('/api/users', userRoutes);
routes.use('/api/vendor', vendorRoutes)
// routes.use('/api/wishlist', wishlistRoutes )
routes.use('/api/accountsetting',accountsettingRoutes )
routes.use('/api/userInfo',userInfoRoutes )
routes.use('/api/booking',bookingRoutes )
routes.use('/api/currency', currencyRoutes)
routes.use('/api/wishList', wishlistRoutes);







export default routes;