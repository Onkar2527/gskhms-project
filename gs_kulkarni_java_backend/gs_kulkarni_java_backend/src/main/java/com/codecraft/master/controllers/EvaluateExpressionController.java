package com.codecraft.master.controllers;


import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.EvaluateReqBody;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.expression.Expression;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@RestController
@CrossOrigin
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@RequestMapping("/mastermanager")
@Slf4j
public class EvaluateExpressionController {

	@PostMapping(value = "/evaluate")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<Double> search(@RequestBody EvaluateReqBody body) throws NoSuchMethodException {
		if (Objects.nonNull(body)) {

			ExpressionParser parser = new SpelExpressionParser();
			String expression = body.getExpression().replace("log10", "#log10"); //"(495/1.0324 - 0.19077 * #log10(#waist-#neck) + 0.15456 * #log10(#height))- 450";

			Expression exp = parser.parseExpression(expression.toLowerCase());
			StandardEvaluationContext evaluationContext = new StandardEvaluationContext();

			evaluationContext.registerFunction("log10", EvaluateExpressionController.class.getDeclaredMethod("log10", new Class[] {Double.class}));

			if(Objects.nonNull(body.getKeyValueList()) && !CollectionUtils.isEmpty(body.getKeyValueList())){
				body.getKeyValueList().forEach(keyValue -> evaluationContext.setVariable(keyValue.getKey().toLowerCase(), keyValue.getValue()));
			}
			Double result =   exp.getValue(evaluationContext, Double.class);
			if(Objects.nonNull(result) && !result.isNaN()){
				result = round(result, 2);
			}


		return new ResponseEntity<>(result,HttpStatus.OK);
		} else {
		  throw new MasterManagerException(MasterConstant.EMPTY_BODY, HttpStatus.BAD_REQUEST);
		}
	}

	public static double round(double value, int places) {
		if (places < 0) throw new IllegalArgumentException();

		long factor = (long) Math.pow(10, places);
		value = value * factor;
		long tmp = Math.round(value);
		return (double) tmp / factor;
	}

	public static Double log10(Double input) {
		return Math.log10(input);
	}


}
