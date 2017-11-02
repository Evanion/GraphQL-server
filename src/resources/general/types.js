export default `
  type Error {
    path: String!
    message: String!
  }

  type Query {
    # Check that the connection is working
    ping: String!
  }
`;
