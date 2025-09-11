package com.codecraft.master.logger;

import com.codecraft.master.configs.UserContext;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.CodeSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;


@Aspect
@Component
@Slf4j
public class ControllerLogging {

    @Autowired
    ObjectMapper mapper;

    @Autowired
    HttpServletRequest request;

    @Pointcut("within(com.codecraft.master.controllers..*)")
    public void controllerPointCut() {
    }

    @Before("controllerPointCut()")
    public void logControllerMethodBefore(JoinPoint joinPoint) {
        Map<String, Object> parameters = getParameters(joinPoint);
        try {
            log.info("Executing API: {} with arguments {} User {}", request.getRequestURI(), mapper.writeValueAsString(parameters), UserContext.getCurrentUser());
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    @AfterReturning(pointcut = "controllerPointCut()", returning = "entity")
    public void logControllerMethodAfter(ResponseEntity<?> entity) {
        log.info("Response completed for API: {} ", request.getRequestURI());
    }

    private Map<String, Object> getParameters(JoinPoint joinPoint) {
        CodeSignature signature = (CodeSignature) joinPoint.getSignature();
        HashMap<String, Object> map = new HashMap<>();
        AtomicInteger index = new AtomicInteger();
        Arrays.asList(signature.getParameterNames()).forEach(param -> map.put(param, joinPoint.getArgs()[index.getAndIncrement()]));
        return map;
    }

}
