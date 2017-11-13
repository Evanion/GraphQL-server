export default `
  # The user model contains the available userdata
  type User {
    id: String!
    username: String!
    roles: [String!]
    status: String!
    createdAt: String
    updatedAt: String
  }

  # The object contains the status of the registration, created user, and any errors
  type RegisterResponse {
    ok: Boolean!
    user: User
    errors: [Error!]
  }

  # The response contains the tokens and user object, as well as any errors
  type LoginResponse {
    ok: Boolean!
    token: String
    refreshToken: String
    user: User
    errors: [Error!]
  }

  type UpdateUserResponse {
    ok: Boolean!
    user: User
    errors: [Error!]
  }

  type Query {
    # Allows you to fetch a user
    getUser(id: String!): User!
    # Returns all registered users
    allUsers: [User!]
    # Checks if a username exists
    usernameTaken(username: String!): Boolean
  }

  type Mutation {
    # Allows you to create a new user
    register(email: String!, password: String!, username: String!): RegisterResponse!
    updateUser(id: String, email: String, password: String, newPassword: String, username: String): UpdateUserResponse!
    login(email: String!, password: String!): LoginResponse!
  }
`;
