package com.evizzo.retailcheckout;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan(basePackages = {"com.evizzo.retailcheckout.entities"})
public class RetailcheckoutApplication {

	public static void main(String[] args) {
		SpringApplication.run(RetailcheckoutApplication.class, args);
	}

}
