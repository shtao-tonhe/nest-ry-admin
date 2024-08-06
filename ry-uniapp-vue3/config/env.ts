import DEV from './env.dev';
import PROD from './env.prod';
export default () => {
	// 环境变量 development,production
  const env = 'development';
  return env === 'development' ? DEV : PROD;
};
