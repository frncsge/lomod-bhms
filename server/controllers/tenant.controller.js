//landlord creates tenant acc
//then stores username in db with status pending
//send set password link to landlord email
//store the set password link token in redis as key (hashed) and value of the tenant user_id
//if landlord wants to resend email, just use the tenant user id in order to get the username (avoid username regeneration)
//if tenant sets password, get the token and validate. if password is set succesfully, delete the used token


