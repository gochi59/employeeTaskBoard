// package com.apprasail.beesheet.beesheet.config;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.config.Customizer;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// import org.springframework.security.config.http.SessionCreationPolicy;
// import org.springframework.security.web.SecurityFilterChain;

// @Configuration
// @EnableWebSecurity
// public class SpringSecurity {

//     @Bean
//     public SecurityFilterChain securityFilterChain(HttpSecurity https) throws 
//     {
//         https.csrf(csrfCustomizer->csrfCustomizer.disable())
//                 .authorizeHttpRequests(request->request.anyRequest().authenticated())
//                 .formLogin(Customizer.withDefaults())
//                 .httpBasic(Customizer.withDefaults())
//                 .sessionManagement(session->session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
//         return https.build();
//     }
// }
