import DEV from './env.dev'
import PROD from './env.prod'
export default () => {
  const env = process.env.NODE_ENV
  return env === 'dev' ? DEV : PROD
}
