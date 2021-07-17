export default {
  config: () => {
    require('dotenv').config({
      path: require('path').resolve(
        process.cwd(),
        process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
      ),
    });
  },
};
