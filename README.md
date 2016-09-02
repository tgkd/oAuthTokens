# oAuthTokens

##DB Models:
* User — user has name and password;
* Client - client that is granted access on behalf of the user. Have name and secret code.
* AccessToken — token (type of bearer) issued to the client is limited in time.
* RefreshToken - allows you to request a new bearer-token without re-query the user for the password.

---
##Run
1.  npm i 
2.  change default values for record in database
3.  node gen.js
3.  node app.js

---
##HTTP req
1. http POST get tokens

> http://localhost:8080/oauth/token + {
  grant_type=password,
  client_id=clientId,
  client_secret=clientSecret,
  username=user,
  password=password
}

2. http POST refresh

> http://localhost:8080/oauth/token + {
  grant_type=refresh_token,
  client_id=clientId,
  client_secret=clientSecret,
  refresh_token=Token
}
