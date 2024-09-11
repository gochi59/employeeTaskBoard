package com.apprasail.beesheet.beesheet.Services;

import java.security.Key;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JWTService {

    private final String secretKey;

    public JWTService() throws NoSuchAlgorithmException
    {
        this.secretKey="APlx0SV4i1ShPnyUF/qX+cYOji7WWy88e/G66GLIRb0=";
        // System.out.println(secretKey); 
    }
    
    public String generateToken(String email,String Role) {
        Map<String,Object>claims=new HashMap<>();
        claims.put("Role", Role);
        return Jwts
                    .builder()
                    .claims(claims)
                    .subject(email)
                    .issuedAt(new Date(System.currentTimeMillis()))
                    .expiration(new Date(System.currentTimeMillis()+100000000))
                    .signWith(getKey())
                    .compact();
    }

    private Key getKey()
    {
        byte[] keyBytes=Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public boolean validateToken(String token, UserDetails user) {
        final String username=extractUsername(token);
        return (username.equals(user.getUsername())&&!isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    private <T>T extractClaim(String token,Function<Claims,T>claimResolver)
    {
        final Claims claims=extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                    .parser()
                    .verifyWith((SecretKey)getKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
    }

}
