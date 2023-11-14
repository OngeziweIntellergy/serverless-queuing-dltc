resource "aws_iam_role" "TicketLambdaRole" {
  name               = "TicketLambdaRole"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

data "template_file" "ticketlambdapolicy" {
  template = file("${path.module}/policy.json")
}

resource "aws_iam_policy" "TicketLambdaPolicy" {
  name        = "TicketLambdaPolicy"
  path        = "/"
  description = "IAM policy for Ticket lambda functions"
  policy      = data.template_file.ticketlambdapolicy.rendered
}

resource "aws_iam_role_policy_attachment" "TicketLambdaRolePolicy" {
  role       = aws_iam_role.TicketLambdaRole.name
  policy_arn = aws_iam_policy.TicketLambdaPolicy.arn
}

data "archive_file" "lambda_zip_store" {
  type        = "zip"
  source_dir  = "../lambda"
  output_path = "../lambda/StoreTicketHandler.zip"
}

data "archive_file" "lambda_zip_list" {
  type        = "zip"
  source_dir  = "../lambda"
  output_path = "../lambda/ListTicketsHandler.zip"
}

resource "aws_lambda_function" "StoreTicketHandler" {
  function_name = "StoreTicketHandler"
  filename      = data.archive_file.lambda_zip_store.output_path
  handler       = "StoreTicketHandler.lambda_handler"
  runtime       = "python3.8"

  environment {
    variables = {
      REGION            = "us-east-1"
      ticket_table = aws_dynamodb_table.ticket_table.name
    }
  }

  role        = aws_iam_role.TicketLambdaRole.arn
  timeout     = "5"
  memory_size = "128"
}

resource "aws_lambda_function" "ListTicketsHandler" {
  function_name = "ListTicketsHandler"
  filename      = data.archive_file.lambda_zip_list.output_path
  handler       = "ListTicketsHandler.lambda_handler"
  runtime       = "python3.8"

  environment {
    variables = {
      REGION            = "us-east-1"
      ticket_table = aws_dynamodb_table.ticket_table.name
    }
  }

  role        = aws_iam_role.TicketLambdaRole.arn
  timeout     = "5"
  memory_size = "128"
}

resource "aws_cloudwatch_log_group" "lambda_log_group_store" {
  name = "/aws/lambda/${aws_lambda_function.StoreTicketHandler.function_name}"

  retention_in_days = 14
}
