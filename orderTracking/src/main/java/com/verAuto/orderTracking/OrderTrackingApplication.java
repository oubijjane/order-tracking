package com.verAuto.orderTracking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.concurrent.Executor;

import static org.springframework.data.web.config.EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO;

@SpringBootApplication
@EnableAsync
@EnableSpringDataWebSupport(pageSerializationMode = VIA_DTO)
public class OrderTrackingApplication {

	public static void main(String[] args) {
		SpringApplication.run(OrderTrackingApplication.class, args);
	}

	@Bean(name = "emailExecutor")
	public Executor emailExecutor() {
		ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();

		// Perfect for your scale (max 5 emails at once)
		executor.setCorePoolSize(2);
		executor.setMaxPoolSize(4);
		executor.setQueueCapacity(50);

		executor.setThreadNamePrefix("LogisticsMail-");

		// Graceful shutdown so emails aren't cut off
		executor.setWaitForTasksToCompleteOnShutdown(true);
		executor.setAwaitTerminationSeconds(30);

		executor.initialize();
		return executor;
	}


}
