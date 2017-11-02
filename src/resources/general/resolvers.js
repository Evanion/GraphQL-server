export default {
  Query: {
    ping
  }
};

function ping(parent, args, context) {
  return 'pong'
}
