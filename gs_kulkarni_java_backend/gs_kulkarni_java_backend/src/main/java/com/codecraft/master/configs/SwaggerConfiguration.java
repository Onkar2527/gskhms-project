package com.codecraft.master.configs;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

@Configuration
@SecurityScheme(
        name = "bearerAuth",
        type = SecuritySchemeType.HTTP,
        bearerFormat = "JWT",
        scheme = "bearer"
)
public class SwaggerConfiguration {

    @Bean
    public OpenAPI defineOpenApi() {
        List servers = new ArrayList();
        Server server = new Server();
        server.setUrl("http://localhost:6969/");
        server.setDescription("Development");
        servers.add(server);

        // Server server1 = new Server();
        // server1.setUrl("http://hmsbackendjava.kredpool.in/"); 
        // server1.setDescription("Test");
        // servers.add(server1);

        Info information = new io.swagger.v3.oas.models.info.Info()
                .title("Health Craft Application API")
                .version("1.0")
                .description("This API exposes endpoints to manage Health Craft application.");
        return new OpenAPI().info(information).servers(servers);
    }
}
