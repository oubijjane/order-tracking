package com.verAuto.orderTracking.security;


import com.verAuto.orderTracking.Config.JwtAuthenticationFilter;
import jakarta.servlet.DispatcherType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final AuthenticationProvider authenticationProvider;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Value("${app.cors.origin}")
    private List<String> allowedOrigins;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            AuthenticationProvider authenticationProvider
    ) {
        this.authenticationProvider = authenticationProvider;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }


    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring()
                .requestMatchers("/assets/**", "/static/**", "/verauto-logo.png", "/*.js", "/*.css");
    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable()) // Disable CSRF for JWT-based APIs
                .authorizeHttpRequests(auth -> auth// Allow public access to auth endpoints
                        .dispatcherTypeMatchers(DispatcherType.FORWARD).permitAll()
                        .requestMatchers("/{path:[^\\.]*}", "/**/{path:[^\\.]*}").permitAll()
                        .requestMatchers("/api/auth/**", "/uploads/**").permitAll()
                        .requestMatchers("/", "/index.html", "/static/**", "/assets/**", "/verauto-logo.png", "/*.js", "/*.css").permitAll()
                        .requestMatchers("/error").permitAll()
                        .requestMatchers(HttpMethod.DELETE).hasRole("ADMIN")
                        .requestMatchers("/api/**").authenticated()
                       // All other requests need a token
                        .requestMatchers("/api/orders/**").hasAnyRole("ADMIN",
                                 "GARAGISTE", "MANAGER",
                                       "LOGISTICIEN", "GESTIONNAIRE")
                        .requestMatchers(HttpMethod.GET,"/api/comments/**").hasAnyRole("ADMIN",
                                "GARAGISTE", "MANAGER",
                                "LOGISTICIEN", "GESTIONNAIRE")
                        .requestMatchers("/api/cities/**").hasAnyRole("ADMIN",
                                "GARAGISTE", "MANAGER",
                                "LOGISTICIEN", "GESTIONNAIRE")
                        .requestMatchers("/api/companies/**").hasAnyRole("ADMIN",
                                "GARAGISTE", "MANAGER",
                                "LOGISTICIEN", "GESTIONNAIRE")
                        .requestMatchers(HttpMethod.GET, "/api/window-details/**").hasAnyRole("ADMIN",
                                "GARAGISTE", "MANAGER",
                                "LOGISTICIEN", "GESTIONNAIRE")
                        .requestMatchers(HttpMethod.DELETE, "/api/window-details/**").hasAnyRole("ADMIN",
                                "GARAGISTE", "MANAGER",
                                "LOGISTICIEN", "GESTIONNAIRE")
                        .requestMatchers(HttpMethod.PUT, "/api/window-details/**").hasAnyRole("ADMIN",
                                "LOGISTICIEN")
                        .requestMatchers(HttpMethod.POST, "/api/window-details/**").hasAnyRole("ADMIN",
                                "LOGISTICIEN")
                        .requestMatchers("/api/brands/**").hasAnyRole("ADMIN",
                                "GARAGISTE", "MANAGER",
                                "LOGISTICIEN", "GESTIONNAIRE")
                        .requestMatchers("/api/models/**").hasAnyRole("ADMIN",
                                "GARAGISTE", "MANAGER",
                                "LOGISTICIEN", "GESTIONNAIRE")
                        .requestMatchers(HttpMethod.DELETE, "/api/**").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // No JSESSIONID cookies
                )
                .authenticationProvider(authenticationProvider) // Use your custom DaoAuthenticationProvider
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
   @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration source = new CorsConfiguration();

        // Allow your React Frontend
        source.setAllowedOriginPatterns(allowedOrigins);

        // Allow these methods
        source.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE"));

        // Allow all headers (Authorization, Content-Type, etc.)
        source.setAllowedHeaders(Arrays.asList("*"));

        UrlBasedCorsConfigurationSource urlBasedSource = new UrlBasedCorsConfigurationSource();
        urlBasedSource.registerCorsConfiguration("/**", source);
        return urlBasedSource;
    }
}
