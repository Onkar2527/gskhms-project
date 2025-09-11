package com.codecraft.master.audit;

import com.codecraft.master.entities.Employee;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.Optional;

@Slf4j
public class SpringSecurityAuditorAwareImpl implements AuditorAware<String> {
    @Override
    public Optional<String> getCurrentAuditor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return Optional.empty();
        }
        if(authentication.getPrincipal() instanceof Employee){
            return Optional.of(((Employee) authentication.getPrincipal()).getEmailId());
        }

        if(authentication.getDetails() instanceof Employee){
            return Optional.of(((Employee) authentication.getDetails()).getEmailId());
        }
        return Optional.of("SYSTEM");
    }
}
