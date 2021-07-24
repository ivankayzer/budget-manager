export default {
  config: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('dotenv').config({
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      path: require('path').resolve(
        process.cwd(),
        process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
      ),
    });
  },
};
