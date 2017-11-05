const patterns = {
  user: {
    email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    password: /^(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z*!|()\/-_.,;:]{6,25}$/,
    username: /^[a-zA-Z0-9]{3,15}$/,
    slug: /^[a-z0-9]{3,15}$/
  }
}

export default patterns;