const sessionConfig = {
  name: "session",
  secret: process.env.SESSION_SECRET || "thisshouldbeabettersecret!",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

export default sessionConfig;
