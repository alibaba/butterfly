import reactRefresh from '@vitejs/plugin-react-refresh';

/**
 * @type { import('vite').UserConfig }
 */
export default {
  plugins: [reactRefresh()],
  optimizeDeps: {
    include: [
      'react-dev-utils/webpackHotDevClient',
      'butterfly-dag/pack'
    ]
  }
};
