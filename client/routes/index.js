import { Layout } from '../components';
import Home from '../pages/Home';
import Dji from '../pages/Dji';
import NotFound from '../pages/NotFound';

export const routes = [
  {
    key: 'home',
    path: '/',
    exact: true,
    component: Home
  },

  //   key: 'not-found',
  //   path: '*',
  //   component: NotFound
  // },
  {
    key: 'dji',
    path: '/dji',
    exact: true,
    component: Dji
  }

];

export default [
  {
    component: Layout,
    routes
  }
];
