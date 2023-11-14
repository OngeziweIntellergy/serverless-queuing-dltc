##############
# API Gateway#
##############
resource "aws_api_gateway_rest_api" "dltc_ticket_api" {
  name        = "dltc_ticket_api"
  description = "ticket API Gateway"
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_resource" "ticket" {
  rest_api_id = aws_api_gateway_rest_api.dltc_ticket_api.id
  parent_id   = aws_api_gateway_rest_api.dltc_ticket_api.root_resource_id
  path_part   = "ticket"
}

resource "aws_api_gateway_resource" "list_tickets" {
  rest_api_id = aws_api_gateway_rest_api.dltc_ticket_api.id
  parent_id   = aws_api_gateway_rest_api.dltc_ticket_api.root_resource_id
  path_part   = "list_tickets"
}

resource "aws_api_gateway_method" "storeticket" {
  rest_api_id   = aws_api_gateway_rest_api.dltc_ticket_api.id
  resource_id   = aws_api_gateway_resource.ticket.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "list_tickets" {
  rest_api_id   = aws_api_gateway_rest_api.dltc_ticket_api.id
  resource_id   = aws_api_gateway_resource.list_tickets.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "storeticket-lambda" {
  rest_api_id = aws_api_gateway_rest_api.dltc_ticket_api.id
  resource_id = aws_api_gateway_resource.ticket.id
  http_method = aws_api_gateway_method.storeticket.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"

  uri = aws_lambda_function.StoreTicketHandler.invoke_arn
}

resource "aws_api_gateway_integration" "list_tickets-lambda" {
  rest_api_id = aws_api_gateway_rest_api.dltc_ticket_api.id
  resource_id = aws_api_gateway_resource.list_tickets.id
  http_method = aws_api_gateway_method.list_tickets.http_method

  integration_http_method = "GET"
  type                    = "AWS_PROXY"

  uri = aws_lambda_function.ListTicketsHandler.invoke_arn
}

resource "aws_lambda_permission" "apigw-StoreticketHandler" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.StoreTicketHandler.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.dltc_ticket_api.execution_arn}/*/POST/ticket"
}

resource "aws_lambda_permission" "apigw-ListticketsHandler" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ListTicketsHandler.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.dltc_ticket_api.execution_arn}/*/GET/list_tickets"
}

resource "aws_cloudwatch_log_group" "main_api_gw" {
  name              = "/aws/api-gw/${aws_api_gateway_rest_api.dltc_ticket_api.name}"
  retention_in_days = 14
}


resource "aws_api_gateway_deployment" "ticket_apigw_deployment" {
  depends_on = [
    aws_api_gateway_method.storeticket,
    aws_api_gateway_method.list_tickets,
    aws_api_gateway_integration.storeticket-lambda,
    aws_api_gateway_integration.list_tickets-lambda,
  ]
  rest_api_id = aws_api_gateway_rest_api.dltc_ticket_api.id
  stage_name  = "Dev"
}
