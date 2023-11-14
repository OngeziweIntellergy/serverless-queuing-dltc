
output "lambda_function_name" {
  value = aws_lambda_function.StoreTicketHandler.function_name
}

output "lambda_function_arn" {
  value = aws_lambda_function.StoreTicketHandler.arn
}

output "lambda_invoke_arn" {
  value = aws_lambda_function.StoreTicketHandler.invoke_arn
}

output "api_gateway_id" {
  value = aws_api_gateway_rest_api.dltc_ticket_api.id
}

#output "api_gateway_url" {
#  value = aws_api_gateway_deployment.dltc_ticket_api_deployment.invoke_url
#}

output "cloudwatch_log_group_name" {
  value = aws_cloudwatch_log_group.main_api_gw.name
}

output "list_tickets_function_arn" {
  value = aws_lambda_function.ListTicketsHandler.arn
}

