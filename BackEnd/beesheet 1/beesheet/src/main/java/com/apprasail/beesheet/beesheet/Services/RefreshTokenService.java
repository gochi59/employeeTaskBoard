package com.apprasail.beesheet.beesheet.Services;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.apprasail.beesheet.beesheet.Repository.EmployeeRepo;
import com.apprasail.beesheet.beesheet.Repository.RefreshTokenRepo;
import com.apprasail.beesheet.beesheet.model.Entities.Employee;
import com.apprasail.beesheet.beesheet.model.Entities.RefreshToken;
import com.apprasail.beesheet.beesheet.model.InputDTO.Input.RefreshId;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
@Transactional
public class RefreshTokenService {

    private final RefreshTokenRepo refreshTokenRepo;
    private final EmployeeRepo employeeRepo;
    private final JWTService jwtService;

    public RefreshToken generateRefreshToken(int id) {
        RefreshToken token = new RefreshToken();
        token.setEmp(employeeRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Employee Not Found")));
        token.setToken(UUID.randomUUID().toString());
        token.setExpiry(Instant.now().plusSeconds(60 * 60));
        refreshTokenRepo.save(token);
        return token;
    }

    public Optional<RefreshToken> findToken(String token) {
        return refreshTokenRepo.findByToken(token);
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiry().compareTo(Instant.now()) < 0) {
            refreshTokenRepo.delete(token);
            throw new JwtException("Refresh Token has expired");
        }
        return token;
    }

    public RefreshToken refreshTokenForRenew(RefreshToken token) {
        RefreshToken refreshToken = refreshTokenRepo.findById(token.getId())
                .orElseThrow(() -> new IllegalArgumentException("invalid token"));
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshTokenRepo.save(refreshToken);
        return refreshToken;
    }

    public String renewToken(String userCookie, HttpServletResponse response, RefreshId id) {
        RefreshToken token = findToken(userCookie).orElseThrow(() -> new JwtException("Invalid Refresh Token"));
        token = verifyExpiration(token);
        Employee emp = token.getEmp();
        if (emp.getEmpId() != id.getId()) {
            throw new IllegalArgumentException("Refresh Token doesnt match for this user");
        }
        RefreshToken refreshToken = refreshTokenForRenew(token);
        Cookie cookie = new Cookie("userToken", refreshToken.getToken());
        cookie.setMaxAge(24 * 60 * 10);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        response.addCookie(cookie);

        return jwtService.generateToken(refreshToken.getEmp().getEmpId(), refreshToken.getEmp().getRole());
    }

    public void logout(String userCookie, HttpServletResponse response) {
        RefreshToken token=refreshTokenRepo.findByToken(userCookie).orElseThrow(()->new IllegalArgumentException("Invalid Refresh token from cookie"));
        refreshTokenRepo.delete(token);
        Cookie cookie = new Cookie("userToken", null);
        cookie.setMaxAge(0);
        cookie.setSecure(true);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        response.addCookie(cookie);
    }

}
