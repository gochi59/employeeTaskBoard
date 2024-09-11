package com.apprasail.beesheet.beesheet.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.apprasail.beesheet.beesheet.filter.JWTFilter;

@Configuration
@EnableWebSecurity
public class SpringSecurity {

    private final UserDetailsService userDetailsService;
    private final JWTFilter jWTFilter;

    public SpringSecurity(UserDetailsService userDetailsService, JWTFilter jwtFilter) {
        this.userDetailsService = userDetailsService;
        this.jWTFilter = jwtFilter;
    }

   
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity https) throws Exception {
    // .cors(cors -> cors.configurationSource(corsConfigurationSource()))
    https
        .cors(Customizer.withDefaults())
        .csrf(AbstractHttpConfigurer::disable)  
        .authorizeHttpRequests(
                request -> request.requestMatchers("/login", "/signup").permitAll()
                        .requestMatchers("/admin/**").hasAuthority("ADMIN")
                        .anyRequest().authenticated()
        )
        .httpBasic(Customizer.withDefaults())
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .addFilterBefore(jWTFilter, UsernamePasswordAuthenticationFilter.class);
    return https.build();
}

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(new BCryptPasswordEncoder(12));
        provider.setUserDetailsService(userDetailsService);
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource()
    {
        CorsConfiguration corsConfiguration=new CorsConfiguration();
        corsConfiguration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        corsConfiguration.setAllowedMethods(Arrays.asList("GET","PUT","POST","DELETE"));
        corsConfiguration.setAllowedHeaders(List.of("Authorization","Content-Type"));
        UrlBasedCorsConfigurationSource source=new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);
        return source;
    }




//     @Bean
// public CorsConfigurationSource corsConfigurationSource() {
//     CorsConfiguration configuration = new CorsConfiguration();
//     configuration.addAllowedOrigin("http://localhost:5174");  // Add your frontend URL
//     configuration.addAllowedMethod("*");  // Allow all HTTP methods (GET, POST, PUT, etc.)
//     configuration.addAllowedHeader("*");  // Allow all headers
//     configuration.setAllowCredentials(true);  // Allow credentials (e.g., cookies, authorization headers)
    
//     UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//     source.registerCorsConfiguration("/**", configuration);  // Apply CORS settings globally
//     return source;
// }
}
