package com.apprasail.beesheet.beesheet;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class BeesheetApplication {

	public static void main(String[] args) {
		SpringApplication.run(BeesheetApplication.class, args);
	}

}
